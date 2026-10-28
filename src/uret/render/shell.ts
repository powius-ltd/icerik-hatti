// Kaynak: kreatif-studyo/src/hf-engine/scenes/shell.ts (b6aff3d)
/**
 * Yeni kalıpların ortak kabuğu: sahne kabı (kimlik `sc-<sahne id>`, sahne aralığında görünür), zemin, başlık ve pencere kuralları.
 * Kimlikler sahne `id`'siyle önekli olduğundan aynı kalıp bir sayfada birden çok kez kullanılabilir. Değerler yalnız `var(--…)` belirteçlerinden.
 */
import { z } from "zod";
import type { Scene } from "./plan.ts";
import { fmt, type Layer } from "./layer.ts";
import { wordStart } from "./kelimeler.ts";
import { jsStr, slide } from "./motion-kit.ts";
import type { SceneContext } from "./types.ts";

export const SHELL_CSS = `
.sc{position:absolute;inset:0;opacity:0;overflow:hidden}
.sc .bgl{position:absolute;inset:0;background:var(--bg-dark)}
.sc .glow{position:absolute;left:-210px;top:200px;width:1500px;height:1500px;border-radius:50%;background:radial-gradient(circle,var(--accent-glow) 0%,transparent 62%)}
.sc .edge{position:absolute;left:0;top:0;width:1080px;height:4px;background:var(--accent)}
.sc .hd{position:absolute;left:var(--safe-left);top:330px;width:var(--safe-w)}
.sc .hd .kick{font-size:30px;font-weight:700;letter-spacing:5px;color:var(--accent);text-transform:uppercase}
.sc .hd .nm{margin-top:14px;font-size:88px;font-weight:800;letter-spacing:-2.5px;line-height:1;white-space:nowrap}
.sc .win{position:absolute;left:var(--safe-left);top:var(--win-top,548px);width:var(--safe-w);height:700px;border-radius:var(--radius-window);background:var(--surface-window);box-shadow:var(--shadow-window);overflow:hidden}
.sc .win .bar{height:72px;background:var(--surface-window-bar);border-bottom:1px solid var(--line-soft);display:flex;align-items:center;padding:0 28px;gap:12px}
.sc .win .bar i{width:18px;height:18px;border-radius:50%;background:var(--line-dark);display:block}
.sc .win .bar span{margin-left:18px;font-family:var(--font-mono);font-size:26px;color:var(--text-muted-on-dark)}
`;

export const Heading = z.object({ kick: z.string().min(1).max(24), name: z.string().min(1).max(24) });
export type Heading = z.infer<typeof Heading>;
/** Pencerenin üst kenarı (px); varsayılan 548. Hook bandının altında kalması gereken ilk sahnede aşağı alınır. */
export const WindowTop = z.number().int().min(300).max(900).optional();

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Kelime sırası → video saniyesi; sıra yoksa sahne ve alan adını söyleyen hata. */
export function atWord(ctx: SceneContext, scene: Scene, index: number, what: string): number {
  return wordStart(ctx.words, index, `Sahne "${scene.id}" ${what}`);
}

/** Sahne kabının kimliği; çocuk kimlikleri `${p}-ad`. */
export const scenePrefix = (scene: Scene): string => `sc-${scene.id}`;

export interface ShellInput {
  scene: Scene;
  /** Başlık (isteğe bağlı) ve pencere dışında kalan içerik; pencere `win` sınıflı öğedir. */
  heading?: Heading | undefined;
  inner: string;
  /** Pencere üst kenarı (px); yoksa 548. */
  windowTop?: number | undefined;
  /** Pencerenin kimliği (girişte aşağıdan kayar). */
  winId?: string;
  js: string[];
  /** Zemin parçası; yoksa ekran dilinin koyu zemini + ışık + üst çizgi. */
  backdrop?: string;
  /** Kaba eklenen sınıf (görünüm: `ed`). */
  className?: string;
}

const SCREEN_BACKDROP = `<div class="bgl"></div><div class="glow"></div><div class="edge"></div>`;

/** Kabı sarar: sahne aralığında görünür yapar (başta `set`, sonda `set`), pencere girişini ekler. */
export function shell(input: ShellInput): Layer {
  const { scene, heading, inner, js } = input;
  const p = scenePrefix(scene);
  const head = heading ? `<div class="hd"><div class="kick">${esc(heading.kick)}</div><div class="nm">${esc(heading.name)}</div></div>` : "";
  const html = `<div class="sc${input.className ? ` ${input.className}` : ""}" id="${p}"${input.windowTop ? ` style="--win-top:${input.windowTop}px"` : ""} data-layout-allow-overlap data-layout-allow-occlusion data-layout-allow-overflow>${input.backdrop ?? SCREEN_BACKDROP}${head}${inner}</div>`;
  const root = jsStr(`#${p}`);
  const lines = [`tl.set(${root},{opacity:1},${fmt(scene.start)});`, `tl.set(${root},{opacity:0},${fmt(scene.end)});`];
  if (input.winId) lines.push(slide(`#${input.winId}`, scene.start, { dy: 50, dur: 0.55 }));
  return { html: [html], js: [...lines, ...js] };
}
