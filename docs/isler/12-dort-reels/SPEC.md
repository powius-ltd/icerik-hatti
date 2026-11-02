# IHT-12: 3 Kasım dört Reels

Sana düşen: Sabah `/home/dev/teslim/icerik-hatti/2026-11-03-dort-reels/` altındaki videoları izle, zamanlamayı onayla. Yayın ve Zernio bu pakette yok.

| Saat | Video | Tür | Neden seçildi |
|---|---|---|---|
| 12:00 | HyperFrames (2 Kas üretimi, 0 $) | Ücretsiz araç | Hazır ve gönderilmedi; hesapta en iyi tür |
| 15:00 | IKEA etkisi | Pazarlama | Kaynaklı rakam + bu hafta uygulanacak somut adım; gün içi çeşitlilik kararı |
| 18:00 | Airbnb gevrek hikâyesi | Startup / hikâye | Hikâye/isim türü ortanca izlenmede ikinci; startup yuvası |
| 22:00 | Graphify | Ücretsiz araç (Claude) | Haftalık ağırlık ücretsiz araç; taramada 58.716 izlenme; 141 bin yıldız, kurulumu kaydedilir |

Elenen: Televizyon (2 Kas kararı: reklam kapatma güvenilir bulunmadı). Üç boy, %50 ortaklık yayında. Trader beceri seti (finansal risk).

## Kaynaklar (2026-11-03)
- IKEA: Norton, Mochon, Ariely, "The IKEA effect", Journal of Consumer Psychology 22(3), 2012, https://dash.harvard.edu/handle/1/12136084 . %63 ikincil kaynaklarda ve makale alıntısında var; bitmeyen ya da bozulan işte etki kaybolur (özet). Dolar tutarı kullanılmadı.
- Airbnb: https://en.wikipedia.org/wiki/Brian_Chesky , https://moneywise.com/news/top-stories/brian-chesky-airbnb-cereal-startup-funding , https://www.inc.com/tess-townsend/airbnb-gebbia-trough-of-sorrow-npr.html . Kutu sayısı kaynaklarda 500-1.000 arası değişiyor, kullanılmadı; gelir 20-30 bin $ aralık olarak verildi. Hamamböceği sözü "aktarılana göre" diye geçer.
- Graphify: https://github.com/Graphify-Labs/graphify (README, GitHub API: 141.127 yıldız, Apache-2.0). "71 kat", "%80" gibi tasarruf rakamları kullanılmadı: biri üçüncü kişi iddiası, öbürü ücretli bulut sürümünün reklamı.

## PAKET

**Kazanım:** Sabah dört Reels (mp4 + kapak + açıklama) teslim klasöründe durur; kontrol edip saatlere koyman yeter.

**Plan:** (1) `tools/gece-12.sh` üç fişi (`fisler/`) ve çizimleri (`tools/cizim-kod/dort-reels.mjs`) koşu klasörüne koyar. (2) Sesi ve videoyu üretir. (3) Ajan kareleri denetler, görsel hatayı düzeltir, ses önbellekten yeniden render eder. (4) Betik teslim klasörünü doldurur, ölçüleri denetler, dalı push eder. Ajan yalnız `docs/isler/12-dort-reels/`, `tools/cizim-kod/dort-reels.mjs` dosyalarına dokunur; `metin` alanı değişmez.

**Kararlar:** Fişler bu pakette `fis_onay: evet`, çünkü kullanıcı "sabah kontrol ederim" dedi; `paylasim_onay: hayir` kalır. Sözlüğe Graphify, Airbnb'yi, McCain, Graham, Michael eklendi. HyperFrames yeniden üretilmez.

**Goal:** `tools/gece-12.sh` içinde. Bitti: üç videonun her sahnesinden kare incelendi, taşma/çakışma 0; RAPOR.md ilk satırı "Durum: bitti". Ya da 8 turda dur, "Durum: yarım". Videolar ajan olmadan da üretilmiş olur.

**Sigorta:** Ses tavanı 1,00 $ (betik her çağrıdan önce denetler, video başına 1.000 karakter); ajan `gece-claude 3`, Sonnet. Ajana ElevenLabs anahtarı verilmez, metin değişirse ses çağrısı hata verir, para çıkmaz. Yeni ücretli servis yok. Zernio, `hat paylas`, `hat tablo` yasak. Aynı hata 3 kez → dur; soru yok, karar GUNLUK "Bekleyen" yerine RAPOR'a `Karar: …`. Port açılmaz; içeride `agir` yok.

**Koşu:** `agir --gece --oncelik 5 --ram 5 --ad iht-4reels -- bash /home/dev/projeler/icerik-hatti/tools/gece-12.sh`. Worktree `.claude/worktrees/gece-12`, dal `gece-iht-12`.

**Kullanıcıya düşen:** İzleme, zamanlama, yayın. ManyChat SEMİNER kuralının yeni gönderilerde çalıştığını kontrol.

## Kapsam dışı
Yayın, zamanlama, Zernio, Drive yükleme, yeni şablon kalıbı, b-roll.

## Açık sorular
Yok; konu seçimi gerekçeyle yukarıda, kullanıcı sabah değiştirebilir.
