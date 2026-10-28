// Kaynak: viral-uyarla/src/cozumle/akis.ts (335b436)
/**
 * Tek hedefin çözümleme akışı: indir (ya da yerel kopya) → süre ölç → döküm (whisper) → agy çözümlemesi → `dokum.json` + `analiz.json`.
 *  - Yeniden başlatılabilir: `kaynak.mp4` ve geçerli `dokum.json` varsa atlanır (`--yeniden` hepsini baştan yapar). Böylece agy hatasından
 *    sonra indirme ve whisper tekrarlanmaz.
 *  - Telif: `kaynak.mp4` yalnız `kosular/` altındadır; çözümleme BAŞARILI bitince `--sakla` yoksa silinir (hatada yeniden deneme için kalır).
 *    agy'ye verilen kopya (`calisma/agy/`) her durumda silinir.
 */
import { copyFile, mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import { okuJson, yazJson } from "../ortak/dosya.ts";
import { kosuYollari } from "../ortak/kosu.ts";
import { dokumSema, type Analiz, type Dokum } from "../ortak/tipler.ts";
import type { AgyBagimlilik } from "./agy.ts";
import { analizEt } from "./analiz.ts";
import { dokumCikar } from "./dokum.ts";
import { agyIcinHazirla, sureOlc } from "./ffmpeg.ts";
import type { Hedef } from "./hedefler.ts";
import { videoIndir } from "./indir.ts";
import type { Kosucu } from "./surec-tipleri.ts";
import { ytdlpIndir } from "./ytdlp.ts";

export interface AkisBagimlilik {
  kosucu: Kosucu;
  agy: AgyBagimlilik;
  ortam: NodeJS.ProcessEnv;
  fetch?: typeof fetch;
  gunluk: (satir: string) => void;
}

export interface AkisSecenek {
  sakla: boolean;
  yeniden: boolean;
  dil?: string;
}

const varMi = async (yol: string): Promise<boolean> => (await stat(yol).then((s) => s.size > 0).catch(() => false));

async function kaynagiHazirla(h: Hedef, hedef: string, b: AkisBagimlilik, yeniden: boolean): Promise<void> {
  if (h.yerelVideo) {
    if (!(await varMi(h.yerelVideo))) throw new Error(`Yerel video bulunamadı ya da boş: ${h.yerelVideo}`);
    await copyFile(h.yerelVideo, hedef);
    return;
  }
  if (!yeniden && (await varMi(hedef))) {
    b.gunluk("kaynak.mp4 var, indirme atlandı");
    return;
  }
  const sebepler: string[] = [];
  if (h.videoUrl) {
    try {
      const bayt = await videoIndir(h.videoUrl, hedef, { fetch: b.fetch });
      b.gunluk(`indirildi: ${(bayt / 1048576).toFixed(1)} MB (videoUrl)`);
      return;
    } catch (hata) {
      sebepler.push(`videoUrl: ${(hata as Error).message}`);
    }
  } else sebepler.push("videoUrl yok");
  if (h.sayfaUrl) {
    try {
      const bayt = await ytdlpIndir(h.sayfaUrl, hedef, b.kosucu, b.ortam);
      b.gunluk(`indirildi: ${(bayt / 1048576).toFixed(1)} MB (yt-dlp yedeği)`);
      return;
    } catch (hata) {
      sebepler.push(`yt-dlp: ${(hata as Error).message}`);
    }
  }
  throw new Error(`${h.id} indirilemedi — ${sebepler.join(" | ")}. Videoyu elle indirip \`cozumle --kosu … --video <dosya> --id ${h.id}\` ile ver.`);
}

export async function hedefiCozumle(kosu: string, h: Hedef, sec: AkisSecenek, b: AkisBagimlilik): Promise<Analiz> {
  const yol = kosuYollari(kosu).aday(h.id);
  await mkdir(yol.kok, { recursive: true });
  await kaynagiHazirla(h, yol.kaynakVideo, b, sec.yeniden);

  const sureSn = await sureOlc(yol.kaynakVideo, b.kosucu, b.ortam);
  let dokum: Dokum | undefined;
  if (!sec.yeniden && (await varMi(yol.dokum))) dokum = await okuJson(yol.dokum, dokumSema).catch(() => undefined);
  if (dokum) b.gunluk("dokum.json var, whisper atlandı");
  else {
    dokum = await dokumCikar(yol.kaynakVideo, yol.dokum, b.kosucu, b.ortam, sec.dil);
    b.gunluk(`döküm: dil ${dokum.dil}, ${dokum.segmentler.length} segment`);
  }

  const agyDizini = path.join(yol.calisma, "agy");
  await rm(agyDizini, { recursive: true, force: true });
  await mkdir(agyDizini, { recursive: true });
  try {
    const hazir = await agyIcinHazirla(yol.kaynakVideo, path.join(agyDizini, "video.mp4"), b.kosucu, b.ortam);
    b.gunluk(`agy'ye gidiyor: ${(hazir.bayt / 1048576).toFixed(1)} MB${hazir.kucultuldu ? " (480p'ye küçültüldü)" : ""}, model ${b.agy.ayar.model}`);
    const sonuc = await analizEt({ adayId: h.id, dizin: agyDizini, videoAdi: "video.mp4", dokum, aciklama: h.aciklama, sureSn }, b.agy);
    await yazJson(yol.analiz, sonuc.analiz);
    const i = sonuc.istatistik;
    b.gunluk(`agy: ${i.cagri} çağrı, ${i.duzeltmeTuru} düzeltme turu, ${i.kotaYenidenDeneme} kota beklemesi${sonuc.kullanim.toplamToken !== undefined ? `, ${sonuc.kullanim.toplamToken} token` : ""}`);
    if (!sec.sakla) await rm(yol.kaynakVideo, { force: true });
    return sonuc.analiz;
  } finally {
    await rm(agyDizini, { recursive: true, force: true });
  }
}
