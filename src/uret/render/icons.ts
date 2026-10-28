// Kaynak: kreatif-studyo/src/hf-engine/scenes/icons.ts (b6aff3d)
/**
 * Genel çizgi ikonlar (kendi SVG'miz; marka logosu yok). Hepsi `currentColor` kullanır: renk çevreleyen öğenin `color`'ından,
 * yani tema belirteçlerinden gelir. 24×24 kutuda, 2 px çizgi.
 */
const PATHS = {
  chat: `<path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1h-8l-5 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/>`,
  table: `<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M3 15h18M9 4v16"/>`,
  clock: `<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>`,
  check: `<circle cx="12" cy="12" r="9"/><path d="M8 12.5l2.7 2.7L16 9.5"/>`,
  warn: `<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>`,
  file: `<path d="M6 3h8l5 5v13H6z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>`,
  send: `<path d="M4 12L20 4l-6 16-3-7z"/>`,
  person: `<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7"/>`,
} as const;

export type IconName = keyof typeof PATHS;
export const ICON_NAMES = Object.keys(PATHS) as IconName[];

export function icon(name: IconName, sizePx = 40): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="${sizePx}" height="${sizePx}" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[name]}</svg>`;
}
