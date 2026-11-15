// "awesome-ai-motion: Claude'a hareket tarifi" araç Reels'inin SVG sahneleri: node dort-reels.mjs animasyon-teknik <koşu>/cizimler.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu } from "./reels-yardimci.mjs";

const ok = (x1, y, x2) => `<path d="M${x1} ${y}H${x2}" stroke="${G.mur}" stroke-width="16" stroke-linecap="round"/><path d="M${x2 - 30} ${y - 35}L${x2} ${y}L${x2 - 30} ${y + 35}" fill="none" stroke="${G.mur}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>`;
const satir = (x, y, g, renk = G.gri) => `<rect x="${x}" y="${y}" width="${g}" height="22" rx="11" fill="${renk}"/>`;
const top = (cx, cy, r, renk = G.mavi) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${renk}" stroke="${G.mur}" stroke-width="8"/>`;

export default {
  // Sol: tarifsiz "hareketlendir" isteği (gri, düz kutu); sağ: adı konmuş hareket (mavi, eğri yol).
  hareket: svg(`<g class="sozcuk">${kutu(40, 130, 360, 450, G.ak, 22)}${satir(80, 230, 280)}${satir(80, 290, 200)}${top(220, 450, 46, G.gri)}${yazi(220, 680, 40, G.mur, "HAREKETLENDİR")}</g>
${ok(430, 355, 510)}
<g class="hareket">${kutu(540, 130, 380, 450, G.ak, 22)}<path d="M580 500C640 200 780 200 880 500" fill="none" stroke="${G.mur}" stroke-width="10" stroke-dasharray="4 22" stroke-linecap="round"/>${top(600, 470, 30)}${top(730, 290, 34)}${top(860, 470, 30)}${yazi(730, 680, 40, G.mur, "HAREKET")}</g>`),
  // Efekt kartı: tanım, ayar çubukları, hazır istem.
  kart: svg(`<g class="kart">${kutu(40, 90, 880, 140, G.ak, 22)}${satir(80, 125, 420, G.mavi)}${satir(80, 175, 320)}${yazi(790, 190, 40, G.mur, "TANIM")}
${kutu(40, 260, 880, 190, G.ak, 22)}${satir(80, 305, 520)}<circle cx="560" cy="316" r="16" fill="${G.mavi}" stroke="${G.mur}" stroke-width="6"/>${satir(80, 365, 520)}<circle cx="400" cy="376" r="16" fill="${G.mavi}" stroke="${G.mur}" stroke-width="6"/>${yazi(790, 400, 40, G.mur, "AYAR")}</g>
<g class="istem">${kutu(40, 480, 880, 190, G.ak, 22)}<rect x="80" y="520" width="800" height="110" rx="14" fill="${G.mur}"/><rect x="110" y="552" width="400" height="18" rx="9" fill="${G.ak}"/><rect x="110" y="590" width="260" height="18" rx="9" fill="${G.mavi}"/>${yazi(480, 730, 40, G.mur, "HAZIR İSTEM")}</g>`),
  // Üç teknik: yumuşak hızlanma, ezilip uzama, kamera uçuşu.
  teknik: svg(`<g class="yumusak"><path d="M60 560C150 560 190 200 270 200" fill="none" stroke="${G.mur}" stroke-width="12" stroke-linecap="round"/>${top(60, 560, 26)}${top(270, 200, 26)}${yazi(165, 680, 32, G.mur, "YUMUŞAK")}</g>
<g class="ezil"><ellipse cx="480" cy="540" rx="90" ry="50" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8"/><ellipse cx="480" cy="300" rx="44" ry="90" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8"/><path d="M480 420V470" stroke="${G.mur}" stroke-width="10" stroke-dasharray="4 18" stroke-linecap="round"/>${yazi(480, 680, 32, G.mur, "EZİLİP UZAMA")}</g>
<g class="kamera">${kutu(690, 160, 230, 400, G.ak, 22)}<rect x="725" y="200" width="160" height="110" rx="10" fill="${G.mur}"/><rect x="745" y="225" width="120" height="60" rx="8" fill="${G.mavi}"/><rect x="765" y="245" width="80" height="22" rx="6" fill="${G.ak}"/>${satir(725, 350, 160)}${satir(725, 400, 110)}${yazi(805, 680, 32, G.mur, "KAMERA")}</g>`),
};
