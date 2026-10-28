// Kaynak: kreatif-studyo/src/hf-engine/loudness.ts + voice.ts (parseLoudnorm) (b6aff3d); süreç çalıştırıcı bu reponun `Kosucu`'su
/**
 * Render sonrası ses seviyesi: HyperFrames sesi ~3 dB yükseltiyor (−11,8 LUFS), bu yüzden bitmiş videonun sesi iki geçişli doğrusal loudnorm'dan
 * geçer; görüntü bayt bayt kopyalanır (`-c:v copy`). Çıktı bağımsız bir ölçümle doğrulanır; hedefin dışındaysa Türkçe hatayla durur.
 */
import { z } from "zod";
import type { Kosucu } from "../../cozumle/surec-tipleri.ts";
import { temelEnv } from "../../ortak/surec.ts";

export interface GurlukHedefi {
  targetLufs: number;
  /** Gerçek tepe sınırı (dBTP). */
  truePeakDb: number;
  lra: number;
  toleranceLu: number;
}

/** Sosyal medya için hedef: −14 LUFS, −1 dBTP. */
export const GURLUK: GurlukHedefi = { targetLufs: -14, truePeakDb: -1, lra: 11, toleranceLu: 1 };

const SAMPLE_RATE = 48000;
const AUDIO_BITRATE = "192k";
const FFMPEG_TIMEOUT_MS = 10 * 60 * 1000;

export interface LoudnormStats {
  inputI: string;
  inputTp: string;
  inputLra: string;
  inputThresh: string;
  targetOffset: string;
}

const LoudnormJson = z.object({ input_i: z.string(), input_tp: z.string(), input_lra: z.string(), input_thresh: z.string(), target_offset: z.string() });

/** ffmpeg loudnorm `print_format=json` çıktısı stderr'in sonundaki JSON bloğudur. */
export function parseLoudnorm(stderr: string): LoudnormStats {
  const start = stderr.lastIndexOf("{");
  const end = stderr.lastIndexOf("}");
  if (start < 0 || end < start) throw new Error("ffmpeg loudnorm ölçümü JSON vermedi (ses dosyası okunamamış olabilir).");
  const j = LoudnormJson.parse(JSON.parse(stderr.slice(start, end + 1)));
  return { inputI: j.input_i, inputTp: j.input_tp, inputLra: j.input_lra, inputThresh: j.input_thresh, targetOffset: j.target_offset };
}

const measureFilter = (t: GurlukHedefi) => `loudnorm=I=${t.targetLufs}:TP=${t.truePeakDb}:LRA=${t.lra}:print_format=json`;

/** İkinci geçiş: birinci geçişin ölçümüyle doğrusal loudnorm. */
export function normalizeFilter(t: GurlukHedefi, m: LoudnormStats): string {
  return `loudnorm=I=${t.targetLufs}:TP=${t.truePeakDb}:LRA=${t.lra}:measured_I=${m.inputI}:measured_TP=${m.inputTp}:measured_LRA=${m.inputLra}:measured_thresh=${m.inputThresh}:offset=${m.targetOffset}:linear=true,aresample=${SAMPLE_RATE}`;
}

async function olc(yol: string, hedef: GurlukHedefi, kosucu: Kosucu): Promise<LoudnormStats> {
  const s = await kosucu("ffmpeg", ["-hide_banner", "-threads", "2", "-i", yol, "-vn", "-af", measureFilter(hedef), "-f", "null", "-"], { env: temelEnv(), timeoutMs: FFMPEG_TIMEOUT_MS });
  return parseLoudnorm(s.stderr);
}

export interface GurlukSonucu {
  beforeLufs: number;
  afterLufs: number;
  afterTruePeakDb: number;
}

/** `girdi` videosunun sesini hedefe getirip `cikti`'ya yazar (görüntü kopya). */
export async function gurlukNormallestir(g: { girdi: string; cikti: string; hedef: GurlukHedefi; kosucu: Kosucu }): Promise<GurlukSonucu> {
  const { hedef, kosucu } = g;
  const ilk = await olc(g.girdi, hedef, kosucu);
  const s = await kosucu("ffmpeg", ["-v", "error", "-y", "-threads", "2", "-i", g.girdi, "-c:v", "copy", "-af", normalizeFilter(hedef, ilk), "-c:a", "aac", "-b:a", AUDIO_BITRATE, "-ar", String(SAMPLE_RATE), g.cikti], { env: temelEnv(), timeoutMs: FFMPEG_TIMEOUT_MS });
  if (s.kod !== 0) throw new Error(`ffmpeg gürlük düzeltmesi başarısız: ${s.stderr.trim().slice(-300)}`);
  const kontrol = await olc(g.cikti, hedef, kosucu);
  const afterLufs = Number(kontrol.inputI);
  const afterTruePeakDb = Number(kontrol.inputTp);
  if (!Number.isFinite(afterLufs) || Math.abs(afterLufs - hedef.targetLufs) > hedef.toleranceLu) {
    throw new Error(`Video gürlüğü hedefte değil: ${kontrol.inputI} LUFS (hedef ${hedef.targetLufs} ± ${hedef.toleranceLu}). Ayrıntı: ${g.cikti}`);
  }
  if (afterTruePeakDb > hedef.truePeakDb + 0.3) throw new Error(`Video gerçek tepesi sınırda değil: ${kontrol.inputTp} dBTP (sınır ${hedef.truePeakDb}). Ayrıntı: ${g.cikti}`);
  return { beforeLufs: Number(ilk.inputI), afterLufs, afterTruePeakDb };
}
