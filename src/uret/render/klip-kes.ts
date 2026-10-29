/**
 * B-roll ön kırpması: arşiv klibinden sahne süresi kadar dikey (9:16) parça çıkarır (orta kırpma, sessiz, 1080x1920, 30 fps).
 * Tek girdiden tek çıktı (RAM); çok trim yok. Çıktı `hf/assets/broll/<sahne>.mp4`; çalıştırıcı enjekte edilir.
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import type { Kosucu } from "../../cozumle/surec-tipleri.ts";
import { temelEnv } from "../../ortak/surec.ts";

/** Parça sahne süresinden bu kadar uzun kesilir (kare yuvarlama payı). */
export const KIRPMA_PAYI_SN = 0.2;
/**
 * AISCALE arşivi dikey çekim: .mp4'ler etiketsiz yan yatık kaydedilmiş (17 Eki prototipi `transpose=2` ile kullandı),
 * .mov'lar ya dik kaydedilmiş ya da döndürme etiketli, ffmpeg dik açar (`zatenDik`). İkisinde de sonuç 9:16; oran tutmazsa orta kırpma.
 */
export const KLIP_FILTRESI = "transpose=2,scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30";
export const DIK_FILTRE = "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,fps=30";

const yuvarla = (n: number): number => Math.round(n * 1000) / 1000;

/** Klibin ortasına yakın, `gerekenSn` sığacak başlangıç (sn). */
export function baslangicSn(klipSureSn: number, gerekenSn: number): number {
  return yuvarla(Math.max(0, Math.min((klipSureSn - gerekenSn) / 2, klipSureSn - gerekenSn)));
}

export interface KesimIstegi {
  /** Kaynak klip dosyası (mutlak). */
  klip: string;
  klipSureSn: number;
  sahneSureSn: number;
  /** Çıktı dosyası (mutlak). */
  cikti: string;
  /** Klip ekranda zaten dik mi (değilse arşiv kuralıyla çevrilir). */
  zatenDik?: boolean;
}

/** ffmpeg argümanları (saf; testte doğrudan denetlenir). */
export function kesimArgumanlari(i: KesimIstegi): string[] {
  const sure = yuvarla(i.sahneSureSn + KIRPMA_PAYI_SN);
  return ["-v", "error", "-y", "-ss", String(baslangicSn(i.klipSureSn, sure)), "-t", String(sure), "-i", i.klip, "-vf", i.zatenDik ? DIK_FILTRE : KLIP_FILTRESI, "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", i.cikti];
}

/** Klipleri sırayla (aynı anda tek ffmpeg) keser; ilk hatada Türkçe tek cümleyle durur. */
export async function klipleriKes(istekler: readonly KesimIstegi[], kosucu: Kosucu): Promise<void> {
  for (const i of istekler) {
    await mkdir(path.dirname(i.cikti), { recursive: true });
    const s = await kosucu("ffmpeg", kesimArgumanlari(i), { env: temelEnv(), timeoutMs: 300_000 });
    if (s.kod !== 0) throw new Error(`B-roll klibi kesilemedi (${path.basename(i.klip)}): ${s.stderr.trim().split("\n").at(-1)?.slice(0, 160) ?? ""}`);
  }
}
