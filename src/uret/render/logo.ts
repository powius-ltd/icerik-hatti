/** Marka logoları (`assets/logo/*.svg`): tek renkli, `currentColor` ile boyanır; renk çevreleyen öğenin `color`'ından (tema belirteci) gelir. */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { REPO_KOK } from "./tema.ts";

export const LOGO_KOK = join(REPO_KOK, "assets/logo");

/** SVG'yi okur; başlığı atar, boyutu ve `currentColor` dolgusunu ekler. Dosya yoksa anlamlı hata. */
export async function logoSvg(ad: string, boyutPx: number, kok: string = LOGO_KOK): Promise<string> {
  if (!/^[a-z0-9]+$/.test(ad)) throw new Error(`Geçersiz logo adı: ${ad}`);
  const ham = await readFile(join(kok, `${ad}.svg`), "utf8").catch(() => {
    throw new Error(`Logo dosyası yok: assets/logo/${ad}.svg`);
  });
  return ham
    .replace(/<title>.*?<\/title>/s, "")
    .replace(/<svg\b/, `<svg width="${boyutPx}" height="${boyutPx}" fill="currentColor" aria-hidden="true"`)
    .replace(/\s+role="img"/, "")
    .trim();
}
