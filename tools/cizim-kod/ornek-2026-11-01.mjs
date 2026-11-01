import { writeFileSync as w } from "node:fs"; import { R,sahne,isik,yildiz,zerre,kafa } from "./kit.mjs";
const D=process.argv[2];
// Kitap s1
const kart=(x,y,a,c)=>`<g transform="translate(${x} ${y}) rotate(${a})" filter="url(#parlak)"><rect x="-58" y="-80" width="116" height="160" rx="16" fill="#101B44" stroke="${c}" stroke-width="7"/><circle cy="-18" r="24" fill="${c}"/><rect x="-34" y="28" width="68" height="10" rx="5" fill="${c}"/></g>`;
const blok=(x,y,o,c)=>`<g transform="translate(${x} ${y})"><rect width="${o}" height="${o}" fill="${c}"/><rect width="${o}" height="${o*.3}" fill="${R.yesil}"/></g>`;
const kitap=sahne(`
<g filter="url(#b8)" opacity=".75"><rect x="40" y="520" width="340" height="16" fill="#28407C"/><rect x="70" y="440" width="34" height="80" fill="#3C5AA8"/><rect x="110" y="456" width="30" height="64" fill="#8B4F6E"/><rect x="146" y="430" width="40" height="90" fill="#2F86E8"/><rect x="760" y="360" width="280" height="460" rx="10" fill="#101F4E"/><path d="M900 360V820M760 590H1040" stroke="#22397A" stroke-width="10"/></g>
${isik(250,840,470)}${isik(720,860,430,"maviIsik")}
<path d="M185 650L40 1180H560L265 650Z" fill="url(#koni)" opacity=".7"/>
<g transform="translate(205 620) rotate(25)"><path d="M-80 40Q0 -90 80 40Z" fill="${R.altin}"/><ellipse cy="40" rx="80" ry="18" fill="#FFF3C4" filter="url(#parlak)"/></g><path d="M140 560Q60 500 30 640" stroke="${R.griA}" stroke-width="14" fill="none"/>
<rect x="-20" y="1110" width="1120" height="220" fill="#5C351C"/><rect x="-20" y="1110" width="1120" height="26" fill="#9A6236"/>
<path d="M140 1110Q130 960 300 930Q480 960 560 1110Z" fill="#3D5BA8"/><path d="M180 1020Q300 990 470 1030M160 1070Q300 1040 520 1080" stroke="#F2C58A" stroke-width="20" fill="none" opacity=".75"/>
<g transform="rotate(-11 330 860)">${kafa(330,860,1.28,{ifade:"sikkin",bak:18})}</g>
<path d="M560 1124L800 1090L1030 1124L1000 1160L800 1130L590 1160Z" fill="#FFF3DC"/><path d="M800 1090V1130" stroke="#C9A97A" stroke-width="5"/><path d="M590 1160L800 1130L1000 1160V1176L800 1146L590 1176Z" fill="#23408F"/>
${isik(800,1040,240,"maviIsik")}
${blok(650,1020,62,"#8B4F9E")}${blok(712,1058,50,"#8B4F9E")}${blok(860,1040,56,"#8B4F9E")}
<rect x="928" y="980" width="20" height="96" fill="#6B3F1E"/><circle cx="938" cy="960" r="50" fill="${R.yesil}" filter="url(#parlak)"/>
<g filter="url(#parlak)"><rect x="704" y="966" width="30" height="42" rx="6" fill="${R.pembe}"/><circle cx="719" cy="952" r="16" fill="${R.ten}"/></g>
<g fill="none" filter="url(#parlak)" stroke-width="10"><ellipse cx="800" cy="850" rx="130" ry="34" stroke="${R.camgobegi}"/><ellipse cx="800" cy="780" rx="100" ry="28" stroke="${R.pembe}"/><ellipse cx="800" cy="720" rx="70" ry="20" stroke="${R.altin}"/></g>
${kart(620,620,-16,R.camgobegi)}${kart(960,640,16,R.pembe)}${kart(800,500,4,R.altin)}
${yildiz(660,800,30)}${yildiz(960,830,24,R.camgobegi)}${yildiz(880,420,26)}${yildiz(650,450,20,R.pembe)}
${zerre(60,560,380,480,720,[R.camgobegi,R.altin,R.pembe])}`);
// DOMS s1
const kalem=(x,y,en,boy,gov,kes=R.griA,uc="#1A1020",kr=false)=>`<g transform="translate(${x} ${y})"><path d="M${-en/2} 0L0 ${-en*1.2}L${en/2} 0Z" fill="#E6C49A"/><path d="M${-en*.14} ${-en*.85}L0 ${-en*1.2}L${en*.14} ${-en*.85}Z" fill="${uc}"/><rect x="${-en/2}" width="${en}" height="${boy}" fill="${gov}"/><rect x="${-en/6}" width="${en/3}" height="${boy}" fill="${kes}" opacity=".85"/>${kr?"":`<rect x="${-en/2}" y="${boy}" width="${en}" height="${en*.3}" fill="${kes}"/>`}</g>`;
const goz=(x,y,o)=>`<ellipse cx="${x}" cy="${y}" rx="${o}" ry="${o*.62}" fill="#FFF3C4" filter="url(#parlak)"/><circle cx="${x}" cy="${y+3}" r="${o*.36}" fill="#1A1020"/>`;
const doms=sahne(`
<path d="M540 300L20 1500H1060Z" fill="url(#koni)" opacity=".45"/>${isik(540,1120,520)}
<g filter="url(#b8)" opacity=".55">${kalem(90,520,130,750,"#27324E")}${kalem(990,540,130,730,"#27324E")}</g>
${kalem(255,330,270,945,"#2C3652","#141B30")}${kalem(825,330,270,945,"#2C3652","#141B30")}
${goz(205,620,50)}${goz(305,620,50)}${goz(775,620,50)}${goz(875,620,50)}
<path d="M155 560L250 600M355 560L260 600M725 600L820 560M925 600L830 560" stroke="#0A0F20" stroke-width="20" stroke-linecap="round"/>
<path d="M175 760Q255 700 335 760M745 760Q825 700 905 760" stroke="#0A0F20" stroke-width="16" fill="none" stroke-linecap="round"/>
<rect x="-20" y="1270" width="1120" height="200" fill="#111A38"/><ellipse cx="540" cy="1272" rx="360" ry="34" fill="${R.sicak}" opacity=".55" filter="url(#b30)"/>
${isik(540,1040,300,"maviIsik")}
<g filter="url(#parlak)">${kalem(540,900,120,370,R.pembe,R.altin)}</g>
<rect x="480" y="1040" width="40" height="16" fill="#fff" opacity=".0"/>
${goz(510,1000,22)}${goz(570,1000,22)}
<path d="M484 968L526 982M596 968L554 982" stroke="#1A1020" stroke-width="9" stroke-linecap="round"/><path d="M515 1050Q540 1072 565 1050" stroke="#1A1020" stroke-width="8" fill="none" stroke-linecap="round"/>
<path d="M480 1090L400 1020M600 1090L690 1010" stroke="${R.pembe}" stroke-width="20" stroke-linecap="round"/>
${yildiz(390,1000,24)}${yildiz(705,990,26,R.camgobegi)}${zerre(70,250,780,580,500,[R.altin,R.pembe,R.camgobegi])}`);
// Jack Ma s4: kurucu ve insan ağı
const sil=(x,y,o,c=R.sicak)=>`<g transform="translate(${x} ${y}) scale(${o})" filter="url(#parlak)"><circle r="44" cy="-80" fill="${c}"/><path d="M-70 60Q-70 -28 0 -28Q70 -28 70 60Z" fill="${c}"/></g>`;
const noktalar=[[140,610,1],[320,500,.95],[760,500,.95],[940,620,1],[110,860,.9],[970,870,.9],[240,1100,.85],[840,1100,.85]];
const jm=sahne(`
${isik(540,850,560)}
<g stroke="${R.altin}" stroke-width="5" opacity=".9" filter="url(#parlak)" fill="none">${noktalar.map(([x,y])=>`<path d="M540 760Q${(x+540)/2} ${(y+760)/2-50} ${x} ${y}"/>`).join("")}</g>
${noktalar.map(([x,y,o],i)=>sil(x,y,o,[R.sicak,R.camgobegi,R.pembe,R.altin][i%4])).join("")}
<path d="M390 1240Q390 990 540 960Q690 990 690 1240Z" fill="#26324F"/><path d="M510 965L540 1070L570 965Z" fill="#fff"/><path d="M528 985L540 1060L552 985Z" fill="${R.mavi}"/>
<path d="M410 1040Q340 960 330 870M670 1040Q740 960 750 870" stroke="#26324F" stroke-width="44" fill="none" stroke-linecap="round"/><circle cx="330" cy="860" r="30" fill="url(#ten)"/><circle cx="750" cy="860" r="30" fill="url(#ten)"/>
${kafa(540,790,1.3,{ifade:"neseli",sac:"#1A1420",kulak:1.5})}
<rect x="-20" y="1240" width="1120" height="260" fill="#0A1228"/>${zerre(60,60,430,960,780,[R.altin,R.camgobegi])}`);
for (const [a,h] of [["kitap",kitap],["doms",doms],["jackma",jm]]) w(`${D}/${a}.html`,h);
