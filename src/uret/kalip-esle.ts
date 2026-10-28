/**
 * Fiş sahnesi → görsel kalıp (deterministik, LLM yok). Tablo:
 *
 *   tür ekran-kaydi/ekran-goruntusu + tırnaklı istem + kısa yanıt yazısı → chat-window (istem yazılır, yanıt gelir)
 *   ekran yazısında tek sayı (≥ 10, yıl değil) + etiket                 → big-stat (sayaç sayıya sayar)
 *   geri kalan her şey (grafik, yüz, b-roll, metin kartı, boş yazı...)   → kart (varsayılan tipografik kart; yazı boşsa yalnız zemin)
 *
 * Kalıba giden metin boşsa ya da kalıbın kuralına uymuyorsa (K26: yarım yazı / boş kutu) o kalıp SEÇİLMEZ, `kart`a düşülür.
 * Kelime sırası parametreleri (typeWord, startWord...) sesin genel kelime sırasıdır; sahne `ilk` kelimeden başlar.
 */
import type { FisSahne } from "../fis/sema.ts";
import type { KartParams } from "./render/kart.ts";

export interface KelimeAraligi {
  /** Sahnenin ilk kelimesinin genel sırası. */
  ilk: number;
  adet: number;
}

export interface KalipSecimi {
  template: "kart" | "chat-window" | "big-stat";
  kind: "motion" | "screen";
  params: Record<string, unknown>;
  /** Neden bu kalıp (günlük/rapor için tek satır). */
  neden: string;
}

const EKRAN_TURLERI = new Set<FisSahne["tur"]>(["ekran-kaydi", "ekran-goruntusu"]);
const SAYI = /\d{1,3}(?:\.\d{3})+|\d+/g;
const ISTEM = /["“]([^"“”]{3,110})["”]/;

export const harfAnahtari = (s: string): string => s.toLocaleLowerCase("tr").replace(/[^\p{L}\d]/gu, "");
export const kelimeler = (metin: string): string[] => metin.split(/\s+/).filter((k) => k !== "");

function kart(s: FisSahne, neden: string): KalipSecimi {
  const yazi = s.ekranYazisi.replace(/\s+/g, " ").trim();
  const rozet = /^(\d{1,2})\s+(\S.*)$/.exec(yazi);
  const params: KartParams = rozet ? { text: rozet[2]!, rozet: rozet[1]!, konum: s.konum === "yok" ? "orta" : s.konum } : { text: yazi, konum: s.konum === "yok" ? "orta" : s.konum };
  return { template: "kart", kind: "motion", params, neden };
}

function sohbet(s: FisSahne, a: KelimeAraligi): KalipSecimi | undefined {
  if (!EKRAN_TURLERI.has(s.tur)) return undefined;
  const istem = ISTEM.exec(s.metin)?.[1]?.trim() ?? "";
  const yanit = s.ekranYazisi.replace(/\s+/g, " ").trim();
  if (istem === "" || yanit === "" || yanit.length > 46) return undefined;
  const sozler = kelimeler(s.metin);
  const istemIlk = kelimeler(istem)[0] ?? "";
  const at = sozler.findIndex((k) => harfAnahtari(k) === harfAnahtari(istemIlk));
  if (at < 0) return undefined;
  const type = a.ilk + at;
  const send = type + Math.max(1, kelimeler(istem).length);
  const reply = Math.min(send + 1, a.ilk + a.adet - 1);
  if (!(send <= reply) || send > a.ilk + a.adet - 1) return undefined;
  return { template: "chat-window", kind: "screen", params: { prompt: istem, typeWord: type, sendWord: send, replyWord: reply, reply: { kind: "lines", lines: [yanit] } }, neden: "ekran türü, tırnaklı istem ve yanıt yazısı var" };
}

function sayac(s: FisSahne, a: KelimeAraligi): KalipSecimi | undefined {
  const yazi = s.ekranYazisi.replace(/\s+/g, " ").trim();
  const sayilar = yazi.match(SAYI) ?? [];
  if (sayilar.length !== 1 || a.adet < 2) return undefined;
  const ham = sayilar[0]!;
  const deger = Number(ham.replaceAll(".", ""));
  const yil = !ham.includes(".") && deger >= 1900 && deger <= 2100;
  if (deger < 10 || yil) return undefined;
  const etiket = yazi.replace(ham, " ").replace(/\s+/g, " ").replace(/^[\s.,:;·\-–—]+|[\s.,:;·\-–—]+$/g, "");
  if (etiket === "" || etiket.length > 40) return undefined;
  const at = kelimeler(s.metin).findIndex((k) => k.includes(ham));
  const land = Math.min(a.ilk + a.adet - 1, a.ilk + Math.max(1, at));
  return { template: "big-stat", kind: "motion", params: { value: deger, label: etiket, startWord: a.ilk, landWord: land }, neden: `ekran yazısında tek sayı (${ham})` };
}

export function kalipEsle(s: FisSahne, a: KelimeAraligi): KalipSecimi {
  return sohbet(s, a) ?? sayac(s, a) ?? kart(s, s.ekranYazisi.trim() === "" ? "ekran yazısı boş: yalnız zemin" : "varsayılan tipografik kart");
}
