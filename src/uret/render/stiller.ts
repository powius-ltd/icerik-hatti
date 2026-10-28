// Kaynak: kreatif-studyo/src/hf-engine/styles.ts (b6aff3d)
/**
 * Sayfanın sabit stili. Renk, boşluk ve yazı yalnız `tema.ts` belirteçlerinden (`var(--…)`); burada değer yok, yalnız yerleşim.
 */
import type { ReelsTheme } from "./tema.ts";
import { themeCss } from "./tema.ts";

const BASE = (w: number, h: number) => `
*{box-sizing:border-box;margin:0}
html,body{width:${w}px;height:${h}px;overflow:hidden;background:var(--bg-dark);font-family:var(--font-display);color:var(--fg-on-dark)}
#root{position:relative;width:${w}px;height:${h}px;overflow:hidden}
.zemin{position:absolute;inset:0;background:var(--bg-dark)}
`;

/** Altyazı kuralları; ölçüler `theme.captions`'tan satır içi yazılır, burada yalnız ortak kurallar. */
const OVERLAY = (t: ReelsTheme) => `
.cap-g{position:absolute;left:var(--safe-left);width:var(--safe-w);display:flex;flex-wrap:wrap;justify-content:center;gap:0 22px;line-height:1.12}
.cap-g .w{display:inline-block;font-weight:800;letter-spacing:-.5px;color:var(--fg-on-dark);-webkit-text-stroke:${t.captions.strokePx}px var(--cap-stroke);paint-order:stroke fill;text-shadow:0 6px 22px var(--cap-shadow)}
.cap-g.cta{left:70px;width:calc(var(--safe-w) + 20px);padding:34px 40px;border-radius:var(--radius-window);background:var(--scrim);border-left:8px solid var(--accent);justify-content:flex-start;gap:0 18px}
.cap-g.cta .w{-webkit-text-stroke:0;text-shadow:none}
`;

/** `templateCss`: sayfada kullanılan şablonların CSS'i (şablon başına bir kez, plan sırasıyla); kuralları şablon dosyasında yaşar. */
export function pageCss(theme: ReelsTheme, templateCss: readonly string[], frame: { w: number; h: number } = { w: 1080, h: 1920 }): string {
  return [themeCss(theme), BASE(frame.w, frame.h), ...templateCss, OVERLAY(theme)].join("\n");
}
