// Kaynak: viral-uyarla/test/cozumle/yardimci.ts (335b436)
/** Cozumle testleri için sahte alt süreç çalıştırıcıları ve ortak veriler. */
import { readFileSync } from "node:fs";
import type { AgyBagimlilik } from "../../src/cozumle/agy.ts";
import { agyAyariOku } from "../../src/cozumle/agy.ts";
import type { Kosucu } from "../../src/cozumle/surec-tipleri.ts";
import type { SurecSecenek, SurecSonucu } from "../../src/ortak/surec.ts";
import { dokumSema, type Dokum } from "../../src/ortak/tipler.ts";

const oku = (ad: string): unknown => JSON.parse(readFileSync(new URL(`../fixtures/cozumle/${ad}`, import.meta.url), "utf8"));

export const modelYaniti = (): Record<string, unknown> => structuredClone(oku("model-yaniti.json") as Record<string, unknown>);
export const ornekDokum = (): Dokum => dokumSema.parse(oku("dokum.json"));

export interface Cagri {
  komut: string;
  args: string[];
  secenek: SurecSecenek;
}

export const ok = (stdout: string): SurecSonucu => ({ kod: 0, stdout, stderr: "" });
export const hata = (kod: number, stderr: string): SurecSonucu => ({ kod, stdout: "", stderr });

/** agy zarfı: structured_output nesnesi + kullanım. */
export const zarf = (nesne: unknown, usage = { input_tokens: 100, output_tokens: 50, total_tokens: 150 }): string =>
  JSON.stringify({ conversation_id: "x", status: "SUCCESS", response: JSON.stringify(nesne), structured_output: nesne, usage });

/** Sıradaki yanıtı veren sahte koşucu; her çağrıyı kaydeder. */
export function sahteKosucu(yanitlar: Array<SurecSonucu | ((c: Cagri) => SurecSonucu | Promise<SurecSonucu>)>): { kosucu: Kosucu; cagrilar: Cagri[] } {
  const cagrilar: Cagri[] = [];
  const kosucu: Kosucu = async (komut, args, secenek = {}) => {
    const c = { komut, args, secenek };
    cagrilar.push(c);
    const y = yanitlar.shift();
    if (!y) throw new Error(`beklenmeyen çağrı: ${komut}`);
    return typeof y === "function" ? y(c) : y;
  };
  return { kosucu, cagrilar };
}

export function agyBagimliligi(kosucu: Kosucu, bekleme: number[] = []): AgyBagimlilik {
  return { kosucu, bekle: async (ms) => void bekleme.push(ms), ayar: agyAyariOku({}) };
}
