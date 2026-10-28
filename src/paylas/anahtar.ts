// Kaynak: sosyal-panel/src/lib/zernio/api-key.ts (c960b96) · genel ZERNIO_API_KEY kullanılmaz
/**
 * Zernio anahtarı yalnız hesap slug'ına özel `ZERNIO_API_KEY_<SLUG>` ortam değişkeninden (`patron` → `ZERNIO_API_KEY_PATRON`).
 * Slug büyük harfe çevrilir, harf/rakam dışı her karakter `_` olur. Anahtar DEĞERİ hiçbir yere yazılmaz; yalnız değişkenin adı döner.
 */
export interface ZernioAnahtar {
  envAdi: string;
  apiKey: string;
}

export function anahtarEnvAdi(slug: string | undefined): string | undefined {
  const sonek = slug?.trim().toUpperCase().replace(/[^A-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return sonek ? `ZERNIO_API_KEY_${sonek}` : undefined;
}

export function anahtarSec(slug: string | undefined, env: Readonly<Record<string, string | undefined>>): ZernioAnahtar | undefined {
  const envAdi = anahtarEnvAdi(slug);
  const apiKey = envAdi === undefined ? undefined : env[envAdi]?.trim();
  return envAdi !== undefined && apiKey ? { envAdi, apiKey } : undefined;
}
