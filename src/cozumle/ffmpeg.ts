// Kaynak: viral-uyarla/src/cozumle/ffmpeg.ts (335b436)
/**
 * ffmpeg / ffprobe yardımcıları: süre ölçme ve büyük videoyu küçültme.
 * Büyük video (> 18 MB) 480p'ye indirilir: analiz için ses + görüntü yeter, büyük dosya yükleme/zaman aşımı riskidir.
 * Küçültülmüş dosya özgünden büyükse özgün kullanılır. ffmpeg yoksa sessizce atlanmaz: açık hata.
 */
import { copyFile, stat } from "node:fs/promises";
import { temelEnv } from "../ortak/surec.ts";
import { bulunamadi, type Kosucu } from "./surec-tipleri.ts";

export const KUCULTME_ESIGI_BAYT = 18 * 1024 * 1024;
const HEDEF_YUKSEKLIK = 480;
const KUCULTME_ZAMAN_ASIMI_MS = 180_000;

export function kucultmeArgumanlari(girdi: string, cikti: string): string[] {
  return [
    "-hide_banner", "-loglevel", "error", "-y",
    "-i", girdi,
    "-vf", `scale=-2:'min(${HEDEF_YUKSEKLIK},ih)'`,
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "28",
    "-c:a", "aac", "-b:a", "64k", "-ac", "1",
    "-movflags", "+faststart",
    cikti,
  ];
}

/** Video süresi (sn); ffprobe yoksa ya da okunamıyorsa undefined (bilinmeyen ≠ 0). */
export async function sureOlc(yol: string, kosucu: Kosucu, ortam: NodeJS.ProcessEnv = process.env): Promise<number | undefined> {
  try {
    const bin = ortam.FFPROBE_BIN?.trim() || "ffprobe";
    const s = await kosucu(bin, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", yol], { env: temelEnv(), timeoutMs: 30_000 });
    const sure = Number(s.stdout.trim());
    return s.kod === 0 && Number.isFinite(sure) && sure > 0 ? Math.round(sure * 100) / 100 : undefined;
  } catch {
    return undefined;
  }
}

export interface HazirVideo {
  bayt: number;
  kucultuldu: boolean;
}

/** `kaynak`'ı agy çalışma klasörüne `hedef` olarak koyar: küçükse kopya, büyükse 480p. */
export async function agyIcinHazirla(kaynak: string, hedef: string, kosucu: Kosucu, ortam: NodeJS.ProcessEnv = process.env, esik = KUCULTME_ESIGI_BAYT): Promise<HazirVideo> {
  const bayt = (await stat(kaynak)).size;
  if (bayt <= esik) {
    await copyFile(kaynak, hedef);
    return { bayt, kucultuldu: false };
  }
  try {
    const s = await kosucu(ortam.FFMPEG_BIN?.trim() || "ffmpeg", kucultmeArgumanlari(kaynak, hedef), { env: temelEnv(), timeoutMs: KUCULTME_ZAMAN_ASIMI_MS });
    if (s.kod !== 0) throw new Error(`Video küçültülemedi (ffmpeg çıkış ${s.kod}): ${s.stderr.trim().split("\n").slice(-3).join(" ")}`);
  } catch (hata) {
    if (bulunamadi(hata)) throw new Error("ffmpeg bulunamadı: kur ya da FFMPEG_BIN ile tam yolunu ver.");
    throw hata;
  }
  const kucuk = await stat(hedef).catch(() => undefined);
  if (!kucuk || kucuk.size === 0) throw new Error("Video küçültülemedi: ffmpeg çıktı dosyası üretmedi.");
  if (kucuk.size >= bayt) {
    await copyFile(kaynak, hedef);
    return { bayt, kucultuldu: false };
  }
  return { bayt: kucuk.size, kucultuldu: true };
}
