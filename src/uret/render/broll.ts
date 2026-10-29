// Kaynak: kreatif-studyo/src/hf-engine/scenes/clip.ts (b6aff3d); klip katmanı, sarmalayıcı zamanlanmaz + hafif yaklaşma
/**
 * "broll" kalıbı: tam ekran kurucu b-roll klibi (ön kırpılmış dikey MP4, sessiz), üstte tema karartması ve sahnenin kısa ekran yazısı.
 * Altyazı katmanı sayfada bu sahnenin üstünde kalır. Renk yalnız tema belirteçlerinden (`--broll-overlay`).
 */
import { z } from "zod";
import type { Sahne } from "./plan.ts";
import { fmt, type Layer } from "./layer.ts";
import { fade, jsStr, slide } from "./motion-kit.ts";
import { esc, scenePrefix, shell, SHELL_CSS } from "./shell.ts";
import type { SceneContext, TemplateScene } from "./types.ts";

export const BrollParams = z.object({
  /** Sayfaya göre klip yolu (`assets/broll/<sahne>.mp4`). */
  src: z.string().min(1),
  /** Kısa başlık (sahnenin ekran yazısı); yoksa yalnız klip. */
  baslik: z.string().max(60).optional(),
});
export type BrollParams = z.infer<typeof BrollParams>;

const CLIP_TRACK = 1;

const CSS = `
.sc .br-w{position:absolute;inset:0;overflow:hidden}
.sc .br-v{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.sc .br-o{position:absolute;inset:0;background:var(--broll-overlay)}
.sc .br-t{position:absolute;left:var(--safe-left);width:var(--safe-w);top:330px;font-size:84px;font-weight:800;line-height:1.05;letter-spacing:-.02em;color:var(--fg-on-dark);text-shadow:0 6px 22px var(--cap-shadow)}
`;

function render(scene: Sahne, ctx: SceneContext): Layer {
  const params = BrollParams.parse(scene.params);
  const p = scenePrefix(scene);
  const sure = scene.end - scene.start;
  const yaklasma = ctx.theme.broll?.yaklasma ?? 1;
  const zaman = `data-start="${fmt(scene.start)}" data-duration="${fmt(sure)}" data-track-index="${CLIP_TRACK}"`;
  // Sarmalayıcı zamanlanmaz (HyperFrames: video ile sarmalayıcıdan yalnız biri zamanlanır); görünürlüğü videonun kendi zamanı belirler.
  const backdrop =
    `<div class="br-w" id="${p}-w"><video id="${p}-v" class="br-v" src="${esc(params.src)}" ${zaman} data-media-start="0" muted playsinline></video></div>` +
    `<div class="br-o"></div>`;
  const inner = params.baslik ? `<div class="br-t" id="${p}-t">${esc(params.baslik)}</div>` : "";
  const js = [`tl.fromTo(${jsStr(`#${p}-w`)},{scale:1},{scale:${fmt(yaklasma)},duration:${fmt(sure)},ease:"none"},${fmt(scene.start)});`];
  if (params.baslik) js.push(slide(`#${p}-t`, scene.start + 0.15, { dy: 40, dur: 0.5 }), fade(`#${p}-t`, scene.end - 0.25, { to: 0, dur: 0.2 }));
  return shell({ scene, inner, js, backdrop });
}

export const brollTemplate: TemplateScene<Sahne> = { name: "broll", singleton: false, css: [SHELL_CSS, CSS], render };
