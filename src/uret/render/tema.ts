// Kaynak: kreatif-studyo/src/hf-engine/theme.ts (b6aff3d)
/**
 * Video motorunun görünüm ayarı (`config/workspaces/<slug>.reels.json`): renk, yazı tipi, altyazı ve hook ölçüleri tek yerde.
 * Motor kodunda renk ya da yazı tipi adı yok; CSS değişkenleri buradan üretilir.
 */
import { access } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { okuJson } from "../../ortak/dosya.ts";

const FontSpec = z.object({ family: z.string().min(1), file: z.string().min(1), weight: z.string().min(1), style: z.enum(["normal", "italic"]).optional() });
const Positive = z.number().positive();

export const ReelsTheme = z.object({
  basis: z.string().optional(),
  /** Köşede küçük duran yazı markası (logo dosyası yoksa); boşsa gösterilmez. */
  marka: z.string().max(24).optional(),
  /** Şablon görünümü: bu hatta yalnız "screen" (koyu ekran dili); editoryal görünüm alınmadı. */
  look: z.enum(["screen"]).default("screen"),
  tokens: z.record(z.string().regex(/^[a-z][a-z0-9-]*$/), z.string().min(1)),
  /** `extra`: başka aileler (serif başlık, gövde); aile adı belirteçlerden (`--font-head` gibi) okunur. */
  fonts: z.object({ display: FontSpec, mono: FontSpec, extra: z.array(FontSpec).optional() }),
  captions: z.object({
    centerPx: Positive, fontPx: Positive, ctaFontPx: Positive, minFontPx: Positive, maxCharsPerLine: Positive, maxWords: Positive,
    strokePx: Positive, leadSec: z.number().nonnegative(), holdSec: z.number().nonnegative(), joinGapSec: Positive, newGroupGapSec: Positive,
    /** K26: altyazısız boşluk bu süreyi geçmez; geçecekse önceki öbek sonrakinin girişine dek ekranda kalır. */
    maxGapSec: Positive.default(0.6),
    inSec: Positive, ctaInSec: Positive, wordInSec: Positive, dimOpacity: z.number().min(0).max(1),
  }),
});
export type ReelsTheme = z.infer<typeof ReelsTheme>;

/** Repo kökü (bu dosyadan iki üst): tema ve yazı tipleri çalışma dizininden bağımsız bulunur. */
export const REPO_KOK = fileURLToPath(new URL("../../../", import.meta.url));
export const TEMA_KOK = join(REPO_KOK, "config/hesaplar");
export const FONT_KOK = join(REPO_KOK, "assets/fonts");

/** `config/hesaplar/<hesap>.json`; hesaba özel dosya yoksa `varsayilan.json`. */
export async function temaYukle(hesap: string, kok: string = TEMA_KOK): Promise<ReelsTheme> {
  if (!/^[A-Za-z0-9._-]+$/.test(hesap)) throw new Error(`Geçersiz hesap adı: ${hesap}`);
  const ozel = join(kok, `${hesap}.json`);
  const var_ = await access(ozel).then(() => true).catch(() => false);
  return okuJson(var_ ? ozel : join(kok, "varsayilan.json"), ReelsTheme);
}

/** Kitaptaki bir renk/ölçü değeri; yoksa anlamlı hata (şablon eksik belirteç kullanamaz). */
export function token(theme: ReelsTheme, name: string): string {
  const v = theme.tokens[name];
  if (v === undefined) throw new Error(`reels ayarında "${name}" belirteci yok (config/workspaces/*.reels.json "tokens").`);
  return v;
}

/** `:root { --ad: değer }` ve @font-face kuralları (yazı dosyaları sayfada `assets/fonts/` altında). */
export function themeCss(theme: ReelsTheme): string {
  const vars = Object.entries(theme.tokens).map(([k, v]) => `--${k}:${v}`);
  vars.push(`--font-display:${theme.fonts.display.family},sans-serif`, `--font-mono:${theme.fonts.mono.family},monospace`);
  const face = (f: z.infer<typeof FontSpec>) => `@font-face{font-family:${f.family};src:url(assets/fonts/${f.file});font-weight:${f.weight}${f.style ? `;font-style:${f.style}` : ""}}`;
  const faces = [theme.fonts.display, theme.fonts.mono, ...(theme.fonts.extra ?? [])].map(face);
  return `${faces.join("\n")}\n:root{${vars.join(";")}}`;
}

/** Sayfanın kopyalaması gereken yazı dosyaları (ortak varlık kökünde `fonts/`). */
export function themeFontFiles(theme: ReelsTheme): string[] {
  return [theme.fonts.display.file, theme.fonts.mono.file, ...(theme.fonts.extra ?? []).map((f) => f.file)];
}

/** CSS'te `var(--ad)` ile kullanılan ama temada tanımsız belirteçler; varsa kullanıcıya hangi belirtecin eksik olduğunu söyler. */
export function belirtecleriDenetle(theme: ReelsTheme, css: string, hesap = "tema"): void {
  const tanimli = new Set([...Object.keys(theme.tokens), "font-display", "font-mono"]);
  const eksik = new Set<string>();
  for (const m of css.matchAll(/var\(--([a-z][a-z0-9-]*)\)/g)) if (!tanimli.has(m[1]!)) eksik.add(m[1]!);
  if (eksik.size > 0) throw new Error(`Tema belirteci eksik (${hesap}): ${[...eksik].map((e) => `--${e}`).join(", ")}; config/hesaplar/${hesap}.json "tokens" bölümüne ekleyin.`);
}
