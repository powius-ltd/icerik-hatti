// Reels SVG sahnelerinin ortak parçaları (960×780 tuval); dort-reels.mjs ve reels-<id>.mjs kullanır.
import { G } from "./gazete.mjs";

export const svg = (ic) => `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="780" viewBox="0 0 960 780">${ic}</svg>`;
export const yazi = (x, y, boy, renk, metin, agirlik = 800) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Poppins" font-weight="${agirlik}" font-size="${boy}" fill="${renk}">${metin}</text>`;
export const solYazi = (x, y, boy, renk, metin) => `<text x="${x}" y="${y}" font-family="JetBrainsMono" font-weight="700" font-size="${boy}" fill="${renk}">${metin}</text>`;
export const kutu = (x, y, g, y2, c = G.ak, r = 26) => `<rect x="${x}" y="${y}" width="${g}" height="${y2}" rx="${r}" fill="${c}" stroke="${G.mur}" stroke-width="8"/>`;
export const cizgi = (sinif, d, c = G.mur, k = 16) => `<path class="${sinif}" pathLength="1" d="${d}" fill="none" stroke="${c}" stroke-width="${k}" stroke-linecap="round" stroke-linejoin="round"/>`;

// Eşit boylu karton kutu: ön yüz + kapak; `kapali` değilse kapaklar açık.
export const karton = (x, y, g, y2, c = G.ak, kapali = true) => `<path d="M${x} ${y}L${x + 70} ${y - 60}H${x + g + 70}V${y + y2 - 60}L${x + g} ${y + y2}Z" fill="${G.gri}" stroke="${G.mur}" stroke-width="8" stroke-linejoin="round"/>${kutu(x, y, g, y2, c, 8)}${kapali ? "" : `<path d="M${x} ${y}L${x - 50} ${y - 80}M${x + g} ${y}L${x + g + 50} ${y - 80}" stroke="${G.mur}" stroke-width="14" stroke-linecap="round"/>`}`;
