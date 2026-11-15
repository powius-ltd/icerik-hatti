// "earshot: Claude'un ses efektlerini düzeltir" araç Reels'inin SVG sahneleri: node dort-reels.mjs claude-hareket-ses <koşu>/cizimler.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu, cizgi } from "./reels-yardimci.mjs";

const cubuklar = (x, y, adet, renk, boylar) => boylar.slice(0, adet).map((h, i) => `<rect x="${x + i * 38}" y="${y - h / 2}" width="22" height="${h}" rx="11" fill="${renk}"/>`).join("");
const pencere = (x, y, g, h) => `${kutu(x, y, g, h, G.ak, 22)}<circle cx="${x + 40}" cy="${y + 38}" r="13" fill="${G.mavi}"/><circle cx="${x + 80}" cy="${y + 38}" r="13" fill="${G.gri}"/>`;
const hoparlor = (cx, cy) => `<path d="M${cx - 50} ${cy - 30}H${cx - 20}L${cx + 30} ${cy - 70}V${cy + 70}L${cx - 20} ${cy + 30}H${cx - 50}Z" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/>`;

export default {
  ses: svg(`<g class="kotu">${kutu(40, 110, 410, 520, G.ak, 22)}${cubuklar(75, 330, 10, G.gri, [20, 150, 40, 200, 30, 170, 25, 190, 35, 160])}${yazi(245, 700, 40, G.mur, "KÖTÜ SES")}<path d="M150 210L330 430M330 210L150 430" stroke="${G.mur}" stroke-width="16" stroke-linecap="round" opacity=".18"/></g>
<g class="duzelt">${kutu(510, 110, 410, 520, G.ak, 22)}${cubuklar(545, 330, 10, G.mavi, [60, 120, 200, 260, 200, 120, 200, 150, 90, 50])}${cizgi("tik", "M640 520L685 565L790 460", G.mur, 18)}${yazi(715, 700, 40, G.mur, "DÜZELDİ")}</g>`),
  dinle: svg(`<g class="dalga">${pencere(40, 80, 880, 260)}${cubuklar(110, 235, 21, G.mavi, [40, 80, 120, 70, 150, 100, 60, 140, 90, 50, 130, 80, 160, 70, 110, 60, 120, 90, 50, 80, 40])}</g>
<g class="puan">${kutu(40, 400, 400, 330, G.ak, 22)}<rect x="90" y="500" width="300" height="40" rx="20" fill="${G.gri}"/><rect x="90" y="500" width="220" height="40" rx="20" fill="${G.mavi}"/>${yazi(240, 660, 40, G.mur, "KARNE")}</g>
<g class="isaret">${kutu(500, 400, 420, 330, G.ak, 22)}<circle cx="560" cy="470" r="14" fill="${G.mavi}"/><rect x="595" y="458" width="270" height="24" rx="12" fill="${G.gri}"/><circle cx="560" cy="560" r="14" fill="${G.mavi}"/><rect x="595" y="548" width="220" height="24" rx="12" fill="${G.gri}"/><circle cx="560" cy="650" r="14" fill="${G.mavi}"/><rect x="595" y="638" width="250" height="24" rx="12" fill="${G.gri}"/></g>`),
  uret: svg(`<g class="kod">${kutu(40, 160, 340, 420, G.mur, 22)}${yazi(210, 330, 120, G.ak, "{ }")}<rect x="90" y="430" width="240" height="16" rx="8" fill="${G.mavi}"/><rect x="90" y="470" width="160" height="16" rx="8" fill="${G.gri}"/>${yazi(210, 680, 40, G.mur, "KOD")}</g>
<path d="M410 370H520" stroke="${G.mur}" stroke-width="16" stroke-linecap="round"/><path d="M490 335L525 370L490 405" fill="none" stroke="${G.mur}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
<g class="ses">${kutu(560, 160, 360, 420, G.ak, 22)}${hoparlor(640, 370)}${cubuklar(725, 370, 5, G.mavi, [60, 140, 220, 140, 70])}${yazi(740, 680, 40, G.mur, "SES")}</g>`),
};
