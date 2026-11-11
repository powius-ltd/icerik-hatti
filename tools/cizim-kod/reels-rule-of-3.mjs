// "Rule of 3 / çapalama" Reels'inin SVG sahneleri: node dort-reels.mjs rule-of-3 <koşu>/cizimler.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu } from "./reels-yardimci.mjs";

const makine = (x, w, c, fiyat, ty = G.mur) => `${kutu(x, 300, w, 260, c, 30)}<rect x="${x + 30}" y="330" width="${w - 60}" height="110" rx="14" fill="${G.ak}" stroke="${G.mur}" stroke-width="6"/>${yazi(x + w / 2, 520, 60, ty, fiyat)}`;
const taban = `<path d="M40 640H920" stroke="${G.mur}" stroke-width="12" stroke-linecap="round"/>`;
const cubuk = (sinif, x, g, h, c, ust, alt, ty = G.mur) => `<g class="${sinif}"><rect x="${x}" y="${640 - h}" width="${g}" height="${h}" fill="${c}" stroke="${G.mur}" stroke-width="8"/>${yazi(x + g / 2, 640 - h - 24, 62, ty, ust)}${yazi(x + g / 2, 710, 42, G.mur, alt)}</g>`;

export default {
  ekmek: svg(`<g class="m1">${makine(80, 330, G.ak, "$275")}</g><g class="m2">${makine(540, 340, G.mavi, "$429", G.ak)}</g>
<path d="M40 600H920" stroke="${G.mur}" stroke-width="12" stroke-linecap="round"/>
<g class="ok">${kutu(90, 110, 310, 130, G.mur, 22)}${yazi(245, 197, 64, G.ak, "×2")}</g>`),
  iki: svg(`${taban}${cubuk("b1", 150, 270, 400, G.ak, "%50", "UCUZ")}${cubuk("b2", 540, 270, 400, G.mavi, "%50", "ORTA")}`),
  uc: svg(`${taban}${cubuk("b1", 60, 240, 185, G.ak, "%22", "UCUZ")}${cubuk("b2", 360, 240, 480, G.mavi, "%57", "ORTA")}${cubuk("b3", 660, 240, 177, G.gri, "%21", "PAHALI")}`),
};
