// Kaynak: viral-uyarla/src/cozumle/sema.ts (335b436)
/**
 * `agy --json-schema` için JSON Schema: `analizSema` (adayId HARİÇ: onu biz biliyoruz, model uydurmasın) → `z.toJSONSchema`.
 * Modelin yapısal çıktı ayrıştırıcısı bazı anahtar kelimeleri (`$schema`, `additionalProperties`, `pattern`, `format`, `exclusive*`,
 * `default`…) kabul etmeyebilir: BEYAZ LİSTE ile yalnız yapıyı tarif eden anahtarlar kalır. Kaybolan kısıtlar zararsızdır: gerçek
 * doğrulamayı yanıttan sonra zod yapar (ve tek düzeltme turu vardır). agy kökün `"type": "object"` olmasını ister.
 */
import { z } from "zod";
import { analizSema } from "../ortak/tipler.ts";

/** Modelden istenen şema: tam Analiz eksi adayId. */
export const modelAnalizSema = analizSema.omit({ adayId: true });

type JsonNesne = Record<string, unknown>;
const SKALER = ["type", "description", "enum", "minimum", "maximum", "minItems", "maxItems", "nullable"] as const;

const nesneMi = (d: unknown): d is JsonNesne => typeof d === "object" && d !== null && !Array.isArray(d);

export function semaTemizle(dugum: unknown): unknown {
  if (!nesneMi(dugum)) return dugum;
  const cikti: JsonNesne = {};
  for (const anahtar of SKALER) if (anahtar in dugum) cikti[anahtar] = dugum[anahtar];
  if ("const" in dugum && !("enum" in dugum)) cikti.enum = [dugum.const]; // `const` yerine tek değerli enum
  if (nesneMi(dugum.properties)) cikti.properties = Object.fromEntries(Object.entries(dugum.properties).map(([ad, cocuk]) => [ad, semaTemizle(cocuk)]));
  if (Array.isArray(dugum.required)) cikti.required = dugum.required;
  if (nesneMi(dugum.items)) cikti.items = semaTemizle(dugum.items);
  if (Array.isArray(dugum.anyOf)) cikti.anyOf = dugum.anyOf.map(semaTemizle);
  return cikti;
}

export function modelJsonSemasi(): JsonNesne {
  const temiz = semaTemizle(z.toJSONSchema(modelAnalizSema, { target: "draft-7" }));
  if (!nesneMi(temiz) || temiz.type !== "object") throw new Error("Yanıt şemasının kökü nesne olmalı.");
  return temiz;
}

export const modelJsonSemasiMetni = (): string => JSON.stringify(modelJsonSemasi(), null, 2);
