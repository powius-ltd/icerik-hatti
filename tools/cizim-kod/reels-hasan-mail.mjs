// "Hasan: fabrikadan mail cevaplayan yapay zekaya" Reels'inin SVG sahneleri: node dort-reels.mjs hasan-mail <koşu>/cizimler. Öğeler sınıf adıyla şablondan hareket ettirilir.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu } from "./reels-yardimci.mjs";

const ok = (y) => `<path d="M480 ${y}V${y + 34}M462 ${y + 18}L480 ${y + 38}L498 ${y + 18}" stroke="${G.mur}" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
const rozet = (y, n, c) => `<circle cx="150" cy="${y}" r="46" fill="${c}" stroke="${G.mur}" stroke-width="8"/>${yazi(150, y + 20, 56, c === G.mur ? G.ak : G.mur, n)}`;
const zarf = (x, y) => `<rect x="${x}" y="${y}" width="300" height="200" rx="14" fill="${G.ak}" stroke="${G.mur}" stroke-width="8"/><path d="M${x} ${y}L${x + 150} ${y + 115}L${x + 300} ${y}" fill="none" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/>`;
const etiket = (x, c, ty, m) => `${kutu(x, 520, 260, 120, c, 18)}${yazi(x + 130, 600, 46, ty, m)}`;
const satir = (y, c, m) => `<rect x="250" y="${y - 44}" width="40" height="40" rx="8" fill="${c}" stroke="${G.mur}" stroke-width="6"/>${yazi(560, y - 8, 46, G.mur, m)}`;

export default {
  sistem: svg(`<g class="a">${kutu(60, 40, 840, 180, G.mavi)}${rozet(130, "1", G.ak)}${yazi(540, 152, 60, G.ak, "GELEN KUTUSU")}</g>
<g class="b">${ok(232)}${kutu(60, 300, 840, 180, G.ak)}${rozet(390, "2", G.mavi)}${yazi(540, 412, 60, G.mur, "BÜRO BİLGİSİ")}</g>
<g class="c">${ok(492)}${kutu(60, 560, 840, 180, G.gri)}${rozet(650, "3", G.mur)}${yazi(540, 672, 60, G.mur, "SENİN ONAYIN")}</g>`),
  gelen: svg(`<g class="zarf">${zarf(330, 80)}${yazi(480, 360, 44, G.mur, "YENİ MAİL")}</g><path d="M480 395V470" stroke="${G.mur}" stroke-width="9" stroke-dasharray="14 12"/>
<g class="t1">${etiket(40, G.mavi, G.ak, "SORU")}</g><g class="t2">${etiket(350, G.ak, G.mur, "RANDEVU")}</g><g class="t3">${etiket(660, G.gri, G.mur, "EVRAK")}</g>`),
  bilgi: svg(`<g class="belge"><path d="M180 50H680L780 150V740H180Z" fill="${G.ak}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/><path d="M680 50V150H780" fill="none" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/>${yazi(480, 150, 48, G.mavi, "BÜRO BİLGİSİ")}</g>
<g class="s1">${satir(320, G.mavi, "SIK SORULANLAR")}</g><g class="s2">${satir(480, G.gri, "ÜCRETLER")}</g><g class="s3">${satir(640, G.koyu, "EVRAK LİSTESİ")}</g>`),
  onay: svg(`<g class="taslak">${kutu(100, 40, 760, 360, G.ak)}${yazi(480, 120, 50, G.mavi, "TASLAK CEVAP")}<rect x="170" y="175" width="620" height="22" rx="11" fill="${G.gri}"/><rect x="170" y="235" width="520" height="22" rx="11" fill="${G.gri}"/><rect x="170" y="295" width="580" height="22" rx="11" fill="${G.gri}"/></g>
<g class="dugme">${kutu(270, 440, 420, 130, G.mavi, 65)}<path d="M330 505L360 535L410 475" fill="none" stroke="${G.ak}" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>${yazi(530, 527, 54, G.ak, "GÖNDER")}</g>
<g class="kalkan">${yazi(480, 690, 44, G.mur, "Son söz her zaman sende")}</g>`),
};
