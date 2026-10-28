/**
 * `npm run hat -- paylas (--fis <fis.md> | --video <mp4> --aciklama <txt>) [--saat "YYYY-AA-GG SS:DD"] [--kapak-ms N] [--onay <video dosya adı>] [--hesap <slug>] [--ig <kullanıcı>]`
 *
 * Varsayılan KURU KOŞU: hesapları okur (GET), gönderi gövdesini yazdırır; yükleme ve gönderi yok.
 * Gerçek gönderim: `--onay` = video dosya adı VE (fiş kipinde) fişte `paylasim_onay: evet`. Tüm kapılar ağa yazmadan ÖNCE denetlenir.
 * `--saat` İstanbul saatidir; Zernio'ya zamanlanmış gönderi gider, geçmiş saat reddedilir. Anahtar `ZERNIO_API_KEY_<HESAP>` (varsayılan hesap `patron`).
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, statSync } from "node:fs";
import { basename, dirname, resolve } from "node:path";
import { parseArgs } from "node:util";

import { anahtarSec } from "./anahtar.ts";
import { fisOku, type FisAlanlari } from "./fis.ts";
import { reelGovdesiKur, zernioIstemciKur, ZERNIO_SAAT_DILIMI, type ZernioHesap, type ZernioIstemci } from "./istemci.ts";
import { fiseDonusYaz, gonderiyiYokla, type YoklaSecenekleri } from "./yokla.ts";
import { SaatHatasi, zamanlamaKur } from "./zaman.ts";

const ACIKLAMA_MAX = 2200;
const HASHTAG_MAX = 30;
const VIDEO_MAX_BAYT = 300 * 1024 * 1024;
const SURE_MIN_SN = 3;
const SURE_MAX_SN = 15 * 60;
export const VARSAYILAN_HESAP = "patron";

export class PaylasHatasi extends Error {}

export interface Bagimliliklar {
  env: Readonly<Record<string, string | undefined>>;
  istemciKur: (apiKey: string) => ZernioIstemci;
  simdi: () => Date;
  /** Video süresi ve en-boy; ffprobe yoksa undefined. */
  videoBilgisi: (yol: string) => { saniye: number; genislik: number; yukseklik: number } | undefined;
  yaz: (satir: string) => void;
  yokla?: YoklaSecenekleri;
}

function ffprobeIle(yol: string) {
  try {
    const cikti = execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "format=duration:stream=width,height", "-of", "json", yol], { encoding: "utf8" });
    const j = JSON.parse(cikti) as { format: { duration: string }; streams: { width: number; height: number }[] };
    const s = j.streams[0];
    return s ? { saniye: Number(j.format.duration), genislik: s.width, yukseklik: s.height } : undefined;
  } catch {
    return undefined;
  }
}

const varsayilanlar = (): Bagimliliklar => ({
  env: process.env,
  istemciKur: (apiKey) => zernioIstemciKur({ apiKey }),
  simdi: () => new Date(),
  videoBilgisi: ffprobeIle,
  yaz: (satir) => console.log(satir),
});

/** Açıklama dosyası: "## Açıklama" başlığı varsa yalnız o bölüm, yoksa dosyanın tamamı. */
function aciklamaDosyasi(yol: string): string {
  if (!existsSync(yol)) throw new PaylasHatasi(`açıklama dosyası bulunamadı: ${yol}`);
  const metin = readFileSync(yol, "utf8");
  const bolum = /^##\s*Açıklama[^\n]*\n([\s\S]*?)(?=^##\s|(?![\s\S]))/m.exec(metin);
  return (bolum?.[1] ?? metin).trim();
}

const hesapAdi = (h: ZernioHesap) => `@${h.username ?? "?"}`;

