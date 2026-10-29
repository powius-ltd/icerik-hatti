/**
 * B-roll arşivini bulur: hesap ayarındaki `klipler` listesi ya da `kok` altındaki iki klasörün taranması (id = dosya adındaki HK-01 / BR-12).
 * Süre ffprobe ile okunur (ayarda yoksa); çalıştırıcı enjekte edilir.
 */
import { readdir } from "node:fs/promises";
import path from "node:path";
import type { Kosucu } from "../../cozumle/surec-tipleri.ts";
import { temelEnv } from "../../ortak/surec.ts";
import type { BrollAyari } from "./tema.ts";

export interface BrollKlip {
  id: string;
  /** Mutlak dosya yolu. */
  dosya: string;
  etiket: string;
  sureSn: number;
}

export const KLASORLER = ["01_KANCALAR_HOOKS", "02_ARA_GORUNTU_BROLL"] as const;
const AD = /^((?:HK|BR)-\d+)(?:_(.*))?\.(?:mp4|mov)$/i;

async function sureOku(dosya: string, kosucu: Kosucu): Promise<number> {
  const s = await kosucu("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", dosya], { env: temelEnv(), timeoutMs: 30_000 });
  const sn = Number(s.stdout.trim());
  if (s.kod !== 0 || !Number.isFinite(sn) || sn <= 0) throw new Error(`B-roll klibinin süresi okunamadı: ${path.basename(dosya)}.`);
  return sn;
}

async function klasorTara(kok: string): Promise<Array<{ id: string; dosya: string; etiket: string }>> {
  const sonuc: Array<{ id: string; dosya: string; etiket: string }> = [];
  for (const k of KLASORLER) {
    const adlar = await readdir(path.join(kok, k)).catch(() => {
      throw new Error(`B-roll klasörü bulunamadı: ${path.join(kok, k)}.`);
    });
    for (const ad of adlar.sort()) {
      const m = AD.exec(ad);
      if (m) sonuc.push({ id: m[1]!.toUpperCase(), dosya: path.join(kok, k, ad), etiket: (m[2] ?? "").replace(/_/g, " ") });
    }
  }
  return sonuc;
}

export async function kliplerBul(ayar: BrollAyari, kosucu: Kosucu): Promise<BrollKlip[]> {
  const ham: Array<{ id: string; dosya: string; etiket: string; sureSn?: number | undefined }> = ayar.klipler
    ? ayar.klipler.map((k) => ({ id: k.id, dosya: path.resolve(ayar.kok, k.dosya), etiket: k.etiket ?? "", sureSn: k.sureSn }))
    : await klasorTara(ayar.kok);
  const kimlikler = new Set<string>();
  const sonuc: BrollKlip[] = [];
  for (const k of ham) {
    if (kimlikler.has(k.id)) throw new Error(`B-roll kimliği ${k.id} birden çok dosyada geçiyor.`);
    kimlikler.add(k.id);
    sonuc.push({ id: k.id, dosya: k.dosya, etiket: k.etiket, sureSn: (k.sureSn ?? (await sureOku(k.dosya, kosucu))) });
  }
  return sonuc;
}
