// "Haftalık raporu tek istemle" Reels'inin SVG sahneleri: node dort-reels.mjs haftalik-rapor <koşu>/cizimler.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu } from "./reels-yardimci.mjs";

const cizgiler = (x, y, g, adet, ara = 36, c = G.gri) => Array.from({ length: adet }, (_, i) => `<rect x="${x}" y="${y + i * ara}" width="${i % 2 ? g * 0.7 : g}" height="14" rx="7" fill="${c}"/>`).join("");
const not = (x, y, g, y2, a) => `<g transform="rotate(${a} ${x + g / 2} ${y + y2 / 2})"><rect x="${x}" y="${y}" width="${g}" height="${y2}" rx="8" fill="${G.ak}" stroke="${G.mur}" stroke-width="6"/>${cizgiler(x + 20, y + 28, g - 40, 3)}</g>`;
const sira = (sinif, y, metin, simge) => `<g class="${sinif}">${kutu(40, y, 880, 110, G.ak, 22)}<circle cx="120" cy="${y + 55}" r="34" fill="${G.mavi}" stroke="${G.mur}" stroke-width="6"/>${simge(120, y + 55)}${yazi(540, y + 72, 44, G.mur, metin)}</g>`;
const ok = (x, y) => `<path d="M${x - 16} ${y}L${x - 4} ${y + 12}L${x + 16} ${y - 12}" fill="none" stroke="${G.ak}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
const sag = (x, y) => `<path d="M${x - 14} ${y}H${x + 14}M${x + 3} ${y - 12}L${x + 15} ${y}L${x + 3} ${y + 12}" fill="none" stroke="${G.ak}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
const unlem = (x, y) => `<rect x="${x - 5}" y="${y - 18}" width="10" height="24" rx="5" fill="${G.ak}"/><circle cx="${x}" cy="${y + 16}" r="6" fill="${G.ak}"/>`;
const takvim = (x, y) => `<rect x="${x - 17}" y="${y - 15}" width="34" height="32" rx="6" fill="none" stroke="${G.ak}" stroke-width="7"/><path d="M${x - 17} ${y - 3}H${x + 17}" stroke="${G.ak}" stroke-width="7"/>`;

export default {
  dagin: svg(`<g class="dagin">${kutu(40, 90, 400, 570, G.gri, 22)}${not(80, 140, 190, 130, -9)}${not(250, 250, 170, 130, 11)}${not(90, 400, 200, 140, -4)}${not(250, 500, 160, 100, 8)}${yazi(240, 740, 40, G.mur, "DAĞINIK")}</g>
<g class="rapor"><path d="M452 375H508M492 355L512 375L492 395" fill="none" stroke="${G.mur}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>${kutu(520, 90, 400, 570, G.ak, 22)}<rect x="560" y="130" width="320" height="50" rx="12" fill="${G.mavi}" stroke="${G.mur}" stroke-width="6"/>${[0, 1, 2, 3].map((i) => `<rect x="560" y="${225 + i * 100}" width="30" height="30" rx="8" fill="${G.mavi}"/>${cizgiler(610, 227 + i * 100, 270, 2, 30)}`).join("")}${yazi(720, 740, 40, G.mur, "DÜZENLİ")}</g>`),
  istem: svg(`<g class="notlar">${kutu(40, 90, 880, 230, G.gri, 22)}${yazi(480, 165, 44, G.mur, "NOTLAR")}${cizgiler(100, 205, 760, 3, 30, G.ak)}</g>
<g class="istem">${kutu(40, 360, 880, 230, G.mavi, 22)}${yazi(480, 435, 44, G.ak, "KISA İSTEM")}<rect x="100" y="475" width="760" height="14" rx="7" fill="${G.ak}"/><rect x="100" y="511" width="530" height="14" rx="7" fill="${G.ak}"/><rect x="100" y="547" width="650" height="14" rx="7" fill="${G.ak}"/>${yazi(480, 700, 40, G.mur, "NOTLAR + İSTEM")}</g>`),
  rapor: svg(`${sira("biten", 90, "BU HAFTA BİTEN", ok)}${sira("devam", 230, "DEVAM EDEN", sag)}${sira("takilan", 370, "TAKILAN", unlem)}${sira("gelecek", 510, "GELECEK HAFTA", takvim)}${yazi(480, 720, 40, G.mur, "DÖRT BAŞLIK")}`),
};
