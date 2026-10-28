// Kaynak: viral-uyarla/src/ortak/dosya.ts (335b436)
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { z } from "zod";

/** JSON dosyasını okur ve şemayla doğrular; hata mesajı dosya yolunu ve ilk sorunları söyler. */
export async function okuJson<T extends z.ZodType>(yol: string, sema: T): Promise<z.infer<T>> {
  const ham: unknown = JSON.parse(await readFile(yol, "utf8"));
  const sonuc = sema.safeParse(ham);
  if (!sonuc.success) {
    const sorunlar = sonuc.error.issues.slice(0, 5).map((s) => `${s.path.join(".") || "(kök)"}: ${s.message}`);
    throw new Error(`${yol} şemaya uymuyor:\n  ${sorunlar.join("\n  ")}`);
  }
  return sonuc.data;
}

/** JSON yazar (klasörü açar, 2 boşluk girinti, sonda satır sonu). */
export async function yazJson(yol: string, veri: unknown): Promise<void> {
  await mkdir(path.dirname(yol), { recursive: true });
  await writeFile(yol, `${JSON.stringify(veri, null, 2)}\n`, "utf8");
}
