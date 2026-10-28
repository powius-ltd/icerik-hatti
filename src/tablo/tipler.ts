/** Tablo sözleşmesi: sütunlar, durumlar ve dış dünyaya açılan arayüzler (testte sahtelenir). */
export const SUTUNLAR = ["ornek_link", "paylasim_zamani", "durum", "fis_onay", "paylasim_onay", "video_link", "caption", "instagram_link", "not"] as const;
export type Sutun = (typeof SUTUNLAR)[number];

/** Yalnız hat bu sütunlara yazar; ekibin hücreleri (ilk iki + iki onay) koda yazılamaz. */
export const HAT_SUTUNLARI = ["durum", "video_link", "caption", "instagram_link", "not"] as const;
export type HatSutun = (typeof HAT_SUTUNLARI)[number];
export type HatAlani = Partial<Record<HatSutun, string>>;

export const DURUMLAR = ["yeni", "fis_hazir", "video_hazir", "zamanlandi", "yayinda", "hata"] as const;
export type TabloDurumu = (typeof DURUMLAR)[number];

export const TABLO_ADI = "AISCALE İçerik Hattı";
export const KLASOR = "AISCALE_ICERIK_HATTI";
export const VIDEO_KLASORU = `${KLASOR}/videolar`;

/** Tablodaki bir satır (ham hücreler okunmuş hâliyle). `no` = 1 tabanlı sayfa satırı (başlık 1). */
export interface Satir {
  no: number;
  ornekLink: string;
  paylasimZamani: string;
  durum: string;
  fisOnay: boolean;
  paylasimOnay: boolean;
  videoLink: string;
  caption: string;
  instagramLink: string;
  not: string;
}

export interface TabloIstemci {
  /** Başlık dahil ham değerler (kısa satırlar eksik hücre içerebilir). */
  oku(): Promise<string[][]>;
  /** Tek satırın yalnız verilen hat hücrelerini yazar; başka hücreye dokunmaz. */
  yaz(satirNo: number, alanlar: HatAlani): Promise<void>;
}

export interface DriveIstemci {
  /** Yerel dosyayı videolar klasörüne `ad` ile yükler, "bağlantıya sahip herkes görüntüler" linkini döndürür. */
  yukle(yerelYol: string, ad: string): Promise<string>;
}

export interface AltKomutlar {
  fis(a: { url: string; kosu: string; id: string }): Promise<void>;
  uret(fisYolu: string): Promise<void>;
  paylas(a: { fisYolu: string; saat: string; onay: string }): Promise<void>;
}

export type YayinDurumu = { durum: "yayinda"; link?: string } | { durum: "bekliyor" } | { durum: "hata"; neden: string };
export type YayinSorgu = (postId: string, hesap: string | undefined) => Promise<YayinDurumu>;
