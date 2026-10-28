/**
 * Google erişim jetonu: rclone.conf'taki `drive` remote'unun token'ından. Süresi dolmaya yakınsa `rclone about drive:` rclone'a
 * yenilettirir (client secret'a bizim dokunmamız gerekmez), sonra ayar yeniden okunur. Jeton/secret HİÇBİR yere yazılmaz.
 */
import type { SurecSonucu } from "../ortak/surec.ts";

export type Kosucu = (komut: string, args: string[]) => Promise<SurecSonucu>;
export const REMOTE = "drive";
const MARJ_MS = 120_000;

interface RcloneToken {
  access_token?: string;
  expiry?: string;
}

async function jetonOku(kosucu: Kosucu): Promise<RcloneToken> {
  const s = await kosucu("rclone", ["config", "dump"]);
  if (s.kod !== 0) throw new Error("rclone config okunamadı (rclone kurulu ve yapılandırılmış mı?).");
  let ayar: Record<string, { token?: string } | undefined>;
  try {
    ayar = JSON.parse(s.stdout) as typeof ayar;
  } catch {
    throw new Error("rclone config çıktısı çözülemedi.");
  }
  const ham = ayar[REMOTE]?.token;
  if (!ham) throw new Error(`rclone'da "${REMOTE}" remote'u ya da jetonu yok; rclone config ile yetkilendirin.`);
  try {
    return JSON.parse(ham) as RcloneToken;
  } catch {
    throw new Error(`rclone "${REMOTE}" jetonu çözülemedi.`);
  }
}

const taze = (t: RcloneToken, simdi: number) => !!t.access_token && !!t.expiry && Date.parse(t.expiry) - simdi > MARJ_MS;

/** Her çağrıda geçerli bir erişim jetonu verir (gerekirse rclone'a yenilettirir). */
export function jetonSaglayici(kosucu: Kosucu, simdi: () => number = Date.now): () => Promise<string> {
  let onbellek: RcloneToken | undefined;
  return async () => {
    if (onbellek && taze(onbellek, simdi())) return onbellek.access_token as string;
    let t = await jetonOku(kosucu);
    if (!taze(t, simdi())) {
      await kosucu("rclone", ["about", `${REMOTE}:`]); // rclone jetonu yeniler ve conf'a yazar
      t = await jetonOku(kosucu);
      if (!taze(t, simdi())) throw new Error("Google jetonu yenilenemedi; rclone config ile yeniden yetkilendirin.");
    }
    onbellek = t;
    return t.access_token as string;
  };
}

export type Getir = typeof fetch;

/** Google API çağrısı; hata iletisi durum + Google'ın kısa mesajı (jeton/başlık asla). */
export async function googleCagir(jeton: () => Promise<string>, getir: Getir, method: string, url: string, govde?: unknown): Promise<unknown> {
  const yanit = await getir(url, {
    method,
    headers: { Authorization: `Bearer ${await jeton()}`, ...(govde === undefined ? {} : { "Content-Type": "application/json" }) },
    ...(govde === undefined ? {} : { body: JSON.stringify(govde) }),
  });
  const metin = await yanit.text();
  if (!yanit.ok) {
    let mesaj = "";
    try {
      mesaj = (JSON.parse(metin) as { error?: { message?: string } }).error?.message ?? "";
    } catch {
      /* gövde JSON değil */
    }
    throw new Error(`Google API ${yanit.status}${mesaj ? `: ${mesaj.slice(0, 160)}` : ""}`);
  }
  return metin ? (JSON.parse(metin) as unknown) : {};
}
