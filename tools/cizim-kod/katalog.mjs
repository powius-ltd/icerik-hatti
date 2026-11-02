// Şablon kataloğu: node katalog.mjs <kök> → <kök>/k1..k6.html (1080x1920). Sabit: marka, başlık yeri, altyazı hapı, yazı tipleri. Değişen: zemin, kart, hareket.
import { writeFileSync as w } from "node:fs";
import { G } from "./gazete.mjs";

const Z = { krem: G.kagit, grid: "rgba(16,27,51,.09)", gridKoyu: "rgba(255,255,255,.08)", gridMavi: "rgba(255,255,255,.16)", kod: "#0B1426", yesil: "#35B779" };
const CSS = `@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@500;600;700;800&family=Instrument+Serif:ital@1&family=JetBrains+Mono:wght@500;700&display=swap');
*{box-sizing:border-box}body{margin:0;width:1080px;height:1920px;position:relative;overflow:hidden;font-family:Poppins,sans-serif;color:${G.mur}}
.izgara{position:absolute;inset:0;background-size:72px 72px}
.m{position:absolute;left:65px;top:150px;font-size:28px;font-weight:800;letter-spacing:6px}
.h{position:absolute;left:65px;right:65px;top:215px;font-size:88px;line-height:1.04;font-weight:800;letter-spacing:-2.5px}
.h i{font-family:'Instrument Serif',serif;font-weight:400;font-size:1.14em;letter-spacing:-1px;color:var(--vur)}
.no{display:inline-flex;width:92px;height:92px;border-radius:50%;background:var(--vur);color:#fff;align-items:center;justify-content:center;font-size:52px;font-style:normal;margin-right:18px;vertical-align:6px;letter-spacing:0}
.c{position:absolute;left:0;right:0;top:1290px;text-align:center}
.c span{display:inline-block;background:#fff;color:${G.mur};font-size:56px;font-weight:800;padding:12px 30px;border-radius:18px;box-shadow:0 8px 0 ${G.mur}}.c b{color:${G.mavi};font-weight:800}
.kart{position:absolute;background:#fff;border:5px solid ${G.mur};border-radius:30px;box-shadow:12px 12px 0 ${G.mur}}`;
const sayfa = (o) => `<!doctype html><html><head><meta charset="utf-8"><style>${CSS}${o.css || ""}</style></head><body style="background:${o.zemin};--vur:${o.vur || G.mavi};color:${o.yazi || G.mur}">
${o.izgara ? `<div class="izgara" style="background-image:linear-gradient(${o.izgara} 2px,transparent 2px),linear-gradient(90deg,${o.izgara} 2px,transparent 2px)"></div>` : ""}
<div class="m">◆ AISCALE</div><div class="h">${o.baslik}</div>${o.ic}<div class="c"><span>${o.alt}</span></div></body></html>`;

