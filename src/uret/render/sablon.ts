/**
 * Sabit şablon (IHT-11): tüm kalıplarda marka, başlık yeri, altyazı hapı ve yazı tipleri aynıdır; zemin, kart ve hareket kalıba göre değişir.
 *   gazete, akis → `cizimler/` altındaki SVG sayfaya gömülür, öğeleri sınıf adıyla kelime anında hareket eder
 *   rakam        → numaralı satır kartı          cubuk → yüzde çubukları (sayaçlı, ikinci değere gidebilir)
 *   kapanis      → çağrı damgası + yorum kutusu
 * Kelime sıraları sahneye görelidir (0 = sahnenin ilk kelimesi). Başlıkta `*kelime*` italik vurgu olur. Renkler yalnız tema belirteçlerinden.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { fmt, type Layer } from "./layer.ts";
import { count, drawPath, fade, jsStr, pop, slide, typer } from "./motion-kit.ts";
import type { Sahne } from "./plan.ts";
import { atWord, esc, scenePrefix, shell, SHELL_CSS } from "./shell.ts";
import type { SceneContext, TemplateScene } from "./types.ts";

const Kelime = z.number().int().nonnegative();

export const SablonAdim = z.object({
  /** SVG öğesinin sınıf adı. */
  hedef: z.string().regex(/^[a-z][\w-]*$/),
  kelime: Kelime,
  hareket: z.enum(["dus", "belir", "kay", "ciz", "say", "sil"]),
  dx: z.number().optional(),
  dy: z.number().optional(),
  deger: z.number().optional(),
  sonek: z.string().optional(),
});

export const SablonSahne = z.object({
  kalip: z.enum(["gazete", "rakam", "cubuk", "akis", "kapanis"]),
  baslik: z.string().min(1).max(60),
  /** gazete, akis: `cizimler/` altındaki SVG. */
  svg: z.string().regex(/^[\w-]+\.svg$/).optional(),
  /** Bu sahnede görünmeyecek SVG öğeleri. */
  gizli: z.array(z.string()).optional(),
  adimlar: z.array(SablonAdim).optional(),
  satirlar: z.array(z.object({ baslik: z.string().min(1).max(40), alt: z.string().max(50).optional(), kelime: Kelime, sec: z.boolean().optional() })).max(4).optional(),
  cubuklar: z.array(z.object({ etiket: z.string().min(1).max(20), yuzde: z.number().min(0).max(100), kelime: Kelime, sec: z.boolean().optional(), hedefYuzde: z.number().min(0).max(100).optional(), hedefKelime: Kelime.optional(), silKelime: Kelime.optional() })).max(4).optional(),
  ust: z.string().max(30).optional(),
  damga: z.string().max(14).optional(),
});
export type SablonSahne = z.infer<typeof SablonSahne>;

export const SablonParams = SablonSahne.extend({ ilk: Kelime });

const ZEMIN: Record<SablonSahne["kalip"], string> = { gazete: "krem", kapanis: "krem", rakam: "mavi", cubuk: "mavi", akis: "acik" };
/** Yazısı koyu olması gereken zeminler (marka bu sahnelerde koyuya döner). */
export const sablonAcikZemin = (kalip: string): boolean => ZEMIN[kalip as SablonSahne["kalip"]] !== "mavi";

