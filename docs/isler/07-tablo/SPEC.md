# 07 Tablo: Drive tablosu giriş kapısı

## Kazanım
Ekip Google Drive'daki tek tabloya örnek video linki + paylaşım zamanı yazar; `npm run hat -- tablo yokla` yeni satırları alır, fişi üretir, onaylı fişten videoyu üretir, Drive'a yükler, tabloya link + caption + durum yazar, paylaşım onaylı satırı o saatte Zernio'ya zamanlar.

## Plan
Tablo "AISCALE İçerik Hattı" (Drive `AISCALE_ICERIK_HATTI/`, videolar `.../videolar/`). Sütunlar: `ornek_link | paylasim_zamani (GG.AA.YYYY SS:DD, İstanbul) | durum | fis_onay | paylasim_onay | video_link | caption | instagram_link | not`. Ekip yalnız ilk iki sütun + iki onay (evet/hayır liste); gerisini hat yazar.
Durum: `yeni → fis_hazir → (fis_onay=evet) → video_hazir → (paylasim_onay=evet) → zamanlandi → yayinda | hata`. Tur başına satır başına tek geçiş.
- `src/tablo/erisim.ts`: jeton rclone `drive` remote'undan (süresi dolunca `rclone about` yeniletir); jeton log'a yazılmaz.
- `sheets.ts` (okuma + yalnız hat sütunlarına hücre bazlı yazma), `drive.ts` (rclone copyto + link), `kur.ts`, `yokla.ts` (durum makinesi), `alt-komutlar.ts` (fis/uret/paylas ayrı süreçte).
- Satır kimliği = `satir-<sha1(link)[:10]>`; klasör `kosular/tablo/<kimlik>/`. Yazmadan önce satır linkle yeniden bulunur (kayma).
- Tablodaki onay fişe aktarılır; onay üretimden hemen önce yeniden okunur, `hayır`sa üretim/zamanlama yapılmaz.

## Kararlar
- Kimlik yalnız linkten türer (satır no değil): satır kayarsa fiş klasörü ve eşleme değişmez. Aynı link iki satırda ise ikincisi hata.
- Hata satırı atlanır; yeniden denemek için ekip `durum` hücresini siler (yeni) ya da `fis_hazir`/`video_hazir` yazar. `not` temizlenir.
- Render/ağır iş yoklama komutunun içinde `agir` ile değil; tur cron/systemd'den çağrılır, üst üste binen tur `.hat/tablo.kilit` ile engellenir.
- `zamanlandi → yayinda` Zernio'dan salt okuma ile, zamandan 10 dk sonra.

## Kapsam dışı
Çoklu sayfa/hesap, tablodan zamanlanmış gönderiyi geri alma/iptal, yayın sonrası ölçüm, Zernio'ya gerçek gönderim denemesi (bu iş).

## Açık sorular
- Zamanlanmış gönderiden sonra paylasim_onay `hayır` yapılırsa Zernio'daki gönderi iptal edilmez (elle iptal).
- Drive "bağlantıya sahip herkes" linki kurum politikasına takılırsa `rclone link` hata verir; o satır hata olur.
