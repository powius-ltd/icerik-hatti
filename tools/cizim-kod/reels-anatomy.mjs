// "Anatomy: makineyi dokunulur çizime çeviren Claude skill'i" Reels'inin SVG sahneleri: node dort-reels.mjs anatomy <koşu>/cizimler. Öğeler sınıf adıyla şablondan hareket ettirilir.
import { G } from "./gazete.mjs";
import { svg, yazi, solYazi, kutu } from "./reels-yardimci.mjs";

const cizgiler = `stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"`;
const tahta = `<rect x="100" y="95" width="220" height="130" rx="10" fill="${G.mavi}" ${cizgiler}/><path d="M130 135H270M130 175H220" stroke="${G.ak}" stroke-width="10" stroke-linecap="round"/>`;
const kup = `<g transform="translate(0 -16)"><path d="M210 335L285 372L210 410L135 372Z" fill="${G.ak}" ${cizgiler}/><path d="M135 372L210 410V495L135 457Z" fill="${G.gri}" ${cizgiler}/><path d="M285 372L210 410V495L285 457Z" fill="${G.koyu}" ${cizgiler}/></g>`;
const etiket = `<path d="M105 640L175 570H310V710H175Z" fill="${G.mavi}" ${cizgiler}/><circle cx="195" cy="640" r="15" fill="${G.gri}" stroke="${G.mur}" stroke-width="6"/>`;

export default {
  kullanan: svg(`<g class="ders">${kutu(60, 50, 840, 200, G.ak)}${tahta}${yazi(620, 170, 54, G.mur, "DERS ANLATAN")}</g>
<g class="urun">${kutu(60, 290, 840, 200, G.mavi)}${kup}${yazi(620, 410, 54, G.ak, "ÜRÜN TANITAN")}</g>
<g class="satis">${kutu(60, 530, 840, 200, G.gri)}${etiket}${yazi(620, 650, 54, G.mur, "TEKNİK SATIŞ")}</g>`),
  kurulum: svg(`<g class="pencere">${kutu(30, 70, 900, 600, G.mur)}<circle cx="90" cy="130" r="17" fill="${G.mavi}"/><circle cx="145" cy="130" r="17" fill="${G.ak}"/><circle cx="200" cy="130" r="17" fill="${G.gri}"/></g>
<g class="s1">${solYazi(60, 290, 34, G.ak, "npx skills add wheresryan22/anatomy -g")}</g>
<g class="s2">${solYazi(60, 420, 40, G.ak, "/anatomy espresso makinesi")}</g>
<g class="s3">${yazi(480, 560, 38, G.gri, "Node 22.20 ve üstü gerekir", 700)}</g>`),
};
