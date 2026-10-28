/** Zamanlanmış gönderinin yayın durumu (salt okuma: Zernio `GET /posts/<id>`) ve iptali (`DELETE /posts/<id>`). */
import { anahtarSec } from "../paylas/anahtar.ts";
import { zernioIstemciKur } from "../paylas/istemci.ts";
import { durumuSinifla } from "../paylas/yokla.ts";
import type { GonderiIptal, YayinSorgu } from "./tipler.ts";

export function zernioYayinSorgu(env: Readonly<Record<string, string | undefined>>): YayinSorgu {
  return async (postId, hesap) => {
    const anahtar = anahtarSec(hesap, env);
    if (!anahtar) throw new Error(`Zernio anahtarı yok (hesap: ${hesap ?? "?"}).`);
    const d = await zernioIstemciKur({ apiKey: anahtar.apiKey }).gonderiDurumu(postId);
    const sonuc = durumuSinifla(postId, d);
    if (!sonuc) return { durum: "bekliyor" };
    if (sonuc.kind === "basarisiz") return { durum: "hata", neden: sonuc.neden };
    if (sonuc.kind === "zaman_asimi") return { durum: "bekliyor" };
    return sonuc.durum === "published" ? { durum: "yayinda", ...(sonuc.permalink ? { link: sonuc.permalink } : {}) } : { durum: "bekliyor" };
  };
}

export function zernioGonderiIptal(env: Readonly<Record<string, string | undefined>>): GonderiIptal {
  return async (postId, hesap) => {
    const anahtar = anahtarSec(hesap, env);
    if (!anahtar) throw new Error(`Zernio anahtarı yok (hesap: ${hesap ?? "?"}).`);
    await zernioIstemciKur({ apiKey: anahtar.apiKey }).gonderiSil(postId);
  };
}
