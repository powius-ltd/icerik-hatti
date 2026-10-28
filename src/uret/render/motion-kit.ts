// Kaynak: kreatif-studyo/src/hf-engine/scenes/motion-kit.ts (b6aff3d)
/**
 * Hareket yardımcıları: her biri duraklatılmış ana zaman çizelgesine (`tl`) eklenecek GSAP satırı üretir.
 * Zaman (`at`) mutlak VİDEO saniyesidir; çağıran kelime zamanından hesaplar, burada saniye varsayımı yok.
 * Süre ve sıçrama gibi hareket ölçüleri yardımcıların varsayılanıdır, çağıran ezebilir. Fikir kaynağı: reel-kurgu `yardim.py` (salt okunur, kod kopyası yok).
 */
import { fmt } from "./layer.ts";

/** JS dize değeri; `<` kaçırılır ki sayfadaki `<script>` bloğu metinle bozulamasın. */
export function jsStr(s: string): string {
  return JSON.stringify(s).replace(/</g, "\\u003c");
}

const sel = (selector: string) => jsStr(selector);

export interface MoveOpts {
  /** Hareketin süresi (sn). */
  dur?: number;
  ease?: string;
}

/** Saydamlıkla belirme; `to: 0` verilirse kaybolma (başlangıç varsayılanı karşı uç: 1). */
export function fade(selector: string, at: number, opts: MoveOpts & { from?: number; to?: number } = {}): string {
  const { dur = 0.3, ease = "power2.out", to = 1 } = opts;
  const from = opts.from ?? (to > 0.5 ? 0 : 1);
  return `tl.fromTo(${sel(selector)},{opacity:${fmt(from)}},{opacity:${fmt(to)},duration:${fmt(dur)},ease:${jsStr(ease)}},${fmt(at)});`;
}

/** Kayarak girme: `dx`/`dy` px uzaktan gelir, aynı anda belirir. */
export function slide(selector: string, at: number, opts: MoveOpts & { dx?: number; dy?: number } = {}): string {
  const { dur = 0.45, ease = "power3.out", dx = 0, dy = 40 } = opts;
  return `tl.fromTo(${sel(selector)},{x:${fmt(dx)},y:${fmt(dy)},opacity:0},{x:0,y:0,opacity:1,duration:${fmt(dur)},ease:${jsStr(ease)}},${fmt(at)});`;
}

/** Hafif aşıp yerine oturan büyüme (balon, kart, etiket). */
export function pop(selector: string, at: number, opts: MoveOpts & { from?: number } = {}): string {
  const { dur = 0.4, ease = "back.out(1.7)", from = 0.6 } = opts;
  return `tl.fromTo(${sel(selector)},{scale:${fmt(from)},opacity:0},{scale:1,opacity:1,duration:${fmt(dur)},ease:${jsStr(ease)}},${fmt(at)});`;
}

/** Yaylanarak oturma: verilen özellikler (`y`, `scale`…) esneyerek hedefe varır. */
export function spring(selector: string, at: number, props: Record<string, number>, opts: MoveOpts = {}): string {
  const { dur = 0.8, ease = "elastic.out(1,0.55)" } = opts;
  const to = Object.entries(props).map(([k, v]) => `${k}:${fmt(v)}`).join(",");
  return `tl.to(${sel(selector)},{${to},duration:${fmt(dur)},ease:${jsStr(ease)}},${fmt(at)});`;
}

/** Düğmeye basma: küçülüp geri döner (toplam `dur`). */
export function press(selector: string, at: number, opts: MoveOpts & { depth?: number } = {}): string {
  const { dur = 0.22, depth = 0.92 } = opts;
  const half = fmt(dur / 2);
  return `tl.to(${sel(selector)},{scale:${fmt(depth)},duration:${half},ease:"power2.in"},${fmt(at)});tl.to(${sel(selector)},{scale:1,duration:${half},ease:"power2.out"},${fmt(at + dur / 2)});`;
}

