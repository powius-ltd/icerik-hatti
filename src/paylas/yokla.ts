// Kaynak: sosyal-panel/src/lib/publish/zernio-provider.ts poll() mantığı (c960b96), DB/Next bağımlılığı atıldı
/**
 * Gönderi yoklaması: `GET /posts/<id>` 10 sn arayla en çok 3 dk. `publishing` ara durumdur (hata değil); `published` ya da `scheduled`
 * başarı, `failed`/`error` hata. Süre dolarsa gönderi Zernio'da duruyor olabilir: hata iletisi kimliği taşır, ikinci gönderim yapılmaz.
 */
import { readFileSync, writeFileSync } from "node:fs";

import { fisPaylasildiYaz } from "./fis.ts";
import type { ZernioGonderiDurumu, ZernioIstemci } from "./istemci.ts";

export const YOKLAMA_ARALIK_MS = 10_000;
export const YOKLAMA_TAVAN_MS = 180_000;

export type YoklamaSonucu =
  | { kind: "tamam"; durum: "published" | "scheduled"; postId: string; permalink?: string }
  | { kind: "basarisiz"; postId: string; neden: string }
  | { kind: "zaman_asimi"; postId: string; sonDurum?: string };

export interface YoklaSecenekleri {
  aralikMs?: number;
  tavanMs?: number;
  bekle?: (ms: number) => Promise<void>;
}

const beklemeVarsayilan = (ms: number) => new Promise<void>((tamam) => setTimeout(tamam, ms));

/** Tek durumu sınıflar: bitti (published/scheduled), hata ya da hâlâ beklenen (`undefined`). */
export function durumuSinifla(postId: string, d: ZernioGonderiDurumu): YoklamaSonucu | undefined {
  const durum = (d.instagram?.status ?? d.status)?.toLowerCase();
  const permalink = d.instagram?.permalink;
  if (durum === "published" || durum === "scheduled") return { kind: "tamam", durum, postId, ...(permalink ? { permalink } : {}) };
  if (durum === "failed" || durum === "error") return { kind: "basarisiz", postId, neden: d.instagram?.errorMessage?.slice(0, 200) ?? "Zernio gönderiyi yayınlayamadı." };
  return undefined; // publishing, pending, bilinmeyen: başarısız sayılmaz, beklenir
}

export async function gonderiyiYokla(istemci: Pick<ZernioIstemci, "gonderiDurumu">, postId: string, ilk?: ZernioGonderiDurumu, s: YoklaSecenekleri = {}): Promise<YoklamaSonucu> {
  const aralik = s.aralikMs ?? YOKLAMA_ARALIK_MS;
  const tavan = s.tavanMs ?? YOKLAMA_TAVAN_MS;
  const bekle = s.bekle ?? beklemeVarsayilan;
  let son = ilk;
  const ilkSonuc = ilk ? durumuSinifla(postId, ilk) : undefined;
  if (ilkSonuc) return ilkSonuc;
  for (let gecen = 0; gecen < tavan; gecen += aralik) {
    await bekle(aralik);
    son = await istemci.gonderiDurumu(postId);
    const sonuc = durumuSinifla(postId, son);
    if (sonuc) return sonuc;
  }
  const sonDurum = son?.instagram?.status ?? son?.status;
  return { kind: "zaman_asimi", postId, ...(sonDurum ? { sonDurum } : {}) };
}

/** Başarıda fişe `durum: paylasildi`, `zernio_post_id`, `yayin_url` yazar. */
export function fiseDonusYaz(fisYolu: string, sonuc: Extract<YoklamaSonucu, { kind: "tamam" }>): void {
  writeFileSync(fisYolu, fisPaylasildiYaz(readFileSync(fisYolu, "utf8"), sonuc.postId, sonuc.permalink));
}
