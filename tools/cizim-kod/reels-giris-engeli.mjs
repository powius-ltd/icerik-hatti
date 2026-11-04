// "Giriş engeli" Reels'inin SVG sahneleri: node dort-reels.mjs giris-engeli <çizim klasörü>. Parçalar reels-yardimci.mjs ve gazete.mjs'ten.
import { G, adam } from "./gazete.mjs";
import { svg, yazi, kutu, cizgi } from "./reels-yardimci.mjs";

const balon = (x, y, g, y2, s1, s2) => `${kutu(x, y, g, y2)}${yazi(x + g / 2, y + y2 / 2 - 12, 58, G.mur, s1)}${yazi(x + g / 2, y + y2 / 2 + 62, 58, G.mavi, s2)}`;
const kart = (x, sinif, c, ad, tc) => `<g class="${sinif}">${kutu(x, 150, 360, 470, c, 24)}${yazi(x + 180, 270, 46, tc, ad)}${yazi(x + 180, 410, 62, tc, "24 SAAT")}${yazi(x + 180, 490, 44, tc, "STORIES")}</g>`;
const sira = (y, sinif, c, tc, s) => `<g class="${sinif}">${kutu(100, y, 760, 125, c, 22)}${yazi(480, y + 83, 50, tc, s)}</g>`;

export default {
  kopya: svg(`${kart(60, "k2", G.ak, "INSTAGRAM", G.mur)}${kart(540, "k1", G.mavi, "SNAPCHAT", G.ak)}
<g class="ok">${cizgi("yol", "M430 385H530M490 335L540 385L490 435", G.mavi, 22)}${yazi(480, 710, 54, G.mur, "AYNI ÖZELLİK")}</g>`),
  soru: svg(`<g class="kisi">${adam(170, 730, 1.4)}</g><g class="balon">${balon(260, 90, 640, 300, "YARIN BİRİ", "KOPYALARSA?")}<path d="M330 385L280 480L440 385Z" fill="${G.ak}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/><rect x="320" y="368" width="125" height="30" fill="${G.ak}"/></g>
<g class="alt">${yazi(620, 600, 50, G.mur, "Müşteri neden")}${yazi(620, 670, 50, G.mavi, "sende kalır?")}</g>`),
  engeller: svg(`${sira(35, "e1", G.mavi, G.ak, "AĞ ETKİSİ")}${sira(180, "e2", G.ak, G.mur, "MARKA")}${sira(325, "e3", G.mavi, G.ak, "MALİYET AVANTAJI")}${sira(470, "e4", G.ak, G.mur, "DEĞİŞTİRME MALİYETİ")}${sira(615, "e5", G.mavi, G.ak, "ÖZEL TEKNOLOJİ")}`),
};
