// "Damga kartı / endowed progress" Reels'inin SVG sahneleri: node dort-reels.mjs damga-karti <koşu>/cizimler.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu } from "./reels-yardimci.mjs";

const taban = `<path d="M40 640H920" stroke="${G.mur}" stroke-width="12" stroke-linecap="round"/>`;
const delik = (cx, cy, r, dolu) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${dolu ? G.mavi : G.ak}" stroke="${G.mur}" stroke-width="7"/>`;
// kart: x, genişlik, sütun sayısı, toplam damga, hazır damga sayısı
const kart = (sinif, x, g, sut, toplam, hazir, etiket, renk) => {
  const adim = (g - 80) / (sut - 1);
  const r = Math.min(30, adim / 2 - 8);
  let ic = "";
  for (let i = 0; i < toplam; i++) ic += delik(x + 40 + (i % sut) * adim, 340 + Math.floor(i / sut) * 100, r, i < hazir);
  return `<g class="${sinif}">${kutu(x, 220, g, 270, G.ak, 30)}${ic}${yazi(x + g / 2, 590, 54, renk, etiket)}</g>`;
};
const cubuk = (sinif, x, g, h, c, ust, alt, ty = G.mur) => `<g class="${sinif}"><rect x="${x}" y="${640 - h}" width="${g}" height="${h}" fill="${c}" stroke="${G.mur}" stroke-width="8"/>${yazi(x + g / 2, 640 - h - 24, 62, ty, ust)}${yazi(x + g / 2, 710, 40, G.mur, alt)}</g>`;

export default {
  hediye: svg(`<g class="k">${kutu(130, 200, 700, 300, G.ak, 36)}${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => delik(220 + (i % 5) * 130, 290 + Math.floor(i / 5) * 120, 40, i < 2)).join("")}</g><g class="h">${yazi(480, 620, 64, G.mavi, "İLK 2 HAZIR")}</g>`),
  damga: svg(`${kart("b1", 50, 380, 4, 8, 0, "BOŞ: 8", G.mur)}${kart("b2", 530, 380, 5, 10, 2, "2 HAZIR: 10", G.mavi)}`),
  oran: svg(`${taban}${cubuk("b1", 150, 270, 220, G.ak, "%19", "BOŞ KART")}${cubuk("b2", 540, 270, 390, G.mavi, "%34", "2 HAZIR")}`),
};
