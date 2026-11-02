// 3 Kasım Reels'lerinin SVG sahneleri: node dort-reels.mjs <ikea|airbnb|graphify> <koşu>/cizimler. Öğeler sınıf adıyla şablondan hareket ettirilir.
import { writeFileSync as w } from "node:fs";
import { G, adam } from "./gazete.mjs";

const svg = (ic) => `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="780" viewBox="0 0 960 780">${ic}</svg>`;
const yazi = (x, y, boy, renk, metin, agirlik = 800) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Poppins" font-weight="${agirlik}" font-size="${boy}" fill="${renk}">${metin}</text>`;
const solYazi = (x, y, boy, renk, metin) => `<text x="${x}" y="${y}" font-family="JetBrainsMono" font-weight="700" font-size="${boy}" fill="${renk}">${metin}</text>`;
const kutu = (x, y, g, y2, c = G.ak, r = 26) => `<rect x="${x}" y="${y}" width="${g}" height="${y2}" rx="${r}" fill="${c}" stroke="${G.mur}" stroke-width="8"/>`;
const cizgi = (sinif, d, c = G.mur, k = 16) => `<path class="${sinif}" pathLength="1" d="${d}" fill="none" stroke="${c}" stroke-width="${k}" stroke-linecap="round" stroke-linejoin="round"/>`;

// Eşit boylu karton kutu: ön yüz + kapak; `kapali` değilse kapaklar açık.
const karton = (x, y, g, y2, c = G.ak, kapali = true) => `<path d="M${x} ${y}L${x + 70} ${y - 60}H${x + g + 70}V${y + y2 - 60}L${x + g} ${y + y2}Z" fill="${G.gri}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/>${kutu(x, y, g, y2, c, 8)}${kapali ? "" : `<path d="M${x} ${y}L${x - 50} ${y - 80}M${x + g} ${y}L${x + g + 50} ${y - 80}" stroke="${G.mur}" stroke-width="14" stroke-linecap="round"/>`}`;

const ikea = {
  montaj: svg(`<g class="kutu">${karton(300, 330, 330, 300, G.ak, false)}${yazi(465, 465, 58, G.mavi, "KENDİN")}${yazi(465, 535, 58, G.mavi, "KUR")}</g>
<g class="kisi">${adam(150, 710, 1.45, { kolB: "M16 -196L70 -160L120 -180" })}</g>
<g class="kalp"><path d="M720 170C720 110 800 100 820 160C840 100 920 110 920 170C920 240 840 280 820 310C800 280 720 240 720 170Z" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/></g>`),
  deney: svg(`<g class="k1">${karton(60, 300, 300, 270)}${yazi(210, 425, 50, G.mavi, "KENDİ")}${yazi(210, 490, 50, G.mavi, "KURDU")}</g>
<g class="k2">${karton(540, 300, 300, 270, G.gri)}${yazi(690, 455, 50, G.mur, "HAZIR")}</g>
<g class="ayni">${kutu(280, 630, 400, 110, G.mur, 20)}${yazi(480, 705, 54, G.ak, "AYNI KUTU")}</g>`),
  ode: svg(`<g class="c1"><rect x="150" y="330" width="240" height="340" fill="${G.gri}" stroke="${G.mur}" stroke-width="8"/>${yazi(270, 730, 44, G.mur, "HAZIR KUTU")}</g>
<g class="c2"><rect x="570" y="120" width="240" height="550" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8"/>${yazi(690, 730, 44, G.mur, "KENDİ KURDU")}</g>
<g class="fark">${yazi(690, 330, 70, G.ak, "+%63")}</g>`),
};

