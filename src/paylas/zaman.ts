/**
 * `--saat "YYYY-AA-GG SS:DD"` İstanbul duvar saatidir (Türkiye yıl boyu UTC+3). Zernio'ya ofsetsiz `scheduledFor` + `timezone` olarak gider.
 * Geçmiş (ya da şimdi) saat reddedilir: Zernio geçmiş zamanı "hemen yayınla" sayar, bu da geri alınamaz.
 */
const TR_OFSET_MS = 3 * 3600 * 1000;

export class SaatHatasi extends Error {}

/** İstanbul duvar saatini UTC anına çevirir; biçim ya da takvim geçersizse `SaatHatasi`. */
export function istanbulSaatiniCoz(deger: string): Date {
  const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})$/.exec(deger.trim());
  if (!m) throw new SaatHatasi(`--saat biçimi "YYYY-AA-GG SS:DD" olmalı (İstanbul saati); gelen: ${deger}`);
  const [y, mo, d, h, mi] = m.slice(1).map(Number) as [number, number, number, number, number];
  const duvar = new Date(Date.UTC(y, mo - 1, d, h, mi));
  if (duvar.getUTCFullYear() !== y || duvar.getUTCMonth() !== mo - 1 || duvar.getUTCDate() !== d || duvar.getUTCHours() !== h) {
    throw new SaatHatasi(`--saat geçerli bir tarih değil: ${deger}`);
  }
  return new Date(duvar.getTime() - TR_OFSET_MS);
}

/** Zernio `scheduledFor` (ofsetsiz yerel zaman); `simdi`den önceki ya da eşit saat `SaatHatasi`. */
export function zamanlamaKur(deger: string, simdi: Date = new Date()): string {
  const an = istanbulSaatiniCoz(deger);
  if (an.getTime() <= simdi.getTime()) throw new SaatHatasi(`--saat geçmişte (${deger}); geçmiş saat hemen yayın demektir, reddedildi.`);
  const m = /^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})$/.exec(deger.trim()) as RegExpExecArray;
  return `${m[1]}T${m[2]}:00`;
}
