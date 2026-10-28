/**
 * Tablo yoklama turu (durum makinesi). Bir tur satır başına EN FAZLA BİR geçiş yapar:
 *   yeni → fis_hazir → (fis_onay=evet) → video_hazir → (paylasim_onay=evet) → zamanlandi → yayinda | hata
 *   zamanlandi + paylasim_onay≠evet (onay geri alındı) → Zernio'daki zamanlanmış gönderi silinir, durum video_hazir (yayınlanmışsa silinmez, yalnız not)
 * Her satır kendi try/catch'inde: bir satır patlarsa durum=hata + not yazılır, öteki satırlar sürer. Kuru kipte hiçbir yazma/alt komut yok.
 * Yazmadan önce satır, `ornek_link` ile yeniden bulunur (ekip araya satır eklediyse kayma yanlış satıra yazdırmaz).
 */
import { existsSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { geriYaz, onayYaz } from "../fis/geri-yaz.ts";
import { zamanlamaKur } from "../paylas/zaman.ts";
import { tabloFisOku } from "./fis-yardim.ts";
import { satirKimligi, satirlariCoz, zamanBicimle } from "./satir.ts";
import type { AltKomutlar, DriveIstemci, HatAlani, Satir, GonderiIptal, TabloIstemci, YayinSorgu } from "./tipler.ts";

export interface Baglam {
  tablo: TabloIstemci;
  drive: DriveIstemci;
  alt: AltKomutlar;
  yayin: YayinSorgu;
  /** Zamanlanmış Zernio gönderisini siler (onay geri alınınca). */
  iptal: GonderiIptal;
  /** `kosular/tablo` (fişler `<dizin>/<satır-kimliği>/fis.md`). */
  kosuDizini: string;
  kosuAdi: string;
  simdi: () => Date;
  yaz: (satir: string) => void;
  kuru: boolean;
}

export interface Ozet {
  islenen: number;
  atlanan: number;
  hata: number;
}

const YAYIN_BEKLEME_MS = 10 * 60_000;
const kisa = (e: unknown) => (e instanceof Error ? e.message : String(e)).split("\n")[0]!.replace(/\s+/g, " ").trim().slice(0, 200);

/** Linke göre güncel satır; aynı link birden çoksa önce aynı satır no. */
async function taze(b: Baglam, link: string, no?: number): Promise<Satir | undefined> {
  const eslesen = satirlariCoz(await b.tablo.oku()).filter((s) => s.ornekLink === link);
  return eslesen.find((s) => s.no === no) ?? eslesen[0];
}

/** Satırı linkiyle yeniden bulup yalnız hat hücrelerini yazar. */
async function guvenliYaz(b: Baglam, s: Satir, alanlar: HatAlani): Promise<void> {
  const guncel = await taze(b, s.ornekLink, s.no);
  if (!guncel) throw new Error("satır tablodan silinmiş ya da link değiştirilmiş; yazılmadı");
  await b.tablo.yaz(guncel.no, alanlar);
}

function urlDenetle(link: string): void {
  let u: URL;
  try {
    u = new URL(link);
  } catch {
    throw new Error("ornek_link geçerli bir URL değil");
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") throw new Error("ornek_link http(s) olmalı");
}

async function fisAdimi(b: Baglam, s: Satir, id: string, fis: string): Promise<boolean> {
  urlDenetle(s.ornekLink);
  if (s.paylasimZamani) zamanBicimle(s.paylasimZamani);
  if (b.kuru) return b.yaz(`  satır ${s.no}: fiş üretilecek (${existsSync(fis) ? "fiş zaten var, yeniden üretilmez" : "claude çağrısı"}) → fis_hazir`), true;
  if (!existsSync(fis)) await b.alt.fis({ url: s.ornekLink, kosu: b.kosuAdi, id });
  if (!existsSync(fis)) throw new Error("fis komutu bitti ama fis.md oluşmadı");
  await guvenliYaz(b, s, { durum: "fis_hazir", not: "" });
  b.yaz(`  satır ${s.no}: fiş hazır (${fis})`);
  return true;
}

async function uretAdimi(b: Baglam, s: Satir, id: string, fis: string): Promise<boolean> {
  if (!existsSync(fis)) throw new Error("fis.md bulunamadı; durumu yeni yapıp fişi yeniden üretin");
  if (b.kuru) return b.yaz(`  satır ${s.no}: fis_onay=evet → video üretilecek, Drive'a yüklenecek → video_hazir`), true;
  const guncel = await taze(b, s.ornekLink, s.no); // render uzun sürer: onay son anda hâlâ evet mi
  if (!guncel?.fisOnay || guncel.durum !== "fis_hazir") return b.yaz(`  satır ${s.no}: onay geri alınmış; üretim yapılmadı`), false;
  await onayYaz(fis, { fis_onay: "evet" });
  await b.alt.uret(fis);
  const f = tabloFisOku(fis);
  const video = f.video ? resolve(dirname(fis), f.video) : undefined;
  if (!video || !existsSync(video)) throw new Error("uret bitti ama video dosyası yok");
  if (!f.aciklama_taslagi) throw new Error("fişte açıklama yok");
  const link = await b.drive.yukle(video, `${id}.mp4`);
  await guvenliYaz(b, s, { durum: "video_hazir", video_link: link, caption: f.aciklama_taslagi, not: "" });
  b.yaz(`  satır ${s.no}: video hazır → ${link}`);
  return true;
}

async function paylasAdimi(b: Baglam, s: Satir, fis: string): Promise<boolean> {
  if (!s.paylasimZamani) throw new Error("paylasim_zamani boş; zamanlanamaz");
  const saat = zamanBicimle(s.paylasimZamani);
  zamanlamaKur(saat, b.simdi()); // geçmiş saat reddedilir (hemen yayın olur, geri alınamaz)
  if (!existsSync(fis)) throw new Error("fis.md bulunamadı");
  const f = tabloFisOku(fis);
  if (!f.video) throw new Error("fişte video yok");
  const videoAdi = basename(f.video);
  if (b.kuru) return b.yaz(`  satır ${s.no}: paylasim_onay=evet → ${saat} (İstanbul) için Zernio'ya zamanlanacak (${videoAdi}) → zamanlandi`), true;
  const guncel = await taze(b, s.ornekLink, s.no);
  if (!guncel?.paylasimOnay || guncel.durum !== "video_hazir") return b.yaz(`  satır ${s.no}: paylaşım onayı geri alınmış; zamanlanmadı`), false;
  await onayYaz(fis, { paylasim_onay: "evet" });
  await b.alt.paylas({ fisYolu: fis, saat, onay: videoAdi });
  await guvenliYaz(b, s, { durum: "zamanlandi", not: "" });
  b.yaz(`  satır ${s.no}: zamanlandı (${saat})`);
  return true;
}

async function yayinAdimi(b: Baglam, s: Satir, fis: string): Promise<boolean> {
  if (!s.paylasimZamani || !existsSync(fis)) return false;
  if (b.simdi().getTime() < Date.parse(zamanIso(s.paylasimZamani)) + YAYIN_BEKLEME_MS) return false;
  if (b.kuru) return b.yaz(`  satır ${s.no}: zaman geçti; Zernio yayın durumu sorulacak`), true;
  const f = tabloFisOku(fis);
  if (!f.zernioPostId) return false;
  const d = await b.yayin(f.zernioPostId, f.hesap);
  if (d.durum === "bekliyor") return false;
  if (d.durum === "hata") throw new Error(`Zernio: ${d.neden}`);
  await guvenliYaz(b, s, { durum: "yayinda", ...(d.link ? { instagram_link: d.link } : {}), not: "" });
  b.yaz(`  satır ${s.no}: yayında ${d.link ?? ""}`);
  return true;
}

const IPTAL_NOTU = "paylaşım iptal edildi (onay geri alındı)";
const YAYINDA_NOTU = "paylaşım onayı geri alındı ama gönderi zaten yayında; silinmedi";

/**
 * zamanlandi + paylasim_onay evet değil. Önce Zernio'ya durum sorulur: yayınlanmışsa silinmez (yalnız not), değilse zamanlanmış gönderi silinir.
 * Fişin paylaşım izi geri alınır (durum uretildi, paylasim_onay hayir) ki onay yeniden verilirse hat tekrar zamanlayabilsin; eski zernio_post_id yeni gönderide ezilir.
 * Hata olursa satır hata olur, otomatik sıfırlanmaz (ekip durumu elle düzeltir; karar 2026-10-28).
 */
async function iptalAdimi(b: Baglam, s: Satir, fis: string): Promise<boolean> {
  if (!existsSync(fis)) throw new Error("onay geri alındı ama fis.md bulunamadı; Zernio'daki gönderi elle iptal edilmeli");
  const f = tabloFisOku(fis);
  if (!f.zernioPostId) throw new Error("onay geri alındı ama fişte zernio_post_id yok; Zernio'daki gönderi elle iptal edilmeli");
  if (b.kuru) return b.yaz(`  satır ${s.no}: paylasim_onay evet değil → Zernio gönderisi ${f.zernioPostId} yayında değilse SİLİNECEK, durum video_hazir (kuru kip: silinmedi)`), true;
  const d = await b.yayin(f.zernioPostId, f.hesap);
  if (d.durum === "yayinda") {
    await guvenliYaz(b, s, { durum: "yayinda", ...(d.link ? { instagram_link: d.link } : {}), not: YAYINDA_NOTU });
    b.yaz(`  satır ${s.no}: onay geri alındı ama gönderi yayında; silinmedi`);
    return true;
  }
  if (d.durum === "hata") throw new Error(`Zernio: ${d.neden}`);
  await b.iptal(f.zernioPostId, f.hesap);
  await geriYaz(fis, { durum: "uretildi" });
  await onayYaz(fis, { paylasim_onay: "hayir" });
  await guvenliYaz(b, s, { durum: "video_hazir", not: IPTAL_NOTU });
  b.yaz(`  satır ${s.no}: paylaşım iptal edildi (Zernio gönderisi ${f.zernioPostId} silindi)`);
  return true;
}

function zamanIso(deger: string): string {
  return `${zamanBicimle(deger).replace(" ", "T")}:00+03:00`;
}

async function satiriIsle(b: Baglam, s: Satir, id: string): Promise<boolean> {
  const fis = join(b.kosuDizini, id, "fis.md");
  switch (s.durum || "yeni") {
    case "yeni":
      return fisAdimi(b, s, id, fis);
    case "fis_hazir":
      if (s.fisOnay) return uretAdimi(b, s, id, fis);
      if (existsSync(fis) && !b.kuru) await onayYaz(fis, { fis_onay: "hayir" }); // tablodan geri alınan onay fişe de yansır
      return false;
    case "video_hazir":
      if (s.paylasimOnay) return paylasAdimi(b, s, fis);
      if (existsSync(fis) && !b.kuru) await onayYaz(fis, { paylasim_onay: "hayir" });
      return false;
    case "zamanlandi":
      return s.paylasimOnay ? yayinAdimi(b, s, fis) : iptalAdimi(b, s, fis);
    default:
      return false; // yayinda, hata (ekip durumu silip/yeniden ayarlayınca devam), bilinmeyen
  }
}

export async function yokla(b: Baglam): Promise<Ozet> {
  const satirlar = satirlariCoz(await b.tablo.oku());
  const ozet: Ozet = { islenen: 0, atlanan: 0, hata: 0 };
  const gorulen = new Set<string>();
  for (const s of satirlar) {
    try {
      if (gorulen.has(s.ornekLink) && (s.durum || "yeni") === "yeni") throw new Error("aynı ornek_link tabloda birden çok satırda; yalnız ilki işlenir");
      gorulen.add(s.ornekLink);
      if (await satiriIsle(b, s, satirKimligi(s.ornekLink))) ozet.islenen += 1;
      else ozet.atlanan += 1;
    } catch (e) {
      ozet.hata += 1;
      b.yaz(`  satır ${s.no}: HATA ${kisa(e)}`);
      if (!b.kuru && s.durum !== "hata") await guvenliYaz(b, s, { durum: "hata", not: kisa(e) }).catch((y) => b.yaz(`  satır ${s.no}: hata notu yazılamadı (${kisa(y)})`));
    }
  }
  return ozet;
}
