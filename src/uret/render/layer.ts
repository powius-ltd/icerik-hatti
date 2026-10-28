// Kaynak: kreatif-studyo/src/hf-engine/layer.ts (b6aff3d)
/** Sayfayı oluşturan katman: HTML parçaları + GSAP zaman çizelgesi satırları. Her sahne/altyazı/hook bir katman döndürür. */
export interface Layer {
  html: string[];
  js: string[];
}

/** Sayı → CSS/HTML'e yazılacak kısa onlu gösterim (üç hane). */
export function fmt(n: number): string {
  return (Math.round(n * 1000) / 1000).toString();
}

export function emptyLayer(): Layer {
  return { html: [], js: [] };
}
