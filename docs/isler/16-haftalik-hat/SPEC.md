# IHT-16: haftalık hat, günde 4 içerik

Sana düşen (haftada ~15 dk + günde ~10 dk):
1. Her Pazar haftanın 28 konusunu onayla (aşağıdaki tablo; bu hafta 9–15 Kas).
2. Her sabah o günün 4 videosunu izle, "tamam" de; kendi saatlerine zamanlanır.
3. Tek seferlik: ses bütçesi onayı (haftada ~8,5 $) ve yeni öğrenci kaydı (seri havuzu 13 Kas'ta biter).

Hedef (kullanıcı, 7 Kas): "İçerik hattında günlük 4 içerik çıkması." · "Konuları önceden belirleyip haftalık olarak direkt onlara zamanlayıp oluşturup ben izleyeceğim."

## Kazanım
Konu her gün aranmaz: Pazar onaylanan hafta takvimi gece toplu üretilir, sabah 4 video teslim klasöründe durur; izleyip onaylayınca 12 / 15 / 18 / 22'ye zamanlanır. Kaçan slot olmaz.

## Akış (benzetme: haftalık menü + gece mutfağı)
```
Pazar: hafta takvimi (28 konu) ──[sen onaylarsın]──► fişler toplu yazılır (ajan, 0 $)
   │
   ▼  her gece (önceki gün 23:00)
gece betiği: takvimdeki ertesi günün 4 fişi → ses (≤1,20 $) → render → kare denetimi → teslim
   │
   ▼  her sabah
sen izlersin ──["tamam"]──► Zernio: 12:00 · 15:00 · 18:00 · 22:00
```
Bugünkü fark: gündüz tek tek üretim yerine gece toplu; konu onayı günlük değil haftalık.

## Hafta takvimi (9–15 Kas, öneri)
Slot kuralı (6 Kas kararı): 12 ve 22 araç · 15 serbest (Claude tasarruf / pazarlama) · 18 ÖĞRENCİ KURDU. Ekranda terminal komutu yok (6 Kas).
| Gün | 12:00 araç | 15:00 serbest | 18:00 ÖĞRENCİ KURDU | 22:00 araç |
|---|---|---|---|---|
| 9 Pt | Claude'dan Instagram'a otomatik yükleme | Klad tasarruf: işe göre model seçimi | 03 Hakan: diş kliniği yazılımı | Site animasyonu (Claude) |
| 10 Sa | TV'yi temalı açılış ekranına çevirmek | Klad tasarruf: uzayan sohbeti temizle | 04 Buğçe: 15 kişiden binlerce kişiye | Claude ile 3D video |
| 11 Ça | Trader skill paketi (yumuşatılmış) | Boşlukla ürünü premium göstermek | 05 Çağrı: müzik kursu ders takibi | 5 gizli istem kalıbı |
| 12 Pe | Eklentiler kotanı yer mi? | Rule of 3 / çapalama | 06 Hakan: karşındakini uzman yap istemi | AI agent office |
| 13 Cu | Toplantı notunu e-postaya çevir | Klad tasarruf: skill ile kota | 07 Onur: arıza → chatbot → mühendis | Aynı soruyu iki yapay zekâya sordum |
| 14 Ct | Haftalık raporu tek istemle | "Müşteri sana değil kendine bakar" | 08 Sümeyye: hamburger tekniğiyle satış | Claude'a kötü cevap verdiren alışkanlık |
| 15 Pz | Claude'u ilk açtıysan ilk iş | Haftanın en çok kaydedileni (tekrar açı) | 09 Harita mühendisi: sohbeti ürüne çevir | 9 Kas analitiğine göre |
Kaynak: 1 Kas taraması (`kosular/2026-11-01-tarama/`), testimonial dökümleri (`/home/dev/cikti/aiscale-testimonial/dokum/`), teardown konuları (6 Kas). Araç Reels'inde araç üretimden önce kaynaktan doğrulanır; doğrulanmazsa yerine havuzdan sıradaki girer.

## Kullanıcıdan gerekenler (günde 4 için)
| Ne | Ne zaman | Süre / tutar | Olmazsa |
|---|---|---|---|
| Haftalık konu onayı | Pazar | ~15 dk | Hafta başlamaz (gece betiği onaysız fişte para harcamadan durur) |
| Günlük izleme + "tamam" | her sabah, 12:00'den önce | ~10 dk | O günün videoları zamanlanmaz (proje kuralı: video başına onay) |
| Ses bütçesi | bir kez | günde ≤1,20 $, haftada ~8,5 $; ElevenLabs bakiyesi haftada ~20 bin karakter | Gece betiği bakiye yetmezse durur |
| Yeni öğrenci kaydı | 13 Kas'tan önce | arşivde 9 bölüm var | 18:00 seri iki günde bire iner |
| Logo dosyası | isteğe bağlı | — | yazı markası kalır |
| rclone / Drive tablosu | gerekmez | — | onay sohbetten verilir |
| ManyChat SEMİNER DM kontrolü | bir kez | ~5 dk panelden | yorumlar DM'e dönmüyor olabilir (2–3 Kas) |

## Teknik işler (görevler GOREVLER.md'de)
1. Takvim dosyası `docs/takvim/<yıl>-H<hafta>.tsv` (`tarih saat id fiş_yolu`); gece betiği slotları buradan okur.
2. `tools/gece-12.sh` → fiş yolu takvimden (şu an yalnız `12-dort-reels/fisler/`), ızgara kancalı fiş için `reels.sh izgara` adımı, ajan denetimi çizim dosyasını `reels-<id>.mjs`ten bilir.
3. Sabah teslim: 4 video tek klasör + Taildrop.
4. Onaydan sonra 4 zamanlama tek komut (`reels.sh paylas` ×4).

## Kapsam dışı
Apify ile yeni tarama (hafta 1 $ ayrı onay), Drive tablosu, otomatik onay (proje kuralı izin vermiyor), SPN'e know-how aktarımı (kullanıcı orada bulunmak istiyor, bekliyor).

## Açık sorular
- Gece koşusunu yöneticinin kuyruğa koyması mı (YONTEM §11), yoksa her Pazar onayından sonra hafta boyu kendiliğinden mi (cron)?
- Günlük onay sabah mı, yoksa gece üretimden sonra Drive/teslim + sabah toplu mu? (öneri: sabah 09–11 arası tek mesaj)
- Hafta takvimi hücreleri onaylanırsa fişler toplu mu onaylanır, yoksa yalnız konu onayı yeter mi? (öneri: konu onayı = fiş onayı; fiş metni sabah videoyla birlikte görülür)
