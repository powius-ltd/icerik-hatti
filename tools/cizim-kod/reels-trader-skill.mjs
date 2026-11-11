// "Day Trader Skill" araç Reels'inin SVG sahneleri: node dort-reels.mjs trader-skill <koşu>/cizimler.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu } from "./reels-yardimci.mjs";

const mum = (x, y1, y2, ust, alt, c) => `<path d="M${x} ${y1}V${y2}" stroke="${G.mur}" stroke-width="6"/><rect x="${x - 18}" y="${ust}" width="36" height="${alt - ust}" fill="${c}" stroke="${G.mur}" stroke-width="5"/>`;
const grafik = [[120, 330, 470, 360, 430, G.mavi], [190, 300, 440, 320, 400, G.gri], [260, 260, 420, 280, 360, G.mavi], [330, 300, 460, 330, 420, G.gri], [400, 220, 380, 240, 330, G.mavi], [470, 180, 340, 200, 290, G.mavi]].map((a) => mum(...a)).join("");
const cizgiDemet = Array.from({ length: 9 }, (_, i) => `<path d="M520 300C600 ${240 + i * 15} 700 ${150 + i * 40} 880 ${110 + i * 55}" fill="none" stroke="${i % 2 ? G.koyu : G.mavi}" stroke-width="5" opacity=".75"/>`).join("");
const adim = (sinif, x, c, ty, s1, s2) => `<g class="${sinif}">${kutu(x, 250, 210, 280, c, 22)}${yazi(x + 105, 375, 40, ty, s1)}${yazi(x + 105, 430, 40, ty, s2)}</g>`;
const taban = `<path d="M40 640H920" stroke="${G.mur}" stroke-width="12" stroke-linecap="round"/>`;
const cubuk = (sinif, x, h, c, ust, alt, ty = G.mur) => `<g class="${sinif}"><rect x="${x}" y="${640 - h}" width="240" height="${h}" fill="${c}" stroke="${G.mur}" stroke-width="8"/>${yazi(x + 120, 640 - h - 24, 62, ty, ust)}${yazi(x + 120, 710, 42, G.mur, alt)}</g>`;

export default {
  masa: svg(`<g class="ekran">${kutu(60, 80, 840, 520, G.ak, 26)}${grafik}</g><g class="demet">${cizgiDemet}</g>
<g class="sayi">${kutu(250, 620, 460, 120, G.mur, 22)}${yazi(480, 700, 60, G.ak, "10.000 KEZ")}</g>`),
  akis: svg(`${adim("a1", 20, G.ak, G.mur, "GRAFİK", "TARAR")}${adim("a2", 255, G.gri, G.mur, "HABER", "İZLER")}${adim("a3", 490, G.mavi, G.ak, "GİRİŞ", "ANI")}${adim("a4", 725, G.mur, G.ak, "STOP", "NOKTASI")}`),
  zaman: svg(`${yazi(480, 90, 46, G.mur, "ÖRNEK: GÜNÜN KALANI")}${taban}${cubuk("b1", 70, 290, G.mavi, "%29", "HEDEF")}${cubuk("b2", 360, 250, G.gri, "%26", "STOP")}${cubuk("b3", 650, 450, G.ak, "%45", "AÇIK KALDI")}`),
};
