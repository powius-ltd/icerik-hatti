// Kaynak: viral-uyarla/src/cozumle/surec-tipleri.ts (335b436)
/** Alt süreç çalıştırıcı tipi: gerçek `calistir` (src/ortak/surec.ts) ya da testte sahte. */
import type { SurecSecenek, SurecSonucu } from "../ortak/surec.ts";

export type Kosucu = (komut: string, argumanlar: string[], secenek?: SurecSecenek) => Promise<SurecSonucu>;

/** Spawn edilemeyen komut (kurulu değil) mi? */
export function bulunamadi(hata: unknown): boolean {
  return typeof hata === "object" && hata !== null && (hata as NodeJS.ErrnoException).code === "ENOENT";
}