const CSS = `
.sc .sb-z{position:absolute;inset:0;background-size:72px 72px}
.sc .sb-z.krem{background-color:var(--cizim-kagit)}
.sc .sb-z.acik{background-color:var(--sablon-zemin-acik);background-image:linear-gradient(var(--sablon-izgara-acik) 2px,transparent 2px),linear-gradient(90deg,var(--sablon-izgara-acik) 2px,transparent 2px)}
.sc .sb-z.mavi{background-color:var(--cizim-vurgu);background-image:linear-gradient(var(--sablon-izgara-mavi) 2px,transparent 2px),linear-gradient(90deg,var(--sablon-izgara-mavi) 2px,transparent 2px)}
.sc .sb-h{position:absolute;left:var(--safe-left);width:var(--safe-w);top:215px;font-weight:800;line-height:1.04;letter-spacing:-2.5px;color:var(--cizim-murekkep)}
.sc .sb-h i{font-family:var(--font-vurgu);font-weight:400;font-style:italic;font-size:1.14em;letter-spacing:-1px;color:var(--cizim-vurgu)}
.sc .sb-h.ters,.sc .sb-h.ters i{color:var(--sablon-kart)}
.sc .sb-svg{position:absolute;left:60px;top:470px;width:960px;height:780px}
.sc .sb-svg svg{display:block}
.sc .sb-kart{position:absolute;left:var(--safe-left);width:var(--safe-w);top:510px;background:var(--sablon-kart);border:5px solid var(--cizim-murekkep);border-radius:var(--radius-window);box-shadow:12px 12px 0 var(--cizim-murekkep);color:var(--cizim-murekkep)}
.sc .sb-s{display:flex;gap:28px;align-items:center;padding:40px 36px;border-bottom:4px solid var(--sablon-cizgi)}
.sc .sb-s:last-child{border-bottom:0}
.sc .sb-s em{font-style:normal;font-size:76px;font-weight:800;width:70px;color:var(--sablon-cizgi)}
.sc .sb-s strong{display:block;font-size:58px;line-height:1.15;font-weight:800}
.sc .sb-s small{display:block;font-size:44px;font-weight:600;color:var(--sablon-soluk)}
.sc .sb-s.sec em,.sc .sb-s.sec strong{color:var(--cizim-vurgu)}
.sc .sb-c{padding:30px 36px;border-bottom:4px solid var(--sablon-cizgi)}
.sc .sb-c:last-child{border-bottom:0}
.sc .sb-ce{display:flex;justify-content:space-between;align-items:baseline;font-size:46px;font-weight:800}
.sc .sb-ce b{font-size:60px;font-weight:800}
.sc .sb-cy{margin-top:14px;height:34px;border-radius:17px;background:var(--sablon-zemin-acik);overflow:hidden}
.sc .sb-cd{height:100%;width:100%;border-radius:17px;background:var(--cizim-murekkep);transform-origin:left center}
.sc .sb-c.sec .sb-cd{background:var(--cizim-vurgu)}
.sc .sb-c.sec .sb-ce b{color:var(--cizim-vurgu)}
.sc .sb-u{position:absolute;left:0;right:0;top:545px;text-align:center;font-size:36px;font-weight:800;letter-spacing:10px;color:var(--cizim-murekkep)}
.sc .sb-d{position:absolute;left:125px;top:610px;width:830px;text-align:center;background:var(--cizim-vurgu);color:var(--sablon-kart);font-size:118px;font-weight:800;letter-spacing:2px;padding:34px 0;border:6px solid var(--cizim-murekkep);border-radius:var(--radius-window);box-shadow:14px 14px 0 var(--cizim-murekkep)}
.sc .sb-y{position:absolute;left:var(--safe-left);width:var(--safe-w);top:900px;height:124px;background:var(--sablon-kart);border:5px solid var(--cizim-murekkep);border-radius:62px;display:flex;align-items:center;gap:24px;padding:0 26px;font-size:42px;font-weight:600;color:var(--cizim-murekkep)}
.sc .sb-y em{width:76px;height:76px;border-radius:50%;background:var(--cizim-murekkep);color:var(--sablon-kart);display:flex;align-items:center;justify-content:center;font-style:normal;font-size:28px;font-weight:700}
.cap-g.hap{left:0;right:0;width:fit-content;max-width:var(--safe-w);margin:0 auto;font-size:58px!important;background:var(--sablon-kart);padding:12px 30px;border-radius:18px;box-shadow:0 8px 0 var(--cizim-murekkep);gap:0 16px}
.cap-g.hap .w{color:var(--cizim-murekkep);-webkit-text-stroke:0;text-shadow:none}
`;

/** `*vurgu*` italik olur, kalan metin kaçırılır. */
export function baslikHtml(baslik: string): string {
  return esc(baslik).replace(/\*([^*]+)\*/g, "<i>$1</i>");
}

const baslikBoyu = (baslik: string): number => (baslik.replaceAll("*", "").length <= 26 ? 88 : 74);

async function svgYukle(params: SablonSahne, ctx: SceneContext, id: string): Promise<string> {
  if (!params.svg) throw new Error(`Sahne "${id}": ${params.kalip} kalıbı svg dosyası ister.`);
  if (!ctx.cizimKok) throw new Error(`Sahne "${id}": çizim klasörü verilmedi.`);
  return readFile(path.join(ctx.cizimKok, params.svg), "utf8");
}

function adimJs(a: z.infer<typeof SablonAdim>, kok: string, t: number): string[] {
  const sec = `${kok} .${a.hedef}`;
  const merkez = `gsap.set(${jsStr(sec)},{transformOrigin:"50% 50%"});`;
  switch (a.hareket) {
    case "dus":
      return [`tl.fromTo(${jsStr(sec)},{y:${fmt(a.dy ?? -520)},opacity:0},{y:0,opacity:1,duration:0.6,ease:"bounce.out"},${fmt(t)});`];
    case "belir":
      return [merkez, pop(sec, t)];
    case "kay":
      return [slide(sec, t, { dx: a.dx ?? 0, dy: a.dy ?? 0, dur: 0.9 })];
    case "ciz":
      return [drawPath(sec, t, { dur: 0.8 })];
    case "say":
      return [fade(sec, t, { dur: 0.15 }), count(sec, 0, a.deger ?? 0, t, 0.6, { suffix: a.sonek ?? "" })];
    case "sil":
      return [fade(sec, t, { to: 0, dur: 0.3 })];
  }
}

