// "Planı pahalı model yapar, kodu ucuz model yazar" Reels'inin SVG sahneleri: node dort-reels.mjs pahali-model <koşu>/cizimler.
import { G, adam } from "./gazete.mjs";
import { svg, yazi, solYazi, kutu } from "./reels-yardimci.mjs";

const tugla = (() => {
  let s = "";
  for (let r = 0; r < 6; r++) for (let c = 0; c < 3; c++) {
    const kay = r % 2 ? 60 : 0, x = 600 + c * 120 - kay;
    s += `<rect x="${Math.max(x, 600)}" y="${230 + r * 70}" width="${r % 2 && c === 0 ? 60 : 120}" height="70" fill="${G.gri}" stroke="${G.mur}" stroke-width="7"/>`;
  }
  return s;
})();

export default {
  mimar: svg(`<g class="duvar">${tugla}${yazi(720, 710, 44, G.mur, "DUVAR")}</g>
<g class="mimar">${adam(190, 730, 1.4)}</g>
<g class="etiket"><path d="M300 150L360 90H640V230H360Z" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/>${yazi(500, 135, 34, G.ak, "EN PAHALI")}${yazi(500, 188, 34, G.ak, "MODEL")}</g>`),
  bolme: svg(`<g class="o">${kutu(80, 60, 800, 200, G.mur)}${yazi(480, 175, 62, G.ak, "OPUS · PLANLAR")}</g>
<g class="s">${kutu(80, 300, 800, 200, G.mavi)}${yazi(480, 415, 56, G.ak, "SONNET · KODU YAZAR")}</g>
<g class="h">${kutu(80, 540, 800, 200, G.gri)}${yazi(480, 655, 56, G.mur, "HAIKU · DOSYA ARAR")}</g>`),
  komut: svg(`<g class="pencere">${kutu(30, 70, 900, 600, G.mur)}<circle cx="90" cy="130" r="17" fill="${G.mavi}"/><circle cx="145" cy="130" r="17" fill="${G.ak}"/><circle cx="200" cy="130" r="17" fill="${G.gri}"/></g>
<g class="s1">${solYazi(70, 290, 50, G.ak, "/model opusplan")}</g>
<g class="s2">${solYazi(70, 420, 44, G.ak, "plan modu &gt; Opus")}</g>
<g class="s3">${solYazi(70, 540, 44, G.ak, "kodlama   &gt; Sonnet")}</g>`),
  ajan: svg(`<g class="d">${kutu(60, 70, 840, 560, G.ak)}${solYazi(110, 190, 44, G.mur, "---")}${solYazi(110, 290, 44, G.mur, "name: dosya-arayici")}${solYazi(110, 500, 44, G.mur, "---")}${yazi(480, 710, 40, G.mur, "alt ajan dosyası", 700)}</g>
<g class="m"><rect x="90" y="330" width="780" height="100" rx="14" fill="${G.mavi}"/>${solYazi(110, 400, 52, G.ak, "model: haiku")}</g>`),
};
