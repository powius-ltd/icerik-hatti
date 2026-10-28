// Kaynak: kreatif-studyo/src/hf-engine/scenes/screen-terminal.ts + terminal-css.ts (b6aff3d); sabit "Claude limit" senaryosu atıldı, satırlar fişten gelir
/**
 * "terminal" kalıbı (yön: terminal): komut/adım satırları terminal penceresinde satır satır belirir. Komut harf harf yazılır (imleçle),
 * çıktı satırları söylendikleri kelimede girer (✓ ya da · imi). Pencere ekranın ortasını doldurur. KS'nin tek senaryolu çalışma-zamanı betiği
 * yerine ortak hareket yardımcıları (`motion-kit`) kullanılır; böylece satırlar fişin sözünden kurulur. Zamanlar kelime SIRASIYLA.
 */
import { z } from "zod";
import type { Sahne } from "./plan.ts";
import { type Layer } from "./layer.ts";
import { pulse, slide, typer } from "./motion-kit.ts";
import { atWord, esc, scenePrefix, shell, SHELL_CSS } from "./shell.ts";
import type { SceneContext, TemplateScene } from "./types.ts";

const Index = z.number().int().nonnegative();

export const TerminalParams = z.object({
  baslik: z.string().min(1).max(30).default("aiscale — ~/proje"),
  /** Yazılan komut; yoksa yalnız çıktı satırları. */
  komut: z.string().min(1).max(60).optional(),
  satirlar: z.array(z.object({ metin: z.string().min(1).max(170), word: Index, tur: z.enum(["ok", "cikti"]).default("ok") })).min(1).max(6),
});
export type TerminalParams = z.infer<typeof TerminalParams>;

const CPS = 22;

const CSS = `
.sc .tm-body{position:absolute;left:0;right:0;top:72px;bottom:0;padding:40px 44px;font-family:var(--font-mono);font-size:38px;line-height:1.4}
.sc .tm-cmd{display:flex;gap:18px;color:var(--fg-on-dark);min-height:54px}
.sc .tm-cmd .pr{color:var(--accent);flex:none}
.sc .tm-cmd .cur{display:inline-block;width:20px;height:44px;margin-left:4px;background:var(--accent);vertical-align:middle}
.sc .tm-l{display:flex;gap:18px;margin-top:26px;opacity:0}
.sc .tm-l .im{flex:none;width:34px}
.sc .tm-l.ok .im{color:var(--success)}
.sc .tm-l.cikti .im{color:var(--text-faint-on-dark)}
.sc .tm-l .tx{flex:1;color:var(--fg-on-dark);font-family:var(--font-display);font-weight:600;font-size:40px;line-height:1.28}
.sc .tm-l.cikti .tx{color:var(--text-muted-on-dark)}
`;

function render(scene: Sahne, ctx: SceneContext): Layer {
  const params = TerminalParams.parse(scene.params);
  const p = scenePrefix(scene);
  const zamanlar = params.satirlar.map((s, i) => atWord(ctx, scene, s.word, `satirlar[${i}].word`));
  zamanlar.forEach((t, i) => {
    if (i > 0 && t <= zamanlar[i - 1]!) throw new Error(`Sahne "${scene.id}": satirlar[${i}] kelimesi öncekinden sonra olmalı.`);
  });
  const t0 = scene.start + 0.2;
  const js: string[] = [];
  let cmd = "";
  if (params.komut) {
    // Komut ilk satırdan önce biter; sığmazsa hız artar (üst sınır 40 harf/sn).
    const cps = Math.min(40, Math.max(CPS, [...params.komut].length / Math.max(0.3, zamanlar[0]! - 0.15 - t0)));
    cmd = `<div class="tm-cmd"><span class="pr">❯</span><span><span id="${p}-c"></span><span class="cur" id="${p}-cur"></span></span></div>`;
    js.push(typer(`#${p}-c`, params.komut, t0, cps), pulse(`#${p}-cur`, t0, Math.max(0.5, scene.end - t0)));
  } else {
    cmd = `<div class="tm-cmd"><span class="pr">❯</span><span class="cur" id="${p}-cur"></span></div>`;
    js.push(pulse(`#${p}-cur`, t0, Math.max(0.5, scene.end - t0)));
  }
  const satirlar = params.satirlar.map((s, i) => {
    js.push(slide(`#${p}-l${i}`, Math.max(zamanlar[i]!, t0 + 0.2), { dx: 0, dy: 18, dur: 0.3 }));
    return `<div class="tm-l ${s.tur}" id="${p}-l${i}"><span class="im">${s.tur === "ok" ? "✓" : "·"}</span><span class="tx">${esc(s.metin)}</span></div>`;
  });
  const inner =
    `<div class="win" id="${p}-win" style="top:300px;height:880px"><div class="bar"><i></i><i></i><i></i><span>${esc(params.baslik)}</span></div>` +
    `<div class="tm-body">${cmd}${satirlar.join("")}</div></div>`;
  return shell({ scene, inner, winId: `${p}-win`, js });
}

export const terminalTemplate: TemplateScene<Sahne> = { name: "terminal", singleton: false, css: [SHELL_CSS, CSS], render };
