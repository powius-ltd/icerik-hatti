// Gazete görüş sayfası tarzı çizim takımı: düz renk, sert gölge, degrade yok. Kare (860) tuval; renkler hesap temasındaki cizim-* belirteçleriyle aynı.
export const G = { kagit: "#F3EDE0", mur: "#101B33", mavi: "#2F86E8", koyu: "#1B5FB5", ak: "#FFFFFF", ten: "#E9B48C", gri: "#C9C2B2" };
export const tuval = (ic) => `<svg xmlns="http://www.w3.org/2000/svg" width="860" height="860" viewBox="0 0 860 860"><rect width="860" height="860" fill="${G.kagit}"/>${ic}</svg>`;
const uzuv = (d, c, k) => `<path d="${d}" stroke="${c}" stroke-width="${k}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
/** Gömlekli, kravatlı küçük figür; x,y ayak ortası, o ölçek, kol/bacak: kendi koordinatında yol. */
export function adam(x, y, o, { kolA = "M-16 -196L-46 -130L-30 -80", kolB = "M16 -196L46 -130L30 -80", bacakA = "M-10 -110L-16 -50L-20 0", bacakB = "M10 -110L16 -50L20 0", yon = 1 } = {}) {
  return `<g transform="translate(${x} ${y}) scale(${o * yon} ${o})">
${uzuv(bacakA, G.mur, 22)}${uzuv(bacakB, G.mur, 22)}
${uzuv(kolB, G.ak, 17)}
<path d="M-26 -206Q0 -218 26 -206L22 -106H-22Z" fill="${G.ak}"/><path d="M0 -206V-106H22L26 -206Z" fill="${G.gri}" opacity=".55"/>
<path d="M-5 -208L5 -208L9 -130L0 -116L-9 -130Z" fill="${G.mur}"/>
${uzuv(kolA, G.ak, 17)}
<circle cx="0" cy="-238" r="24" fill="${G.ten}"/><path d="M-25 -240Q-28 -268 2 -266Q28 -266 25 -244Q14 -254 -4 -252Q-16 -252 -25 -240Z" fill="${G.mur}"/>
</g>`;
}
export const levha = (x, y, g, y2, a, sapBoy = 150) => `<g transform="translate(${x} ${y}) rotate(${a})"><rect x="-7" y="${y2 / 2 - 6}" width="14" height="${sapBoy}" fill="${G.mur}"/><rect x="${-g / 2 - 9}" y="${-y2 / 2 - 9}" width="${g + 18}" height="${y2 + 18}" fill="${G.mur}"/><rect x="${-g / 2}" y="${-y2 / 2}" width="${g}" height="${y2}" fill="${G.ak}"/><path d="M${g / 2 - 26} ${-y2 / 2}H${g / 2}V${y2 / 2}H${g / 2 - 26}Z" fill="${G.gri}" opacity=".6"/></g>`;
export const megafon = (x, y, o, a, c = G.mavi) => `<g transform="translate(${x} ${y}) rotate(${a}) scale(${o})"><path d="M-46 -14L34 -52V52L-46 14Z" fill="${c}"/><path d="M34 -52L52 -60V60L34 52Z" fill="${G.mur}"/><rect x="-70" y="-14" width="26" height="28" fill="${G.mur}"/><path d="M-30 14L-22 50H-4L-12 8Z" fill="${G.mur}"/></g>`;
