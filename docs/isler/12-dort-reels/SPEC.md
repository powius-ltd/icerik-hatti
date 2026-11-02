# IHT-12: günlük dört Reels

Sana düşen: Konu listesini onayla. Ses ve üretim onaydan önce başlamaz; yayın ve Zernio bu pakette yok.

## 3 Kas takvimi (2 Kas 12:22 tablosu, `GUNLUK.md` Bekleyen; onay bekliyor)
| Saat | Alan | Konu | Kaynak izlenme | Durum |
|---|---|---|---|---|
| 12:00 | Claude | HyperFrames | - | Hazır (2 Kas), 0 $ |
| 15:00 | Pazarlama | "Çok pahalı" itirazı | 3,2 M | Fiş onaydan sonra yazılır |
| 18:00 | Startup | Rekabet / Peter Thiel | 388 B | Fiş onaydan sonra yazılır |
| 22:00 | Claude + startup | Hukuk: Claude'la yapılan uygulama | 200 B | Fiş onaydan sonra yazılır; hukukçu kontrolü önerilir |

Stok: Pahalı model (takvimden). Kuru koşudan geçmiş fişli öneriler: IKEA etkisi, Airbnb gevrek, Graphify; `fis_onay: hayir`, takvimin yerine geçmez.

## Stok fişlerin kaynakları (2026-11-03)
- IKEA: Norton, Mochon, Ariely, "The IKEA effect", Journal of Consumer Psychology 22(3), 2012, https://dash.harvard.edu/handle/1/12136084 . %63 ikincil kaynaklarda ve makale alıntısında var; bitmeyen ya da bozulan işte etki kaybolur (özet). Dolar tutarı kullanılmadı.
- Airbnb: https://en.wikipedia.org/wiki/Brian_Chesky , https://moneywise.com/news/top-stories/brian-chesky-airbnb-cereal-startup-funding , https://www.inc.com/tess-townsend/airbnb-gebbia-trough-of-sorrow-npr.html . Kutu sayısı kaynaklarda 500-1.000 arası değişiyor, kullanılmadı; gelir 20-30 bin $ aralık olarak verildi. Hamamböceği sözü "aktarılana göre" diye geçer.
- Graphify: https://github.com/Graphify-Labs/graphify (README, GitHub API: 141.127 yıldız, Apache-2.0). "71 kat", "%80" gibi tasarruf rakamları kullanılmadı: biri üçüncü kişi iddiası, öbürü ücretli bulut sürümünün reklamı.

## PAKET

**Kazanım:** Sabah dört Reels (mp4 + kapak + açıklama) teslim klasöründe durur; kontrol edip saatlere koyman yeter.

**Plan:** (1) `tools/gece-12.sh <saat:id,...>` onaylı fişleri (`fisler/`) ve çizimleri (`tools/cizim-kod/dort-reels.mjs`) koşu klasörüne koyar. (2) Sesi ve videoyu üretir. (3) Ajan kareleri denetler, görsel hatayı düzeltir, ses önbellekten yeniden render eder. (4) Betik teslim klasörünü doldurur, ölçüleri denetler, dalı push eder. Ajan yalnız `docs/isler/12-dort-reels/`, `tools/cizim-kod/dort-reels.mjs` dosyalarına dokunur; `metin` alanı değişmez.

**Kararlar:** Fiş ancak kullanıcı konuyu onaylayınca `fis_onay: evet` olur; betik onaysız fişte para harcamadan durur. `paylasim_onay: hayir` kalır. Sözlüğe Graphify, Airbnb'yi, McCain, Graham, Michael eklendi. HyperFrames yeniden üretilmez.

**Goal:** `tools/gece-12.sh` içinde. Bitti: üç videonun her sahnesinden kare incelendi, taşma/çakışma 0; RAPOR.md ilk satırı "Durum: bitti". Ya da 8 turda dur, "Durum: yarım". Videolar ajan olmadan da üretilmiş olur.

**Sigorta:** Ses tavanı 1,00 $ (betik her çağrıdan önce denetler, video başına 1.000 karakter); ajan `gece-claude 3`, Sonnet. Ajana ElevenLabs anahtarı verilmez, metin değişirse ses çağrısı hata verir, para çıkmaz. Yeni ücretli servis yok. Zernio, `hat paylas`, `hat tablo` yasak. Aynı hata 3 kez → dur; soru yok, karar GUNLUK "Bekleyen" yerine RAPOR'a `Karar: …`. Port açılmaz; içeride `agir` yok.

**Koşu:** `agir --gece --oncelik 5 --ram 5 --ad iht-4reels -- bash /home/dev/projeler/icerik-hatti/tools/gece-12.sh 15:<id>,18:<id>,22:<id>`. Worktree `.claude/worktrees/gece-12`, dal `gece-iht-12`.

**Kullanıcıya düşen:** İzleme, zamanlama, yayın. ManyChat SEMİNER kuralının yeni gönderilerde çalıştığını kontrol.

## Kapsam dışı
Yayın, zamanlama, Zernio, Drive yükleme, yeni şablon kalıbı, b-roll.

## Açık sorular
3 Kas takvimi onaylanıyor mu; kalıcı günlük kurulum sonraki adım.
