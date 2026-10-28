// Kaynak: viral-uyarla/src/cozumle/agy.ts (335b436)
/**
 * `agy` (Antigravity CLI, abonelik) alt süreç istemcisi: TEK çağrı + kota geri çekilmesi. Komut biçimi (agy 1.4.0'da doğrulandı):
 *   agy --model <m> --output-format json --print-timeout <n>s --json-schema <dosya> --add-dir <klasör> --sandbox      (istem STDIN'den)
 *  - `--add-dir` ve `cwd` aynı İZOLE klasör (video + şema orada): ajan yalnız onu görür, proje kurallarını bağlama karıştırmaz.
 *  - İstem argümanla değil stdin'le verilir. `--sandbox` ajanın kabuk komutu çalıştırmasını kısıtlar (`AGY_SANDBOX=off` kapatır).
 *  - ORTAM HİJYENİ: alt sürece yalnız `temelEnv` (PATH, HOME, LANG, TMPDIR) gider; servis anahtarları (APIFY_TOKEN…) agy'ye ve
 *    videodaki içeriğe açılmaz. Abonelik oturumu HOME altındadır. API anahtarı geçseydi agy abonelik yerine anahtar oturumuna düşerdi.
 *  - 429 / kota: 8 sn, sonra 16 sn bekleyip yeniden dener (`bekle` enjekte). Kalıcı hata ya da süre aşımı açık hata verir.
 */
import { temelEnv } from "../ortak/surec.ts";
import { bulunamadi, type Kosucu } from "./surec-tipleri.ts";

export const VARSAYILAN_MODEL = "gemini-3.8-flash-medium";
export const VARSAYILAN_ZAMAN_ASIMI_MS = 480_000;
export const KOTA_BEKLEMELERI_MS = [8_000, 16_000] as const;
const OLDURME_PAYI_MS = 20_000;

export interface AgyAyar {
  bin: string;
  model: string;
  zamanAsimiMs: number;
  sandbox: boolean;
}

export function agyAyariOku(ortam: NodeJS.ProcessEnv = process.env): AgyAyar {
  const zaman = Number(ortam.AGY_TIMEOUT_MS);
  return {
    bin: ortam.AGY_BIN?.trim() || "agy",
    model: ortam.AGY_MODEL?.trim() || VARSAYILAN_MODEL,
    zamanAsimiMs: Number.isFinite(zaman) && zaman > 0 ? zaman : VARSAYILAN_ZAMAN_ASIMI_MS,
    sandbox: ortam.AGY_SANDBOX?.trim().toLowerCase() !== "off",
  };
}

export interface AgyBagimlilik {
  kosucu: Kosucu;
  bekle: (ms: number) => Promise<void>;
  ayar: AgyAyar;
}

export interface AgyGirdi {
  /** Video + şema dosyasının bulunduğu izole klasör (cwd ve `--add-dir`). */
  dizin: string;
  semaYolu: string;
  istem: string;
}

export function agyArgumanlari(ayar: AgyAyar, girdi: Pick<AgyGirdi, "dizin" | "semaYolu">): string[] {
  return [
    "--model", ayar.model,
    "--output-format", "json",
    "--print-timeout", `${Math.ceil(ayar.zamanAsimiMs / 1000)}s`,
    "--json-schema", girdi.semaYolu,
    "--add-dir", girdi.dizin,
    ...(ayar.sandbox ? ["--sandbox"] : []),
  ];
}

const KOTA_IMZASI = /\b429\b|RESOURCE_EXHAUSTED|quota|rate.?limit|too many requests/i;

export function kotaHatasiMi(stderr: string, stdout: string): boolean {
  return KOTA_IMZASI.test(stderr) || KOTA_IMZASI.test(stdout.slice(0, 2000));
}

export interface AgyIstatistik {
  cagri: number;
  kotaYenidenDeneme: number;
  duzeltmeTuru: number;
}

/** Tek agy çağrısı (kota durumunda geri çekilmeyle yeniden dener). Ham stdout döner. */
export async function agyCalistir(girdi: AgyGirdi, bag: AgyBagimlilik, ist: AgyIstatistik): Promise<string> {
  for (let deneme = 0; ; deneme++) {
    let sonuc;
    try {
      sonuc = await bag.kosucu(bag.ayar.bin, agyArgumanlari(bag.ayar, girdi), {
        env: temelEnv(),
        cwd: girdi.dizin,
        girdi: girdi.istem,
        timeoutMs: bag.ayar.zamanAsimiMs + OLDURME_PAYI_MS,
      });
    } catch (hata) {
      if (bulunamadi(hata)) throw new Error("agy bulunamadı: kur ya da AGY_BIN ile tam yolunu ver.");
      if (hata instanceof Error && /bitmedi/.test(hata.message)) throw new Error(`agy zaman aşımı (${Math.round(bag.ayar.zamanAsimiMs / 1000)} sn): ${hata.message}`);
      throw hata;
    }
    ist.cagri += 1;
    if (sonuc.kod === 0) return sonuc.stdout;
    if (kotaHatasiMi(sonuc.stderr, sonuc.stdout)) {
      if (deneme >= KOTA_BEKLEMELERI_MS.length) throw new Error(`agy kota/oran sınırına takıldı (${deneme + 1} deneme). Biraz sonra yeniden dene.`);
      ist.kotaYenidenDeneme += 1;
      await bag.bekle(KOTA_BEKLEMELERI_MS[deneme]!);
      continue;
    }
    const kuyruk = sonuc.stderr.trim().split("\n").slice(-6).join("\n");
    throw new Error(`agy çıkış kodu ${sonuc.kod}\n${kuyruk}`);
  }
}
