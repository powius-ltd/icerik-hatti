// Kaynak: kreatif-studyo/src/production/voice/providers/char-words.ts (b6aff3d); sahibi V satırı atıldı
/** Karakter zaman damgası → kelime zamanı (ElevenLabs `alignment`). Saf. Kelime sınırı yalnız boşluktur; noktalama kelimenin üstünde kalır. Sahibi: V. */
import type { KelimeDamgasi as SpokenStamp } from "./saglayici.ts";

export interface CharAlignment {
  characters: string[];
  character_start_times_seconds: number[];
  character_end_times_seconds: number[];
}

/**
 * Kelime: ardışık boşluksuz karakterler; `start` ilk karakterin başı, `end` son karakterin sonu.
 * Dizilerin boyu tutmuyorsa ya da bir karakterin zamanı yoksa fırlatır (eksik zaman uydurulmaz).
 */
export function wordsFromCharacters(alignment: CharAlignment): SpokenStamp[] {
  const { characters, character_start_times_seconds: starts, character_end_times_seconds: ends } = alignment;
  if (characters.length === 0) throw new Error("Karakter damgası boş.");
  if (starts.length !== characters.length || ends.length !== characters.length) {
    throw new Error(`Karakter damgası tutarsız: ${characters.length} karakter, ${starts.length} başlangıç, ${ends.length} bitiş.`);
  }
  const words: SpokenStamp[] = [];
  let current: SpokenStamp | undefined;
  characters.forEach((char, index) => {
    if (char.trim() === "") {
      current = undefined;
      return;
    }
    const start = starts[index]!;
    const end = ends[index]!;
    if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) throw new Error(`Karakter damgasında zaman eksik ya da bozuk: ${index + 1}. karakter "${char}" (başlangıç ${start}, bitiş ${end}).`);
    if (current === undefined) {
      current = { text: char, start, end };
      words.push(current);
    } else {
      current.text += char;
      current.end = end;
    }
  });
  return words;
}
