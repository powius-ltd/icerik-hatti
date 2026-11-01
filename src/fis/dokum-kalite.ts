/** Whisper çıktısındaki bozuk (halüsinasyon) satırları yakalar: modele "güvenilmez" diye işaretlenir, anlam kaynağı olmaz. */
const LATIN = /\p{Script=Latin}/u;
const BASKA_ALFABE = /[\p{Script=Arabic}\p{Script=Devanagari}\p{Script=Cyrillic}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Hebrew}\p{Script=Thai}]/u;
const CJK = /[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u;

export function dokumSupheli(metin: string, dil: string): boolean {
  const kelimeler = metin.split(/\s+/).filter(Boolean);
  if (kelimeler.length === 0) return false;
  if (CJK.test(metin) && !["zh", "ja", "ko"].includes(dil)) return true;
  // Tek sözcükte iki alfabe karışmış ("अलेज़े再", "नाker")
  if (kelimeler.some((k) => LATIN.test(k) && BASKA_ALFABE.test(k))) return true;
  // Whisper'ın "word-" halüsinasyonu
  if (kelimeler.some((k) => /^\p{Script=Latin}+-$/u.test(k))) return true;
  // Aynı sözcüğün art arda 4+ tekrarı
  let seri = 1;
  for (let i = 1; i < kelimeler.length; i++) {
    seri = kelimeler[i] === kelimeler[i - 1] ? seri + 1 : 1;
    if (seri >= 4) return true;
  }
  return false;
}
