// HyperFrames videosunun SVG sahneleri: node hyperframes.mjs <koşu>/cizimler. Öğeler sınıf adıyla şablondan hareket ettirilir.
import { writeFileSync as w } from "node:fs";
import { G } from "./gazete.mjs";

const svg = (ic) => `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="780" viewBox="0 0 960 780">${ic}</svg>`;
const yazi = (x, y, boy, renk, metin) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="${boy}" fill="${renk}">${metin}</text>`;
const kutu = (x, y, g, y2, c = "#fff") => `<rect x="${x}" y="${y}" width="${g}" height="${y2}" rx="26" fill="${c}" stroke="${G.mur}" stroke-width="8"/>`;
const serit = (x, y, g, c) => `<rect x="${x}" y="${y}" width="${g}" height="64" rx="12" fill="${c}" stroke="${G.mur}" stroke-width="6"/>`;

const kurgu = svg(`<g class="panel">${kutu(60, 120, 840, 480)}<rect x="100" y="165" width="760" height="20" rx="10" fill="${G.gri}"/>
${serit(100, 225, 300, G.mavi)}${serit(420, 225, 200, G.gri)}${serit(640, 225, 220, G.mavi)}
${serit(100, 320, 180, G.gri)}${serit(300, 320, 360, G.mavi)}${serit(680, 320, 180, G.gri)}
${serit(100, 415, 420, G.gri)}${serit(540, 415, 320, G.gri)}
<rect x="455" y="195" width="10" height="330" fill="${G.mur}"/></g>
<path class="x1" pathLength="1" d="M90 90L870 630" fill="none" stroke="${G.mur}" stroke-width="30" stroke-linecap="round"/>
<path class="x2" pathLength="1" d="M870 90L90 630" fill="none" stroke="${G.mur}" stroke-width="30" stroke-linecap="round"/>`);

const satir = (x, y, g, c) => `<rect x="${x}" y="${y}" width="${g}" height="20" rx="10" fill="${c}"/>`;
const donusum = svg(`<g class="kod">${kutu(30, 150, 380, 420)}${yazi(220, 240, 62, G.mavi, "HTML")}${satir(80, 300, 280, G.gri)}${satir(120, 350, 200, G.mavi)}${satir(120, 400, 240, G.gri)}${satir(80, 450, 150, G.mavi)}${satir(80, 500, 260, G.gri)}</g>
<path class="ok" pathLength="1" d="M425 360H525M490 320L530 360L490 400" fill="none" stroke="${G.mur}" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/>
<g class="video">${kutu(550, 150, 380, 420, G.mavi)}${yazi(740, 240, 62, G.ak, "MP4")}<circle cx="740" cy="390" r="95" fill="${G.ak}" stroke="${G.mur}" stroke-width="8"/><path d="M710 335L800 390L710 445Z" fill="${G.mavi}"/></g>`);

const balonSatir = (sinif, y, metin) => `<g class="${sinif}"><text x="100" y="${y}" font-family="Poppins" font-weight="700" font-size="54" fill="${G.mur}">${metin}</text></g>`;
const istem = svg(`<g class="balon">${kutu(50, 90, 860, 520)}${yazi(480, 180, 40, G.mavi, "CLAUDE CODE'A YAZ")}</g>
${balonSatir("s1", 290, "10 saniyelik ürün tanıtımı")}${balonSatir("s2", 400, "Başlık yavaşça belirsin")}${balonSatir("s3", 510, "Arkada hafif müzik çalsın")}`);

const k = process.argv[2];
w(`${k}/kurgu.svg`, kurgu);
w(`${k}/donusum.svg`, donusum);
w(`${k}/istem.svg`, istem);
