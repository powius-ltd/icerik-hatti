// Kaynak: viral-uyarla/src/ortak/tipler.ts (335b436)
/**
 * Adımlar arası veri sözleşmesi. Her adım bir önceki adımın dosyasını bu şemalarla okur ve kendi çıktısını yazar.
 * Alan adı değişirse iki tarafı da (yazan + okuyan) aynı commit'te güncelle.
 *
 *   tara     → kosular/<kosu>/tara.json      Aday[]
 *   sec      → kosular/<kosu>/secim.json     Secilen[]
 *   cozumle  → kosular/<kosu>/<id>/dokum.json + analiz.json
 *   uyarla   → kosular/<kosu>/<id>/senaryo.json (şema: src/uyarla/senaryo-sema.ts)
 *   uret     → kosular/<kosu>/<id>/cikti/*.mp4
 */
import { z } from "zod";

export const platformSema = z.enum(["tiktok", "instagram"]);
export type Platform = z.infer<typeof platformSema>;

/** Taramada bulunan tek video. Bilinmeyen sayı alanı yazılmaz (0 ile doldurulmaz). */
export const adaySema = z.object({
  /** `<platform>-<platform video id>`; koşu içinde benzersiz, klasör adı olarak da kullanılır. */
  id: z.string().regex(/^[a-z]+-[A-Za-z0-9_-]+$/),
  platform: platformSema,
  url: z.string().url(),
  hesap: z.string().min(1),
  takipci: z.number().int().nonnegative().optional(),
  izlenme: z.number().int().nonnegative(),
  begeni: z.number().int().nonnegative().optional(),
  yorum: z.number().int().nonnegative().optional(),
  paylasim: z.number().int().nonnegative().optional(),
  sureSn: z.number().positive().optional(),
  /** ISO 8601 */
  yayinTarihi: z.string().datetime({ offset: true }),
  aciklama: z.string().optional(),
  /** Doğrudan indirilebilir video adresi (süresi dolabilir; dolarsa `cozumle` sayfa adresinden yeniden dener). */
  videoUrl: z.string().url().optional(),
  /** Bu adayı getiren arama ifadesi ya da etiket. */
  arama: z.string(),
});
export type Aday = z.infer<typeof adaySema>;

export const secilenSema = adaySema.extend({
  sira: z.number().int().positive(),
  puan: z.number(),
  /** izlenme ÷ takipçi; takipçi bilinmiyorsa yok. */
  oran: z.number().nonnegative().optional(),
  /** Neden seçildiğinin tek satırlık Türkçe açıklaması. */
  neden: z.string(),
});
export type Secilen = z.infer<typeof secilenSema>;

/** Whisper dökümü (orijinal dil, çevrilmez). Kelime: [başSn, sonSn, kelime]. */
export const dokumSema = z.object({
  dil: z.string(),
  segmentler: z.array(
    z.object({
      bas: z.number().nonnegative(),
      son: z.number().nonnegative(),
      metin: z.string(),
      kelimeler: z.array(z.tuple([z.number(), z.number(), z.string()])),
    }),
  ),
});
export type Dokum = z.infer<typeof dokumSema>;

export const sahneTuruSema = z.enum(["yuz", "ekran-kaydi", "ekran-goruntusu", "grafik", "metin-karti", "broll", "diger"]);
export type SahneTuru = z.infer<typeof sahneTuruSema>;

/** Kaynak videonun sahne sahne çözümlemesi (agy). Alıntılar orijinal dilde, birebir. */
export const analizSema = z.object({
  adayId: z.string(),
  dil: z.string(),
  sureSn: z.number().positive(),
  hook: z.object({
    metin: z.string(),
    kaynak: z.enum(["konusma", "ekran", "aciklama"]),
    /** Kısa tür etiketi: iddia, soru, sayi, haber, skec, liste, uyari, diger */
    tur: z.string(),
  }),
  sahneler: z
    .array(
      z.object({
        no: z.number().int().positive(),
        basSn: z.number().nonnegative(),
        sonSn: z.number().positive(),
        tur: sahneTuruSema,
        /** Görüntüde ne var (Türkçe, 1-2 cümle). */
        gorsel: z.string(),
        ekranYazisi: z.string().optional(),
        konusma: z.string().optional(),
        /** Kamera / hareket: sabit, yakınlaş, kaydır, kesme... */
        hareket: z.string().optional(),
      }),
    )
    .min(1),
  cta: z.object({ metin: z.string(), anahtar: z.string().optional() }).optional(),
  /** Doğrulanması gereken olgusal iddialar (sayı, ürün adı, tarih). */
  iddialar: z.array(z.object({ metin: z.string(), sn: z.number().nonnegative() })),
  kurgu: z.object({
    kesimSayisi: z.number().int().nonnegative(),
    tempo: z.enum(["yavas", "orta", "hizli"]),
    muzik: z.boolean(),
    altyazi: z.boolean(),
    yuzVar: z.boolean(),
  }),
});
export type Analiz = z.infer<typeof analizSema>;
