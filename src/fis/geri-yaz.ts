// Kaynak: kreatif-studyo/src/orders/write-back.ts (kalıp); alan listesi fişe göre.
/**
 * Fiş dönüş yazımı: üretim hattı fişin frontmatter'ına YALNIZ `durum`, `video`, `kapak`, `hata_notu` yazar. Satır düzeyinde:
 * hedef satır değişir, öteki satırlara (yorumlar, gövde) dokunulmaz; YAML baştan yazılmaz. Alan yoksa frontmatter sonuna eklenir.
 * Yazım atomiktir (geçici dosya + yeniden adlandırma).
 */
import { readFile, rename, writeFile } from "node:fs/promises";
import { DURUMLAR } from "./sema.ts";

export type GeriYazim = Partial<{ durum: (typeof DURUMLAR)[number]; video: string; kapak: string; hata_notu: string }>;
const YAZILABILIR = ["durum", "video", "kapak", "hata_notu"] as const;

/** Tek satırlık değeri YAML için güvenle yazar: düz metin yeterliyse olduğu gibi, değilse çift tırnaklı. */
function skaler(deger: string): string {
  if (/^[\p{L}\p{N}_./-][\p{L}\p{N}_./ ()-]*$/u.test(deger) && !/^(evet|hayir|true|false|null|yes|no)$/i.test(deger) && !/\s$/.test(deger)) return deger;
  return JSON.stringify(deger.replace(/\s+/g, " ").trim());
}

/** Saf işlev; satır sonu biçimini (LF/CRLF) korur. Boş değer alanı boşaltır (`anahtar:`). */
export function geriYazUygula(metin: string, degisim: GeriYazim): string {
  for (const k of Object.keys(degisim)) if (!(YAZILABILIR as readonly string[]).includes(k)) throw new Error(`Fişe yalnız ${YAZILABILIR.join(", ")} yazılır; "${k}" yazılamaz.`);
  if (degisim.durum !== undefined && !DURUMLAR.includes(degisim.durum)) throw new Error(`Geçersiz durum: ${degisim.durum}`);
  const eol = metin.includes("\r\n") ? "\r\n" : "\n";
  const satirlar = metin.split(eol);
  if (satirlar[0]?.trim() !== "---") throw new Error("Fiş '---' ile başlamıyor: frontmatter bulunamadı.");
  let son = satirlar.findIndex((l, i) => i > 0 && l.trim() === "---");
  if (son < 0) throw new Error("Fiş frontmatter'ı kapanmıyor.");
  for (const [anahtar, deger] of Object.entries(degisim) as Array<[string, string]>) {
    const yeni = deger === "" ? `${anahtar}:` : `${anahtar}: ${skaler(deger)}`;
    const yer = satirlar.findIndex((l, i) => i > 0 && i < son && new RegExp(`^${anahtar}:(\\s|$)`).test(l));
    if (yer >= 0) {
      const yorum = /(\s+#.*)$/.exec(satirlar[yer]!.slice(anahtar.length + 1));
      satirlar[yer] = yeni + (yorum && deger !== "" ? yorum[1] : "");
    } else {
      satirlar.splice(son, 0, yeni);
      son += 1;
    }
  }
  return satirlar.join(eol);
}

export async function geriYaz(yol: string, degisim: GeriYazim): Promise<void> {
  const yeni = geriYazUygula(await readFile(yol, "utf8"), degisim);
  const gecici = `${yol}.tmp`;
  await writeFile(gecici, yeni, "utf8");
  await rename(gecici, yol);
}
