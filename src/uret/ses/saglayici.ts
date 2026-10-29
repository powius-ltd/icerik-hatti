// Kaynak: kreatif-studyo/src/production/voice/provider.ts (b6aff3d); sadeleştirildi (Billing/contracts yok)
/** Ses sağlayıcısı arayüzü: bütün okunuş metni tek çağrıda sese çevrilir, söylenen kelimelerin zamanı döner. */
export interface KonusmaIstegi {
  /** Bütün sahnelerin okunuş metni, sırayla, tek metin (kelimeler boşlukla ayrılır). */
  metin: string;
  sesId: string;
}

/** Söylenen bir kelimenin zamanı (ses dosyasının başından saniye). `text` noktalamasızdır DEĞİL: boşluksuz parçadır. */
export interface KelimeDamgasi {
  text: string;
  start: number;
  end: number;
}

export interface KonusmaSonucu {
  /** MP3 baytları. */
  ses: Uint8Array;
  /** Metnin boşlukla ayrılan her kelimesi için bir damga, sırayla. */
  damgalar: KelimeDamgasi[];
  model: string;
  /** İşlenen karakter sayısı (fatura birimi). */
  karakter: number;
  usd: number;
}

export interface SesSaglayici {
  readonly id: "elevenlabs" | "chatterbox";
  /** Sonucu etkileyen ayarların (model, ses ayarları) parmak izi; önbellek imzasına girer. */
  readonly imza?: string;
  /** Ağ çağrısı: testte çalışmaz, sahtesi verilir. Başarısızlıkta fırlatır. */
  konus(istek: KonusmaIstegi): Promise<KonusmaSonucu>;
}
