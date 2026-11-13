// "Eklentiler kotanı yer mi?" Reels'inin SVG sahneleri: node dort-reels.mjs eklenti-kota <koşu>/cizimler.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu } from "./reels-yardimci.mjs";

const kart = (x, y) => `${kutu(x, y, 230, 130, G.ak, 18)}<rect x="${x + 30}" y="${y + 30}" width="60" height="60" rx="14" fill="${G.mavi}"/><rect x="${x + 110}" y="${y + 38}" width="90" height="16" rx="8" fill="${G.gri}"/><rect x="${x + 110}" y="${y + 70}" width="60" height="16" rx="8" fill="${G.gri}"/>`;
const satir = (x, y, g) => `<rect x="${x}" y="${y}" width="${g}" height="44" rx="12" fill="${G.ak}" stroke="${G.mur}" stroke-width="6"/>`;

export default {
  bag: svg(`<g class="eklenti">${kart(30, 160)}${kart(30, 330)}${kart(30, 500)}${yazi(145, 740, 40, G.mur, "EKLENTİLER")}</g>
<g class="yer">${kutu(340, 90, 590, 600, G.ak, 22)}${yazi(635, 160, 44, G.mur, "BAĞLAM")}<rect x="380" y="200" width="510" height="56" rx="12" fill="${G.mavi}"/><rect x="380" y="276" width="400" height="56" rx="12" fill="${G.mavi}"/><rect x="380" y="352" width="300" height="56" rx="12" fill="${G.mavi}"/><rect x="380" y="440" width="510" height="200" rx="14" fill="${G.gri}" opacity=".5"/>${yazi(635, 740, 40, G.mur, "BİRAZ YER TUTAR")}</g>`),
  mcp: svg(`<g class="adlar">${kutu(40, 90, 380, 570, G.ak, 22)}${yazi(230, 160, 44, G.mur, "MCP")}${satir(80, 210, 300)}${satir(80, 290, 240)}${satir(80, 370, 280)}${satir(80, 450, 200)}${yazi(230, 740, 40, G.mur, "ADLAR HEP")}</g>
<g class="ayrinti">${kutu(540, 90, 380, 570, G.gri, 22)}${yazi(730, 160, 44, G.mur, "AYRINTI")}<rect x="590" y="220" width="280" height="260" rx="16" fill="${G.ak}" opacity=".7"/>${yazi(730, 590, 36, G.mur, "KULLANILINCA")}${yazi(730, 740, 40, G.mur, "SONRA GELİR")}</g>`),
};
