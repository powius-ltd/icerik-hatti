// Kaynak: viral-uyarla/src/cozumle/indir.ts (335b436)
/**
 * Güvenli video indirme (sosyal-panel `video-analysis/download*.ts`'ten). Kurallar:
 *  - Her adres (ilk adres + her yönlendirme) denetlenir: yalnız https, kimlik bilgisi/özel port yok, alan adı yalnız platformların
 *    kendi CDN'i (TAM sonek eşleşmesi, nokta sınırıyla: `evil.cdninstagram.com.attacker.com` ve `notcdninstagram.com` reddedilir).
 *  - Instagram CDN adreslerindeki `oe` (onaltılık unix sn) bitiş zamanı geçmişse hiç istek atılmaz.
 *  - Yönlendirme ELLE izlenir (en çok 3); izinli bir adres izinsiz bir yere yönlendiremez.
 *  - content-type `video/*` olmalı; boyut tavanı hem content-length ile hem akış sırasında sayılarak uygulanır; tek zaman aşımı.
 *  - Hata iletisine tam adres YAZILMAZ (imzalı adreste erişim belirteci olur): yalnız alan adı. Yarım dosya silinir.
 */
import { open, unlink } from "node:fs/promises";

export const IZINLI_CDN = ["cdninstagram.com", "fbcdn.net", "tiktokcdn.com", "tiktokcdn-us.com", "tiktokcdn-eu.com", "tiktokv.com", "tiktokv.us"] as const;
export const AZAMI_BAYT = 150 * 1024 * 1024;
const AZAMI_YONLENDIRME = 3;
const YONLENDIRME_KODLARI = new Set([301, 302, 303, 307, 308]);

const altAlanMi = (host: string, alan: string): boolean => host.endsWith(`.${alan}`) && host.length > alan.length + 1;

export function izinliAdres(ham: string | URL, simdi: Date, taban?: URL): URL {
  let url: URL;
  try {
    url = ham instanceof URL ? ham : new URL(ham, taban);
  } catch {
    throw new Error("Video adresi geçersiz.");
  }
  if (url.protocol !== "https:") throw new Error("Video adresi yalnız https olabilir.");
  if (url.username !== "" || url.password !== "") throw new Error("Video adresinde kimlik bilgisi olamaz.");
  if (url.port !== "" && url.port !== "443") throw new Error("Video adresinde özel bağlantı noktası olamaz.");
  const host = url.hostname.toLowerCase();
  if (!IZINLI_CDN.some((alan) => altAlanMi(host, alan))) throw new Error(`Video alan adı izinli değil (yalnız platformun kendi CDN'i): ${host}`);
  const oe = url.searchParams.get("oe");
  if (oe !== null && /^[0-9a-f]{1,8}$/i.test(oe) && Number.parseInt(oe, 16) * 1000 <= simdi.getTime()) {
    throw new Error("Video adresinin süresi dolmuş; yeni adres için taramayı yenile ya da yt-dlp yedeğini kullan.");
  }
  return url;
}

export interface IndirmeAyari {
  azamiBayt?: number;
  zamanAsimiMs?: number;
  fetch?: typeof fetch;
  simdi?: () => Date;
}

const mb = (bayt: number): string => `${Math.round(bayt / 1024 / 1024)} MB`;

async function govdeAt(yanit: Response): Promise<void> {
  try {
    await yanit.body?.cancel();
  } catch {
    // gövde zaten kapalı
  }
}

async function sinirliYaz(yanit: Response, hedef: string, azami: number): Promise<number> {
  if (!yanit.body) throw new Error("İndirilen video boş.");
  const okuyucu = yanit.body.getReader();
  const dosya = await open(hedef, "w");
  let toplam = 0;
  try {
    for (;;) {
      const { done, value } = await okuyucu.read();
      if (done) break;
      toplam += value.byteLength;
      if (toplam > azami) {
        await okuyucu.cancel();
        throw new Error(`Video ${mb(azami)} sınırını aşıyor.`);
      }
      await dosya.write(value);
    }
  } finally {
    await dosya.close();
  }
  return toplam;
}

/** `url`'deki videoyu `hedef` dosyaya indirir; indirilen bayt sayısını döndürür. */
export async function videoIndir(url: string, hedef: string, ayar: IndirmeAyari = {}): Promise<number> {
  const getir = ayar.fetch ?? fetch;
  const simdi = ayar.simdi ?? (() => new Date());
  const azami = ayar.azamiBayt ?? AZAMI_BAYT;
  let simdikiUrl = izinliAdres(url, simdi());
  const kontrolcu = new AbortController();
  let zamanAsti = false;
  const sayac = setTimeout(() => {
    zamanAsti = true;
    kontrolcu.abort();
  }, ayar.zamanAsimiMs ?? 180_000);

  try {
    for (let yonlendirme = 0; ; ) {
      const yanit = await getir(simdikiUrl.href, { redirect: "manual", signal: kontrolcu.signal, headers: { accept: "video/*" } });
      if (YONLENDIRME_KODLARI.has(yanit.status)) {
        const konum = yanit.headers.get("location");
        await govdeAt(yanit);
        if (!konum) throw new Error(`Video sunucusu yönlendirme adresi vermedi (HTTP ${yanit.status}).`);
        if (yonlendirme >= AZAMI_YONLENDIRME) throw new Error(`Video adresi ${AZAMI_YONLENDIRME} adımdan fazla yönlendiriyor.`);
        yonlendirme += 1;
        simdikiUrl = izinliAdres(konum, simdi(), simdikiUrl);
        continue;
      }
      if (!yanit.ok) {
        await govdeAt(yanit);
        throw new Error(`Video sunucusu hata döndürdü (HTTP ${yanit.status}, ${simdikiUrl.hostname}).`);
      }
      const tur = (yanit.headers.get("content-type") ?? "").split(";")[0]!.trim().toLowerCase();
      if (!tur.startsWith("video/")) {
        await govdeAt(yanit);
        throw new Error(`Yanıt bir video değil (content-type: ${tur || "yok"}).`);
      }
      const bildirilen = Number(yanit.headers.get("content-length"));
      if (Number.isFinite(bildirilen) && bildirilen > azami) {
        await govdeAt(yanit);
        throw new Error(`Video ${mb(bildirilen)}; sınır ${mb(azami)}.`);
      }
      const bayt = await sinirliYaz(yanit, hedef, azami);
      if (bayt === 0) throw new Error("İndirilen video boş.");
      return bayt;
    }
  } catch (hata) {
    await unlink(hedef).catch(() => undefined); // yarım dosya kalmasın
    if (zamanAsti) throw new Error("Video indirme zaman aşımına uğradı.");
    throw hata instanceof Error && !/^(Video|Yanıt|İndirilen)/.test(hata.message) ? new Error("Video indirilemedi (ağ hatası).") : hata;
  } finally {
    clearTimeout(sayac);
  }
}
