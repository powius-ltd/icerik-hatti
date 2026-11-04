// 3 Kasım Reels'lerinin SVG sahneleri: node dort-reels.mjs <ikea|airbnb|graphify> <koşu>/cizimler. Öğeler sınıf adıyla şablondan hareket ettirilir.
import { writeFileSync as w, existsSync } from "node:fs";
import { G, adam } from "./gazete.mjs";
import { svg, yazi, solYazi, kutu, cizgi, karton } from "./reels-yardimci.mjs";

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

const balon = (x, y, g, y2, s1, s2, renk = G.mur) => `${kutu(x, y, g, y2)}${s2 ? `${yazi(x + g / 2, y + y2 / 2 - 12, 58, renk, s1)}${yazi(x + g / 2, y + y2 / 2 + 62, 58, G.mavi, s2)}` : yazi(x + g / 2, y + y2 / 2 + 22, 62, renk, s1)}`;
const cokPahali = {
  itiraz: svg(`<g class="kisi">${adam(170, 730, 1.4)}</g><g class="balon">${balon(60, 70, 560, 170, "ÇOK PAHALI!")}</g>
<g class="etiket"><path d="M560 420L720 300H900V620H720Z" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/><circle cx="660" cy="460" r="22" fill="${G.ak}" stroke="${G.mur}" stroke-width="7"/>${yazi(790, 480, 88, G.ak, "₺")}</g>`),
  soru: svg(`<g class="balon">${balon(190, 60, 580, 190, "NEYE GÖRE?", null, G.mavi)}</g>
<g class="terazi"><path d="M480 300V680M300 680H660M180 390H780" stroke="${G.mur}" stroke-width="16" stroke-linecap="round"/>${kutu(90, 410, 240, 150, G.ak, 16)}${yazi(210, 505, 76, G.mur, "?")}${kutu(630, 410, 240, 150, G.mavi, 16)}${yazi(750, 508, 76, G.ak, "₺")}</g>`),
  kapsam: svg(`<g class="a">${kutu(50, 70, 380, 200, G.gri, 18)}${yazi(240, 150, 46, G.mur, "AYNI İŞ")}${yazi(240, 220, 46, G.mur, "DAHA UCUZ")}</g>
<g class="b">${kutu(530, 70, 380, 200, G.ak, 18)}${yazi(720, 150, 42, G.mavi, "FİYAT NEDEN")}${yazi(720, 220, 42, G.mavi, "O KADARDI?")}</g>
<g class="c">${kutu(130, 380, 700, 330, G.mavi, 22)}${yazi(480, 500, 62, G.ak, "DAHA AZ İŞ")}${yazi(480, 620, 62, G.ak, "DAHA AZ ÜCRET")}</g>`),
  gunluk: svg(`<g class="yil">${kutu(50, 90, 400, 300, G.gri, 18)}${yazi(250, 180, 44, G.mur, "YILDA")}${yazi(250, 300, 76, G.mur, "3.650 ₺")}</g>
<g class="gun">${kutu(510, 90, 400, 300, G.mavi, 18)}${yazi(710, 180, 44, G.ak, "GÜNDE")}${yazi(710, 300, 76, G.ak, "10 ₺")}</g>
<g class="not">${kutu(120, 490, 720, 170, G.mur, 20)}${yazi(480, 595, 54, G.ak, "TOPLAMI DA SÖYLE")}</g>`),
};

const kosan = (x, y, o, yon = 1) => adam(x, y, o, { kolA: "M-16 -196L-60 -160L-80 -110", kolB: "M16 -196L60 -170L84 -210", bacakA: "M-10 -110L-50 -70L-90 -40", bacakB: "M10 -110L40 -60L30 0", yon });
const rekabet = {
  yaris: svg(`<g class="k1">${kosan(210, 720, 1.25)}</g><g class="k2">${kosan(520, 720, 1.25)}</g>
<g class="bayrak"><path d="M820 730V170" stroke="${G.mur}" stroke-width="16" stroke-linecap="round"/><path d="M820 175L640 245L820 315Z" fill="${G.mavi}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/></g><path d="M40 736H920" stroke="${G.mur}" stroke-width="12" stroke-linecap="round"/>`),
  arkadas: svg(`<g class="kisi">${adam(190, 730, 1.35)}</g>
<g class="balon">${kutu(240, 70, 680, 300)}<path d="M340 362L290 450L450 362Z" fill="${G.ak}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/><rect x="330" y="345" width="125" height="30" fill="${G.ak}"/>${yazi(580, 195, 50, G.mur, "Staja giremediğine")}${yazi(580, 285, 50, G.mavi, "sevinmiyor musun?")}</g>`),
  pazar: svg(`<g class="kalabalik">${[70, 200, 330, 130, 270].map((x, i) => adam(x, i < 3 ? 400 : 700, 1.05)).join("")}${yazi(240, 760, 46, G.mur, "AYNI PAZAR")}</g>
<g class="tek">${kutu(540, 150, 370, 550, G.mavi, 24)}${adam(725, 560, 1.2)}${yazi(725, 640, 44, G.ak, "FARKLI İŞ")}</g>`),
};

const takimlar = { ikea, airbnb, graphify, "cok-pahali": cokPahali, rekabet };
const [ad, k] = process.argv.slice(2);
// Yeni konu kendi dosyasında: reels-<id>.mjs, varsayılan dışa aktarım { dosyaAdı: svg }.
const ek = new URL(`./reels-${ad}.mjs`, import.meta.url);
if (!takimlar[ad] && ad && existsSync(ek)) takimlar[ad] = (await import(ek)).default;
if (!takimlar[ad] || !k) throw new Error(`Kullanım: node dort-reels.mjs <${Object.keys(takimlar).join("|")}> <çizim klasörü>`);
for (const [dosyaAdi, icerik] of Object.entries(takimlar[ad])) w(`${k}/${dosyaAdi}.svg`, icerik);
