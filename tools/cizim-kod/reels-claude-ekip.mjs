// "ECC: Claude Code'u yazılım ekibine çeviren depo" Reels'inin SVG sahneleri: node dort-reels.mjs claude-ekip <koşu>/cizimler.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu, cizgi } from "./reels-yardimci.mjs";

const kisi = (x, y, renk) => `<circle cx="${x}" cy="${y - 70}" r="26" fill="${G.ten}" stroke="${G.mur}" stroke-width="8"/><path d="M${x - 44} ${y + 50}Q${x - 44} ${y - 30} ${x} ${y - 30}Q${x + 44} ${y - 30} ${x + 44} ${y + 50}Z" fill="${renk}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/>`;
const satir = (x, y, g, renk = G.gri) => `<rect x="${x}" y="${y}" width="${g}" height="18" rx="9" fill="${renk}"/>`;
const tik = (cx, cy) => `<path d="M${cx - 34} ${cy}L${cx - 8} ${cy + 28}L${cx + 36} ${cy - 30}" fill="none" stroke="${G.mavi}" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>`;

export default {
  ekip: svg(`<g class="depo">${kutu(40, 150, 330, 430, G.ak, 22)}<rect x="80" y="200" width="250" height="60" rx="12" fill="${G.mur}"/>${satir(80, 300, 250)}${satir(80, 345, 190)}${satir(80, 390, 220)}${satir(80, 435, 160)}${satir(80, 480, 210)}${yazi(205, 680, 40, G.mur, "TEK DEPO")}</g>
${cizgi("ok", "M410 365H520")}<path d="M490 330L525 365L490 400" fill="none" stroke="${G.mur}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
<g class="ekip">${kutu(560, 150, 360, 430, G.ak, 22)}${kisi(640, 330, G.mavi)}${kisi(740, 330, G.koyu)}${kisi(840, 330, G.mavi)}${kisi(690, 480, G.koyu)}${kisi(790, 480, G.mavi)}${yazi(740, 680, 40, G.mur, "YAZILIM EKİBİ")}</g>`),
  ajanlar: svg(`<g class="plan">${kutu(40, 90, 410, 270, G.ak, 22)}${satir(80, 140, 250, G.mur)}<circle cx="100" cy="230" r="16" fill="${G.mavi}"/>${satir(135, 221, 230)}<circle cx="100" cy="285" r="16" fill="${G.mavi}"/>${satir(135, 276, 180)}${yazi(245, 400, 36, G.mur, "PLANLA")}</g>
<g class="kod">${kutu(510, 90, 410, 270, G.ak, 22)}<rect x="550" y="130" width="330" height="190" rx="12" fill="${G.mur}"/><path d="M620 180L580 225L620 270M810 180L850 225L810 270" fill="none" stroke="${G.ak}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/><path d="M730 170L700 280" stroke="${G.mavi}" stroke-width="16" stroke-linecap="round"/>${yazi(715, 400, 36, G.mur, "KODLA")}</g>
<g class="test">${kutu(40, 430, 410, 270, G.ak, 22)}${tik(245, 520)}${satir(100, 590, 290)}${yazi(245, 735, 36, G.mur, "TEST ET")}</g>
<g class="inceleme">${kutu(510, 430, 410, 270, G.ak, 22)}<circle cx="690" cy="510" r="56" fill="${G.ak}" stroke="${G.mur}" stroke-width="14"/><path d="M732 552L790 610" stroke="${G.mur}" stroke-width="20" stroke-linecap="round"/>${satir(570, 610, 190)}${yazi(715, 735, 36, G.mur, "İNCELE")}</g>`),
};
