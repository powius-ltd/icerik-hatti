// Kaynak: kreatif-studyo/src/hf-engine/render.ts (b6aff3d); süreç çalıştırıcı bu reponun `Kosucu`'su
/**
 * HyperFrames çağrısı: önce `check` (hata varsa durur), sonra `render` (tek işçi: 4 vCPU / 16 GB makine paylaşılır).
 * Sürüm sabit (`npx hyperframes@…`). Gerçek render `agir` altında çalıştırılır; testte sahte süreç.
 */
import { rm } from "node:fs/promises";
import { temelEnv } from "../../ortak/surec.ts";
import type { Kosucu } from "../../cozumle/surec-tipleri.ts";
import { gurlukNormallestir, type GurlukHedefi } from "./gurluk.ts";

export const HYPERFRAMES_VERSION = "0.8.158";
const NPX = "npx";
const CHECK_TIMEOUT_MS = 10 * 60 * 1000;
const RENDER_TIMEOUT_MS = 90 * 60 * 1000;

function base(args: string[]): string[] {
  return ["--yes", `hyperframes@${HYPERFRAMES_VERSION}`, ...args];
}

export const checkArgs = (hfDir: string): string[] => base(["check", hfDir]);
export const renderArgs = (hfDir: string, output: string): string[] => base(["render", hfDir, "--workers", "1", "--sdr", "--output", output]);

function ortam(): NodeJS.ProcessEnv {
  return { ...temelEnv(), HOME: process.env.HOME, npm_config_cache: process.env.npm_config_cache };
}

function acikla(adim: string, hfDir: string, stderr: string): Error {
  return new Error(`HyperFrames ${adim} başarısız (${hfDir}): ${stderr.trim().slice(-600) || "ileti yok"}. Ayrıntı için: npx hyperframes@${HYPERFRAMES_VERSION} ${adim} ${hfDir}`);
}

/** Sayfayı denetler; hata (çıkış kodu ≠ 0) varsa Türkçe hatayla durur, uyarılar durdurmaz. */
export async function sayfayiDenetle(hfDir: string, kosucu: Kosucu): Promise<string> {
  const s = await kosucu(NPX, checkArgs(hfDir), { env: ortam(), timeoutMs: CHECK_TIMEOUT_MS });
  if (s.kod !== 0) throw acikla("check", hfDir, s.stderr || s.stdout);
  return s.stdout;
}

/**
 * check → render. `gurluk` verilirse render ham dosyaya (`<çıktı>.ham.mp4`) yazılır; sesi hedef gürlüğe getirilmiş kopya `output` olur (görüntü kopya).
 */
export async function olustur(girdi: { hfDir: string; output: string; gurluk?: GurlukHedefi }, kosucu: Kosucu): Promise<string> {
  await sayfayiDenetle(girdi.hfDir, kosucu);
  const ham = girdi.gurluk ? `${girdi.output}.ham.mp4` : girdi.output;
  const s = await kosucu(NPX, renderArgs(girdi.hfDir, ham), { env: ortam(), timeoutMs: RENDER_TIMEOUT_MS });
  if (s.kod !== 0) throw acikla("render", girdi.hfDir, s.stderr || s.stdout);
  if (girdi.gurluk) {
    await gurlukNormallestir({ girdi: ham, cikti: girdi.output, hedef: girdi.gurluk, kosucu });
    await rm(ham, { force: true });
  }
  return girdi.output;
}
