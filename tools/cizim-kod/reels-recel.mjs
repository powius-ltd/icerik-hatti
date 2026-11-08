// "Reçel deneyi" (Iyengar ve Lepper 2000) Reels'inin SVG sahneleri: node dort-reels.mjs recel <koşu>/cizimler.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu } from "./reels-yardimci.mjs";

const kavanoz = (x, y, g, h, c) => `<rect x="${x + g * 0.12}" y="${y}" width="${g * 0.76}" height="${h * 0.18}" rx="4" fill="${G.mur}"/><rect x="${x}" y="${y + h * 0.16}" width="${g}" height="${h * 0.84}" rx="${g * 0.18}" fill="${c}" stroke="${G.mur}" stroke-width="5"/>`;
const renk = (i) => [G.mavi, G.koyu, G.ak, G.gri][i % 4];
const raf = (x, g) => `<rect x="${x}" y="455" width="${g}" height="24" fill="${G.gri}" stroke="${G.mur}" stroke-width="8"/>`;
const cok = Array.from({ length: 24 }, (_, i) => kavanoz(55 + (i % 6) * 66, 140 + Math.floor(i / 6) * 78, 50, 64, renk(i))).join("");
const az = Array.from({ length: 6 }, (_, i) => kavanoz(550 + (i % 3) * 125, 190 + Math.floor(i / 3) * 132, 92, 118, renk(i))).join("");
const taban = `<path d="M40 640H920" stroke="${G.mur}" stroke-width="12" stroke-linecap="round"/>`;
const cubuk = (sinif, x, g, h, c, ust, alt, ty = G.mur) => `<g class="${sinif}"><rect x="${x}" y="${640 - h}" width="${g}" height="${Math.max(h, 8)}" fill="${c}" stroke="${G.mur}" stroke-width="8"/>${yazi(x + g / 2, 640 - h - 24, 64, ty, ust)}${yazi(x + g / 2, 710, 42, G.mur, alt)}</g>`;

export default {
  tezgah: svg(`<g class="t1">${cok}${raf(40, 420)}${yazi(250, 545, 48, G.mur, "24 ÇEŞİT")}</g>
<g class="t2">${az}${raf(520, 400)}${yazi(720, 545, 48, G.mur, "6 ÇEŞİT")}</g>
<g class="ok">${kutu(60, 610, 380, 120, G.mur, 22)}${yazi(250, 690, 56, G.ak, "AZ SATTI")}</g>`),
  durdu: svg(`${yazi(480, 90, 52, G.mur, "TEZGÂHTA DURAN")}${taban}${cubuk("b1", 150, 270, 450, G.mavi, "%60", "24 ÇEŞİT")}${cubuk("b2", 540, 270, 300, G.gri, "%40", "6 ÇEŞİT")}`),
  aldi: svg(`${yazi(480, 90, 52, G.mur, "DURUP SATIN ALAN")}${taban}${cubuk("b1", 150, 270, 48, G.gri, "%3", "24 ÇEŞİT")}${cubuk("b2", 540, 270, 450, G.mavi, "%30", "6 ÇEŞİT")}
<g class="fark">${kutu(130, 230, 310, 140, G.ak, 22)}${yazi(285, 325, 72, G.mavi, "10 KAT")}</g>`),
};
