// Kaynak: kreatif-studyo/src/hf-engine/words.ts (b6aff3d); hız ve dosya biçimi atıldı, kelimeler doğrudan verilir; K26 boşluk koruması eklendi
/**
 * Kelime zamanları ve altyazı öbekleri. Öbek kuralı: plan `groupStarts` verdiyse onlar (sahne başları); yoksa en çok `maxWords` kelime,
 * satır sınırı, noktalama ya da duraklamada yeni öbek. Altyazısız boşluk `maxGapSec`'i geçmez (`groupWindow`).
 */
import type { PlanCaptions } from "./plan.ts";
import type { ReelsTheme } from "./tema.ts";

/** Sesten gelen kelime: metin, başlangıç ve bitiş (video saniyesi). */
export interface KonusKelime {
  w: string;
  s: number;
  e: number;
}

export interface Word {
  index: number;
  text: string;
  start: number;
  end: number;
  emphasis: boolean;
}

export interface CaptionGroup {
  words: Word[];
  cta: boolean;
}

const QUOTES = /^["“”]+|["“”]+$/g;

export function toWords(kelimeler: readonly KonusKelime[], captions: PlanCaptions): Word[] {
  const emphasis = new Set(captions.emphasis);
  return kelimeler.map((w, index) => ({
    index,
    text: captions.display[String(index)] ?? w.w.replace(QUOTES, ""),
    start: w.s,
    end: w.e,
    emphasis: emphasis.has(index),
  }));
}

/** Kelime sırasının başlangıç anı; sıra sınırın dışındaysa açık hata. */
export function wordStart(words: readonly Word[], index: number, what: string): number {
  const w = words[index];
  if (!w) throw new Error(`${what}: ${index}. kelime yok (sesin ${words.length} kelimesi var).`);
  return w.start;
}

const SENTENCE_END = /[.,!?:;]$/;

export function makeGroups(words: readonly Word[], captions: PlanCaptions, theme: ReelsTheme): CaptionGroup[] {
  const c = theme.captions;
  const starts = new Set(captions.groupStarts ?? []);
  const groups: CaptionGroup[] = [];
  let cur: Word[] = [];
  const flush = () => {
    if (cur.length) groups.push({ words: cur, cta: false });
    cur = [];
  };
  for (const w of words) {
    const prev = cur[cur.length - 1];
    const chars = cur.reduce((n, x) => n + x.text.length + 1, 0) + w.text.length;
    const autoSplit = prev !== undefined && (cur.length >= c.maxWords || chars > c.maxCharsPerLine || SENTENCE_END.test(prev.text) || w.start - prev.end >= c.newGroupGapSec);
    // groupStarts yalnız sahne başlarını zorlar; sahne içinde yine kelime/satır kuralıyla bölünür.
    if (starts.has(w.index) || autoSplit) flush();
    cur.push(w);
  }
  flush();
  return groups;
}

/**
 * Öbeğin ekranda kaldığı aralık: sonrakine yakınsa onun girişine dek, değilse son kelime + bekleme.
 * K26: sonraki öbeğe kalan boşluk `maxGapSec`'i geçecekse öbek sonrakinin girişine dek kalır; ilk öbek de çok geç başlamaz.
 */
export function groupWindow(groups: readonly CaptionGroup[], i: number, endSec: number, theme: ReelsTheme): { start: number; end: number } {
  const c = theme.captions;
  const g = groups[i]!;
  const next = groups[i + 1];
  const first = g.words[0]!.start;
  const last = g.words[g.words.length - 1]!.end;
  const start = i === 0 ? Math.max(0, Math.min(first - c.leadSec, first - c.maxGapSec)) : Math.max(0, first - c.leadSec);
  if (!next) return { start, end: endSec };
  const nextStart = Math.max(0, next.words[0]!.start - c.leadSec);
  let end = next.words[0]!.start - last < c.joinGapSec ? nextStart : last + c.holdSec;
  if (nextStart - end > c.maxGapSec) end = nextStart;
  return { start, end };
}

/** Altyazının görünmediği en uzun aralık (sn): baştan ilk öbeğe, öbekler arası, son öbekten sona. */
export function enBuyukBosluk(groups: readonly CaptionGroup[], endSec: number, theme: ReelsTheme): number {
  if (groups.length === 0) return endSec;
  const pencere = groups.map((_, i) => groupWindow(groups, i, endSec, theme));
  let en = pencere[0]!.start;
  for (let i = 1; i < pencere.length; i += 1) en = Math.max(en, pencere[i]!.start - pencere[i - 1]!.end);
  return Math.max(en, endSec - pencere[pencere.length - 1]!.end);
}
