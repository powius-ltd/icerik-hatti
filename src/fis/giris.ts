/**
 * fis girişi: `--video <yol> | --url <link> | --metin <dosya.md>` bayraklarını tek bir girişe çevirir ve (metin hariç)
 * kaynağı çözümler: indirir/kopyalar → döküm → agy analizi. `--metin` çözümlemeyi atlar.
 */
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Analiz, Dokum } from "../ortak/tipler.ts";
import { hedefiCozumle, type AkisBagimlilik } from "../cozumle/akis.ts";
import { yerelKimlik, type Hedef } from "../cozumle/hedefler.ts";
import { sayfaAdresiMi } from "../cozumle/ytdlp.ts";
import { okuJson } from "../ortak/dosya.ts";
import { kosuYollari } from "../ortak/kosu.ts";
import { dokumSema } from "../ortak/tipler.ts";
import type { Kaynak } from "./sema.ts";

export type Giris = { tur: "video" | "url" | "metin"; deger: string };

export function girisCoz(bayrak: Record<string, string | true>): Giris {
  const adaylar = (["video", "url", "metin"] as const).filter((a) => bayrak[a] !== undefined);
  if (adaylar.length !== 1) throw new Error("Tam olarak biri gerekli: --video <dosya> | --url <link> | --metin <dosya.md>.");
  const tur = adaylar[0]!;
  const deger = bayrak[tur];
  if (typeof deger !== "string" || deger === "") throw new Error(`--${tur} bir değer ister.`);
  return { tur, deger };
}

/** Sayfa adresinden kimlik: instagram-<kod> ya da tiktok-<id>. */
export function urlKimlik(ham: string): string {
  if (!sayfaAdresiMi(ham)) throw new Error("--url yalnız Instagram/TikTok https sayfa adresi olabilir.");
  const url = new URL(ham);
  const host = url.hostname.toLowerCase();
  const parcalar = url.pathname.split("/").filter(Boolean);
  if (host.endsWith("instagram.com")) {
    const i = parcalar.findIndex((p) => ["reel", "reels", "p", "tv"].includes(p));
    const kod = i >= 0 ? parcalar[i + 1] : undefined;
    if (kod && /^[A-Za-z0-9_-]+$/.test(kod)) return `instagram-${kod}`;
  } else {
    const i = parcalar.indexOf("video");
    const no = i >= 0 ? parcalar[i + 1] : undefined;
    if (no && /^[0-9]+$/.test(no)) return `tiktok-${no}`;
  }
  throw new Error("Bağlantıdan video kimliği çıkarılamadı; --id <ad> ver.");
}

export interface GirisSonucu {
  id: string;
  kaynak: Kaynak;
  /** Çözümleme (video/url); metin girişinde yok. */
  analiz?: Analiz;
  dokum?: Dokum;
  /** Hazır metin girişinde dosya içeriği. */
  metin?: string;
}

export async function girisHazirla(giris: Giris, kosu: string, idVerilen: string | undefined, bag: AkisBagimlilik, secenek: { yeniden?: boolean; dil?: string } = {}): Promise<GirisSonucu> {
  if (giris.tur === "metin") {
    const dosya = path.resolve(giris.deger);
    const metin = (await readFile(dosya, "utf8").catch(() => {
      throw new Error(`Metin dosyası okunamadı: ${dosya}`);
    })).trim();
    if (metin === "") throw new Error("Metin dosyası boş.");
    const ad = path.basename(dosya, path.extname(dosya)).replace(/[^A-Za-z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 24) || "metin";
    const id = idVerilen ?? `metin-${ad}`;
    kosuYollari(kosu).aday(id); // kimlik kuralını doğrular
    return { id, kaynak: { tur: "metin", dosya }, metin };
  }
  let hedef: Hedef;
  let kaynak: Kaynak;
  if (giris.tur === "video") {
    const id = yerelKimlik(giris.deger, idVerilen);
    kosuYollari(kosu).aday(id);
    hedef = { id, yerelVideo: path.resolve(giris.deger) };
    kaynak = { tur: "video", dosya: path.resolve(giris.deger) };
  } else {
    const id = idVerilen ?? urlKimlik(giris.deger);
    kosuYollari(kosu).aday(id);
    hedef = { id, sayfaUrl: giris.deger };
    kaynak = { tur: "url", url: giris.deger };
  }
  const analiz = await hedefiCozumle(kosu, hedef, { sakla: true, yeniden: secenek.yeniden === true, dil: secenek.dil }, bag);
  const dokum = await okuJson(kosuYollari(kosu).aday(hedef.id).dokum, dokumSema);
  return { id: hedef.id, kaynak, analiz, dokum };
}
