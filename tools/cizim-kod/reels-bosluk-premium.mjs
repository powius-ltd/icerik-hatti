// "Boşlukla premium gösterme" Reels'inin SVG sahneleri: node dort-reels.mjs bosluk-premium <koşu>/cizimler.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu } from "./reels-yardimci.mjs";

const sise = (x, y, c = G.mavi) => `${kutu(x, y, 90, 150, c, 14)}<rect x="${x + 25}" y="${y - 40}" width="40" height="44" fill="${G.mur}"/>`;
const rozet = (x, y, boy, ty) => yazi(x, y, boy, G.mur, ty);
const cerceve = (x, y, g, y2, c = G.kagit) => `<rect x="${x}" y="${y}" width="${g}" height="${y2}" rx="26" fill="${c}" stroke="${G.mur}" stroke-width="8" stroke-dasharray="26 18"/>`;

export default {
  bos: svg(`<g class="c">${cerceve(110, 150, 740, 520)}</g>
<g class="u">${sise(415, 300)}${rozet(480, 580, 56, "ÜRÜN")}</g>`),
  karsi: svg(`<g class="k1">${kutu(40, 170, 410, 480, G.ak, 22)}${sise(70, 270, G.gri)}${sise(180, 270, G.mavi)}${sise(290, 270, G.gri)}${sise(70, 460, G.mavi)}${sise(180, 460, G.gri)}${sise(290, 460, G.mavi)}${rozet(245, 730, 48, "KALABALIK")}</g>
<g class="k2">${kutu(510, 170, 410, 480, G.ak, 22)}${sise(670, 365)}${rozet(715, 730, 48, "BOŞ ALAN")}</g>`),
  sayfa: svg(`<g class="c">${cerceve(90, 100, 780, 600)}</g>
<g class="u">${kutu(300, 230, 360, 300, G.mavi, 28)}${sise(445, 270, G.ak)}${rozet(480, 640, 56, "ÜRÜN")}</g>`),
};
