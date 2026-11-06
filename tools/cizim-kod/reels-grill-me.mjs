// "Grill Me: kod yazmadan önce seni sorguya çeken skill" Reels'inin SVG sahneleri: node dort-reels.mjs grill-me <koşu>/cizimler. Öğeler sınıf adıyla şablondan hareket ettirilir.
import { G } from "./gazete.mjs";
import { svg, yazi, solYazi, kutu } from "./reels-yardimci.mjs";

const cizgi8 = `stroke="${G.mur}" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"`;
const soru = `${kutu(40, 190, 270, 400, G.mavi)}<text x="175" y="430" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="230" fill="${G.ak}">?</text>${yazi(175, 520, 46, G.ak, "SORU")}`;
const kilit = `${kutu(345, 190, 270, 400, G.mur)}<path d="M425 340V300A55 55 0 0 1 535 300V340" fill="none" stroke="${G.ak}" stroke-width="22" stroke-linecap="round"/><rect x="405" y="335" width="150" height="120" rx="18" fill="${G.ak}"/><circle cx="480" cy="385" r="16" fill="${G.mur}"/><rect x="472" y="390" width="16" height="40" rx="6" fill="${G.mur}"/>${yazi(480, 520, 40, G.ak, "KOD YOK")}`;
const tik = `${kutu(650, 190, 270, 400, G.ak)}<circle cx="785" cy="350" r="95" fill="${G.mavi}" ${cizgi8}/><path d="M740 352L775 390L835 315" fill="none" stroke="${G.ak}" stroke-width="24" stroke-linecap="round" stroke-linejoin="round"/>${yazi(785, 520, 46, G.mur, "ANLAŞTIK")}`;

export default {
  anlasma: svg(`<g class="soru">${soru}</g><g class="kilit">${kilit}</g><g class="tik">${tik}</g>`),
  kurulum: svg(`<g class="pencere">${kutu(30, 70, 900, 600, G.mur)}<circle cx="90" cy="130" r="17" fill="${G.mavi}"/><circle cx="145" cy="130" r="17" fill="${G.ak}"/><circle cx="200" cy="130" r="17" fill="${G.gri}"/></g>
<g class="s1">${solYazi(60, 240, 48, G.ak, "npx skills add")}${solYazi(60, 310, 38, G.ak, "https://github.com/mattpocock/skills")}${solYazi(60, 380, 48, G.ak, "--skill grill-me")}</g>
<g class="s2">${solYazi(60, 520, 56, G.ak, "/grill-me")}</g>`),
};
