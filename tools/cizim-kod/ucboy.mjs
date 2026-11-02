// Üç boy videosunun SVG sahneleri: node ucboy.mjs <koşu>/cizimler. Öğeler sınıf adıyla şablondan hareket ettirilir.
import { writeFileSync as w } from "node:fs";
import { G, adam } from "./gazete.mjs";

const svg = (ic) => `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="780" viewBox="0 0 960 780">${ic}</svg>`;
const yazi = (x, y, boy, renk, metin, sinif = "") => `<text class="${sinif}" x="${x}" y="${y}" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="${boy}" fill="${renk}">${metin}</text>`;
const fincan = (x, o, c, sinif) => `<g class="${sinif}"><g transform="translate(${x} 560) scale(${o})"><path d="M-70 -150H70L52 0H-52Z" fill="${c}"/><path d="M12 -150H70L52 0H22Z" fill="${G.mur}" opacity=".2"/><rect x="-82" y="-176" width="164" height="30" rx="8" fill="${G.mur}"/></g></g>`;

const boylar = svg(`<rect x="50" y="560" width="860" height="14" fill="${G.mur}"/>
${fincan(190, 0.85, G.ak, "b1")}${fincan(480, 1.25, G.mavi, "b2")}${fincan(770, 1.6, G.gri, "b3")}
${yazi(190, 640, 58, G.mur, "40₺", "f1")}${yazi(480, 640, 58, G.mur, "75₺", "f2")}${yazi(770, 646, 72, G.mavi, "80₺", "f3")}
<g class="ok"><path d="M480 210V320" stroke="${G.mur}" stroke-width="12"/><path d="M450 290L480 332L510 290Z" fill="${G.mur}"/></g>
<g class="arti"><rect x="600" y="60" width="210" height="96" rx="20" fill="${G.mur}"/>${yazi(705, 128, 60, G.ak, "+5₺")}</g>
<g class="kisi">${adam(625, 750, 0.62, { kolA: "M-16 -196L-40 -150L-20 -110", kolB: "M16 -196L60 -180L92 -226", bacakA: "M-10 -110L-34 -56L-54 -2", bacakB: "M10 -110L30 -56L48 0" })}</g>`);

const akis = svg(`<rect x="60" y="250" width="300" height="240" rx="28" fill="#fff" stroke="${G.mur}" stroke-width="6"/>${yazi(210, 345, 44, G.mur, "Orta")}${yazi(210, 435, 84, G.mur, "75₺")}
<g class="kart2"><rect x="600" y="250" width="300" height="240" rx="28" fill="#fff" stroke="${G.mavi}" stroke-width="11"/>${yazi(750, 345, 44, G.mur, "Büyük")}${yazi(750, 435, 84, G.mavi, "80₺")}</g>
<path class="hat" pathLength="1" d="M360 370H600" fill="none" stroke="${G.mavi}" stroke-width="12"/>
<g class="etiket"><rect x="325" y="540" width="310" height="96" rx="20" fill="${G.mur}"/>${yazi(480, 606, 54, G.ak, "yalnız +5₺")}</g>`);

const liste = svg(`<g class="kagit"><rect x="340" y="60" width="520" height="560" rx="16" fill="#fff" stroke="${G.mur}" stroke-width="7"/>${yazi(600, 145, 46, G.mur, "Fiyat listen")}
<rect x="390" y="195" width="420" height="92" rx="12" fill="${G.gri}"/>${yazi(600, 256, 44, G.mur, "Küçük")}
<rect class="orta" x="390" y="320" width="420" height="92" rx="12" fill="${G.mavi}"/>${yazi(600, 381, 44, G.ak, "Orta ?")}
<rect x="390" y="445" width="420" height="92" rx="12" fill="${G.gri}"/>${yazi(600, 506, 44, G.mur, "Büyük")}</g>
<g class="kisi">${adam(190, 720, 1.5, { kolA: "M-16 -196L-40 -150L-20 -112", kolB: "M16 -196L56 -190L84 -236" })}</g>
<g class="lup"><circle cx="340" cy="360" r="62" fill="${G.kagit}" fill-opacity=".35" stroke="${G.mur}" stroke-width="16"/><path d="M296 408L256 452" stroke="${G.mur}" stroke-width="20" stroke-linecap="round"/></g>`);

const k = process.argv[2];
w(`${k}/boylar.svg`, boylar);
w(`${k}/akis.svg`, akis);
w(`${k}/liste.svg`, liste);
