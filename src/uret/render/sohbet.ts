/**
 * "sohbet" kalıbı (yön: sohbet): sahnenin sözü bir sohbet penceresinde balonlara dolar. Kullanıcı balonu sağdan kayar; asistan balonundan önce
 * üç noktalı "yazıyor" göstergesi görünür, söz söylendiği an balon yerine oturur. Pencere ekranın ortasını doldurur (üst 300 → alt 1180 px);
 * balonlar yerlerini baştan tutar (yerleşim sıçramaz), metin her balona tam düşer. Zamanlar kelime SIRASIYLA (saniye yazılmaz).
 */
import { z } from "zod";
import type { Sahne } from "./plan.ts";
import { type Layer } from "./layer.ts";
import { icon } from "./icons.ts";
import { fade, pop, pulse, slide } from "./motion-kit.ts";
import { atWord, esc, scenePrefix, shell, SHELL_CSS } from "./shell.ts";
import type { SceneContext, TemplateScene } from "./types.ts";

const Index = z.number().int().nonnegative();

export const SohbetParams = z.object({
  baslik: z.string().min(1).max(24).default("AISCALE Asistan"),
  mesajlar: z.array(z.object({ kim: z.enum(["ben", "ai"]), metin: z.string().min(1).max(200), word: Index })).min(1).max(5),
});
export type SohbetParams = z.infer<typeof SohbetParams>;

/** Yazıyor göstergesi, balondan bu kadar önce başlar (sn); daha kısa boşlukta gösterge atlanır. */
const YAZIYOR_SN = 0.75;
const YAZIYOR_EN_AZ_SN = 0.3;

const CSS = `
.sc .sh-body{position:absolute;left:0;right:0;top:72px;bottom:150px;padding:34px 36px;display:flex;flex-direction:column;justify-content:center;gap:30px;overflow:hidden}
.sc .sh-m{position:relative;display:flex}
.sc .sh-m.ben{justify-content:flex-end}
.sc .sh-b{max-width:800px;padding:30px 38px;font-size:var(--fs,40px);font-weight:600;line-height:1.28;opacity:0}
.sc .sh-m.ben .sh-b{border-radius:32px 32px 8px 32px;background:var(--accent);color:var(--bg-dark)}
.sc .sh-m.ai .sh-b{border-radius:32px 32px 32px 8px;background:var(--surface-row);border:1px solid var(--line-dark)}
.sc .sh-d{position:absolute;left:0;top:0;display:flex;gap:10px;padding:24px 30px;border-radius:32px 32px 32px 8px;background:var(--surface-row);border:1px solid var(--line-dark);opacity:0}
.sc .sh-d i{width:16px;height:16px;border-radius:50%;background:var(--text-muted-on-dark);display:block}
.sc .sh-in{position:absolute;left:30px;right:30px;bottom:26px;height:92px;padding:0 20px 0 34px;border-radius:var(--radius-pill);background:var(--surface-window-bar);border:1px solid var(--line-dark);display:flex;align-items:center;justify-content:space-between;font-size:34px;color:var(--text-faint-on-dark)}
.sc .sh-in span.sd{width:60px;height:60px;border-radius:50%;background:var(--accent);color:var(--bg-dark);display:flex;align-items:center;justify-content:center}
.sc .bar .av{width:34px;height:34px;border-radius:50%;background:var(--accent);margin-left:0}
`;

/** Toplam yazıya göre balon yazısı: az yazı iri, çok yazı sığar (pencere dolu kalsın). */
export function yaziBoyu(toplam: number): number {
  return toplam <= 70 ? 60 : toplam <= 120 ? 48 : toplam <= 200 ? 42 : 36;
}

function render(scene: Sahne, ctx: SceneContext): Layer {
  const params = SohbetParams.parse(scene.params);
  const p = scenePrefix(scene);
  const zamanlar = params.mesajlar.map((m, i) => atWord(ctx, scene, m.word, `mesajlar[${i}].word`));
  zamanlar.forEach((t, i) => {
    if (i > 0 && t <= zamanlar[i - 1]!) throw new Error(`Sahne "${scene.id}": mesajlar[${i}] kelimesi öncekinden sonra olmalı.`);
  });
  const js: string[] = [];
  const mesajlar = params.mesajlar.map((m, i) => {
    const t = Math.max(zamanlar[i]!, scene.start + 0.1);
    const id = `${p}-m${i}`;
    let yazan = "";
    if (m.kim === "ai") {
      const t0 = Math.max(scene.start + 0.05, t - YAZIYOR_SN);
      if (t - t0 >= YAZIYOR_EN_AZ_SN) {
        yazan = `<div class="sh-d" id="${id}-d"><i></i><i></i><i></i></div>`;
        js.push(fade(`#${id}-d`, t0, { dur: 0.15 }), pulse(`#${id}-d i`, t0, t - t0), fade(`#${id}-d`, t - 0.05, { to: 0, dur: 0.05 }));
      }
    }
    js.push(m.kim === "ben" ? slide(`#${id}-b`, t, { dx: 80, dy: 0, dur: 0.35 }) : pop(`#${id}-b`, t, { from: 0.9, dur: 0.35 }));
    return `<div class="sh-m ${m.kim}" id="${id}">${yazan}<div class="sh-b" id="${id}-b">${esc(m.metin)}</div></div>`;
  });
  const inner =
    `<div class="win" id="${p}-win" style="top:330px;height:820px"><div class="bar"><span class="av"></span><span>${esc(params.baslik)}</span></div>` +
    `<div class="sh-body" style="--fs:${yaziBoyu(params.mesajlar.reduce((n, m) => n + m.metin.length, 0))}px">${mesajlar.join("")}</div>` +
    `<div class="sh-in"><span>Mesaj yaz…</span><span class="sd">${icon("send", 30)}</span></div></div>`;
  return shell({ scene, inner, winId: `${p}-win`, js });
}

export const sohbetTemplate: TemplateScene<Sahne> = { name: "sohbet", singleton: false, css: [SHELL_CSS, CSS], render };
