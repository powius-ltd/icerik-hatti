// "'Premium yap' yazma" araç Reels'inin SVG sahneleri: node dort-reels.mjs premium-istem <koşu>/cizimler.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu, cizgi } from "./reels-yardimci.mjs";

const ok = (x1, x2, y) => `<path d="M${x1} ${y}H${x2}" stroke="${G.mur}" stroke-width="16" stroke-linecap="round"/><path d="M${x2 - 30} ${y - 35}L${x2 + 5} ${y}L${x2 - 30} ${y + 35}" fill="none" stroke="${G.mur}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`;
const tik = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="40" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8"/><path d="M${cx - 18} ${cy}L${cx - 4} ${cy + 15}L${cx + 20} ${cy - 15}" fill="none" stroke="${G.ak}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`;
const carpi = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="40" fill="${G.gri}" stroke="${G.mur}" stroke-width="8"/><path d="M${cx - 16} ${cy - 16}L${cx + 16} ${cy + 16}M${cx + 16} ${cy - 16}L${cx - 16} ${cy + 16}" stroke="${G.mur}" stroke-width="10" stroke-linecap="round"/>`;
const satir = (x, y, g, c = G.gri) => `<rect x="${x}" y="${y}" width="${g}" height="22" rx="11" fill="${c}"/>`;

export default {
  premium: svg(`<g class="istem">${kutu(40, 130, 430, 450, G.ak, 22)}${satir(80, 190, 200, G.gri)}<rect x="80" y="260" width="350" height="110" rx="55" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8"/>${yazi(255, 332, 40, G.ak, "PREMİUM YAP")}${satir(80, 430, 280)}${satir(80, 480, 160)}${yazi(255, 680, 40, G.mur, "İSTEM")}</g>
${ok(500, 560, 355)}
<g class="bilmez">${kutu(590, 130, 330, 450, G.ak, 22)}<circle cx="755" cy="290" r="90" fill="${G.mur}"/>${yazi(755, 335, 130, G.ak, "?")}${satir(650, 440, 210)}${satir(690, 490, 130)}${yazi(755, 680, 40, G.mur, "CLAUDE")}</g>`),
  kural: svg(`<g class="kurallar">${kutu(40, 110, 500, 520, G.ak, 22)}${[0, 1, 2, 3].map((i) => `${tik(110, 190 + i * 110)}${satir(180, 178 + i * 110, 300 - (i % 2) * 70)}`).join("")}${yazi(290, 700, 40, G.mur, "YAZILI KURALLAR")}</g>
${ok(570, 640, 370)}
<g class="claude">${kutu(670, 230, 250, 280, G.ak, 22)}<circle cx="795" cy="340" r="60" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8"/><path d="M770 340L790 362L825 318" fill="none" stroke="${G.ak}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>${satir(710, 430, 170)}${yazi(795, 600, 40, G.mur, "CLAUDE")}</g>`),
  dugme: svg(`<g class="basis"><rect x="60" y="250" width="380" height="170" rx="85" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8"/>${yazi(250, 355, 46, G.ak, "DÜĞME")}${cizgi("", "M30 200L70 240M470 200L430 240M250 150V205", G.mur, 12)}${tik(250, 520)}${yazi(250, 680, 40, G.mur, "BASINCA")}</g>
<g class="birak"><rect x="520" y="250" width="380" height="170" rx="85" fill="${G.gri}" stroke="${G.mur}" stroke-width="8"/>${yazi(710, 355, 46, G.mur, "DÜĞME")}${carpi(710, 520)}${yazi(710, 680, 40, G.mur, "BIRAKINCA")}</g>`),
};
