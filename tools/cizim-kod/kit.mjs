// Kodla çizim takımı: sinematik sahne iskeleti ve karikatür karakter (SVG).
export const R = { lacivert:"#0B1633", gece:"#050A1C", sicak:"#FFB45C", altin:"#FFD27A", mavi:"#2F86E8", camgobegi:"#4DE3E0", pembe:"#FF5FA2", yesil:"#6BE675", ten:"#F2B98F", tenG:"#C98658", sac:"#5A3418", beyaz:"#FFF6E6", gri:"#3A4560", griA:"#5C6885" };
export const defs = `<defs>
<radialGradient id="zemin" cx="50%" cy="46%" r="75%"><stop offset="0" stop-color="#1C2C5E"/><stop offset=".55" stop-color="${R.lacivert}"/><stop offset="1" stop-color="${R.gece}"/></radialGradient>
<radialGradient id="ten" cx="38%" cy="32%" r="80%"><stop offset="0" stop-color="#FFDCB8"/><stop offset=".6" stop-color="${R.ten}"/><stop offset="1" stop-color="${R.tenG}"/></radialGradient>
<radialGradient id="sicakIsik" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${R.sicak}" stop-opacity=".85"/><stop offset="1" stop-color="${R.sicak}" stop-opacity="0"/></radialGradient>
<radialGradient id="maviIsik" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${R.camgobegi}" stop-opacity=".75"/><stop offset="1" stop-color="${R.camgobegi}" stop-opacity="0"/></radialGradient>
<linearGradient id="koni" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${R.altin}" stop-opacity=".5"/><stop offset="1" stop-color="${R.altin}" stop-opacity="0"/></linearGradient>
<radialGradient id="vinyet" cx="50%" cy="45%" r="72%"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".78"/></radialGradient>
<filter id="b8" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="b30" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="30"/></filter>
<filter id="parlak" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="12" result="g"/><feMerge><feMergeNode in="g"/><feMergeNode in="g"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="gren"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .09 0"/></filter>
</defs>`;
export const sahne = (ic) => `<!doctype html><html><body style="margin:0;background:#000"><svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">${defs}<rect width="1080" height="1920" fill="url(#zemin)"/>${ic}<rect width="1080" height="1920" fill="url(#vinyet)"/><rect width="1080" height="1920" filter="url(#gren)"/></svg></body></html>`;
export const isik = (x,y,r,id="sicakIsik") => `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#${id})"/>`;
export const yildiz = (x,y,r,c=R.altin) => { let p=""; for(let i=0;i<10;i++){const a=-Math.PI/2+i*Math.PI/5,q=i%2?r*.45:r; p+=`${x+q*Math.cos(a)},${y+q*Math.sin(a)} `;} return `<polygon points="${p}" fill="${c}" filter="url(#parlak)"/>`; };
export function zerre(n,x0,y0,g,y,renk,tohum=7){let s=tohum,o="";const r=()=>(s=(s*16807)%2147483647)/2147483647;for(let i=0;i<n;i++)o+=`<circle cx="${x0+r()*g}" cy="${y0+r()*y}" r="${2+r()*6}" fill="${renk[i%renk.length]}" opacity="${.35+r()*.6}" filter="url(#parlak)"/>`;return o;}
/** Karikatür kafa: x,y merkez, o ölçek. ifade: "sikkin" | "saskin" | "neseli". */
export function kafa(x,y,o,{ifade="neseli",sac=R.sac,bak=0,kulak=1,gozluk=false}={}){
  const g=`<g transform="translate(${x} ${y}) scale(${o})">`;
  const kl=`<ellipse cx="-118" cy="10" rx="${26*kulak}" ry="${38*kulak}" fill="url(#ten)"/><ellipse cx="118" cy="10" rx="${26*kulak}" ry="${38*kulak}" fill="url(#ten)"/>`;
  const yuz=`<path d="M-112 -30C-112 -120 112 -120 112 -30C116 60 74 138 0 140C-74 138 -116 60 -112 -30Z" fill="url(#ten)"/>`;
  const s=`<path d="M-122 -18C-140 -110 -70 -158 -20 -146C-8 -170 50 -170 72 -142C124 -136 140 -70 120 -14C108 -50 84 -74 56 -84C30 -60 -30 -58 -62 -84C-86 -72 -108 -50 -122 -18Z" fill="${sac}"/><path d="M-60 -128C-30 -146 20 -148 60 -130" stroke="#8A5A2E" stroke-width="7" fill="none" opacity=".7"/>`;
  const kapak=ifade==="sikkin"?`<path d="M-72 -10H-14V8H-72Z M14 -10H72V8H14Z" fill="${R.tenG}"/>`:"";
  const goz=`<ellipse cx="-43" cy="8" rx="30" ry="${ifade==="saskin"?36:28}" fill="#fff"/><ellipse cx="43" cy="8" rx="30" ry="${ifade==="saskin"?36:28}" fill="#fff"/><circle cx="${-43+bak}" cy="12" r="15" fill="#1A1020"/><circle cx="${43+bak}" cy="12" r="15" fill="#1A1020"/><circle cx="${-48+bak}" cy="6" r="5" fill="#fff"/><circle cx="${38+bak}" cy="6" r="5" fill="#fff"/>`;
  const kas=ifade==="sikkin"?`<path d="M-78 -24L-16 -34M16 -34L78 -24" stroke="${sac}" stroke-width="13" stroke-linecap="round"/>`:ifade==="saskin"?`<path d="M-76 -46Q-44 -66 -14 -46M14 -46Q44 -66 76 -46" stroke="${sac}" stroke-width="12" fill="none" stroke-linecap="round"/>`:`<path d="M-76 -30Q-44 -48 -14 -30M14 -30Q44 -48 76 -30" stroke="${sac}" stroke-width="12" fill="none" stroke-linecap="round"/>`;
  const burun=`<path d="M0 22Q20 56 2 62Q-10 62 -12 56" fill="${R.tenG}" opacity=".75"/>`;
  const agiz=ifade==="sikkin"?`<path d="M-30 100Q0 82 30 100" stroke="#7A3B2A" stroke-width="9" fill="none" stroke-linecap="round"/>`:ifade==="saskin"?`<ellipse cx="0" cy="98" rx="20" ry="26" fill="#5B1E22"/>`:`<path d="M-52 78Q0 138 52 78Z" fill="#5B1E22"/><path d="M-44 80Q0 94 44 80L38 90Q0 100 -38 90Z" fill="#fff"/>`;
  const al=`<ellipse cx="-74" cy="56" rx="22" ry="13" fill="${R.pembe}" opacity=".3"/><ellipse cx="74" cy="56" rx="22" ry="13" fill="${R.pembe}" opacity=".3"/>`;
  return g+kl+yuz+al+goz+kapak+kas+burun+agiz+s+`</g>`;
}