const gevrek = (x, y, c, u1, u2, ty) => `${kutu(x, y, 300, 460, c, 10)}${yazi(x + 150, y + 110, 44, ty, u1)}${yazi(x + 150, y + 175, 44, ty, u2)}<circle cx="${x + 150}" cy="${y + 310}" r="88" fill="${G.ak}" stroke="${G.mur}" stroke-width="8"/>${[[-35, -20], [30, -35], [0, 25], [-40, 40], [42, 30]].map(([a, b]) => `<circle cx="${x + 150 + a}" cy="${y + 310 + b}" r="17" fill="none" stroke="${G.koyu}" stroke-width="9"/>`).join("")}`;
const airbnb = {
  kutu: svg(`<g class="k">${gevrek(330, 130, G.mavi, "BİR KUTU", "GEVREK", G.ak)}</g><g class="kisi">${adam(150, 710, 1.4, { kolB: "M16 -196L70 -170L110 -210" })}</g><g class="ev"><path d="M720 400L810 310L900 400V590H720Z" fill="${G.ak}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/><rect x="785" y="490" width="50" height="100" fill="${G.mur}"/></g>`),
  secim: svg(`<g class="k1">${gevrek(70, 150, G.mavi, "OBAMA", "O'S", G.ak)}</g><g class="k2">${gevrek(590, 150, G.ak, "CAP'N", "McCAIN'S", G.mur)}</g><g class="ok">${yazi(480, 700, 58, G.mur, "SEÇİM ÖZEL BASKISI")}</g>`),
  graham: svg(`<g class="balon">${kutu(120, 80, 720, 320)}<path d="M300 395L250 500L410 395Z" fill="${G.ak}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/><rect x="290" y="375" width="125" height="30" fill="${G.ak}"/>${yazi(480, 215, 66, G.mur, "Siz hamamböceği")}${yazi(480, 310, 66, G.mavi, "gibisiniz.")}</g>
<g class="kisi">${adam(220, 740, 1.05)}</g><g class="etiket">${yazi(650, 610, 44, G.mur, "aktarılan söz")}</g>`),
};

const dosya = (x, y, sinif) => `<g class="${sinif}"><path d="M${x} ${y}h90l40 40v130h-130Z" fill="${G.ak}" stroke="${G.mur}" stroke-width="7" stroke-linejoin="round"/><rect x="${x + 22}" y="${y + 70}" width="86" height="12" rx="6" fill="${G.gri}"/><rect x="${x + 22}" y="${y + 105}" width="62" height="12" rx="6" fill="${G.mavi}"/></g>`;
const dugum = (x, y, r, c = G.mavi) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}" stroke="${G.mur}" stroke-width="7"/>`;
const harita = `<path d="M690 190L560 310M690 190L820 300M560 310L680 440M820 300L680 440M680 440L560 560M680 440L830 560" stroke="${G.mur}" stroke-width="9" fill="none"/>${dugum(690, 190, 44)}${dugum(560, 310, 36, G.ak)}${dugum(820, 300, 36, G.ak)}${dugum(680, 440, 50)}${dugum(560, 560, 34, G.ak)}${dugum(830, 560, 34, G.ak)}`;
const graphify = {
  dongu: svg(`${dosya(130, 110, "d1")}${dosya(415, 110, "d2")}${dosya(700, 110, "d3")}
${cizgi("ok", "M770 340C770 600 190 600 190 370M145 425L190 360L240 420", G.mavi, 22)}
<g class="sayac">${kutu(130, 600, 700, 130, G.mur, 22)}${yazi(480, 685, 56, G.ak, "HER OTURUM BAŞTAN")}</g>`),
  harita: svg(`<g class="yigin">${dosya(50, 150, "a1")}${dosya(90, 280, "a2")}${dosya(40, 420, "a3")}</g>${cizgi("ok", "M265 370H440M395 320L450 370L395 420")}<g class="graf">${harita}</g>`),
  terminal: svg(`<g class="pencere">${kutu(30, 70, 900, 600, G.mur)}<circle cx="90" cy="130" r="17" fill="${G.mavi}"/><circle cx="145" cy="130" r="17" fill="${G.ak}"/><circle cx="200" cy="130" r="17" fill="${G.gri}"/></g>
<g class="s1">${solYazi(70, 270, 46, G.ak, "uv tool install graphifyy")}</g><g class="s2">${solYazi(70, 400, 46, G.ak, "graphify install")}</g><g class="s3">${solYazi(70, 530, 46, G.ak, "/graphify .")}${yazi(760, 530, 34, G.gri, "Claude Code'da", 700)}</g>`),
};

const takimlar = { ikea, airbnb, graphify };
const [ad, k] = process.argv.slice(2);
if (!takimlar[ad] || !k) throw new Error("Kullanım: node dort-reels.mjs <ikea|airbnb|graphify> <çizim klasörü>");
for (const [dosyaAdi, icerik] of Object.entries(takimlar[ad])) w(`${k}/${dosyaAdi}.svg`, icerik);
