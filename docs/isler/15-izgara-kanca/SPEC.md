# IHT-15: ÖĞRENCİ KURDU serisi + iki haftalık takvim

Sana düşen: takvim onaylandı (6 Kas); her fiş üretimden önce yine senin onayından geçer.

## Kazanım
Her gün en az bir "ÖĞRENCİ KURDU · NN" Reels'i en iyi tutan kancamızla (4'lü ızgara, %71 3 sn tutma) çıkar; kalan slotlar en çok kaydettiren tür olan araç Reels'iyle dolar. Konu her sabah aranmaz, listeden sıradaki alınır.

## Neden bu kalıp (kanıt)
- 3 sn tutma: Sosyal kanıt mix %71 (4 yüz, hızlı kesit), aynı saatte Hasan %51, Pahalı model %55 → fark saatten değil formattan (`docs/analitik/2026-11-05-reels.md`, `2026-11-06-testimonial-mix.md`).
- Kaydetme: araç içeriği %6,0; testimonial/pazarlama/startup %0,3–1,9 (`2026-11-05-tum-hesap.md`). Bu yüzden gövde kopyalanabilir 3 adım.
- Rakip teardown: tepe hesaplarda numaralı seri nadir; "SERİ · NN" ayrışma fırsatı (çıkarım, doğrulanmadı).

## Kalıp
`4'lü ızgara kanca (~5,7 sn; 3 sonuç cümlesi, son konuşan bölümün kahramanı)` → `gazete gövde (~37 sn): kim → sistem üç parça → 1/2/3 → SEMİNER`. Araç: `tools/reels.sh izgara <spec> <id>`; örnekler `fisler/aysenur-uygulama.md`, `fisler/baki-kanal.md`, `tools/testimonial/specs/izgara-*.json`.

## Bölüm havuzu (testimonial arşivi, dökümden)
| NN | Kişi | Kurduğu | Kaynak | Durum |
|---|---|---|---|---|
| 01 | Ayşenur | 4 saatte uygulama | SH-05 | Yayında 6 Kas 13:05 |
| 02 | Baki | 3. günde otomatik video kanalı | TST-01/05 | 6 Kas 18:00 |
| 03 | Hakan | Diş kliniği yazılımı, abonelikle satış | TST-04 | öneri |
| 04 | Buğçe | 15 kişiden binlerce kişiye: AI danışmanlı fitness uygulaması | TST-02/06 | öneri |
| 05 | Çağrı (öğretmen, Tavşanlı) | Müzik kursu ders/ödev takip uygulaması | SH-01 | öneri |
| 06 | Hakan | İstem kalıbı: karşındakini uzman yap (rol + görev + örnek) | TST-08 | öneri |
| 07 | Onur (Florida) | Arıza → chatbot → mühendis ataması | SH-04 | öneri |
| 08 | Sümeyye | Hamburger tekniğiyle satış görüşmesi | SH-03 | öneri (pazarlama türü) |
| 09 | Harita mühendisi | Sıradan sohbeti ürüne çevirmek (kalori uygulaması fikri) | SH-02 | öneri |
Havuz 9 bölüm; günde 1 ile ~9 gün. Yeni kayıt gelmezse 10. günden itibaren seri iki günde bire iner.

## İki haftalık takvim (öneri)
Slot kuralı: 18:00 ÖĞRENCİ KURDU · 12:00 ve 22:00 araç Reels · 15:00 serbest (Claude tasarruf / deneme).
| Gün | 12:00 araç | 15:00 serbest | 18:00 ÖĞRENCİ KURDU | 22:00 araç |
|---|---|---|---|---|
| 6 Kas Cu | (kaçtı) | 01 Ayşenur (13:05) | 02 Baki | konu seçilmedi |
| 7 Kas Ct | Claude'dan Instagram'a yükleme hattı | Klad tasarruf: model seçimi | 03 Hakan klinik | Grill Me skill |
| 8 Kas Pz | Site animasyonu (Claude) | Klad tasarruf: bağlam temizliği | 04 Buğçe | Trader skill paketi |
| 9 Kas Pt | TV'yi launcher'a çevirmek | Boşlukla premium göstermek | 05 Çağrı | 5 gizli komut |
| 10 Kas Sa | Claude ile 3D video | Klad tasarruf: skill ile kota | 06 Hakan istem kalıbı | Eklenti kota uyarısı |
| 11 Kas Ça | Rule of 3 / çapalama | — | 07 Onur | Aracın yerine ajan |
| 12 Kas Pe | — | — | 08 Sümeyye | — |
| 13 Kas Cu | — | — | 09 Harita mühendisi | — |
| 14–19 Kas | araç havuzu | — | yeni kayıt varsa 10+ | araç havuzu |
"—" olan hücreler 9 Kas analitiğinden sonra doldurulur (tutanın payı artar).

## Kurallar ve tavanlar
- Ekranda terminal komutu yok (6 Kas kararı): kurulum "Claude'a şunu söyle: … kur" diye anlatılır; komut gerekiyorsa yalnız açıklamada.
- Konu listesi onayı = kazanım onayı; fiş metni yine video başına onaylanır, paylaşım izlenip onaylanınca saatine (4 Kas kararı).
- Ses 0,15–0,30 $/video, gün tavanı 1,20 $ (4 Kas kararı). Apify bu pakette yok (araç konuları 1 Kas taramasından).
- Gelir/rakam iddiası dökümde doğrulanmıyorsa kullanılmaz; "3 adım" öğrencinin birebir yöntemi değil, "nasıl kurulur" anlatımı (fişte not).
- Gece toplu üretim (`tools/gece-12.sh`) şimdilik `docs/isler/12-dort-reels/fisler/` okuyor ve ızgara kancayı bilmiyor; ÖĞRENCİ KURDU gündüz `reels-uret` ile üretilir.

## Kapsam dışı
Yeni testimonial kaydı toplamak, Drive tablo girişi, gece betiğine ızgara desteği (YOL "Sonra"), kapakta seri şeridi tasarımı.

## Açık sorular
- 22:00 ve 15:00 slotlarında araç mı, seri mi ağırlık? 9 Kas analitiğiyle karar.
- Kapak/ilk karede "ÖĞRENCİ KURDU · NN" şeridi kancanın üstüne mi, kapak görseline mi?
- Yeni öğrenci kaydı ne zaman gelir (havuz 13 Kas'ta biter)?
