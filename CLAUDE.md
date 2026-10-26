# icerik-hatti

Tutan videoyu bulup Türkçeye birebir uyarlayan, patronun klon sesiyle üretip Zernio ile Instagram'a paylaşan tek hat. Müşteri: patron (patronun içerik hesabı). Benzetme: üç ayrı dükkân (bulan, pişiren, kargolayan) tek mutfakta; malzemeyi istediğin istasyondan bırakabilirsin.

## Önce oku (sırayla)
1. `GUNLUK.md` son kayıt + "Bekleyen" (paralel oturum işi değiştirmiş olabilir).
2. `YOL.md` "Şimdi" ve "Senin kapıların".
3. Çalışılacak işin `docs/isler/<NN-ad>/SPEC.md`'si.
Projeler arası bilgi: `/home/dev/beyin/projeler/icerik-hatti.md`.

## Sınırlar
- Bu projenin işi: BUL → FİŞ → [onay] → ÜRET + SES → [onay] → PAYLAŞ; aradan giriş (link/dosya ya da hazır metin). Değil: ölçüm/analiz paneli, yorum→DM (ManyChat'te kalır), başka müşteri hesapları (yeri: sosyal-panel).
- Kaynak repolar `viral-uyarla`, `kreatif-studyo`, `sosyal-panel`: yalnız okunur, parça buraya kopyalanır; oralara yazılmaz.
- Para: Apify, ElevenLabs, Zernio; koşmadan tutar + tavan, onay. Paylaşım geri alınamaz: video başına açık onay olmadan gönderim yok.
- Gizli anahtarlar patronun hesaplarına ait; yalnız ortam değişkeninden.
- Uygulama sırasında gelen yeni fikir çalışan işe girmez, `YOL.md` "Sonra"ya.

## Bitti sayılır
Verify çıktısı raporda (`AGENTS.md` komutları) + diff plana karşı incelendi + dar commit (`git commit --only -- <yollar>`) + `GUNLUK.md` satırı.

@AGENTS.md
