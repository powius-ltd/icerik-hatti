// Kaynak: viral-uyarla/src/cozumle/dokum.ts (335b436)
/** Whisper dökümü: `py/asr.py`'yi çalıştırır, çıktıyı `dokumSema` ile doğrular. Orijinal dilde, çevrilmez. */
import path from "node:path";
import { okuJson } from "../ortak/dosya.ts";
import { temelEnv } from "../ortak/surec.ts";
import { dokumSema, type Dokum } from "../ortak/tipler.ts";
import { bulunamadi, type Kosucu } from "./surec-tipleri.ts";

const ASR_BETIGI = path.resolve(import.meta.dirname, "../../py/asr.py");
const DOKUM_ZAMAN_ASIMI_MS = 15 * 60_000;

export async function dokumCikar(videoYolu: string, ciktiYolu: string, kosucu: Kosucu, ortam: NodeJS.ProcessEnv = process.env, dil?: string): Promise<Dokum> {
  const python = ortam.WHISPER_PY?.trim() || "python3";
  const env = temelEnv({ WHISPER_MODEL: ortam.WHISPER_MODEL, WHISPER_LANG: dil ?? ortam.WHISPER_LANG });
  let sonuc;
  try {
    // -I: kullanıcı site paketlerini ve çalışma klasörünü içe aktarma yoluna katmaz
    sonuc = await kosucu(python, ["-I", ASR_BETIGI, videoYolu, ciktiYolu], { env, timeoutMs: DOKUM_ZAMAN_ASIMI_MS });
  } catch (hata) {
    if (bulunamadi(hata)) throw new Error(`Python bulunamadı (${python}): WHISPER_PY ile faster-whisper kurulu Python'un yolunu ver.`);
    throw hata;
  }
  if (sonuc.kod !== 0) {
    const kuyruk = sonuc.stderr.trim().split("\n").slice(-8).join("\n");
    throw new Error(`Whisper dökümü başarısız (çıkış ${sonuc.kod}). WHISPER_PY faster-whisper kurulu mu?\n${kuyruk}`);
  }
  return okuJson(ciktiYolu, dokumSema);
}

/** Dökümü agy istemine konacak düz metne çevirir: `[12.3] cümle` satırları. */
export function dokumMetni(dokum: Dokum): string {
  if (dokum.segmentler.length === 0) return "(no speech detected)";
  return dokum.segmentler.map((s) => `[${s.bas.toFixed(1)}-${s.son.toFixed(1)}] ${s.metin}`).join("\n");
}
