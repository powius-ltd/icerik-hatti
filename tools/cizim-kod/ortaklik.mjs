// %50 ortaklık videosunun SVG sahneleri: node ortaklik.mjs <koşu>/cizimler. Öğeler sınıf adıyla şablondan hareket ettirilir.
import { writeFileSync as w } from "node:fs";
import { G, adam } from "./gazete.mjs";

const svg = (ic) => `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="780" viewBox="0 0 960 780">${ic}</svg>`;
const yazi = (x, y, boy, renk, metin) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="${boy}" fill="${renk}">${metin}</text>`;
const yarim = (cx, cy, r, yon, c) => `<path d="M${cx} ${cy - r}A${r} ${r} 0 0 ${yon < 0 ? 0 : 1} ${cx} ${cy + r}Z" fill="${c}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/>`;
const kisiler = (xA, xB, y, o) => `<g class="k1">${adam(xA, y, o, { kolB: "M16 -196L56 -170L84 -200" })}</g><g class="k2">${adam(xB, y, o, { kolB: "M16 -196L56 -170L84 -200", yon: -1 })}</g>`;
const pasta = (ara) => svg(`${kisiler(110, 850, 690, 1.35)}
<g class="p1">${yarim(480 - ara, 300, 190, -1, G.mavi)}${yazi(480 - ara - 95, 322, 62, G.ak, "%50")}</g>
<g class="p2">${yarim(480 + ara, 300, 190, 1, G.gri)}${yazi(480 + ara + 95, 322, 62, G.mur, "%50")}</g>`);

const kart = (sinif, x, c, metin) => `<g class="${sinif}"><rect x="${x}" y="130" width="340" height="180" rx="28" fill="#fff" stroke="${c}" stroke-width="10"/>${yazi(x + 170, 245, 74, c, metin)}</g>`;
const kilit = svg(`<g class="karar"><rect x="240" y="0" width="480" height="96" rx="20" fill="${G.mur}"/>${yazi(480, 66, 52, G.ak, "BÜYÜK KARAR")}</g>${kart("evet", 50, G.mavi, "EVET")}${kart("hayir", 570, G.mur, "HAYIR")}
<path class="h1" pathLength="1" d="M220 310V420H400" fill="none" stroke="${G.mavi}" stroke-width="12"/><path class="h2" pathLength="1" d="M740 310V420H560" fill="none" stroke="${G.mur}" stroke-width="12"/>
<g class="kilit"><path d="M425 395V340A55 55 0 0 1 535 340V395" fill="none" stroke="${G.mur}" stroke-width="24"/><rect x="390" y="390" width="180" height="150" rx="22" fill="${G.mur}"/><circle cx="480" cy="450" r="22" fill="${G.ak}"/><rect x="470" y="452" width="20" height="50" rx="8" fill="${G.ak}"/></g>`);

const masa = svg(`${kisiler(150, 810, 660, 1.4)}
<rect x="240" y="470" width="480" height="26" rx="8" fill="${G.mur}"/><rect x="290" y="496" width="24" height="164" fill="${G.mur}"/><rect x="646" y="496" width="24" height="164" fill="${G.mur}"/>
<g class="kagit"><rect x="365" y="245" width="230" height="225" rx="12" fill="#fff" stroke="${G.mur}" stroke-width="7"/><rect x="400" y="295" width="160" height="16" rx="8" fill="${G.gri}"/><rect x="400" y="340" width="160" height="16" rx="8" fill="${G.gri}"/><rect x="400" y="385" width="100" height="16" rx="8" fill="${G.mavi}"/></g>`);

const k = process.argv[2];
w(`${k}/pasta.svg`, pasta(0));
w(`${k}/pasta2.svg`, pasta(55));
w(`${k}/kilit.svg`, kilit);
w(`${k}/masa.svg`, masa);
