// Kaynak: kreatif-studyo/src/hf-engine/captions.ts (b6aff3d)
/**
 * Altyazı katmanı (kanca/hook bu hatta yok: ekran yazısı sahne kalıbında). Altyazı kelime zamanına bağlı öbeklerdir (alta sabit bant, vurgu yalnız renk, kapanışta CTA kartı);
 * Her öğe HyperFrames klibidir (`data-start`/`data-duration`/`data-track-index`).
 */
import { fmt, type Layer } from "./layer.ts";
import { token, type ReelsTheme } from "./tema.ts";
import { type CaptionGroup, groupWindow } from "./kelimeler.ts";

/** Altyazı öbekleri bu kadar kanala dağıtılır (HyperFrames tek kanalda çok öğeyi okunmaz bulur). */
const CAPTION_TRACKS = 8;
const CAPTION_TRACK_BASE = 8;

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Öbeğin yazı boyu: satıra sığana dek küçülür (kitte DOM ölçümüyle; burada karakter sayısıyla, belirlenimli). */
function fontSize(group: CaptionGroup, theme: ReelsTheme): number {
  const c = theme.captions;
  const chars = group.words.reduce((n, w) => n + w.text.length + 1, 0);
  const base = group.cta ? c.ctaFontPx : c.fontPx;
  const perLine = group.cta ? c.maxCharsPerLine * 2.4 : c.maxCharsPerLine;
  return chars <= perLine ? base : Math.max(c.minFontPx, Math.round(base * Math.sqrt(perLine / chars)));
}

/** `acikZemin`: öbeğin başladığı an açık zeminli sahnedeyse koyu altyazı (`.cap-g.acik`, kuralı `cizim.ts`te). */
export function captionLayer(groups: readonly CaptionGroup[], endSec: number, theme: ReelsTheme, acikZemin: (sn: number) => boolean = () => false): Layer {
  const c = theme.captions;
  const html: string[] = [];
  const js: string[] = [];
  groups.forEach((g, i) => {
    const { start, end } = groupWindow(groups, i, endSec, theme);
    const dur = Math.max(end - start, 0.06);
    const id = `cg${i}`;
    const acik = !g.cta && acikZemin(g.words[0]!.start);
    const fg = token(theme, acik ? "cizim-murekkep" : "fg-on-dark");
    const accent = token(theme, acik ? "cizim-vurgu" : "accent");
    const spans = g.words.map((w) => `<span class="w" id="cw${w.index}">${escapeHtml(w.text)}</span>`).join("");
    html.push(
      `<div class="clip cap-g${g.cta ? " cta" : ""}${acik ? " acik" : ""}" id="${id}" style="top:${c.centerPx}px;font-size:${fontSize(g, theme)}px" data-start="${fmt(start)}" data-duration="${fmt(dur)}" data-track-index="${CAPTION_TRACK_BASE + (i % CAPTION_TRACKS)}">${spans}</div>`,
    );
    const rise = g.cta ? 30 : 10;
    const inSec = g.cta ? c.ctaInSec : c.inSec;
    js.push(`tl.set("#${id}",{yPercent:-50},0);`, `tl.fromTo("#${id}",{opacity:0,y:${rise}},{opacity:1,y:0,duration:${inSec},ease:"power3.out"},${fmt(start)});`, `tl.set("#${id}",{opacity:0},${fmt(start + dur)});`);
    for (const w of g.words) {
      js.push(`tl.fromTo("#cw${w.index}",{opacity:${c.dimOpacity}},{opacity:1,duration:${c.wordInSec},ease:"none"},${fmt(w.start)});`);
      if (w.emphasis) js.push(`tl.fromTo("#cw${w.index}",{color:"${fg}"},{color:"${accent}",duration:${c.wordInSec},ease:"none"},${fmt(w.start)});`);
    }
  });
  return { html, js };
}
