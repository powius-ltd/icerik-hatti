/**
 * Üretim akışı: onaylı fiş → ses (tek çağrı) → sahne planı (deterministik) → HyperFrames sayfası → check → render → kapak + açıklama → fişe dönüş.
 * Çıktı fişin klasörüne: ses.mp3, ses.json, hf/, final.mp4, kapak.png, aciklama.txt, uret.json. Fişe yalnız durum/video/kapak/hata_notu yazılır (geri-yaz.ts).
 */
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Kosucu } from "../cozumle/surec-tipleri.ts";
import { geriYaz } from "../fis/geri-yaz.ts";
import { fisOku, type Fis } from "../fis/sema.ts";
import { temelEnv } from "../ortak/surec.ts";
import { brollUygula } from "./broll-uygula.ts";
import { aciklamaYaz } from "./aciklama.ts";
import { kapakYap } from "./kapak.ts";
import { klipleriKes } from "./render/klip-kes.ts";
import { GURLUK } from "./render/gurluk.ts";
import { olustur, sayfayiDenetle } from "./render/hyperframes.ts";
import { enBuyukBosluk, makeGroups, toWords } from "./render/kelimeler.ts";
import { composePage } from "./render/sayfa.ts";
import { FONT_KOK, temaYukle, themeFontFiles } from "./render/tema.ts";
import { okunusMetni, planKur } from "./sahne-plani.ts";
import { sesUret } from "./ses/sentez.ts";
import type { SesAyari } from "./ses/ayar.ts";
import type { SesSaglayici } from "./ses/saglayici.ts";

/** K26: altyazının görünmediği aralık bu süreyi geçerse üretim durur. */
export const BOSLUK_TAVANI_SN = 1.0;
const SURE_SAPMASI_SN = 0.5;

export interface UretGirdisi {
  fisYolu: string;
  /** Hazır sağlayıcı ya da hesabın ses ayarından kuran fabrika (`saglayiciKur().kur`). */
  saglayici: SesSaglayici | ((ayar?: SesAyari) => SesSaglayici);
  sesId: string;
  render: boolean;
  yeniden?: boolean;
  karakterTavani?: number;
  /** B-roll arşiv kökü: verilirse hesabın `broll.kok`'unu ezer; `null` = b-roll kapalı. */
  brollKok?: string | null;
}

export interface UretBagi {
  kosucu: Kosucu;
  gunluk: (satir: string) => void;
}

export interface UretSonucu {
  klasor: string;
  hfDir: string;
  sureSn: number;
  karakter: number;
  cagriYapildi: boolean;
  enBuyukBoslukSn: number;
  final?: string;
  kapak?: string;
}

/** Onay kapısı: fiş onaylı ve henüz paylaşılmamış olmalı. */
export function uretilebilir(fis: Fis): void {
  if (fis.fis_onay !== "evet") throw new Error(`Fiş onaylı değil (fis_onay: ${fis.fis_onay}); önce fişi okuyup fis_onay: evet yapın.`);
  if (fis.durum === "paylasildi") throw new Error("Fiş zaten paylaşılmış (durum: paylasildi); yeniden üretilmez.");
}

async function videoDogrula(video: string, sesSn: number, kosucu: Kosucu): Promise<{ w: number; h: number; sureSn: number }> {
  const s = await kosucu("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=width,height:format=duration", "-of", "json", video], { env: temelEnv(), timeoutMs: 30_000 });
  const j = JSON.parse(s.stdout) as { streams?: Array<{ width?: number; height?: number }>; format?: { duration?: string } };
  const w = j.streams?.[0]?.width ?? 0;
  const h = j.streams?.[0]?.height ?? 0;
  const sureSn = Number(j.format?.duration);
  if (w !== 1080 || h !== 1920) throw new Error(`${video}: çözünürlük ${w}x${h}, 1080x1920 bekleniyordu.`);
  if (!Number.isFinite(sureSn) || Math.abs(sureSn - sesSn) > SURE_SAPMASI_SN) throw new Error(`${video}: süre ${sureSn} sn, ses ${sesSn} sn; fark ${SURE_SAPMASI_SN} sn'yi aşıyor.`);
  return { w, h, sureSn };
}

async function sayfayiYaz(hfDir: string, html: string, yazilar: string[], mp3: string, kosucu: Kosucu): Promise<void> {
  await mkdir(path.join(hfDir, "assets", "fonts"), { recursive: true });
  await writeFile(path.join(hfDir, "index.html"), html, "utf8");
  for (const f of yazilar) await copyFile(path.join(FONT_KOK, f), path.join(hfDir, "assets", "fonts", f));
  // Render mono sesi tam kazançla iki kanala çoğaltır; ses baştan stereo 48 kHz verilir, gürlük render sonunda düzeltilir.
  const s = await kosucu("ffmpeg", ["-v", "error", "-y", "-i", mp3, "-ac", "2", "-ar", "48000", path.join(hfDir, "assets", "ses-son.wav")], { env: temelEnv(), timeoutMs: 120_000 });
  if (s.kod !== 0) throw new Error(`Ses wav'a çevrilemedi: ${s.stderr.trim().slice(-200)}`);
}

