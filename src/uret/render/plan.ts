// Kaynak: kreatif-studyo/src/contracts/scene-plan.ts (b6aff3d); klip sahnesi, hız, kanca ve çalışma alanı atıldı
/**
 * Sahne planı: render motorunun girdisi. Plan "ne zaman ne görünür"ü söyler; renk ve yazı tipi tema belirteçlerindedir (`tema.ts`).
 * Bu hatta plan LLM'den değil fişten deterministik çıkar (`../sahne-plani.ts`). Zamanlar video saniyesidir (hız yok).
 */
export interface Sahne {
  id: string;
  start: number;
  end: number;
  /** "motion" ya da "screen": yalnız kayıt adı için; çizim `template` adıyla seçilir. */
  kind: "motion" | "screen";
  template: string;
  params: Record<string, unknown>;
}
/** Eski ad: kopyalanan kalıp dosyaları `Scene` türünü kullanır. */
export type Scene = Sahne;
export type MotionScene = Sahne;
export type ScreenScene = Sahne;

/** Altyazı: zaman kelimeden gelir; plan yalnız vurgulanacak kelime sırasını, ekranda farklı yazılacak kelimeleri ve öbek sınırlarını taşır. */
export interface PlanCaptions {
  emphasis: number[];
  display: Record<string, string>;
  /** Öbek sınırları: ilk kelime sıraları (sahne başları). Yoksa yazı katmanı kuralı bölünür. */
  groupStarts?: number[];
}

export interface Plan {
  size: { w: number; h: number };
  captions: PlanCaptions;
  scenes: Sahne[];
}
