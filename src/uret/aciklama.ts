// Kaynak: kreatif-studyo/src/orders/caption.ts (b6aff3d) — yalnız "taslak varsa aynen" dalı; model çağrısı yok, hashtag fişin taslağından
/**
 * Instagram açıklaması (`aciklama.txt`): fişin `aciklama_taslagi` alanı aynen (patronun onayladığı metin). Boşsa ya da Instagram sınırlarını
 * aşıyorsa (2200 karakter, 30 hashtag) açık hatayla durur: sessizce kırpılmaz.
 */
import { writeFile } from "node:fs/promises";

export const ACIKLAMA_MAX = 2200;
export const HASHTAG_MAX = 30;

export function aciklamaHazirla(taslak: string): string {
  const metin = taslak.trim();
  if (metin === "") throw new Error("Açıklama taslağı boş: fişte aciklama_taslagi doldurulmalı.");
  if (metin.length > ACIKLAMA_MAX) throw new Error(`Açıklama ${metin.length} karakter; Instagram sınırı ${ACIKLAMA_MAX}.`);
  const etiket = metin.match(/#[\p{L}\p{N}_]+/gu)?.length ?? 0;
  if (etiket > HASHTAG_MAX) throw new Error(`Açıklamada ${etiket} hashtag var; Instagram sınırı ${HASHTAG_MAX}.`);
  return `${metin}\n`;
}

export async function aciklamaYaz(yol: string, taslak: string): Promise<string> {
  const metin = aciklamaHazirla(taslak);
  await writeFile(yol, metin, "utf8");
  return metin;
}
