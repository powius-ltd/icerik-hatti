// "Ayşenur: dört saatte uygulama" Reels'inin SVG sahneleri: node dort-reels.mjs aysenur-uygulama <koşu>/cizimler. Öğeler sınıf adıyla şablondan hareket ettirilir.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu } from "./reels-yardimci.mjs";

const ok = (y) => `<path d="M480 ${y}V${y + 34}M462 ${y + 18}L480 ${y + 38}L498 ${y + 18}" stroke="${G.mur}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const rozet = (y, n, c) => `<circle cx="150" cy="${y}" r="46" fill="${c}" stroke="${G.mur}" stroke-width="8"/>${yazi(150, y + 20, 56, c === G.mur ? G.ak : G.mur, n)}`;
const satir = (y, n, c, ty, m) => `${kutu(60, y, 840, 130, c, 22)}${rozet(y + 65, n, c === G.ak ? G.mavi : G.ak)}${yazi(560, y + 84, 50, ty, m)}`;
const cubuk = (x, y, g, c = G.gri) => `<rect x="${x}" y="${y}" width="${g}" height="22" rx="11" fill="${c}"/>`;

export default {
  adimlar: svg(`<g class="a">${kutu(60, 40, 840, 180, G.mavi)}${rozet(130, "1", G.ak)}${yazi(560, 152, 60, G.ak, "FİKİR")}</g>
<g class="b">${ok(232)}${kutu(60, 300, 840, 180, G.ak)}${rozet(390, "2", G.mavi)}${yazi(560, 412, 60, G.mur, "İLK İSTEM")}</g>
<g class="c">${ok(492)}${kutu(60, 560, 840, 180, G.gri)}${rozet(650, "3", G.mur)}${yazi(580, 672, 56, G.mur, "DENE · DÜZELT")}</g>`),
  cumle: svg(`<g class="kart">${kutu(60, 40, 840, 170, G.mur)}${yazi(480, 150, 70, G.ak, "TEK CÜMLE")}</g>
<g class="t1">${satir(260, "1", G.mavi, G.ak, "KİM KULLANACAK")}</g>
<g class="t2">${satir(420, "2", G.ak, G.mur, "NE YAPACAK")}</g>
<g class="t3">${satir(580, "3", G.gri, G.mur, "EKRANDA NE GÖRECEK")}</g>`),
  istem: svg(`<g class="sohbet">${kutu(60, 30, 840, 160, G.ak)}<path d="M180 188L150 250L260 188Z" fill="${G.ak}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/><rect x="170" y="170" width="100" height="30" fill="${G.ak}"/>${yazi(480, 130, 56, G.mur, "Fikrim: tek cümle")}</g>
<g class="istem">${kutu(60, 290, 840, 290, G.mur, 30)}${yazi(480, 410, 64, G.ak, "Kurmadan önce bana")}${yazi(480, 520, 100, G.mavi, "5 soru sor.")}</g>
<g class="plan">${ok(588)}${kutu(60, 640, 840, 120, G.mavi, 22)}${yazi(480, 718, 50, G.ak, "CEVAPLARINDAN PLAN")}</g>`),
  duzelt: svg(`<g class="ekran">${kutu(100, 30, 760, 430, G.ak)}<circle cx="160" cy="85" r="14" fill="${G.mavi}"/><circle cx="205" cy="85" r="14" fill="${G.gri}"/><circle cx="250" cy="85" r="14" fill="${G.gri}"/><path d="M100 125H860" stroke="${G.mur}" stroke-width="8"/>${cubuk(160, 175, 560)}${cubuk(160, 235, 460)}${cubuk(160, 295, 520)}${cubuk(160, 355, 380)}</g>
<g class="hata"><rect x="140" y="278" width="600" height="56" rx="18" fill="none" stroke="${G.mavi}" stroke-width="10"/><circle cx="780" cy="306" r="42" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8"/>${yazi(780, 328, 62, G.ak, "!")}${yazi(480, 530, 50, G.mur, "Bozuk yeri tek cümleyle söyle")}</g>
<g class="tik">${kutu(210, 590, 540, 150, G.mavi, 75)}<path d="M290 665L335 710L410 625" fill="none" stroke="${G.ak}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>${yazi(590, 686, 60, G.ak, "DÜZELDİ")}</g>`),
};