export async function render(scene: Sahne, ctx: SceneContext): Promise<Layer> {
  const params = SablonParams.parse(scene.params);
  const p = scenePrefix(scene);
  const an = (k: number, ne: string): number => atWord(ctx, scene, params.ilk + k, ne);
  const ters = !sablonAcikZemin(params.kalip);
  let ic = "";
  // Videonun ilk karesinde başlık hazır durur: akışta kaydıran izleyici boş ekran görmez.
  const js: string[] = scene.start > 0 ? [slide(`#${p}-h`, scene.start, { dy: 24, dur: 0.35 })] : [];

  if (params.kalip === "gazete" || params.kalip === "akis") {
    ic = `<div class="sb-svg">${await svgYukle(params, ctx, scene.id)}</div>`;
    for (const g of params.gizli ?? []) js.push(`tl.set(${jsStr(`#${p} .${g}`)},{opacity:0},0);`);
    for (const a of params.adimlar ?? []) js.push(...adimJs(a, `#${p}`, an(a.kelime, `${a.hedef} adımı`)));
  } else if (params.kalip === "rakam") {
    const satirlar = params.satirlar ?? [];
    ic = `<div class="sb-kart" id="${p}-k">${satirlar.map((s, i) => `<div class="sb-s${s.sec ? " sec" : ""}" id="${p}-s${i}"><em>${i + 1}</em><div><strong>${esc(s.baslik)}</strong>${s.alt ? `<small>${esc(s.alt)}</small>` : ""}</div></div>`).join("")}</div>`;
    js.push(pop(`#${p}-k`, scene.start, { from: 0.92, dur: 0.35 }));
    satirlar.forEach((s, i) => js.push(fade(`#${p}-s${i}`, an(s.kelime, `satır ${i + 1}`), { from: 0.15, dur: 0.3 })));
  } else if (params.kalip === "cubuk") {
    const cubuklar = params.cubuklar ?? [];
    ic = `<div class="sb-kart" id="${p}-k">${cubuklar.map((c, i) => `<div class="sb-c${c.sec ? " sec" : ""}" id="${p}-c${i}"><div class="sb-ce"><span>${esc(c.etiket)}</span><b id="${p}-n${i}">%${c.yuzde}</b></div><div class="sb-cy"><div class="sb-cd" id="${p}-d${i}"></div></div></div>`).join("")}</div>`;
    cubuklar.forEach((c, i) => {
      const t = an(c.kelime, `çubuk ${i + 1}`);
      const d = jsStr(`#${p}-d${i}`);
      js.push(`tl.fromTo(${d},{scaleX:0},{scaleX:${fmt(c.yuzde / 100)},duration:0.7,ease:"power2.out"},${fmt(t)});`, count(`#${p}-n${i}`, 0, c.yuzde, t, 0.7, { prefix: "%" }));
      if (c.hedefYuzde !== undefined && c.hedefKelime !== undefined) {
        const t2 = an(c.hedefKelime, `çubuk ${i + 1} hedefi`);
        js.push(`tl.to(${d},{scaleX:${fmt(c.hedefYuzde / 100)},duration:0.8,ease:"power2.inOut"},${fmt(t2)});`, count(`#${p}-n${i}`, c.yuzde, c.hedefYuzde, t2, 0.8, { prefix: "%" }));
      }
      if (c.silKelime !== undefined) js.push(fade(`#${p}-c${i}`, an(c.silKelime, `çubuk ${i + 1} silme`), { to: 0.18, dur: 0.35 }));
    });
  } else {
    const damga = params.damga ?? "";
    const y = an(params.adimlar?.[0]?.kelime ?? 0, "yorum kutusu");
    ic = `<div class="sb-u" id="${p}-u">${esc(params.ust ?? "")}</div><div class="sb-d" id="${p}-d" style="transform:rotate(-3deg)">${esc(damga)}</div><div class="sb-y"><em>SEN</em><span id="${p}-t"></span></div>`;
    js.push(fade(`#${p}-u`, scene.start, { dur: 0.3 }), `tl.fromTo(${jsStr(`#${p}-d`)},{scale:1.7,opacity:0,rotation:-3},{scale:1,opacity:1,rotation:-3,duration:0.35,ease:"power4.in"},${fmt(scene.start + 0.15)});`, typer(`#${p}-t`, damga, y, 10));
  }
  const inner = `<div class="sb-h${ters ? " ters" : ""}" id="${p}-h" style="font-size:${baslikBoyu(params.baslik)}px">${baslikHtml(params.baslik)}</div>${ic}`;
  return shell({ scene, inner, js, backdrop: `<div class="sb-z ${ZEMIN[params.kalip]}"></div>` });
}

export const sablonTemplate: TemplateScene<Sahne> = { name: "sablon", singleton: false, css: [SHELL_CSS, CSS], render };
