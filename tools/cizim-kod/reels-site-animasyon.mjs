// "Scroll Craft: kaydırınca canlanan site" araç Reels'inin SVG sahneleri: node dort-reels.mjs site-animasyon <koşu>/cizimler.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu } from "./reels-yardimci.mjs";

const sablon = (x, y) => `${kutu(x, y, 250, 170, G.ak, 16)}<rect x="${x + 25}" y="${y + 30}" width="200" height="50" rx="8" fill="${G.gri}"/><rect x="${x + 25}" y="${y + 100}" width="120" height="16" rx="8" fill="${G.gri}"/><rect x="${x + 25}" y="${y + 130}" width="160" height="16" rx="8" fill="${G.gri}"/>`;
const tarayici = (x, y, g, h) => `${kutu(x, y, g, h, G.mur, 22)}<circle cx="${x + 40}" cy="${y + 38}" r="13" fill="${G.mavi}"/><circle cx="${x + 80}" cy="${y + 38}" r="13" fill="${G.ak}"/><circle cx="${x + 120}" cy="${y + 38}" r="13" fill="${G.gri}"/>`;
const oynat = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${G.ak}" stroke="${G.mur}" stroke-width="8"/><path d="M${cx - r * 0.3} ${cy - r * 0.45}L${cx + r * 0.5} ${cy}L${cx - r * 0.3} ${cy + r * 0.45}Z" fill="${G.mavi}"/>`;

export default {
  site: svg(`<g class="ayni">${sablon(30, 90)}${sablon(30, 300)}${sablon(30, 510)}${yazi(155, 740, 40, G.mur, "HEPSİ AYNI")}</g>
<g class="canli">${tarayici(340, 90, 590, 600)}<rect x="380" y="160" width="510" height="250" rx="16" fill="${G.mavi}"/>${oynat(635, 285, 70)}<rect x="380" y="440" width="380" height="48" rx="10" fill="${G.ak}"/><rect x="380" y="510" width="260" height="24" rx="12" fill="${G.gri}"/><rect x="380" y="560" width="320" height="24" rx="12" fill="${G.gri}"/><rect x="900" y="160" width="14" height="420" rx="7" fill="${G.gri}"/><rect x="900" y="300" width="14" height="110" rx="7" fill="${G.mavi}"/>${yazi(635, 740, 40, G.mur, "KAYDIRINCA CANLANIR")}</g>`),
  kaydir: svg(`${tarayici(40, 60, 880, 680)}<g class="v"><rect x="90" y="130" width="560" height="300" rx="16" fill="${G.mavi}"/>${oynat(370, 280, 80)}<rect x="90" y="450" width="560" height="14" rx="7" fill="${G.gri}"/><rect x="90" y="450" width="300" height="14" rx="7" fill="${G.ak}"/></g>
<g class="pin">${kutu(690, 130, 190, 300, G.ak, 16)}${yazi(785, 260, 40, G.mur, "SABİT")}${yazi(785, 320, 40, G.mur, "BÖLÜM")}</g>
<g class="h"><rect x="90" y="510" width="420" height="56" rx="10" fill="${G.ak}"/><rect x="90" y="590" width="320" height="56" rx="10" fill="${G.ak}" opacity=".7"/><rect x="90" y="670" width="220" height="40" rx="10" fill="${G.ak}" opacity=".45"/></g>`),
};
