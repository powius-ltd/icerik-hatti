// Kaynak: kreatif-studyo/src/hf-engine/scenes/motion-big-stat.ts (b6aff3d)
/**
 * "big-stat" hareket kalıbı: büyük sayı ya da süre ("200 satır", "30 sn"). Sayaç `startWord`'te yükselmeye başlar, `landWord`'te
 * son değerde durur ve orada kalır; `stopwatch` kipi "d:ss" kronometre gösterir. Alt etiket ve ikon isteğe bağlı.
 */
import { z } from "zod";
import type { MotionScene } from "./plan.ts";
import { type Layer } from "./layer.ts";
import { ICON_NAMES, icon, type IconName } from "./icons.ts";
import { count, draw, fade, pop, slide } from "./motion-kit.ts";
import { atWord, esc, Heading, WindowTop, scenePrefix, shell, SHELL_CSS } from "./shell.ts";
import type { SceneContext, TemplateScene } from "./types.ts";

const Index = z.number().int().nonnegative();

export const BigStatParams = z.object({
  heading: Heading.optional(),
  windowTop: WindowTop,
  mode: z.enum(["count", "stopwatch"]).default("count"),
  /** Son değer (count: sayı, stopwatch: saniye). */
  value: z.number().nonnegative(),
  from: z.number().nonnegative().default(0),
  decimals: z.number().int().min(0).max(2).default(0),
  /** Sayının yanında küçük yazılan birim ("satır", "sn"). */
  unit: z.string().max(12).default(""),
  label: z.string().min(1).max(40),
  sub: z.string().min(1).max(60).optional(),
  icon: z.enum(ICON_NAMES as [IconName, ...IconName[]]).optional(),
  startWord: Index,
  landWord: Index,
});
export type BigStatParams = z.infer<typeof BigStatParams>;

export const BIG_STAT_SAMPLE: BigStatParams = {
  heading: { kick: "Sonuç", name: "Elle yapınca" },
  mode: "count",
  value: 200,
  from: 0,
  decimals: 0,
  unit: "satır",
  label: "tek tek kopyala yapıştır",
  sub: "her hafta, her müşteri için",
  icon: "table",
  startWord: 1,
  landWord: 3,
};

const CSS = `
.sc .bs{position:absolute;left:var(--safe-left);width:var(--safe-w);top:520px;display:flex;flex-direction:column;align-items:flex-start}
.sc .bs-ic{color:var(--accent)}
.sc .bs-num{display:flex;align-items:baseline;gap:24px;margin-top:20px;line-height:1}
.sc .bs-v{font-size:300px;font-weight:800;letter-spacing:-10px;color:var(--accent);font-family:var(--font-display);font-variant-numeric:tabular-nums}
.sc .bs-u{font-size:84px;font-weight:700;color:var(--fg-on-dark);letter-spacing:-1px}
.sc .bs-line{width:520px;height:8px;border-radius:4px;background:var(--accent);margin-top:34px}
.sc .bs-lb{margin-top:34px;font-size:56px;font-weight:700;line-height:1.1;letter-spacing:-1px}
.sc .bs-sub{margin-top:16px;font-size:36px;color:var(--text-muted-on-dark)}
`;

function render(scene: MotionScene, ctx: SceneContext): Layer {
  const params = BigStatParams.parse(scene.params);
  const p = scenePrefix(scene);
  const startT = atWord(ctx, scene, params.startWord, "startWord");
  const landT = atWord(ctx, scene, params.landWord, "landWord");
  if (!(startT < landT)) throw new Error(`Sahne "${scene.id}": startWord landWord'den önce olmalı (${startT.toFixed(2)} ≥ ${landT.toFixed(2)} sn).`);
  const clock = params.mode === "stopwatch";
  const first = clock ? "0:00" : String(params.from);
  const inner =
    `<div class="bs">${params.icon ? `<span class="bs-ic" id="${p}-ic">${icon(params.icon, 96)}</span>` : ""}` +
    `<div class="bs-num"><span class="bs-v" id="${p}-v">${first}</span>${params.unit ? `<span class="bs-u" id="${p}-u">${esc(params.unit)}</span>` : ""}</div>` +
    `<div class="bs-line" id="${p}-ln"></div><div class="bs-lb" id="${p}-lb">${esc(params.label)}</div>` +
    `${params.sub ? `<div class="bs-sub" id="${p}-sb">${esc(params.sub)}</div>` : ""}</div>`;
  const js = [
    pop(`#${p}-v`, startT, { from: 0.85, dur: 0.35 }),
    count(`#${p}-v`, params.from, params.value, startT, landT - startT, { decimals: params.decimals, thousands: ".", clock }),
    draw(`#${p}-ln`, startT + 0.1, { dur: Math.max(0.4, landT - startT) }),
    slide(`#${p}-lb`, landT - 0.1, { dy: 24, dur: 0.4 }),
  ];
  if (params.unit) js.push(fade(`#${p}-u`, startT, { dur: 0.3 }));
  if (params.icon) js.push(pop(`#${p}-ic`, scene.start + 0.1, { dur: 0.45 }));
  if (params.sub) js.push(fade(`#${p}-sb`, landT + 0.25, { dur: 0.4 }));
  return shell({ scene, heading: params.heading, windowTop: params.windowTop, inner, js });
}

export const bigStatTemplate: TemplateScene<MotionScene> = { name: "big-stat", singleton: false, css: [SHELL_CSS, CSS], render };
