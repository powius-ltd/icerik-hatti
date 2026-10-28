Durum: bitti

# 06 testimonial: kadın derlemesi + 6 varyant (Drive kaynağından)

Sana düşen: `/home/dev/teslim/icerik-hatti/testimonial/` içindeki 7 mp4'e bak (Z:\\teslim\\icerik-hatti\\testimonial\\). Karar: Buğçe dışında kadın konuşmacı yok; derleme tek kişilik (43 sn).

## Kişi / cinsiyet (3 kareyle doğrulandı)
| Dosya | Kişi | Cinsiyet | Süre |
|---|---|---|---|
| TST-01 / TST-05 | Baki | erkek | 40 sn / 175 sn |
| TST-02 / TST-06 | Buğçe | KADIN | 69 sn / 794 sn |
| TST-03 / TST-07 | Hasan (fabrika teknisyeni) | erkek | 66 sn / 557 sn |
| TST-04 / TST-08 | Hakan | erkek | 36 sn / 1219 sn |
| October 22 / Çağrı (laptop) | - | erkek | 39 sn / - |
Laptop klasöründeki diğer ~15 dosya (aiscale-kopya, deneme vb.) testimonial değil; taranmadı.

## Çıktılar (`/home/dev/teslim/icerik-hatti/testimonial/`, 1080x1920, ffprobe ile doğrulandı)
kadin-derleme-bugce 43,3 sn; varyant-bugce-sonuc-once 34,1; varyant-bugce-kisa15 14,2; varyant-baki-sonuc-once 33,1; varyant-baki-kisa15 16,5; varyant-hakan-sonuc-once 31,8; varyant-hakan-kisa15 16,0. Her birinin kapak png'si ve `liste.md` var. Ses ~-13 ile -14,4 LUFS.

## Yöntem
Kaynaklar zaten 1080x1920 ama hazır "iki panel (konuk üstte, ev sahibi altta) + yakılmış altyazı" kesimleri. Konuk paneli yüz merkezli kırpıldı, bulanık arka plan üstüne alındı, kendi altyazımız (kelime vurgulu, beyaz/siyah kontur, alt %20 üstünde) ve ilk 3 sn kanca üst yazısı eklendi. Betikler: `tools/testimonial/` (`asr.py`, `build.py`, `specs/*.json`, `uret.sh`). Çıktı: `/home/dev/cikti/aiscale-testimonial/cikti/`.

## Sorunlar / sınırlar
- Kadın tek kişi (Buğçe): "yalnız kadınlar konuşuyor" derlemesi onun 5 kesitinden. Daha çeşitli derleme için başka kadın konuşmacı videosu gerek.
- Whisper dökümü bazı yerlerde hatalı ("Eiskl", "kurudum"); yalnız temiz cümleler seçildi, bir iki kelime elle düzeltildi. Yayın öncesi altyazıya göz at.
- Hasan (TST-03/07) paneli dikey (siyah bantlı) ve düşük çözünürlük; Hakan'la değiştirildi.
- "Kısa 15 sn" varyantları 14-16,5 sn.
- Kaynakta zaten var olan tanıtım anlatıcı sesi (VO) Hakan varyantlarının ilk 5 sn'sinde kullanıldı.
- Ekran paylaşımı kareleri (uygulama ekranı) kesimlerden çıkarıldı; yüz hep kadrajda.