export async function paylas(argv: string[], bag: Bagimliliklar = varsayilanlar()): Promise<void> {
  const { values } = parseArgs({
    args: argv,
    options: { fis: { type: "string" }, video: { type: "string" }, aciklama: { type: "string" }, saat: { type: "string" }, "kapak-ms": { type: "string" }, onay: { type: "string" }, hesap: { type: "string" }, ig: { type: "string" } },
  });

  // 1) Girdiler
  let fis: FisAlanlari | undefined;
  if (values.fis !== undefined) {
    if (!existsSync(values.fis)) throw new PaylasHatasi(`fiş bulunamadı: ${values.fis}`);
    fis = fisOku(readFileSync(values.fis, "utf8"));
  } else if (!values.video || !values.aciklama) throw new PaylasHatasi("--fis ya da (--video ve --aciklama) zorunlu.");

  const videoYolu = values.video ?? (fis?.video && values.fis ? resolve(dirname(values.fis), fis.video) : undefined);
  if (!videoYolu) throw new PaylasHatasi("video yolu yok: --video ver ya da fişe video yazılsın.");
  if (!existsSync(videoYolu)) throw new PaylasHatasi(`video bulunamadı: ${videoYolu}`);
  const dosyaAdi = basename(videoYolu);
  if (!dosyaAdi.toLowerCase().endsWith(".mp4")) throw new PaylasHatasi(`video .mp4 olmalı: ${dosyaAdi}`);
  const boyut = statSync(videoYolu).size;
  if (boyut === 0 || boyut > VIDEO_MAX_BAYT) throw new PaylasHatasi(`video boyutu geçersiz (${(boyut / 1048576).toFixed(1)} MB; sınır 300 MB).`);
  const medya = bag.videoBilgisi(videoYolu);
  if (medya && (medya.saniye < SURE_MIN_SN || medya.saniye > SURE_MAX_SN)) throw new PaylasHatasi(`süre ${medya.saniye.toFixed(1)} sn; Reel ${SURE_MIN_SN} sn – 15 dk olmalı.`);

  const aciklama = values.aciklama !== undefined ? aciklamaDosyasi(values.aciklama) : (fis?.aciklama_taslagi ?? "").trim();
  if (!aciklama) throw new PaylasHatasi("açıklama boş.");
  if (aciklama.length > ACIKLAMA_MAX) throw new PaylasHatasi(`açıklama ${aciklama.length} karakter; sınır ${ACIKLAMA_MAX}.`);
  const hashtag = aciklama.match(/#[\p{L}\p{N}_]+/gu)?.length ?? 0;
  if (hashtag > HASHTAG_MAX) throw new PaylasHatasi(`${hashtag} hashtag; sınır ${HASHTAG_MAX}.`);

  const kapakMs = Number(values["kapak-ms"] ?? 0);
  if (!Number.isInteger(kapakMs) || kapakMs < 0 || (medya && kapakMs > medya.saniye * 1000)) throw new PaylasHatasi("--kapak-ms video süresi içinde tam sayı olmalı.");

  let zamanlama: string | undefined;
  try {
    zamanlama = values.saat === undefined ? undefined : zamanlamaKur(values.saat, bag.simdi());
  } catch (e) {
    if (e instanceof SaatHatasi) throw new PaylasHatasi(e.message);
    throw e;
  }

  // 2) Onay kapıları (ağdan önce)
  const gercek = values.onay !== undefined;
  if (gercek) {
    if (values.onay !== dosyaAdi) throw new PaylasHatasi(`--onay değeri videonun dosya adı olmalı (${dosyaAdi}); onay başka videoya taşınmaz.`);
    if (fis && fis.paylasim_onay !== "evet") throw new PaylasHatasi('fişte "paylasim_onay: evet" yok; gerçek gönderim yapılmaz.');
    if (fis?.durum === "paylasildi") throw new PaylasHatasi("fiş zaten paylaşılmış (durum: paylasildi).");
  }

  // 3) Anahtar + hesap (yalnız okuma)
  const slug = fis?.hesap ?? values.hesap ?? VARSAYILAN_HESAP;
  const anahtar = anahtarSec(slug, bag.env);
  if (!anahtar) throw new PaylasHatasi(`Zernio anahtarı yok (.env: ZERNIO_API_KEY_${slug.toUpperCase().replace(/[^A-Z0-9]+/g, "_")}).`);
  const istemci = bag.istemciKur(anahtar.apiKey);
  const ig = (await istemci.hesaplar()).filter((h) => h.platform === "instagram" && h.isActive !== false);
  const secili = values.ig !== undefined ? ig.filter((h) => (h.username ?? "").toLowerCase() === values.ig!.replace(/^@/, "").toLowerCase()) : ig;
  if (secili.length === 0) throw new PaylasHatasi(values.ig ? `Zernio'da @${values.ig.replace(/^@/, "")} adlı etkin Instagram hesabı yok.` : "Zernio'da etkin Instagram hesabı bağlı değil.");
  if (secili.length > 1) throw new PaylasHatasi(`birden çok etkin Instagram hesabı (${secili.map(hesapAdi).join(", ")}); --ig <kullanıcı> ile seç.`);
  const hesap = secili[0] as ZernioHesap;

  const govde = reelGovdesiKur({ caption: aciklama, mediaUrl: "<yüklemeden sonra publicUrl>", accountId: hesap._id, thumbOffsetMs: kapakMs, ...(zamanlama ? { scheduledFor: zamanlama } : {}) });
  bag.yaz(gercek ? "GERÇEK GÖNDERİM" : "KURU KOŞU (hiçbir şey gönderilmez)");
  bag.yaz(`  hesap   : ${hesapAdi(hesap)} (${anahtar.envAdi})`);
  bag.yaz(`  video   : ${videoYolu} · ${(boyut / 1048576).toFixed(1)} MB${medya ? ` · ${medya.saniye.toFixed(1)} sn · ${medya.genislik}x${medya.yukseklik}` : " · ffprobe yok, süre denetlenmedi"}`);
  bag.yaz(`  yayın   : ${zamanlama ? `${zamanlama.replace("T", " ").slice(0, 16)} ${ZERNIO_SAAT_DILIMI} (zamanlanmış)` : "hemen"} · kapak ${kapakMs} ms`);
  bag.yaz(`  açıklama: ${aciklama.length} karakter, ${hashtag} hashtag\n---\n${aciklama}\n---`);
  bag.yaz(`  POST /posts gövdesi:\n${JSON.stringify(govde, null, 2)}`);
  if (!gercek) {
    bag.yaz(`\nGerçek gönderim için: --onay ${dosyaAdi}${fis ? " (fişte paylasim_onay: evet de olmalı)" : ""}`);
    return;
  }

  // 4) Yükle → gönder → yokla → fişe yaz
  const yuva = await istemci.presign({ filename: dosyaAdi, size: boyut, contentType: "video/mp4" });
  await istemci.yukle(yuva.uploadUrl, readFileSync(videoYolu), "video/mp4");
  bag.yaz(`yüklendi: ${yuva.publicUrl}`);
  const olusan = await istemci.gonderiOlustur({ ...govde, mediaItems: [{ type: "video", url: yuva.publicUrl }] });
  if (olusan.kind === "duplicate") throw new PaylasHatasi(`aynı içerik son 24 saatte bu hesaba gönderilmiş (post ${olusan.existingPostId ?? "?"}).`);
  const postId = olusan.state.postId as string;
  bag.yaz(`post ${postId} · HTTP ${olusan.httpStatus} · durum=${olusan.state.status ?? "?"}`);
  const sonuc = await gonderiyiYokla(istemci, postId, olusan.state, bag.yokla);
  if (sonuc.kind === "basarisiz") throw new PaylasHatasi(`gönderi başarısız (post ${postId}): ${sonuc.neden}`);
  if (sonuc.kind === "zaman_asimi") throw new PaylasHatasi(`yoklama 3 dk içinde bitmedi (post ${postId}, son durum ${sonuc.sonDurum ?? "?"}); Zernio panelinden bak, tekrar gönderme.`);
  bag.yaz(`${sonuc.durum === "scheduled" ? "ZAMANLANDI" : "YAYINLANDI"}${sonuc.permalink ? ` · ${sonuc.permalink}` : ""}`);
  if (values.fis) {
    fiseDonusYaz(values.fis, sonuc);
    bag.yaz(`fiş güncellendi: ${values.fis} (durum: paylasildi)`);
  }
}

/** CLI girişi: hata tek satır Türkçe, çıkış kodu 1. */
export async function calistir(argv: string[]): Promise<void> {
  try {
    await paylas(argv);
  } catch (e) {
    console.error(`HATA: ${e instanceof Error ? e.message : String(e)}`);
    process.exitCode = 1;
  }
}
