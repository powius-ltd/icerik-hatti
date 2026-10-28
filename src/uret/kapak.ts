// Kaynak: kreatif-studyo/src/orders/cover.ts (b6aff3d); png çıktı, ProcessRunner yerine Kosucu
/**
 * Kapak: ekran yazısı oturmuşken (ilk 1,5 sn) birkaç kare çıkarılır, en çok ayrıntı taşıyan (en büyük dosya) `kapak.png` olur, 1080x1920.
 * Adaylar `kapak-adaylari/` altında kalır (kanıt).
 */
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Kosucu } from "../cozumle/surec-tipleri.ts";
import { temelEnv } from "../ortak/surec.ts";

/** Adayların alındığı anlar (sn): kart girişi bitmiş, altyazı başlamış olmalı. */
export const KAPAK_ANLARI_SN = [0.7, 1.0, 1.3, 1.6] as const;

export async function kapakYap(g: { video: string; klasor: string; cikti: string; kosucu: Kosucu }): Promise<{ yol: string; anSn: number }> {
  const dizin = path.join(g.klasor, "kapak-adaylari");
  await mkdir(dizin, { recursive: true });
  let en: { anSn: number; boyut: number; dosya: string } | undefined;
  for (const anSn of KAPAK_ANLARI_SN) {
    const dosya = path.join(dizin, `${String(Math.round(anSn * 100)).padStart(3, "0")}.png`);
    const s = await g.kosucu("ffmpeg", ["-v", "error", "-y", "-threads", "2", "-ss", String(anSn), "-i", g.video, "-frames:v", "1", "-vf", "scale=1080:1920:flags=lanczos", dosya], { env: temelEnv(), timeoutMs: 60_000 });
    if (s.kod !== 0) throw new Error(`Kapak karesi çıkarılamadı (${anSn} sn): ${s.stderr.trim().slice(-200)}`);
    const boyut = (await stat(dosya)).size;
    if (!en || boyut > en.boyut) en = { anSn, boyut, dosya };
  }
  await writeFile(g.cikti, await readFile(en!.dosya));
  return { yol: g.cikti, anSn: en!.anSn };
}