const fincan = (x, o, c, f, sec) => {
  const t = 620;
  return `<g transform="translate(${x} ${t}) scale(${o})"><path d="M-70 -150H70L52 0H-52Z" fill="${c}"/><path d="M12 -150H70L52 0H22Z" fill="${G.mur}" opacity=".2"/><rect x="-82" y="-176" width="164" height="30" rx="8" fill="${G.mur}"/></g>
<text x="${x}" y="${t + 72}" text-anchor="middle" font-family="Poppins" font-weight="800" font-size="${sec ? 72 : 54}" fill="${sec ? G.mavi : G.mur}">${f}</text>`;
};
const k1 = sayfa({
  zemin: Z.krem,
  baslik: "Üç boy görüyorsan <i>ortadaki</i> senin için",
  alt: "seçtiğini <b>sanıyorsun</b>",
  ic: `<svg style="position:absolute;left:60px;top:470px" width="960" height="780" viewBox="0 0 960 780"><rect x="50" y="622" width="860" height="14" fill="${G.mur}"/>
${fincan(190, 0.85, G.ak, "40₺")}${fincan(480, 1.25, G.mavi, "75₺", true)}${fincan(770, 1.6, G.gri, "80₺")}
<path d="M480 270V380" stroke="${G.mur}" stroke-width="12"/><path d="M450 350L480 392L510 350Z" fill="${G.mur}"/></svg>`,
});
const satir = (n, a, b, sec) => `<div class="s${sec ? " on" : ""}"><em>${n}</em><div><strong>${a}</strong><small>${b}</small></div></div>`;
const k2 = sayfa({
  zemin: G.mavi, izgara: Z.gridMavi, yazi: "#fff", vur: "#fff",
  baslik: "<em class='no' style='background:#fff;color:" + G.mavi + "'>3</em>cevap: <i>çok pahalı</i>",
  alt: "fiyatı <b>kırma</b>",
  css: `.s{display:flex;gap:28px;align-items:center;padding:30px 36px;border-bottom:4px solid ${G.gri}}.s:last-child{border:0}.s em{font-style:normal;font-size:76px;font-weight:800;color:${G.gri};width:70px}.s strong{display:block;font-size:46px;line-height:1.15}.s small{font-size:31px;font-weight:600;color:#59647A}.s.on em,.s.on strong{color:${G.mavi}}`,
  ic: `<div class="kart" style="left:65px;right:65px;top:520px;color:${G.mur}">${satir(1, "Neye göre pahalı?", "Karşılaştırmayı öğren")}${satir(2, "Sorunun bedeli ne?", "Fiyatı kayıpla ölç", true)}${satir(3, "Ne çıkarsak uyar?", "Fiyatı değil kapsamı indir")}</div>`,
});
const k3 = sayfa({
  zemin: Z.krem, izgara: Z.grid,
  baslik: "Claude'a <i>bunu</i> sor",
  alt: "<b>önce</b> plan yaptır",
  css: `.b{position:absolute;font-size:43px;line-height:1.28;font-weight:600;padding:32px 38px;border:5px solid ${G.mur};border-radius:34px}.b small{display:block;font-size:27px;font-weight:800;letter-spacing:2px;margin-bottom:10px;opacity:.65}`,
  ic: `<div class="b" style="left:65px;right:150px;top:470px;background:#fff;box-shadow:10px 10px 0 ${G.mur}"><small>SEN</small>Bu işi kodlama. Önce planı çıkar, sonra hangi modelin yapacağını yaz.</div>
<div class="b" style="left:150px;right:65px;top:840px;background:${G.mavi};color:#fff;box-shadow:10px 10px 0 ${G.mur}"><small>CLAUDE</small>Plan hazır: 4 adım. Üçünü küçük model yapabilir, kontrolü ben yaparım.</div>`,
});
const k4 = sayfa({
  zemin: G.mur, izgara: Z.gridKoyu, yazi: "#fff", vur: "#6DB2FF",
  baslik: "Yayından <i>önce</i> tek komut",
  alt: "eksikleri <b>listeler</b>",
  css: `.t{position:absolute;left:65px;right:65px;top:480px;background:${Z.kod};border:4px solid #6DB2FF;border-radius:26px;box-shadow:12px 12px 0 #000;overflow:hidden;font-family:'JetBrains Mono',monospace}.tb{height:64px;background:#1C2A47;display:flex;gap:14px;align-items:center;padding:0 26px}.tb u{width:20px;height:20px;border-radius:50%;background:#fff;opacity:.35}.tk{padding:34px;font-size:35px;line-height:1.55;color:#E7EEF9}.tk s{text-decoration:none;color:#6DB2FF}.tk q{quotes:none;color:${Z.yesil}}.tk b{color:#FFC857}`,
  ic: `<div class="t"><div class="tb"><u></u><u></u><u></u></div><div class="tk"><s>&gt;</s> claude "yayın öncesi kontrol et"<br><br><q>✓</q> Giriş güvenliği<br><q>✓</q> Yedekleme<br><b>!</b> Gizlilik metni eksik<br><b>!</b> Çerez izni eksik<br><span style="opacity:.55">█</span></div></div>`,
});
const dugum = (x, y, a, b, on) => `<g transform="translate(${x} ${y})"><rect x="-175" y="-68" width="350" height="136" rx="24" fill="#fff" stroke="${on ? G.mavi : G.mur}" stroke-width="${on ? 9 : 5}"/><text text-anchor="middle" y="-6" font-family="Poppins" font-weight="800" font-size="40" fill="${G.mur}">${a}</text><text text-anchor="middle" y="38" font-family="Poppins" font-weight="600" font-size="28" fill="#59647A">${b}</text></g>`;
const k5 = sayfa({
  zemin: "#E8EEF6", izgara: "rgba(47,134,232,.17)",
  baslik: "Pahalı model <i>yazmaz</i>",
  alt: "ucuz model <b>yazar</b>",
  ic: `<svg style="position:absolute;left:0;top:460px" width="1080" height="800" viewBox="0 0 1080 800"><path d="M540 150V330M540 330H250V530M540 330H830V530" fill="none" stroke="${Z.yesil}" stroke-width="10"/><path d="M250 600V700H830V600" fill="none" stroke="${G.gri}" stroke-width="8" stroke-dasharray="6 20" stroke-linecap="round"/>
<circle cx="540" cy="250" r="16" fill="${Z.yesil}"/><circle cx="250" cy="430" r="16" fill="${Z.yesil}"/><circle cx="830" cy="430" r="16" fill="${Z.yesil}"/>
${dugum(540, 90, "Büyük model", "Planlar", true)}${dugum(250, 590, "Orta model", "Kodu yazar")}${dugum(830, 590, "Küçük model", "Dosya arar")}</svg>`,
});
const k6 = sayfa({
  zemin: Z.krem,
  baslik: "Claude'u <i>canlı</i> gösteriyoruz",
  alt: "kayıt linki <b>DM'den</b>",
  css: `.d{position:absolute;left:125px;top:610px;width:830px;text-align:center;background:${G.mavi};color:#fff;font-size:118px;font-weight:800;letter-spacing:2px;padding:34px 0;border:6px solid ${G.mur};border-radius:30px;box-shadow:14px 14px 0 ${G.mur};transform:rotate(-3deg)}.u{position:absolute;left:0;right:0;top:545px;text-align:center;font-size:36px;font-weight:800;letter-spacing:10px}.y{position:absolute;left:65px;right:65px;top:900px;height:124px;background:#fff;border:5px solid ${G.mur};border-radius:62px;display:flex;align-items:center;gap:24px;padding:0 26px;font-size:42px;font-weight:600}.y em{width:76px;height:76px;border-radius:50%;background:${G.mur};color:#fff;display:flex;align-items:center;justify-content:center;font-style:normal;font-size:30px}`,
  ic: `<div class="u">YORUMLARA YAZ</div><div class="d">SEMİNER</div><div class="y"><em>SEN</em>SEMİNER<span style="color:${G.mavi}">|</span></div>`,
});
const k = process.argv[2];
[k1, k2, k3, k4, k5, k6].forEach((h, i) => w(`${k}/k${i + 1}.html`, h));
