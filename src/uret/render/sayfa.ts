// Kaynak: kreatif-studyo/src/hf-engine/compose.ts (b6aff3d); klip/hook/hız/kare biçimi atıldı
/**
 * Sahne planı → HyperFrames sayfası (`hf/index.html`). Saf birleştirici: zemin + sahne katmanları + altyazı + ses.
 * Zamanlar video zamanındadır; disk burada yok, çağıran yazar. Kimlik "main", `data-*` klipleri, duraklatılmış GSAP zaman çizelgesi `window.__timelines`.
 */
import { captionLayer } from "./altyazi.ts";
import { fmt, type Layer } from "./layer.ts";
import type { Plan } from "./plan.ts";
import { findTemplate, renderTemplate } from "./kayit.ts";
import type { SceneContext } from "./types.ts";
import { pageCss } from "./stiller.ts";
import { belirtecleriDenetle, themeFontFiles, type ReelsTheme } from "./tema.ts";
import { MARKA_CSS, markaKatmani } from "./marka.ts";
import { makeGroups, type Word } from "./kelimeler.ts";

const GSAP_URL = "https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js";
const AUDIO_TRACK = 9;

export interface ComposeInput {
  plan: Plan;
  words: readonly Word[];
  durationSec: number;
  theme: ReelsTheme;
  /** Sayfaya göre ses yolu. */
  audioSrc: string;
  /** Ses dosyasının gerçek süresi (HyperFrames sürenin medyadan uzun yazılmasını uyarır); yoksa sayfa süresi. */
  audioDurationSec?: number;
  /** Hata iletisinde tema dosyasını adlandırmak için (eksik belirteç). */
  hesap?: string;
}

export interface ComposeResult {
  html: string;
  /** Sayfanın `assets/fonts/` altında beklediği yazı dosyaları. */
  fonts: string[];
}

/** Sahne kimlikleri benzersiz olmalı (kalıp kimlikleri onunla öneklenir); tek kullanımlık kalıp en çok bir kez geçer. */
function checkScenes(scenes: Plan["scenes"]): void {
  const ids = new Set<string>();
  const singles = new Set<string>();
  for (const s of scenes) {
    if (ids.has(s.id)) throw new Error(`Sahne kimliği "${s.id}" planda birden çok kez geçiyor.`);
    ids.add(s.id);
    if (!findTemplate(s.template).singleton) continue;
    if (singles.has(s.template)) throw new Error(`"${s.template}" kalıbı sayfada en çok bir kez kullanılabilir (sahne "${s.id}").`);
    singles.add(s.template);
  }
}

/** Sayfadaki kalıpların CSS'i: kalıp başına bir kez, plan sırasıyla. */
function templateCss(scenes: Plan["scenes"]): string[] {
  const names = [...new Set(scenes.map((s) => s.template))];
  return [...new Set(names.flatMap((n) => findTemplate(n).css))];
}

export async function composePage(input: ComposeInput): Promise<ComposeResult> {
  const { plan, words, durationSec, theme, audioSrc, audioDurationSec = durationSec } = input;
  checkScenes(plan.scenes);
  const ctx: SceneContext = { theme, words, endSec: durationSec };
  const layers: Layer[] = [];
  for (const scene of plan.scenes) layers.push(await renderTemplate(scene, ctx));
  layers.push(markaKatmani(theme));
  layers.push(captionLayer(makeGroups(words, plan.captions, theme), durationSec, theme));

  const { w, h } = plan.size;
  const css = pageCss(theme, [...templateCss(plan.scenes), MARKA_CSS], { w, h });
  belirtecleriDenetle(theme, css, input.hesap);
  const body = layers.flatMap((l) => l.html).join("\n");
  const timeline = layers.flatMap((l) => l.js).join("\n");
  const html = `<!doctype html>
<html lang="tr" data-resolution="portrait">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=${w}, height=${h}"/>
<script src="${GSAP_URL}"></script>
<style>${css}</style></head>
<body>
<div id="root" data-composition-id="main" data-start="0" data-duration="${fmt(durationSec)}" data-width="${w}" data-height="${h}">
<div class="zemin"></div>
${body}
<audio id="ses" src="${audioSrc}" data-start="0" data-duration="${fmt(audioDurationSec)}" data-track-index="${AUDIO_TRACK}"></audio>
</div>
<script>
window.__timelines = window.__timelines || {};
const tl = gsap.timeline({ paused: true });
${timeline}
window.__timelines["main"] = tl;
</script>
</body></html>
`;
  return { html, fonts: themeFontFiles(theme) };
}
