# IHT-12: günlük dört Reels

Sana düşen: Sabah iki videoyu izle, zamanla. Yayın ve Zernio bu pakette yok.

## 3 Kas takvimi (kullanıcı onayladı, 2026-11-03)
| Saat | Alan | Konu | Kaynak izlenme | Durum |
|---|---|---|---|---|
| 12:00 | Claude | HyperFrames | - | Hazır (2 Kas), 0 $ |
| 15:00 | Pazarlama | "Çok pahalı" itirazı | 3,2 M | `fisler/cok-pahali.md`, gece üretilir |
| 18:00 | Startup | Rekabet / Peter Thiel | 388 B | `fisler/rekabet.md`, gece üretilir |
| 22:00 | Claude + startup | Hukuk: Claude'la yapılan uygulama | 200 B | Bu gece yok; kullanıcı yeni şablonla bakacak |

Stok: Pahalı model (takvimden). Kuru koşudan geçmiş fişli öneriler: IKEA etkisi, Airbnb gevrek, Graphify; `fis_onay: hayir`, takvimin yerine geçmez.

## Onaylı fişlerin kaynakları (2026-11-03)
- Çok pahalı: konu https://www.tiktok.com/@d_russells/video/7523738915337981240 (3,2 M; yalnız açıklaması okundu, video dökümü alınmadı, metin özgün). Gourville, "Pennies-a-Day", Journal of Consumer Research 24(4), 1998, https://doi.org/10.1086/209517 ; özetten: laboratuvar deneyleri, günlük çerçeve küçük harcamaları karşılaştırma olarak akla getirir, değerlendirme ve uyum değişir. Etki büyüklüğü verilmedi. 3.650 ₺ / 10 ₺ örnektir. Üç cevap ve "indirim yerine kapsam" araştırma değil, öneridir.
- Rekabet: konu https://www.instagram.com/p/C9bhagTRZV-/ (388 B; açıklama okundu, döküm alınmadı). Anekdot: https://abovethelaw.com/?p=1088190 (Scalia, Kennedy, 2004'te arkadaşın sorusu, Thiel'in aktarımı). 37 sent, 178 $: https://fortune.com/2017/01/19/peter-thiels-latest-investment-airlines (2014 WSJ yazısı). %21: aynı yazı ve kitap alıntısı https://www.goodreads.com/quotes/9011406-creating-value-is-not-enough-you-also-need-to-capture-some . Rakamlar Thiel'in; bağımsız mali tabloyla doğrulanmadı, metin bu yüzden "kitabına göre" der.

## Stok fişlerin kaynakları (2026-11-03)
- IKEA: Norton, Mochon, Ariely, "The IKEA effect", Journal of Consumer Psychology 22(3), 2012, https://dash.harvard.edu/handle/1/12136084 . %63 ikincil kaynaklarda ve makale alıntısında var; bitmeyen ya da bozulan işte etki kaybolur (özet). Dolar tutarı kullanılmadı.
- Airbnb: https://en.wikipedia.org/wiki/Brian_Chesky , https://moneywise.com/news/top-stories/brian-chesky-airbnb-cereal-startup-funding , https://www.inc.com/tess-townsend/airbnb-gebbia-trough-of-sorrow-npr.html . Kutu sayısı kaynaklarda 500-1.000 arası değişiyor, kullanılmadı; gelir 20-30 bin $ aralık olarak verildi. Hamamböceği sözü "aktarılana göre" diye geçer.
- Graphify: https://github.com/Graphify-Labs/graphify (README, GitHub API: 141.127 yıldız, Apache-2.0). "71 kat", "%80" gibi tasarruf rakamları kullanılmadı: biri üçüncü kişi iddiası, öbürü ücretli bulut sürümünün reklamı.

## PAKET

**Kazanım:** Sabah iki yeni Reels ve hazır HyperFrames (mp4 + kapak + açıklama) teslim klasöründe durur; kontrol edip saatlere koyman yeter.

**Plan:** (1) `tools/gece-12.sh <saat:id,...>` onaylı fişleri (`fisler/`) ve çizimleri (`tools/cizim-kod/dort-reels.mjs`) koşu klasörüne koyar. (2) Sesi ve videoyu üretir. (3) Ajan kareleri denetler, görsel hatayı düzeltir, ses önbellekten yeniden render eder. (4) Betik teslim klasörünü doldurur, ölçüleri denetler, dalı push eder. Ajan yalnız `docs/isler/12-dort-reels/`, `tools/cizim-kod/dort-reels.mjs` dosyalarına dokunur; `metin` alanı değişmez.

**Kararlar:** Fiş ancak kullanıcı konuyu onaylayınca `fis_onay: evet` olur; betik onaysız fişte para harcamadan durur. `paylasim_onay: hayir` kalır. Sözlüğe Graphify, Airbnb'yi, McCain, Graham, Michael, Thiel, Scalia, Kennedy, PayPal, Google, Gourville eklendi. HyperFrames yeniden üretilmez.

**Goal:** `tools/gece-12.sh` içinde. Bitti: iki videonun her sahnesinden kare incelendi, taşma/çakışma 0; RAPOR.md ilk satırı "Durum: bitti". Ya da 8 turda dur, "Durum: yarım". Videolar ajan olmadan da üretilmiş olur.

**Sigorta:** Ses tavanı 0,60 $ (betik her çağrıdan önce denetler, video başına 1.000 karakter); ajan `gece-claude 3`, Sonnet. Ajana ElevenLabs anahtarı verilmez, metin değişirse ses çağrısı hata verir, para çıkmaz. Yeni ücretli servis yok. Zernio, `hat paylas`, `hat tablo` yasak. Aynı hata 3 kez → dur; soru yok, karar GUNLUK "Bekleyen" yerine RAPOR'a `Karar: …`. Port açılmaz; içeride `agir` yok.

**Koşu:** `agir --gece --oncelik 5 --ram 5 --ad iht-reels -- bash /home/dev/projeler/icerik-hatti/tools/gece-12.sh 15:cok-pahali,18:rekabet`. Worktree `.claude/worktrees/gece-12`, dal `gece-iht-12`.

**Kullanıcıya düşen:** İzleme, zamanlama, yayın. ManyChat SEMİNER kuralının yeni gönderilerde çalıştığını kontrol.

## Kapsam dışı
Yayın, zamanlama, Zernio, Drive yükleme, yeni şablon kalıbı, b-roll.

## Açık sorular
Kalıcı günlük kurulum ve 22:00 hukuk videosunun yeni şablonu sonraki adım.
