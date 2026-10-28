/** Ham tablo değerlerinden satır kurar; satır kimliği, onay ve tarih ayrıştırma. */
import { createHash } from "node:crypto";
import { istanbulSaatiniCoz } from "../paylas/zaman.ts";
import { SUTUNLAR, type Satir } from "./tipler.ts";

/** Başlık satırı beklenen sütunlarla birebir aynı olmalı; yoksa tabloyu yanlış sayfada/bozuk okumayız. */
export function basligiDenetle(ham: string[][]): void {
  const baslik = (ham[0] ?? []).map((h) => h.trim());
  const beklenen = SUTUNLAR.join(" | ");
  if (SUTUNLAR.some((s, i) => baslik[i] !== s)) throw new Error(`Tablo başlık satırı beklenenle uyuşmuyor (beklenen: ${beklenen}).`);
}

const hucre = (s: string[], i: number) => (s[i] ?? "").trim();
export const onayMi = (deger: string) => deger.trim().toLowerCase() === "evet";

/** Başlıktan sonraki dolu satırları çözer (ornek_link boş satır atlanır). */
export function satirlariCoz(ham: string[][]): Satir[] {
  basligiDenetle(ham);
  const cikti: Satir[] = [];
  ham.slice(1).forEach((s, i) => {
    const ornekLink = hucre(s, 0);
    if (!ornekLink) return;
    cikti.push({
      no: i + 2,
      ornekLink,
      paylasimZamani: hucre(s, 1),
      durum: hucre(s, 2).toLowerCase(),
      fisOnay: onayMi(hucre(s, 3)),
      paylasimOnay: onayMi(hucre(s, 4)),
      videoLink: hucre(s, 5),
      caption: hucre(s, 6),
      instagramLink: hucre(s, 7),
      not: hucre(s, 8),
    });
  });
  return cikti;
}

/** Satır kimliği linke bağlıdır (satır no değil): satır kayarsa klasör ve eşleme değişmez. `kosu`/aday id kuralına uyar. */
export function satirKimligi(ornekLink: string): string {
  return `satir-${createHash("sha1").update(ornekLink.trim()).digest("hex").slice(0, 10)}`;
}

/** `GG.AA.YYYY SS:DD` (saniye ve tek haneli gün/ay/saat de olur) ya da `YYYY-AA-GG SS:DD` → `YYYY-AA-GG SS:DD` (İstanbul). */
export function zamanBicimle(deger: string): string {
  const t = deger.trim();
  const tr = /^(\d{1,2})\.(\d{1,2})\.(\d{4})[ T]+(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(t);
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})[ T]+(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(t);
  const m = tr ?? iso;
  if (!m) throw new Error(`paylasim_zamani biçimi "GG.AA.YYYY SS:DD" olmalı; gelen: ${t || "(boş)"}`);
  const [y, a, g, s, d] = tr ? [m[3], m[2], m[1], m[4], m[5]] : [m[1], m[2], m[3], m[4], m[5]];
  const p = (n: string | undefined) => (n ?? "").padStart(2, "0");
  const sonuc = `${y}-${p(a)}-${p(g)} ${p(s)}:${d}`;
  istanbulSaatiniCoz(sonuc); // geçersiz takvim (31 Şubat vb.) burada patlar
  return sonuc;
}