export async function uret(g: UretGirdisi, bag: UretBagi): Promise<UretSonucu> {
  const fis = fisOku(await readFile(g.fisYolu, "utf8"));
  uretilebilir(fis);
  const klasor = path.dirname(path.resolve(g.fisYolu));
  const hfDir = path.join(klasor, "hf");
  try {
    if (g.render) await geriYaz(g.fisYolu, { durum: "uretiliyor" });
    const tema = await temaYukle(fis.hesap);
    const ses = await sesUret({ metin: okunusMetni(fis), klasor, saglayici: typeof g.saglayici === "function" ? g.saglayici(tema.ses) : g.saglayici, ...(tema.ses && { sozluk: tema.ses.lexicon }), sesId: g.sesId, kosucu: bag.kosucu, yeniden: g.yeniden ?? false, ...(g.karakterTavani !== undefined && { karakterTavani: g.karakterTavani }), gunluk: bag.gunluk });
    bag.gunluk(`ses: ${ses.sureSn} sn, ${ses.kelimeler.length} kelime, ${ses.karakter} karakter`);

    const brollAyar = g.brollKok === null ? undefined : g.brollKok !== undefined && tema.broll ? { ...tema.broll, kok: g.brollKok } : tema.broll;
    const { plan, kalipler, kesimler } = await brollUygula(fis, planKur(fis, ses.kelimeler, ses.sureSn), brollAyar, hfDir, bag.kosucu);
    bag.gunluk(`sahne planı: ${kalipler.map((k) => `${k.no}:${k.template}`).join(" ")}`);
    const words = toWords(ses.kelimeler, plan.captions);
    const bosluk = enBuyukBosluk(makeGroups(words, plan.captions, tema), ses.sureSn, tema);
    if (bosluk > BOSLUK_TAVANI_SN) throw new Error(`Altyazısız boşluk ${bosluk.toFixed(2)} sn; tavan ${BOSLUK_TAVANI_SN} sn (K26).`);
    const sayfa = await composePage({ plan, words, durationSec: ses.sureSn, theme: tema, hesap: fis.hesap, audioSrc: "assets/ses-son.wav", audioDurationSec: ses.sureSn });
    await sayfayiYaz(hfDir, sayfa.html, themeFontFiles(tema), ses.mp3, bag.kosucu);
    await klipleriKes(kesimler, bag.kosucu);
    if (kesimler.length > 0) bag.gunluk(`b-roll: ${kesimler.length} klip kırpıldı`);
    bag.gunluk(`hf/index.html: ${sayfa.html.length} bayt`);
    await sayfayiDenetle(hfDir, bag.kosucu);
    bag.gunluk("hyperframes check: geçti");

    const sonuc: UretSonucu = { klasor, hfDir, sureSn: ses.sureSn, karakter: ses.karakter, cagriYapildi: ses.cagriYapildi, enBuyukBoslukSn: Math.round(bosluk * 100) / 100 };
    const aciklama = await aciklamaYaz(path.join(klasor, "aciklama.txt"), fis.aciklama_taslagi);
    if (g.render) {
      const final = path.join(klasor, "final.mp4");
      await olustur({ hfDir, output: final, gurluk: GURLUK }, bag.kosucu);
      const v = await videoDogrula(final, ses.sureSn, bag.kosucu);
      bag.gunluk(`final.mp4: ${v.w}x${v.h}, ${v.sureSn} sn`);
      const kapak = await kapakYap({ video: final, klasor, cikti: path.join(klasor, "kapak.png"), kosucu: bag.kosucu });
      bag.gunluk(`kapak.png: ${kapak.anSn} sn karesi`);
      await geriYaz(g.fisYolu, { durum: "uretildi", video: "final.mp4", kapak: "kapak.png" });
      sonuc.final = final;
      sonuc.kapak = kapak.yol;
    }
    await writeFile(path.join(klasor, "uret.json"), `${JSON.stringify({ sureSn: ses.sureSn, karakter: ses.karakter, usd: ses.usd, sesCagrisi: ses.cagriYapildi, kalipler, enBuyukBoslukSn: sonuc.enBuyukBoslukSn, aciklamaKarakter: aciklama.length, render: g.render }, null, 2)}\n`, "utf8");
    return sonuc;
  } catch (hata) {
    if (g.render) await geriYaz(g.fisYolu, { durum: "hata", hata_notu: (hata instanceof Error ? hata.message : String(hata)).split("\n")[0]!.slice(0, 200) }).catch(() => undefined);
    throw hata;
  }
}
