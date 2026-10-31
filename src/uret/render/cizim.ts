/**
 * "cizim" kalıbı: krem kâğıt üstünde gazete görüş sayfası tarzı çizim. Üstte kısa başlık (satır satır gelir, rakamla başlayan satır vurgu renginde),
 * ortada kenarları kâğıda eriyen kare görsel (girişte oturur, sahne boyunca yavaşça yaklaşır), altta koyu altyazı (`.cap-g.acik`).
 * Görsel fişin `cizim:` satırından gelir (`<koşu>/cizimler/<dosya>`); renk yalnız tema belirteçlerinden.
 */
import { z } from "zod";
import type { Sahne } from "./plan.ts";
import { fmt, type Layer } from "./layer.ts";
import { jsStr, pop, slide } from "./motion-kit.ts";
import { esc, scenePrefix, shell, SHELL_CSS } from "./shell.ts";
import type { SceneContext, TemplateScene } from "./types.ts";

export const CizimParams = z.object({
  /** Sayfaya göre görsel yolu (`assets/cizim/<dosya>`). */
  src: z.string().min(1),
  /** Başlık satırları; yoksa yalnız görsel. */
  satirlar: z.array(z.string().min(1).max(60)).max(2),
});
export type CizimParams = z.infer<typeof CizimParams>;

const CSS = `
.sc .cz-z{position:absolute;inset:0;background:var(--cizim-kagit)}
.sc .cz-h{position:absolute;left:var(--safe-left);width:var(--safe-w);top:200px;height:192px;display:flex;flex-direction:column;justify-content:flex-end;font-weight:800;line-height:1.06;letter-spacing:-.025em;color:var(--cizim-murekkep);text-wrap:balance}
.sc .cz-h .n{color:var(--cizim-vurgu)}
.sc .cz-w{position:absolute;left:110px;top:400px;width:860px;height:860px;overflow:hidden;-webkit-mask-image:linear-gradient(to right,transparent,#000 3%,#000 97%,transparent),linear-gradient(to bottom,transparent,#000 3%,#000 97%,transparent);-webkit-mask-composite:source-in;mask-image:linear-gradient(to right,transparent,#000 3%,#000 97%,transparent),linear-gradient(to bottom,transparent,#000 3%,#000 97%,transparent);mask-composite:intersect;mix-blend-mode:darken}
.sc .cz-w img{display:block;width:100%;height:100%;object-fit:cover}
.cap-g.acik .w{color:var(--cizim-murekkep);-webkit-text-stroke:0;text-shadow:none}
`;

/** Başlık boyu en uzun satıra göre: 950 px genişliğe sığar, en uzun satır iki satıra kırılabilir. */
export function cizimBaslikBoyu(satirlar: readonly string[]): number {
  const n = Math.max(0, ...satirlar.map((s) => s.length));
  const boy = n <= 17 ? 92 : n <= 22 ? 74 : n <= 28 ? 60 : 54;
  return satirlar.length > 1 ? Math.min(boy, 78) : boy;
}

function render(scene: Sahne, _ctx: SceneContext): Layer {
  const params = CizimParams.parse(scene.params);
  const p = scenePrefix(scene);
  const sure = scene.end - scene.start;
  const yon = Number(scene.id.replace(/\D/g, "")) % 2 === 0 ? 1 : -1;
  const satirlar = params.satirlar.map((s, i) => `<div id="${p}-l${i}"${/^\d/.test(s) ? ` class="n"` : ""}>${esc(s)}</div>`).join("");
  const inner =
    (params.satirlar.length > 0 ? `<div class="cz-h" style="font-size:${cizimBaslikBoyu(params.satirlar)}px">${satirlar}</div>` : "") +
    `<div class="cz-w" id="${p}-w"><img id="${p}-g" src="${esc(params.src)}" alt=""/></div>`;
  const js = [
    pop(`#${p}-w`, scene.start, { from: 0.9, dur: 0.45 }),
    `tl.fromTo(${jsStr(`#${p}-g`)},{scale:1,x:0},{scale:1.08,x:${yon * 14},duration:${fmt(sure)},ease:"none"},${fmt(scene.start)});`,
    ...params.satirlar.map((_, i) => slide(`#${p}-l${i}`, scene.start + 0.08 + i * 0.14, { dy: 30, dur: 0.4 })),
  ];
  return shell({ scene, inner, js, backdrop: `<div class="cz-z"></div>` });
}

export const cizimTemplate: TemplateScene<Sahne> = { name: "cizim", singleton: false, css: [SHELL_CSS, CSS], render };
