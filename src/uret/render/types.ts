// Kaynak: kreatif-studyo/src/hf-engine/scenes/types.ts (b6aff3d)
/** Sahne kayıt sözleşmesi: her şablon bağlamı alır, bir katman (HTML + GSAP satırları) döndürür. Zamanlar video zamanıdır (hız uygulanmış). */
import type { MotionScene, ScreenScene } from "./plan.ts";
import type { Layer } from "./layer.ts";
import type { ReelsTheme } from "./tema.ts";
import type { Word } from "./kelimeler.ts";

export interface SceneContext {
  theme: ReelsTheme;
  words: readonly Word[];
  /** Sayfanın toplam süresi (sn). */
  endSec: number;
}

export interface TemplateScene<S extends MotionScene | ScreenScene = MotionScene | ScreenScene> {
  /** Şablonun kayıt adı (plandaki `template`). */
  name: string;
  /** Sayfada en çok bir kez kullanılabilir mi (yalnız sabit kimlikli şablonlar; öbürleri kimliklerini sahne `id`'siyle önekler). */
  singleton: boolean;
  /** Şablonun CSS parçaları; sayfada aynı parça bir kez yazılır (ortak kabuk birden çok şablonda tekrar etmez). Değerler `var(--…)` belirteçlerinden. */
  css: readonly string[];
  render(scene: S, ctx: SceneContext): Promise<Layer> | Layer;
}
