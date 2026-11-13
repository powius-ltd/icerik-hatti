// "Claude çalışmıyor mu?" Reels'inin SVG sahneleri: node dort-reels.mjs claude-status <koşu>/cizimler.
import { G } from "./gazete.mjs";
import { svg, yazi, kutu } from "./reels-yardimci.mjs";

const sat = (x, y, g, c) => `<rect x="${x}" y="${y}" width="${g}" height="44" rx="12" fill="${G.ak}" stroke="${G.mur}" stroke-width="6"/><circle cx="${x + 30}" cy="${y + 22}" r="11" fill="${c}"/><rect x="${x + 60}" y="${y + 14}" width="${g - 100}" height="16" rx="8" fill="${G.gri}"/>`;

export default {
  durum: svg(`<g class="kesinti">${kutu(40, 90, 400, 570, G.gri, 22)}${yazi(240, 170, 44, G.mur, "KESİNTİ?")}<path d="M240 230L330 400H150Z" fill="${G.ak}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/><rect x="230" y="285" width="20" height="60" rx="8" fill="${G.mur}"/><circle cx="240" cy="370" r="10" fill="${G.mur}"/>${yazi(240, 740, 40, G.mur, "SAYFAYA BAK")}</g>
<g class="sende">${kutu(520, 90, 400, 570, G.ak, 22)}${yazi(720, 170, 44, G.mur, "SENDE?")}<rect x="590" y="240" width="260" height="170" rx="16" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8"/><rect x="660" y="430" width="120" height="30" fill="${G.mur}"/><rect x="620" y="460" width="200" height="16" rx="8" fill="${G.mur}"/>${yazi(720, 740, 40, G.mur, "SONRA KENDİNE")}</g>`),
  bilesen: svg(`<g class="liste">${kutu(40, 90, 880, 570, G.ak, 22)}${yazi(480, 165, 44, G.mur, "status.claude.com")}${sat(80, 205, 380, G.mavi)}${sat(80, 285, 380, G.mavi)}${sat(80, 365, 380, G.mavi)}${sat(80, 445, 380, G.mavi)}</g>
<g class="ayri">${yazi(700, 245, 36, G.mur, "claude.ai")}${yazi(700, 325, 36, G.mur, "API")}${yazi(700, 405, 36, G.mur, "Claude Code")}${yazi(700, 485, 36, G.mur, "Console")}${yazi(480, 740, 40, G.mur, "AYRI AYRI LİSTELENİR")}</g>`),
};
