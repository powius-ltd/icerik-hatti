/**
 * "editoryal" kalıbı (yön: editoryal): dergi sayfası. İnce üst çizgi, "03 / 08" künyesi, ekranın ortasını dolduran büyük tipografi,
 * vurgu kelimesi tema vurgu renginde ve altı çizgili, altta ince çizgi ve bir satır açıklama. Çizgiler soldan sağa çizilir.
 * Zemin sahne zemini + ince ışık; renk ve yazı tipi yalnız tema belirteçlerinden. Zamanlar sahne başına göre.
 */
import { z } from "zod";
import type { Sahne } from "./plan.ts";
import { type Layer } from "./layer.ts";
import { draw, fade, slide } from "./motion-kit.ts";
import { esc, scenePrefix, shell, SHELL_CSS } from "./shell.ts";
import type { SceneContext, TemplateScene } from "./types.ts";

export const EditoryalParams = z.object({
  adim: z.number().int().positive(),
  toplam: z.number().int().positive(),
  baslik: z.string().min(1).max(90),
  /** Başlığın içinde geçen vurgulanacak parça; geçmiyorsa vurgu yapılmaz. */
  vurgu: z.string().min(1).max(30).optional(),
  alt: z.string().max(130).optional(),
});
export type EditoryalParams = z.infer<typeof EditoryalParams>;

const CSS = `
.sc .ed-r{position:absolute;left:var(--safe-left);width:var(--safe-w);height:3px;background:var(--fg-on-dark);opacity:.9}
.sc .ed-k{position:absolute;left:var(--safe-left);width:var(--safe-w);top:330px;display:flex;justify-content:space-between;font-family:var(--font-mono);font-size:30px;letter-spacing:6px;color:var(--accent)}
.sc .ed-k span+span{color:var(--text-muted-on-dark)}
.sc .ed-m{position:absolute;left:var(--safe-left);width:var(--safe-w);top:420px;height:600px;display:flex;align-items:center}
.sc .ed-t{font-weight:800;line-height:1.02;letter-spacing:-.03em;color:var(--fg-on-dark)}
.sc .ed-t .v{position:relative;display:inline-block;color:var(--accent)}
.sc .ed-t .v u{position:absolute;left:0;right:0;bottom:-6px;height:10px;border-radius:5px;background:var(--accent);text-decoration:none}
.sc .ed-a{position:absolute;left:var(--safe-left);width:var(--safe-w);top:1062px;padding-left:28px;border-left:6px solid var(--accent);font-size:36px;font-weight:600;line-height:1.3;color:var(--text-muted-on-dark)}
`;

/** Başlık boyu uzunluğa göre: kısa başlık iri, uzun başlık satıra ve yüksekliğe sığar. */
export function baslikBoyu(n: number): number {
  return n <= 12 ? 170 : n <= 24 ? 132 : n <= 40 ? 104 : n <= 60 ? 86 : 72;
}

function baslikHtml(p: string, baslik: string, vurgu?: string): string {
  const at = vurgu ? baslik.indexOf(vurgu) : -1;
  if (!vurgu || at < 0) return esc(baslik);
  return `${esc(baslik.slice(0, at))}<span class="v">${esc(vurgu)}<u id="${p}-u"></u></span>${esc(baslik.slice(at + vurgu.length))}`;
}

function render(scene: Sahne, ctx: SceneContext): Layer {
  const params = EditoryalParams.parse(scene.params);
  const p = scenePrefix(scene);
  const vurgulu = params.vurgu !== undefined && params.baslik.includes(params.vurgu);
  const no = (n: number) => String(n).padStart(2, "0");
  const inner =
    `<div class="ed-r" id="${p}-r1" style="top:300px"></div>` +
    `<div class="ed-k" id="${p}-k"><span>${no(params.adim)} / ${no(params.toplam)}</span><span>${esc(ctx.theme.marka ?? "")}</span></div>` +
    `<div class="ed-m"><div class="ed-t" id="${p}-t" style="font-size:${baslikBoyu(params.baslik.length)}px">${baslikHtml(p, params.baslik, params.vurgu)}</div></div>` +
    `<div class="ed-r" id="${p}-r2" style="top:1040px"></div>` +
    `${params.alt ? `<div class="ed-a" id="${p}-a">${esc(params.alt)}</div>` : ""}`;
  const js = [
    draw(`#${p}-r1`, scene.start, { dur: 0.6 }),
    fade(`#${p}-k`, scene.start + 0.1, { dur: 0.3 }),
    slide(`#${p}-t`, scene.start + 0.15, { dy: 50, dur: 0.6 }),
    draw(`#${p}-r2`, scene.start + 0.35, { dur: 0.6 }),
  ];
  if (vurgulu) js.push(draw(`#${p}-u`, scene.start + 0.8, { dur: 0.5 }));
  if (params.alt) js.push(slide(`#${p}-a`, scene.start + 0.6, { dy: 20, dur: 0.45 }));
  return shell({ scene, inner, js });
}

export const editoryalTemplate: TemplateScene<Sahne> = { name: "editoryal", singleton: false, css: [SHELL_CSS, CSS], render };
