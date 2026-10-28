/**
 * Marka işareti: köşede küçük yazı markası (tema `marka`). Logo dosyası gelince yerini alır; şimdilik tema fontuyla yazı.
 * Her karede görünür (sahne kabı değil), altyazı ve sahne içeriğinin üstünde, kenar boşluğunda. Değerler yalnız `var(--…)` belirteçlerinden.
 */
import type { Layer } from "./layer.ts";
import { esc } from "./shell.ts";
import type { ReelsTheme } from "./tema.ts";

export const MARKA_CSS = `
.marka{position:absolute;left:var(--safe-left);top:150px;display:flex;align-items:center;gap:14px;font-size:32px;font-weight:800;letter-spacing:7px;color:var(--fg-on-dark);opacity:.92}
.marka i{width:16px;height:16px;border-radius:5px;background:var(--accent);display:block;transform:rotate(45deg)}
`;

export function markaKatmani(theme: ReelsTheme): Layer {
  if (!theme.marka) return { html: [], js: [] };
  return { html: [`<div class="marka" data-layout-allow-overlap data-layout-allow-occlusion data-layout-allow-overflow><i></i>${esc(theme.marka)}</div>`], js: [] };
}
