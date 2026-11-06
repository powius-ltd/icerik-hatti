// "Baki: üç günde kanal" Reels'inin SVG sahneleri: node dort-reels.mjs baki-kanal <koşu>/cizimler. Öğeler sınıf adıyla şablondan hareket ettirilir.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu } from "./reels-yardimci.mjs";

const ok = (y) => `<path d="M480 ${y}V${y + 34}M462 ${y + 18}L480 ${y + 38}L498 ${y + 18}" stroke="${G.mur}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const rozet = (y, n, c) => `<circle cx="150" cy="${y}" r="46" fill="${c}" stroke="${G.mur}" stroke-width="8"/>${yazi(150, y + 20, 56, c === G.mur ? G.ak : G.mur, n)}`;
const oynat = (x, y, c = G.mavi) => `<circle cx="${x}" cy="${y}" r="42" fill="${c}" stroke="${G.mur}" stroke-width="8"/><path d="M${x - 12} ${y - 22}L${x + 24} ${y}L${x - 12} ${y + 22}Z" fill="${G.ak}"/>`;
const hucre = (y, no, c) => `${kutu(80, y, 800, 130, c, 14)}${yazi(160, y + 82, 56, G.mur, no)}<path d="M230 ${y}V${y + 130}" stroke="${G.mur}" stroke-width="6"/>${yazi(450, y + 82, 54, G.mur, `Konu ${no}`)}${oynat(790, y + 65)}`;

export default {
  parcalar: svg(`<g class="a">${kutu(60, 40, 840, 180, G.mavi)}${rozet(130, "1", G.ak)}${yazi(580, 152, 58, G.ak, "KONU LİSTESİ")}</g>
<g class="b">${ok(232)}${kutu(60, 300, 840, 180, G.ak)}${rozet(390, "2", G.mavi)}${yazi(580, 412, 60, G.mur, "ÜRETİM")}</g>
<g class="c">${ok(492)}${kutu(60, 560, 840, 180, G.gri)}${rozet(650, "3", G.mur)}${yazi(580, 672, 60, G.mur, "SAAT")}</g>`),
  liste: svg(`<g class="tablo">${kutu(60, 30, 840, 730, G.kagit, 22)}${kutu(80, 50, 800, 100, G.mur, 14)}${yazi(480, 120, 52, G.ak, "HAFTANIN KONULARI")}</g>
<g class="s1">${hucre(180, "1", G.ak)}</g>
<g class="s2">${hucre(330, "2", G.ak)}${hucre(480, "3", G.gri)}<g>${yazi(480, 705, 44, G.mur, "HER SATIR = BİR VİDEO")}</g></g>`),
  uretim: svg(`<g class="sohbet">${kutu(60, 30, 840, 120, G.mavi)}<path d="M180 148L150 205L260 148Z" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/><rect x="170" y="130" width="100" height="30" fill="${G.mavi}"/>${yazi(480, 106, 56, G.ak, "Claude'a söyle")}</g>
<g class="istem">${kutu(60, 230, 840, 330, G.mur, 30)}${yazi(480, 330, 62, G.ak, "Sıradaki konuyu al,")}${yazi(480, 420, 62, G.ak, "metnini yaz,")}${yazi(480, 510, 62, G.mavi, "videosunu hazırla.")}</g>
<g class="video">${ok(566)}${kutu(60, 620, 840, 140, G.ak, 22)}${oynat(160, 690)}${yazi(580, 706, 54, G.mur, "VİDEO HAZIR")}</g>`),
  saat: svg(`<g class="saat"><circle cx="480" cy="190" r="150" fill="${G.ak}" stroke="${G.mur}" stroke-width="10"/><path d="M480 190V90M480 190L550 230" stroke="${G.mur}" stroke-width="14" stroke-linecap="round"/><circle cx="480" cy="190" r="14" fill="${G.mavi}"/>${yazi(480, 400, 50, G.mur, "HER GÜN AYNI SAAT")}</g>
<g class="yukle">${kutu(60, 450, 840, 140, G.mavi, 22)}<path d="M150 560V470M120 495L150 462L180 495" stroke="${G.ak}" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>${yazi(560, 535, 58, G.ak, "KENDİSİ YÜKLER")}</g>
<g class="sen">${kutu(60, 620, 840, 140, G.mur, 22)}${yazi(480, 705, 54, G.ak, "SEN: LİSTEYİ DOLDUR")}</g>`),
};
