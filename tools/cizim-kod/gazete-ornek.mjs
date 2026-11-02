// Şablon denemesi: node gazete-ornek.mjs <kök> → <kök>/{a,b}.html (kare çizim) ve {a,b}-kare.html (tam Reels karesi).
import { writeFileSync as w } from "node:fs";
import { G, tuval, adam, levha, megafon } from "./gazete.mjs";
const a = tuval(`
<path d="M70 690V330L120 300V240H150V284L190 262V215H218V246L290 210V690Z" fill="${G.mur}"/>
<path d="M90 690V400L420 320L800 420V690Z" fill="${G.mavi}"/><path d="M420 320L800 420V690H560Z" fill="${G.koyu}"/>
${levha(230, 190, 230, 150, -11)}${levha(450, 110, 240, 165, 4, 225)}${levha(660, 215, 210, 135, 13)}
<path d="M430 322L392 410L440 470L396 560L450 620L420 690H480L500 620L456 560L498 470L450 408Z" fill="${G.kagit}"/>
<path d="M392 410L330 455M396 560L320 600M498 470L575 520" stroke="${G.mur}" stroke-width="7" fill="none"/>
${adam(610, 760, 1.05, { kolA: "M-16 -196L-24 -150L-34 -190", kolB: "M16 -196L-14 -170L-32 -196", bacakA: "M-10 -110L-30 -60L-56 -4", bacakB: "M10 -110L34 -56L46 0" })}`);
const m = [[90, 170, -160], [90, 340, 180], [100, 510, 160], [230, 90, -130], [240, 640, 130], [770, 170, -20], [770, 340, 0], [760, 510, 20], [630, 90, -50], [620, 640, 50]];
const b = tuval(`${m.map(([x, y, r], i) => megafon(x, y, 1.1, r, i % 3 === 1 ? G.koyu : G.mavi)).join("")}
${adam(430, 760, 1.25, { kolA: "M-16 -196L-40 -150L-20 -120", kolB: "M16 -196L52 -190L62 -240" })}
<circle cx="520" cy="490" r="36" fill="${G.kagit}" stroke="${G.mur}" stroke-width="11"/><path d="M500 516L478 546" stroke="${G.mur}" stroke-width="13" stroke-linecap="round"/>`);
const kare = (svg, baslik, alt, vur) => `<!doctype html><html><head><style>@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&display=swap');body{margin:0;width:1080px;height:1920px;background:${G.kagit};font-family:Poppins,sans-serif;position:relative;overflow:hidden}.m{position:absolute;left:65px;top:150px;font-size:30px;font-weight:800;letter-spacing:6px;color:${G.mur}}.h{position:absolute;left:65px;right:65px;top:262px;font-size:92px;line-height:1.05;font-weight:800;letter-spacing:-2px;color:${G.mur}}.h span{color:${G.mavi}}.g{position:absolute;left:110px;top:400px}.c{position:absolute;left:0;right:0;top:1330px;text-align:center;font-size:60px;font-weight:800;color:${G.mur}}.c span{color:#8C8A84}</style></head><body><div class="m">◆ AISCALE</div><div class="h">${baslik}</div><div class="g">${svg}</div><div class="c">${alt} <span>${vur}</span></div></body></html>`;
const k = process.argv[2];
w(`${k}/a.html`, a); w(`${k}/b.html`, b);
w(`${k}/a-kare.html`, kare(a, "<span>3</span> reklam başlığı", "üç", "reklam başlığı"));
w(`${k}/b-kare.html`, kare(b, "Tek soru", "kimsenin", "söylemediği ne?"));
