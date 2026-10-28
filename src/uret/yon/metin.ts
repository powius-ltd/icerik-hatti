/** Yön eşlemesinin metin yardımcıları: cümle bölme (kelime sırası korunur), kırpma, vurgu kelimesi, ikon/logo seçimi. Hepsi saf ve belirlenimli. */
import { harfAnahtari, kelimeler } from "../kalip-esle.ts";
import { ICON_NAMES, type IconName } from "../render/icons.ts";

export interface Cumle {
  metin: string;
  /** Cümlenin ilk kelimesinin SAHNE İÇİ sırası (genel sıra = aralık.ilk + bu). */
  sira: number;
}

/** Metni cümlelere böler; kelime sayımı `kelimeler()` ile birebir aynıdır (sahne = ses parçası sözleşmesi). */
export function cumleler(metin: string): Cumle[] {
  const sonuc: Cumle[] = [];
  let akim: string[] = [];
  let ilk = 0;
  kelimeler(metin).forEach((k, i) => {
    if (akim.length === 0) ilk = i;
    akim.push(k);
    if (/[.?!…]["”')]*$/.test(k)) {
      sonuc.push({ metin: akim.join(" "), sira: ilk });
      akim = [];
    }
  });
  if (akim.length > 0) sonuc.push({ metin: akim.join(" "), sira: ilk });
  return sonuc;
}

/** Azami `en` karaktere kırpar; kelime ortasında kesmez, kesilirse "…" ekler. */
export function kirp(s: string, en: number): string {
  const t = s.replace(/\s+/g, " ").trim();
  if (t.length <= en) return t;
  const kes = t.slice(0, en - 1);
  const bosluk = kes.lastIndexOf(" ");
  return `${(bosluk > en * 0.5 ? kes.slice(0, bosluk) : kes).replace(/[\s.,;:!?-]+$/, "")}…`;
}

/** Cümle listesini toplam karakter bütçesine sığdırır: sondan düşer, tek kalırsa kırpar. */
export function butceyeSigdir(liste: readonly Cumle[], toplam: number, tek: number): Cumle[] {
  const sonuc: Cumle[] = [];
  let kalan = toplam;
  for (const c of liste) {
    if (kalan < 20 && sonuc.length > 0) break;
    const m = kirp(c.metin, Math.min(tek, kalan));
    sonuc.push({ ...c, metin: m });
    kalan -= m.length;
  }
  return sonuc;
}

/** Başlıkta vurgulanacak parça: önce sayı, yoksa ilk uzun (≥ 5 harf) kelime; bulunamazsa undefined. */
export function vurguKelime(baslik: string): string | undefined {
  const sayi = /\d[\d.,]*/.exec(baslik);
  if (sayi) return sayi[0].replace(/[.,]+$/, "");
  return kelimeler(baslik).map((k) => k.replace(/^[^\p{L}\d]+|[^\p{L}\d]+$/gu, "")).find((k) => harfAnahtari(k).length >= 5);
}

const LOGOLAR: ReadonlyArray<[RegExp, string]> = [
  [/claude|klod/i, "claude"],
  [/anthropic/i, "anthropic"],
  [/chatgpt|openai|\bgpt\b/i, "openai"],
  [/gemini/i, "googlegemini"],
  [/github/i, "github"],
  [/mistral/i, "mistralai"],
  [/qwen/i, "qwen"],
];
export const LOGO_ADLARI = ["claude", "anthropic", "openai", "googlegemini", "github", "mistralai", "qwen", "x"] as const;
export type LogoAdi = (typeof LOGO_ADLARI)[number];

/** Metinde geçen ilk araç/marka adının logosu; yoksa undefined. */
export function logoBul(metin: string): LogoAdi | undefined {
  return LOGOLAR.find(([re]) => re.test(metin))?.[1] as LogoAdi | undefined;
}

const IKONLAR: ReadonlyArray<[RegExp, IconName]> = [
  [/dakika|saat|\bsn\b|saniye|süre|hızlı|zaman/i, "clock"],
  [/tablo|excel|sheet|satır|sütun/i, "table"],
  [/dosya|rapor|belge|pdf|döküman/i, "file"],
  [/hata|uyarı|dikkat|sorun|limit/i, "warn"],
  [/mesaj|sohbet|yaz|prompt|istem|soru/i, "chat"],
  [/kişi|müşteri|kullanıcı|ekip|patron|insan/i, "person"],
  [/gönder|paylaş|yayınla/i, "send"],
];
export const IKON_ADLARI: readonly IconName[] = ICON_NAMES;

/** Metne uyan genel ikon; hiçbiri tutmazsa onay işareti. */
export function ikonBul(metin: string): IconName {
  return IKONLAR.find(([re]) => re.test(metin))?.[1] ?? "check";
}
