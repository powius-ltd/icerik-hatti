// Kaynak: kreatif-studyo/src/orders/voice.ts (b6aff3d); sözlük yönü (gösterim → okunuş) alındı, okunuş boşluğu tireye değil kelime sayısı eşlemesine çevrildi
/**
 * Hesabın ses ayarı (`config/hesaplar/<hesap>.json` "ses") ve telaffuz sözlüğü.
 * Sözlük yalnız TTS'e giden metne uygulanır ("Claude'u" → "Klod'u"); altyazı gösterim yazımında kalır: sağlayıcının kelime zamanları gösterim kelimelerine geri eşlenir.
 */
import { z } from "zod";
import type { KelimeDamgasi } from "./saglayici.ts";

export const SozlukGirdisi = z.object({
  /** Ekranda yazılan; boşluk içermez ("OpenMontage"). */
  display: z.string().min(1).regex(/^\S+$/, "display boşluk içeremez"),
  /** Sesin söylediği; boşluklu olabilir ("Opın Montaj"). */
  spoken: z.string().min(1),
});
export type SozlukGirdisi = z.infer<typeof SozlukGirdisi>;

export const SesAyari = z.object({
  modelId: z.string().min(1),
  settings: z.object({
    stability: z.number().min(0).max(1).optional(),
    similarityBoost: z.number().min(0).max(1).optional(),
    style: z.number().min(0).max(1).optional(),
    useSpeakerBoost: z.boolean().optional(),
    /** ElevenLabs API üst sınırı 1,2. */
    speed: z.number().min(0.7).max(1.2).optional(),
  }),
  usdPer1kChars: z.number().positive(),
  lexicon: z.array(SozlukGirdisi).default([]),
});
export type SesAyari = z.infer<typeof SesAyari>;

const kac = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const bosluksuz = (s: string): string[] => s.split(/\s+/).filter((k) => k !== "");

/** Eşleşmenin büyük/küçük harf biçimini okunuşa taşır: "CLAUDE" → "KLOD", "claude" → "klod". */
function biciminiKoru(eslesen: string, okunus: string): string {
  if (eslesen.length > 1 && eslesen === eslesen.toLocaleUpperCase("tr") && eslesen !== eslesen.toLocaleLowerCase("tr")) return okunus.toLocaleUpperCase("tr");
  const ilk = eslesen[0]!;
  if (ilk === ilk.toLocaleLowerCase("tr") && ilk !== ilk.toLocaleUpperCase("tr")) return okunus[0]!.toLocaleLowerCase("tr") + okunus.slice(1);
  return okunus;
}

/** Ad sınırı: harf/rakam içinde değil; kesme işaretli ek ("Claude'u") serbest ve korunur. */
function uygula(metin: string, sozluk: readonly SozlukGirdisi[]): string {
  return sozluk.reduce((acc, e) => acc.replace(new RegExp(`(?<![\\p{L}\\d])${kac(e.display)}(?![\\p{L}\\d])`, "giu"), (m) => biciminiKoru(m, e.spoken.trim())), metin);
}

export interface Okunus {
  /** Sağlayıcıya giden metin. */
  metin: string;
  /** Gösterim metnindeki her kelimenin okunuşta kaç kelime tuttuğu (sözlük çok kelimeli okunuş verince >1). */
  sayilar: number[];
}

export function okunusKur(gosterim: string, sozluk: readonly SozlukGirdisi[] = []): Okunus {
  if (sozluk.length === 0) return { metin: gosterim, sayilar: bosluksuz(gosterim).map(() => 1) };
  return { metin: uygula(gosterim, sozluk), sayilar: bosluksuz(gosterim).map((k) => bosluksuz(uygula(k, sozluk)).length) };
}

/** Sağlayıcı damgalarını gösterim kelimelerine geri eşler: çok kelimeli okunuşun damgaları tek kelimede birleşir (başlangıç ilkinin, bitiş sonuncunun). */
export function damgalariGeriEsle(gosterim: string, okunus: Okunus, damgalar: readonly KelimeDamgasi[]): KelimeDamgasi[] {
  const kelimeler = bosluksuz(gosterim);
  const toplam = okunus.sayilar.reduce((a, b) => a + b, 0);
  if (toplam !== damgalar.length) throw new Error(`Okunuş kelime zamanları gösterim metnine eşlenemedi; ${toplam} damga bekleniyordu, ${damgalar.length} geldi.`);
  let i = 0;
  return kelimeler.map((w, k) => {
    const grup = damgalar.slice(i, i + okunus.sayilar[k]!);
    i += okunus.sayilar[k]!;
    return { text: w, start: grup[0]!.start, end: grup.at(-1)!.end };
  });
}
