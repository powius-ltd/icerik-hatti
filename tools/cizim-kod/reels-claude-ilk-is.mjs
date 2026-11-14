// "Claude'u ilk açtıysan ilk iş" Reels'inin SVG sahneleri: node dort-reels.mjs claude-ilk-is <koşu>/cizimler.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu } from "./reels-yardimci.mjs";

const kart = (x, no, c) => `${kutu(x, 220, 250, 300, G.ak, 22)}<circle cx="${x + 125}" cy="320" r="56" fill="${c}" stroke="${G.mur}" stroke-width="8"/>${yazi(x + 125, 342, 64, G.mur, no)}<rect x="${x + 40}" y="420" width="170" height="16" rx="8" fill="${G.gri}"/><rect x="${x + 40}" y="460" width="120" height="16" rx="8" fill="${G.gri}"/>`;
const satir = (x, y, g) => `<rect x="${x}" y="${y}" width="${g}" height="16" rx="8" fill="${G.gri}"/>`;
const baloncuk = (x, y, g, c) => `<rect x="${x}" y="${y}" width="${g}" height="70" rx="22" fill="${c}" stroke="${G.mur}" stroke-width="6"/>${satir(x + 28, y + 27, g - 56)}`;

export default {
  ilk: svg(`<g class="uc">${kart(60, "1", G.mavi)}${kart(355, "2", G.ten)}${kart(650, "3", G.mavi)}${yazi(480, 120, 46, G.mur, "İLK GÜN, ÜÇ AYAR")}</g>
<g class="ayar"><circle cx="480" cy="640" r="52" fill="${G.ak}" stroke="${G.mur}" stroke-width="8"/><circle cx="480" cy="640" r="18" fill="${G.mur}"/>${yazi(480, 740, 40, G.mur, "HEMEN AYARLA")}</g>`),
  profil: svg(`<g class="talimat">${kutu(40, 90, 430, 570, G.ak, 22)}${yazi(255, 170, 40, G.mur, "TALİMAT")}${satir(90, 230, 330)}${satir(90, 280, 260)}${satir(90, 330, 300)}${satir(90, 380, 200)}<circle cx="255" cy="520" r="50" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8"/>${yazi(255, 538, 52, G.ak, "✓")}${yazi(255, 740, 40, G.mur, "BİR KEZ YAZ")}</g>
<g class="sohbet">${kutu(500, 90, 420, 570, G.kagit, 22)}${baloncuk(540, 150, 300, G.ak)}${baloncuk(580, 260, 300, G.mavi)}${baloncuk(540, 370, 300, G.ak)}${baloncuk(580, 480, 300, G.mavi)}${yazi(710, 740, 40, G.mur, "HER SOHBETTE")}</g>`),
  proje: svg(`<g class="dosya"><path d="M60 230H260L300 280H440V620H60Z" fill="${G.ten}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/><rect x="120" y="190" width="180" height="230" rx="10" fill="${G.ak}" stroke="${G.mur}" stroke-width="8"/>${satir(150, 250, 120)}${satir(150, 300, 90)}${satir(150, 350, 110)}${yazi(250, 740, 40, G.mur, "DOSYALAR")}</g>
<g class="talimat">${kutu(520, 160, 380, 460, G.ak, 22)}${yazi(710, 240, 40, G.mur, "TALİMAT")}${satir(570, 300, 280)}${satir(570, 350, 220)}${satir(570, 400, 250)}${satir(570, 450, 160)}<circle cx="710" cy="540" r="36" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8"/>${yazi(710, 740, 40, G.mur, "PROJEDE")}</g>`),
};
