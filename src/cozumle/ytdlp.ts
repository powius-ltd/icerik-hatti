// Kaynak: viral-uyarla/src/cozumle/ytdlp.ts (335b436)
/**
 * Yedek indirme: `videoUrl` yoksa ya da süresi dolduysa sayfa adresinden `yt-dlp` ile. Yalnız TikTok/Instagram sayfaları (https);
 * `--` ayracı ve yalnız `temelEnv` ile çalışır. yt-dlp kurulu değilse açık hata (otomatik kurulum yok).
 */
import { stat, unlink } from "node:fs/promises";
import { temelEnv } from "../ortak/surec.ts";
import { bulunamadi, type Kosucu } from "./surec-tipleri.ts";

const SAYFA_ALANLARI = ["tiktok.com", "instagram.com"];
const AZAMI_BOYUT = "150M";
const ZAMAN_ASIMI_MS = 240_000;

export function sayfaAdresiMi(ham: string): boolean {
  try {
    const url = new URL(ham);
    const host = url.hostname.toLowerCase();
    return url.protocol === "https:" && url.username === "" && SAYFA_ALANLARI.some((a) => host === a || host.endsWith(`.${a}`));
  } catch {
    return false;
  }
}

export async function ytdlpIndir(sayfaUrl: string, hedef: string, kosucu: Kosucu, ortam: NodeJS.ProcessEnv = process.env): Promise<number> {
  if (!sayfaAdresiMi(sayfaUrl)) throw new Error("yt-dlp yalnız TikTok/Instagram https sayfa adresiyle çalışır.");
  const bin = ortam.YTDLP_BIN?.trim() || "yt-dlp";
  let sonuc;
  try {
    sonuc = await kosucu(
      bin,
      ["--no-playlist", "--no-progress", "--no-warnings", "-f", "mp4/best", "--max-filesize", AZAMI_BOYUT, "--merge-output-format", "mp4", "-o", hedef, "--", sayfaUrl],
      { env: temelEnv(), timeoutMs: ZAMAN_ASIMI_MS },
    );
  } catch (hata) {
    if (bulunamadi(hata)) throw new Error("yt-dlp kurulu değil (YTDLP_BIN ile yolunu ver).");
    throw hata;
  }
  if (sonuc.kod !== 0) {
    await unlink(hedef).catch(() => undefined);
    throw new Error(`yt-dlp indiremedi (çıkış ${sonuc.kod}): ${sonuc.stderr.trim().split("\n").slice(-2).join(" ").slice(0, 300)}`);
  }
  const boyut = await stat(hedef).catch(() => undefined);
  if (!boyut || boyut.size === 0) throw new Error("yt-dlp çıktı dosyası üretmedi.");
  return boyut.size;
}
