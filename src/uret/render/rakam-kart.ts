/**
 * "rakam-kart" kalıbı (yön: rakam-kart): numaralı adım kartı. Ortada ikon ya da (sahnede araç adı geçtiyse) marka logosu halkası, altında büyük rakam
 * (söylenen sayıya sayar; sayı yoksa adım numarası), başlık ve tek satır açıklama. Kart ekranın ortasını doldurur (üst 300 → alt 1180 px).
 * Renk ve ölçüler tema belirteçlerinden; logo `assets/logo/*.svg` (currentColor). Zamanlar kelime SIRASIYLA.
 */
import { z } from "zod";
import type { Sahne } from "./plan.ts";
import { type Layer } from "./layer.ts";
import { ICON_NAMES, icon, type IconName } from "./icons.ts";
import { logoSvg } from "./logo.ts";
import { count, draw, fade, pop, slide } from "./motion-kit.ts";
import { atWord, esc, scenePrefix, shell, SHELL_CSS } from "./shell.ts";
import type { SceneContext, TemplateScene } from "./types.ts";
import { LOGO_ADLARI } from "../yon/metin.ts";

const Index = z.number().int().nonnegative();

export const RakamKartParams = z.object({
  /** Adım etiketi ("ADIM 03"); sayı yoksa büyük rakam olarak da bu numara görünür. */
  adim: z.number().int().positive(),
  toplam: z.number().int().positive(),
  /** Söylenen büyük sayı; yoksa büyük rakam adım numarasıdır. */
  sayi: z.number().nonnegative().optional(),
  baslik: z.string().min(1).max(70),
  alt: z.string().max(100).optional(),
  ikon: z.enum(ICON_NAMES as [IconName, ...IconName[]]).default("check"),
  logo: z.enum(LOGO_ADLARI).optional(),
  startWord: Index,
  landWord: Index,
});
export type RakamKartParams = z.infer<typeof RakamKartParams>;

const CSS = `
.sc .rk{position:absolute;left:var(--safe-left);top:300px;width:var(--safe-w);height:880px;border-radius:var(--radius-window);background:var(--surface-window);border:1px solid var(--line-dark);box-shadow:var(--shadow-window);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:24px;text-align:center;padding:0 48px;overflow:hidden}
.sc .rk-chip{padding:12px 30px;border-radius:var(--radius-pill);background:var(--accent-soft);color:var(--accent);font-size:30px;font-weight:700;letter-spacing:5px}
.sc .rk-ring{width:210px;height:210px;border-radius:50%;background:var(--accent-soft);border:4px solid var(--accent);color:var(--fg-on-dark);display:flex;align-items:center;justify-content:center}
.sc .rk-ring.ik{color:var(--accent)}
.sc .rk-num{font-size:176px;font-weight:800;line-height:1;letter-spacing:-6px;color:var(--accent);font-variant-numeric:tabular-nums}
.sc .rk-ln{width:360px;height:8px;border-radius:4px;background:var(--accent)}
.sc .rk-t{font-weight:800;line-height:1.1;letter-spacing:-1px;color:var(--fg-on-dark)}
.sc .rk-a{font-size:34px;font-weight:600;line-height:1.3;color:var(--text-muted-on-dark)}
`;

function baslikBoyu(n: number): number {
  return n <= 22 ? 78 : n <= 44 ? 64 : 54;
}

async function render(scene: Sahne, ctx: SceneContext): Promise<Layer> {
  const params = RakamKartParams.parse(scene.params);
  const p = scenePrefix(scene);
  const startT = atWord(ctx, scene, params.startWord, "startWord");
  const landT = atWord(ctx, scene, params.landWord, "landWord");
  if (!(startT < landT)) throw new Error(`Sahne "${scene.id}": startWord landWord'den önce olmalı (${startT.toFixed(2)} ≥ ${landT.toFixed(2)} sn).`);
  const merkez = params.logo ? await logoSvg(params.logo, 112) : icon(params.ikon, 112);
  const etiket = `ADIM ${String(params.adim).padStart(2, "0")}/${String(params.toplam).padStart(2, "0")}`;
  const buyuk = params.sayi ?? params.adim;
  const ilk = params.sayi !== undefined ? "0" : String(params.adim).padStart(2, "0");
  const inner =
    `<div class="rk" id="${p}-k"><div class="rk-chip" id="${p}-ch">${etiket}</div><div class="rk-ring${params.logo ? "" : " ik"}" id="${p}-rg">${merkez}</div>` +
    `<div class="rk-num" id="${p}-n">${ilk}</div><div class="rk-ln" id="${p}-ln"></div>` +
    `<div class="rk-t" id="${p}-t" style="font-size:${baslikBoyu(params.baslik.length)}px">${esc(params.baslik)}</div>` +
    `${params.alt ? `<div class="rk-a" id="${p}-a">${esc(params.alt)}</div>` : ""}</div>`;
  const js = [
    slide(`#${p}-k`, scene.start, { dy: 50, dur: 0.5 }),
    fade(`#${p}-ch`, scene.start + 0.1, { dur: 0.3 }),
    pop(`#${p}-rg`, scene.start + 0.2, { dur: 0.5 }),
    draw(`#${p}-ln`, startT + 0.1, { dur: Math.max(0.4, landT - startT) }),
    slide(`#${p}-t`, startT + 0.05, { dy: 24, dur: 0.4 }),
  ];
  if (params.sayi !== undefined) js.push(count(`#${p}-n`, 0, buyuk, startT, landT - startT, { thousands: buyuk >= 10_000 ? "." : "" }));
  else js.push(pop(`#${p}-n`, scene.start + 0.3, { from: 0.85, dur: 0.45 }));
  if (params.alt) js.push(fade(`#${p}-a`, landT, { dur: 0.4 }));
  return shell({ scene, inner, js });
}

export const rakamKartTemplate: TemplateScene<Sahne> = { name: "rakam-kart", singleton: false, css: [SHELL_CSS, CSS], render };
