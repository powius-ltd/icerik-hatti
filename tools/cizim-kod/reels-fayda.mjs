// "Özelliği değil faydayı sat" Reels'inin SVG sahneleri: node dort-reels.mjs fayda <koşu>/cizimler. Öğeler sınıf adıyla şablondan hareket ettirilir.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu, cizgi } from "./reels-yardimci.mjs";

const matkap = (x, y, o = 1) => `<g transform="translate(${x} ${y}) scale(${o})"><path d="M-130 -60H70Q110 -60 110 -20V20Q110 60 70 60H40L20 190H-50L-40 60H-130Z" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/><rect x="110" y="-30" width="50" height="60" fill="${G.gri}" stroke="${G.mur}" stroke-width="8"/><path d="M160 0H290" stroke="${G.mur}" stroke-width="14" stroke-linecap="round"/></g>`;
const carpi = (sinif, x, y, r) => cizgi(sinif, `M${x - r} ${y - r}L${x + r} ${y + r}M${x + r} ${y - r}L${x - r} ${y + r}`, G.mur, 22);

export default {
  matkap: svg(`<g class="dukkan"><path d="M120 150H840L800 270H160Z" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/><rect x="170" y="270" width="620" height="170" fill="${G.ak}" stroke="${G.mur}" stroke-width="8"/>${yazi(480, 370, 70, G.mur, "MATKAP")}</g>
<g class="matkap">${matkap(340, 560, 1)}</g>${carpi("carpi", 420, 625, 110)}`),
  delik: svg(`<g class="duvar"><rect x="60" y="60" width="840" height="700" fill="${G.gri}" stroke="${G.mur}" stroke-width="8"/></g>
<g class="tablo"><rect x="130" y="130" width="280" height="200" fill="${G.ak}" stroke="${G.mur}" stroke-width="10"/><path d="M150 310L250 210L320 280L370 230L390 310Z" fill="${G.mavi}"/></g>
<g class="delik"><circle cx="640" cy="200" r="60" fill="${G.mur}"/>${yazi(640, 340, 44, G.mur, "DELİK")}</g>
<g class="raf"><rect x="470" y="520" width="380" height="26" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8"/><rect x="520" y="440" width="70" height="80" fill="${G.ak}" stroke="${G.mur}" stroke-width="8"/><rect x="700" y="400" width="90" height="120" fill="${G.ak}" stroke="${G.mur}" stroke-width="8"/></g>`),
  ipod: svg(`<g class="teknik">${kutu(50, 150, 400, 330, G.gri, 22)}${yazi(250, 290, 110, G.mur, "5 GB")}${yazi(250, 410, 44, G.mur, "ÖZELLİK")}</g>${carpi("carpi", 250, 315, 190)}
<g class="cep"><path d="M520 250H900V640Q900 700 840 700H580Q520 700 520 640Z" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/><rect x="620" y="130" width="120" height="190" rx="18" fill="${G.ak}" stroke="${G.mur}" stroke-width="8"/><circle cx="680" cy="250" r="30" fill="${G.gri}" stroke="${G.mur}" stroke-width="6"/>${yazi(710, 470, 100, G.ak, "1000")}${yazi(710, 550, 52, G.ak, "ŞARKI")}${yazi(710, 620, 52, G.ak, "CEBİNDE")}</g>`),
};
