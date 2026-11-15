// "Sonu güzel bitir / zirve-son kuralı" Reels'inin SVG sahneleri: node dort-reels.mjs sonu-guzel <koşu>/cizimler.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu } from "./reels-yardimci.mjs";

const taban = `<path d="M40 640H920" stroke="${G.mur}" stroke-width="12" stroke-linecap="round"/>`;
const cubuk = (sinif, x, g, h, c, ust, alt, ty = G.mur) => `<g class="${sinif}"><rect x="${x}" y="${640 - h}" width="${g}" height="${h}" fill="${c}" stroke="${G.mur}" stroke-width="8"/>${ust ? yazi(x + g / 2, 640 - h - 24, 62, ty, ust) : ""}${yazi(x + g / 2, 710, 40, G.mur, alt)}</g>`;
// zaman şeridi: x, y, genişlik, renk, yazı rengi, etiket
const serit = (x, y, g, c, ty, etiket) => `<rect x="${x}" y="${y}" width="${g}" height="120" fill="${c}" stroke="${G.mur}" stroke-width="8"/>${yazi(x + g / 2, y + 78, 40, ty, etiket)}`;

export default {
  // sahne 1: kısa ve uzun deneme (süre)
  deneme: svg(`${taban}${cubuk("b1", 150, 270, 300, G.ak, "60 SN", "KISA DENEME")}${cubuk("b2", 540, 270, 450, G.mavi, "90 SN", "UZUN DENEME", G.koyu)}`),
  // sahne 3: uzun denemenin sonundaki ılık 30 saniye
  son: svg(`<g class="b1">${yazi(300, 215, 40, G.mur, "KISA DENEME")}${serit(60, 230, 480, G.ak, G.mur, "60 SN · 14 °C")}</g><g class="b2">${yazi(420, 455, 40, G.mur, "UZUN DENEME")}${serit(60, 470, 480, G.mavi, G.ak, "60 SN · 14 °C")}${serit(540, 470, 240, G.ten, G.mur, "+30 SN")}${yazi(660, 640, 44, G.koyu, "15 °C")}</g>${yazi(480, 730, 40, G.mur, "SON 30 SN BİRAZ DAHA ILIK")}`),
  // sahne 4: tekrar için seçilen deneme
  tercih: svg(`${taban}${cubuk("b1", 150, 270, 200, G.ak, "", "KISA OLANI")}${cubuk("b2", 540, 270, 430, G.mavi, "%69", "UZUN OLANI", G.koyu)}`),
};
