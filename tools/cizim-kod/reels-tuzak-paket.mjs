// "Tuzak paket" (Ariely abonelik deneyi) Reels'inin SVG sahneleri: node dort-reels.mjs tuzak-paket <koşu>/cizimler.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu, cizgi } from "./reels-yardimci.mjs";

const kart = (sinif, x, c, ty, s1, s2, fiyat) => `<g class="${sinif}">${kutu(x, 150, 270, 430, c, 22)}${yazi(x + 135, s2 ? 250 : 280, 44, ty, s1)}${s2 ? yazi(x + 135, 310, 44, ty, s2) : ""}${yazi(x + 135, 470, 76, ty, fiyat)}</g>`;
const taban = `<path d="M40 640H920" stroke="${G.mur}" stroke-width="12" stroke-linecap="round"/>`;
const cubuk = (sinif, x, g, h, c, ust, alt, ty = G.mur) => `<g class="${sinif}"><rect x="${x}" y="${640 - h}" width="${g}" height="${Math.max(h, 8)}" fill="${c}" stroke="${G.mur}" stroke-width="8"/>${yazi(x + g / 2, 640 - h - 24, 60, ty, ust)}${yazi(x + g / 2, 710, 40, G.mur, alt)}</g>`;
const carpi = (sinif, x, y, r) => cizgi(sinif, `M${x - r} ${y - r}L${x + r} ${y + r}M${x + r} ${y - r}L${x - r} ${y + r}`, G.mur, 22);

export default {
  tuzak: svg(`${kart("p1", 30, G.ak, G.mur, "İNTERNET", "", "$59")}${kart("p2", 345, G.mavi, G.ak, "İKİSİ", "BİRDEN", "$125")}${kart("p3", 660, G.gri, G.mur, "BASILI", "", "$125")}
<g class="ok">${kutu(250, 625, 460, 120, G.mur, 22)}${yazi(480, 705, 58, G.ak, "2,5 KAT SATIŞ")}</g>`),
  sonuc: svg(`${taban}${cubuk("b1", 80, 220, 91, G.ak, "%16", "İNTERNET")}${cubuk("b2", 370, 220, 0, G.gri, "%0", "BASILI")}${cubuk("b3", 660, 220, 480, G.mavi, "%84", "İKİSİ")}`),
  cikar: svg(`<g class="kart">${kutu(40, 170, 240, 320, G.gri, 22)}${yazi(160, 310, 44, G.mur, "BASILI")}${yazi(160, 400, 56, G.mur, "$125")}</g>${carpi("carpi", 160, 330, 120)}
${taban}${cubuk("b1", 380, 220, 480, G.ak, "%68", "İNTERNET")}${cubuk("b2", 680, 220, 226, G.mavi, "%32", "İKİSİ")}`),
};
