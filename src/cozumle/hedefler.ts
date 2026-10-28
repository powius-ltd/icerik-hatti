// Kaynak: viral-uyarla/src/cozumle/hedefler.ts (335b436)
/** `cozumle` hedeflerini belirler: aday kimliği (secim.json → tara.json), `--ilk N` (secim.json) ya da yerel video. */
import path from "node:path";
import { z } from "zod";
import { okuJson } from "../ortak/dosya.ts";
import { kosuYollari } from "../ortak/kosu.ts";
import { adaySema, type Aday } from "../ortak/tipler.ts";

export interface Hedef {
  id: string;
  /** Doğrudan indirme adresi (süreli olabilir). */
  videoUrl?: string;
  /** Sayfa adresi: yt-dlp yedeği için. */
  sayfaUrl?: string;
  aciklama?: string;
  /** Yerel video yolu (indirme yok). */
  yerelVideo?: string;
}

export function adaydanHedef(a: Aday): Hedef {
  return { id: a.id, videoUrl: a.videoUrl, sayfaUrl: a.url, aciklama: a.aciklama };
}

/** Yerel dosya adından kimlik: `yerel-<kisaad>` (kimlik kuralı: harf/rakam/_/-). */
export function yerelKimlik(dosya: string, verilen?: string): string {
  if (verilen) return verilen;
  const ad = path.basename(dosya, path.extname(dosya)).replace(/[^A-Za-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 24);
  return `yerel-${ad || "video"}`;
}

async function listeOku(dosya: string): Promise<Aday[] | undefined> {
  try {
    return await okuJson(dosya, z.array(adaySema.passthrough()));
  } catch (hata) {
    if ((hata as NodeJS.ErrnoException).code === "ENOENT") return undefined;
    throw hata;
  }
}

export async function hedefleriBul(kosu: string, secenek: { id?: string; ilk?: number; video?: string }): Promise<Hedef[]> {
  const yol = kosuYollari(kosu);
  if (secenek.video) {
    const id = yerelKimlik(secenek.video, secenek.id);
    yol.aday(id); // kimlik kuralını doğrular
    return [{ id, yerelVideo: path.resolve(secenek.video) }];
  }
  if (secenek.id) {
    const aday = (await listeOku(yol.secim))?.find((a) => a.id === secenek.id) ?? (await listeOku(yol.tara))?.find((a) => a.id === secenek.id);
    if (!aday) throw new Error(`${secenek.id} ne ${yol.secim} ne ${yol.tara} içinde. Önce tara/sec çalıştır ya da --video ile yerel dosya ver.`);
    return [adaydanHedef(aday)];
  }
  if (secenek.ilk !== undefined) {
    const secim = await listeOku(yol.secim);
    if (!secim || secim.length === 0) throw new Error(`${yol.secim} yok ya da boş: önce "sec" çalıştır.`);
    return secim.slice(0, secenek.ilk).map(adaydanHedef);
  }
  throw new Error("Hedef gerekli: --id <adayId>, --ilk <N> ya da --video <dosya>.");
}
