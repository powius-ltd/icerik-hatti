// "/watch: Claude video izliyor" araç Reels'inin SVG sahneleri: node dort-reels.mjs claude-watch <koşu>/cizimler.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu } from "./reels-yardimci.mjs";

const cubuklar = (x, y, adet, renk, boylar) => boylar.slice(0, adet).map((h, i) => `<rect x="${x + i * 38}" y="${y - h / 2}" width="22" height="${h}" rx="11" fill="${renk}"/>`).join("");
const oynat = (cx, cy, r) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8"/><path d="M${cx - r * 0.3} ${cy - r * 0.45}L${cx + r * 0.5} ${cy}L${cx - r * 0.3} ${cy + r * 0.45}Z" fill="${G.ak}"/>`;
const satirlar = (x, y, adet, g) => Array.from({ length: adet }, (_, i) => `<rect x="${x}" y="${y + i * 56}" width="${g - (i % 3) * 50}" height="22" rx="11" fill="${i === 0 ? G.mavi : G.gri}"/>`).join("");

export default {
  izle: svg(`<g class="video">${kutu(40, 110, 560, 520, G.ak, 22)}<rect x="80" y="150" width="480" height="300" rx="14" fill="${G.mur}"/>${oynat(320, 300, 70)}<rect x="80" y="490" width="480" height="18" rx="9" fill="${G.gri}"/><rect x="80" y="490" width="300" height="18" rx="9" fill="${G.mavi}"/>${yazi(320, 700, 40, G.mur, "VİDEO")}</g>
<g class="konusma">${kutu(650, 110, 270, 520, G.ak, 22)}${cubuklar(690, 370, 5, G.mavi, [60, 150, 240, 150, 80])}${yazi(785, 700, 40, G.mur, "KONUŞMA")}</g>`),
  cevir: svg(`<g class="kareler">${kutu(40, 130, 200, 130, G.ak, 14)}${kutu(40, 290, 200, 130, G.ak, 14)}${kutu(40, 450, 200, 130, G.ak, 14)}<rect x="60" y="150" width="160" height="90" rx="8" fill="${G.mur}"/><rect x="60" y="310" width="160" height="90" rx="8" fill="${G.mur}"/><rect x="60" y="470" width="160" height="90" rx="8" fill="${G.mur}"/>${yazi(140, 680, 40, G.mur, "KARELER")}</g>
<path d="M290 355H400" stroke="${G.mur}" stroke-width="16" stroke-linecap="round"/><path d="M370 320L405 355L370 390" fill="none" stroke="${G.mur}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
<g class="yazi">${kutu(450, 130, 470, 450, G.ak, 22)}${satirlar(490, 190, 6, 390)}${yazi(685, 680, 40, G.mur, "YAZI")}</g>`),
  ornek: svg(`<g class="egitim">${kutu(40, 130, 400, 450, G.ak, 22)}<rect x="80" y="170" width="320" height="200" rx="12" fill="${G.mur}"/>${oynat(240, 270, 52)}<rect x="80" y="410" width="260" height="22" rx="11" fill="${G.gri}"/><rect x="80" y="460" width="180" height="22" rx="11" fill="${G.gri}"/>${yazi(240, 680, 40, G.mur, "SATIŞ EĞİTİMİ")}</g>
<path d="M470 355H520" stroke="${G.mur}" stroke-width="16" stroke-linecap="round"/><path d="M490 320L525 355L490 390" fill="none" stroke="${G.mur}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
<g class="not">${kutu(560, 130, 360, 450, G.ak, 22)}<circle cx="610" cy="210" r="14" fill="${G.mavi}"/><rect x="645" y="198" width="230" height="24" rx="12" fill="${G.gri}"/><circle cx="610" cy="300" r="14" fill="${G.mavi}"/><rect x="645" y="288" width="190" height="24" rx="12" fill="${G.gri}"/><circle cx="610" cy="390" r="14" fill="${G.mavi}"/><rect x="645" y="378" width="210" height="24" rx="12" fill="${G.gri}"/><circle cx="610" cy="480" r="14" fill="${G.mavi}"/><rect x="645" y="468" width="170" height="24" rx="12" fill="${G.gri}"/>${yazi(740, 680, 40, G.mur, "NOT")}</g>`),
};
