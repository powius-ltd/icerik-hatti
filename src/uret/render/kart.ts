/**
 * "kart" kalıbı (varsayılan düşüş kalıbı): ekran yazısı büyük tipografik kart. Yazı fişin `ekranYazisi`'dir, yeri `konum`'dur (ust/orta/alt);
 * yazı "1 Numara al" gibi sayıyla başlıyorsa sayı rozet olur. Yazı boşsa kart yalnız zemindir (boş kutu çizilmez). Kimlik sahne `id`'siyle önekli.
 * Bu dosya bu repoya özgüdür (kaynak yok); kabuk ve hareketler `shell.ts` / `motion-kit.ts`'ten.
 */
import { z } from "zod";
import type { MotionScene } from "./plan.ts";
import { type Layer } from "./layer.ts";
import { draw, fade, slide } from "./motion-kit.ts";
import { esc, scenePrefix, shell, SHELL_CSS } from "./shell.ts";
import type { TemplateScene } from "./types.ts";

export const KartParams = z.object({
  /** Ekranda görünen yazı; boş olabilir. */
  text: z.string().max(80).default(""),
  /** Başta duran adım sayısı ("1"); yoksa rozet yok. */
  rozet: z.string().max(3).optional(),
  konum: z.enum(["ust", "orta", "alt"]).default("orta"),
});
export type KartParams = z.infer<typeof KartParams>;

/** Kartın üst kenarı (px). Altyazı bandı 1330 civarında; "alt" bandın altında kalır. */
export const KONUM_TOP: Record<KartParams["konum"], number> = { ust: 300, orta: 620, alt: 1540 };

const CSS = `
.sc .kt{position:absolute;left:var(--safe-left);width:var(--safe-w);display:flex;align-items:center;gap:36px}
.sc .kt-r{flex:none;width:150px;height:150px;border-radius:50%;background:var(--accent-soft);border:6px solid var(--accent);color:var(--accent);display:flex;align-items:center;justify-content:center;font-size:92px;font-weight:800;line-height:1}
.sc .kt-t{font-weight:800;letter-spacing:-2px;line-height:1.05;color:var(--fg-on-dark)}
.sc .kt-ln{position:absolute;left:var(--safe-left);width:520px;height:8px;border-radius:4px;background:var(--accent)}
`;

/** Yazı boyu uzunluğa göre: kısa yazı iri, uzun yazı satıra sığar. */
export function yaziBoyu(uzunluk: number): number {
  return uzunluk <= 16 ? 120 : uzunluk <= 30 ? 96 : 78;
}

function render(scene: MotionScene): Layer {
  const params = KartParams.parse(scene.params);
  const p = scenePrefix(scene);
  const top = KONUM_TOP[params.konum];
  const yazi = params.text.trim();
  const js: string[] = [];
  let inner = "";
  if (yazi !== "") {
    const rozet = params.rozet ? `<div class="kt-r" id="${p}-r">${esc(params.rozet)}</div>` : "";
    inner = `<div class="kt" style="top:${top}px">${rozet}<div class="kt-t" id="${p}-t" style="font-size:${yaziBoyu(yazi.length)}px">${esc(yazi)}</div></div><div class="kt-ln" id="${p}-ln" style="top:${top + 250}px"></div>`;
    js.push(slide(`#${p}-t`, scene.start + 0.05, { dy: 40, dur: 0.5 }), draw(`#${p}-ln`, scene.start + 0.2, { dur: 0.6 }));
    if (params.rozet) js.push(fade(`#${p}-r`, scene.start, { dur: 0.3 }));
  }
  return shell({ scene, inner, js });
}

export const kartTemplate: TemplateScene<MotionScene> = { name: "kart", singleton: false, css: [SHELL_CSS, CSS], render };
