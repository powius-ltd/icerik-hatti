/** Fiş sözleşmesi: `fis.md` frontmatter'ı (zod) + okuma. Yazan: yaz.ts; dönüş alanları: geri-yaz.ts. */
import { parse } from "yaml";
import { z } from "zod";
import { sahneTuruSema } from "../ortak/tipler.ts";

export const kaynakSema = z.object({
  tur: z.enum(["video", "url", "metin"]),
  url: z.string().url().optional(),
  dosya: z.string().optional(),
});
export type Kaynak = z.infer<typeof kaynakSema>;

export const konumSema = z.enum(["ust", "orta", "alt", "yok"]);

export const fisSahneSema = z.object({
  no: z.number().int().positive(),
  basSn: z.number().nonnegative(),
  sonSn: z.number().positive(),
  tur: sahneTuruSema,
  /** Ekranda görünen yazı (Türkçe); yazı yoksa boş. */
  ekranYazisi: z.string(),
  /** Ekran yazısının kadrajdaki yeri; yazı yoksa "yok". */
  konum: konumSema,
  /** Seslendirilecek/okunacak Türkçe metin. */
  metin: z.string().min(1),
});
export type FisSahne = z.infer<typeof fisSahneSema>;

export const DURUMLAR = ["taslak", "onaylandi", "uretiliyor", "uretildi", "hazir", "paylasildi", "hata"] as const;

export const fisSema = z.object({
  fis_id: z.string().min(1),
  kaynak: kaynakSema,
  hesap: z.string().min(1),
  fis_onay: z.enum(["hayir", "evet"]),
  paylasim_onay: z.enum(["hayir", "evet"]),
  durum: z.enum(DURUMLAR),
  sahneler: z.array(fisSahneSema).min(1),
  aciklama_taslagi: z.string().min(1),
  /** Dönüş alanları (geri-yaz.ts): üretim bitince yazılır. */
  video: z.string().optional(),
  kapak: z.string().optional(),
  hata_notu: z.string().optional(),
});
export type Fis = z.infer<typeof fisSema>;

export const dogrulanacakSema = z.object({
  iddia: z.string().min(1),
  /** Kaynakta geçtiği an (sn); hazır metinde bilinmez. */
  kaynakSn: z.number().nonnegative().optional(),
});
export type Dogrulanacak = z.infer<typeof dogrulanacakSema>;

/** `fis.md` metninden frontmatter'ı çıkarıp doğrular. */
export function fisOku(metin: string): Fis {
  const m = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(metin);
  if (!m) throw new Error("Fiş '---' ile başlayan frontmatter içermiyor.");
  const sonuc = fisSema.safeParse(parse(m[1]!));
  if (!sonuc.success) {
    const sorunlar = sonuc.error.issues.slice(0, 6).map((s) => `${s.path.join(".") || "(kök)"}: ${s.message}`);
    throw new Error(`Fiş şemaya uymuyor:\n  ${sorunlar.join("\n  ")}`);
  }
  return sonuc.data;
}

/** `claude -p`'den istenen gövde: fişin modelin yazdığı kısmı. */
export const fisModelSema = z.object({
  sahneler: z.array(fisSahneSema).min(1),
  aciklama_taslagi: z.string().min(1),
  dogrulanacak: z.array(dogrulanacakSema),
});
export type FisModel = z.infer<typeof fisModelSema>;