/** Çizgi çizme: kutu soldan sağa açılır (`origin: "left"`) ya da yukarıdan aşağı (`"top"`). SVG yolu için `drawPath`. */
export function draw(selector: string, at: number, opts: MoveOpts & { axis?: "x" | "y" } = {}): string {
  const { dur = 0.5, ease = "power2.out", axis = "x" } = opts;
  const prop = axis === "x" ? "scaleX" : "scaleY";
  const origin = axis === "x" ? "left center" : "center top";
  return `tl.fromTo(${sel(selector)},{${prop}:0,transformOrigin:${jsStr(origin)}},{${prop}:1,duration:${fmt(dur)},ease:${jsStr(ease)}},${fmt(at)});`;
}

/** SVG yolu çizme (`stroke-dashoffset`); yolun `pathLength="1"` olması beklenir. */
export function drawPath(selector: string, at: number, opts: MoveOpts = {}): string {
  const { dur = 0.6, ease = "power2.inOut" } = opts;
  return `tl.fromTo(${sel(selector)},{strokeDasharray:1,strokeDashoffset:1},{strokeDashoffset:0,duration:${fmt(dur)},ease:${jsStr(ease)}},${fmt(at)});`;
}

/**
 * Harf harf yazı: öğenin `textContent`'i `at`'ten itibaren saniyede `cps` harf hızıyla dolar.
 * Metin ilk kare için HTML'de boş olmalı (`hidden` ya da boş düğüm); imleç gerekiyorsa çağıran ayrı öğeyle çizer.
 */
export function typer(selector: string, text: string, at: number, cps = 14): string {
  if (!(cps > 0)) throw new Error(`typer: cps pozitif olmalı (${cps}).`);
  const chars = [...text];
  const dur = chars.length / cps;
  return `{const o={n:0},el=document.querySelector(${sel(selector)}),s=${jsStr(chars.join(""))},a=Array.from(s);tl.to(o,{n:${chars.length},duration:${fmt(dur)},ease:"none",onUpdate:function(){el.textContent=a.slice(0,Math.round(o.n)).join("");}},${fmt(at)});}`;
}

/** `typer`in süresi (sn): yazı bitince sonraki hareketi zincirlemek için. */
export function typerDuration(text: string, cps = 14): number {
  return [...text].length / cps;
}

export interface CountOpts {
  /** Ondalık basamak (varsayılan 0). */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Binlik ayracı (varsayılan boş; Türkçe için "."). */
  thousands?: string;
  /** Ondalık ayracı (varsayılan ","). */
  decimalMark?: string;
  ease?: string;
  /** Kronometre biçimi "d:ss" (değer saniyedir); ondalık/ayraç/ek yok sayılır. */
  clock?: boolean;
}

/** Sayaç: `from` → `to`, `dur` sn sürer ve SON DEĞERDE durur (sonraki kareler değişmez). */
export function count(selector: string, from: number, to: number, at: number, dur: number, opts: CountOpts = {}): string {
  const { decimals = 0, prefix = "", suffix = "", thousands = "", decimalMark = ",", ease = "power2.out", clock = false } = opts;
  const fmtFn = clock ? `function(v){const t=Math.floor(v);return Math.floor(t/60)+":"+String(t%60).padStart(2,"0");}` : `function(v){let s=v.toFixed(${decimals});let [i,d]=s.split(".");` +
    (thousands ? `i=i.replace(/\\B(?=(\\d{3})+(?!\\d))/g,${jsStr(thousands)});` : "") +
    `return ${jsStr(prefix)}+i+(d?${jsStr(decimalMark)}+d:"")+${jsStr(suffix)};}`;
  return `{const o={v:${fmt(from)}},el=document.querySelector(${sel(selector)}),f=${fmtFn};el.textContent=f(o.v);` +
    `tl.to(o,{v:${fmt(to)},duration:${fmt(dur)},ease:${jsStr(ease)},onUpdate:function(){el.textContent=f(o.v);}},${fmt(at)});}`;
}

/** Nabız: öğenin saydamlığı `period` sn aralıkla gidip gelir, `total` sn sürer (bekleyen "…" noktaları). Sonlu tekrar: aranabilir. */
export function pulse(selector: string, at: number, total: number, opts: { period?: number; low?: number } = {}): string {
  const { period = 0.45, low = 0.25 } = opts;
  const repeat = Math.max(1, Math.round(total / period)) - 1;
  return `tl.fromTo(${sel(selector)},{opacity:${fmt(low)}},{opacity:1,duration:${fmt(period)},ease:"sine.inOut",repeat:${repeat},yoyo:true},${fmt(at)});`;
}
