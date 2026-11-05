# Günlük

## Bekleyen
- Kullanıcı (16:00): 18/22 videolarını izleyip paylaşım onayı. Teslim `/home/dev/teslim/icerik-hatti/2026-11-04-dort-reels/`.
- Sosyal kanıt (park, 16:00): kullanıcı elindeki indirilmiş Shorts/Reels'i `/home/dev/gelen/icerik-hatti/sosyal-kanit/`e atacak; sonra tarama listesi (kişi, güçlü cümle, süre) ve ne üretileceği konuşulur. Sunucudan YouTube indirme hâlâ "bot" engelli (4 Kas, 4 istemci denendi); yeni video gerekirse laptoptan yt-dlp (girişsiz, 5–15 sn bekleme) ya da kullanıcının sitesi.
- Yarının (5 Kas) 4 konusu seçilmedi; seçilip fiş onaylanınca gece komutu: `GUN=2026-11-05 agir --gece --oncelik 5 --ram 5 --ad iht-reels -- bash /home/dev/projeler/icerik-hatti/tools/gece-12.sh 12:<id>,15:<id>,18:<id>,22:<id>`. Stok: airbnb, ikea (kanca yeniden yazılmalı).
- Karar: 04-bul'a eklenen iki kip (aktif üretici listesi + kişi bazlı kopyalama): liste Drive tablosunda yeni sekme mi, repoda dosya mı; kişi başı kaç video (öneri son 10, tutanlar önce).
- Karar: son tarih.
- Kullanıcı: rclone kendi client_id + tam Drive izni (Google Cloud adımları); sonra `tablo kur` + gerçek deneme (07 RAPOR komutları).
- Kullanıcı: AISCALE logo dosyası (şimdilik yazı markası).
- Ekranın alt %40'ı boş (kart üstte, altyazı ortada): sonraki görsel iyileştirme.
- Fişte ürün adı ASR hatası (Kapso → CAPSO): fiş onayında kontrol.
- rclone ortak client_id 2026'da kapanıyor: kendi Google client_id'si (~10 dk).
- ManyChat SEMİNER kuralı yeni gönderilerde DM atmıyor: gngr.gngr 2 Kas (Kalem) ve 3 Kas (Çok pahalı) "Seminer" yazdı, DM gitmedi. Kullanıcı panelden bakmalı.
- 3 Kas videolarının analitiği 5 Kas'ta eşit yaşta yeniden alınacak; HyperFrames verisi Zernio'da henüz yoktu (202).

## 2026-11-05
- Analitik: 4 Kas Reels + hesabın 43 gönderisi (`docs/analitik/`) · cd9cb21, 20809ab. Erişimi kanca değil kaydetme/paylaşma oranı belirliyor; araç içeriği + SEMİNER CTA en iyi kalıp.
- IHT-13 Anatomy araç Reels (41,4 sn, ses ~0,05 $, demo kaydı skill'in gerçek çizimi) · ad243dc. 18:18'de yayında (kullanıcı "pushlayalım"): https://www.instagram.com/reel/DfXVmktD19A/ · Zernio 6aec9e6cce61bde582b40fc4. BR-90/91 ortak b-roll arşivinden `/home/dev/cikti/anatomy-demo/`e alındı.
- Hasan testimonial kanca + mail otomasyonu gövdesi (43,6 sn) üretildi, teslimde; 22:00 onayı bekliyor · bc1ba01.
- Gündüz Reels üretimi skill'e döndü: `.claude/skills/reels-uret/SKILL.md` + `tools/reels.sh` (hazirla/uret/kanca/kareler/teslim/paylas); anahtar okuma `tools/anahtar.sh`te tek kopya (gece-12 de kullanır). Önbellekli sesle uçtan uca denendi, 656 test geçti.

## 2026-11-04
- 4 Kas Reels'i gündüz üretildi (gece kuyruğu boştu); konular kullanıcı seçimi: 12 Graphify (37,8 sn), 15 Fayda/matkap (40,9 sn), 18 Giriş engeli/Stories (40,8 sn), 22 Pahalı model/opusplan (39,4 sn). Ses toplamı 0,74 $ (tavan 1,20 $). Teslim: `/home/dev/teslim/icerik-hatti/2026-11-04-dort-reels/`.
- Graphify 12:00'de yayında: https://www.instagram.com/reel/DfUFqMrDDcA/ · Zernio 6aeaf2bfb2c6a30be1fab3bf. Fayda 15:00'e zamanlandı (kullanıcı onayıyla) · Zernio 6aeafef97850d11942407535; 18/22 onay bekliyor.
- Fayda 15:00'te yayında: https://www.instagram.com/reel/DfUaU7tCTFp/ · Zernio 6aeafef97850d11942407535 (16:23 yoklaması).
- Giriş engeli 18:00 · Zernio 6aeb320eac6255f5ccd3fabe ve Pahalı model 22:00 · Zernio 6aeb3211ac6255f5ccd3fac6 zamanlandı (kullanıcı onayıyla).
- Giriş engeli 18:00'de yayında: https://www.instagram.com/reel/DfUuxA1DOZ_/ (19:39 yoklaması).
- Pahalı model 22:00'de yayında: https://www.instagram.com/reel/DfVKNAUip-n/ (4 Kas dört Reels tamam).
- Sosyal kanıt mix (gelen/shorts 5 videodan 4 kişi: Ayşenur, Çağrı, Sümeyye, harita mühendisi; Florida atlandı) 43,5 sn + patron sesiyle SEMİNER CTA (~0,01 $). Teslim: `/home/dev/teslim/icerik-hatti/2026-11-04-sosyal-kanit/` · 183443f. 22:50'de yayında: https://www.instagram.com/reel/DfVP3HFjvQc/ · Zernio 6aeb8c5a68959db0d5fcaa7f.
- Çizim ortak parçaları `tools/cizim-kod/reels-yardimci.mjs`e alındı; yeni konu `reels-<id>.mjs` dosyasıyla eklenir. `gece-12.sh` artık `GUN` parametreli, 4 video tavanı 1,20 $.

## 2026-11-03
- Zernio ile @aiscale_app'e zamanlandı (kapak 1 sn; teslimdeki kapak png'si kullanılmadı, `hat paylas` görsel kapak almıyor): Çok pahalı 12:00 · Zernio 6ae99fdacfc78a2c6c467912; Rekabet 15:00 · Zernio 6ae99fe2cfc78a2c6c467936; HyperFrames 18:00 (kullanıcı onayıyla) · Zernio 6ae9a0a9444788e77bc0f8f6. ManyChat SEMİNER kuralı denetlenmedi (araç yok).
- Çok pahalı Reels 12:00'de yayında: https://www.instagram.com/reel/DfRhBvAj9om/ · Zernio 6ae99fdacfc78a2c6c467912 (12:38 yoklaması).
- Rekabet Reels 15:00'te yayında: https://www.instagram.com/reel/DfR1k3NjINp/ · Zernio 6ae99fe2cfc78a2c6c467936 (16:22 yoklaması); HyperFrames 18:00 hâlâ zamanlı.
- HyperFrames 18:03'te yayında: https://www.instagram.com/reel/DfSKAlbFOSr/ · Zernio 6ae9a0a9444788e77bc0f8f6. 22:00 için hazır video yok (IHT-12 planında boş bırakılmıştı).
- Analitik (Zernio, ücretsiz): 31 Eki–3 Kas 9 Reels kanca/gövde raporu `docs/analitik/2026-11-03-reels.md` (e6b4f71). Tutan kanca somut nesne + ters köşe/soru (3 sn tutma %59–66), emir kipli öğüt %40–53; 50 sn üstünde gövde düşüyor; erişimi konudan çok gün belirliyor. Zernio tutma eğrisi ve takipçi kazanımı vermiyor.
- Bugünkü videolarda değişiklik yapılmadı; "yeni kurgu" fikri YOL Sonra'ya park edildi (2ad2cb3).
- Yarının sırası: (1) 22:00 Graphify kararı, (2) 4 Kas konularını onaylat → fişler → gece-12 benzeri paket, komutu yöneticiye bildir, (3) ManyChat SEMİNER kontrolü, (4) skill yazımına geçiş (YOL Sonra).

## 2026-11-03
- IHT-12 gece paketi: `tools/gece-12.sh <saat:id,...>` konu parametreli, onaysız fişte para harcamadan durur; kuru koşu sahte sesle geçti. Takvim konularının fişi onaydan sonra yazılır. IKEA, Airbnb, Graphify fişleri stokta. Üretim yok.
- IHT-12 2 Reels main'e alındı, 118052d

## 2026-11-02
- IHT-11 şablon: eldeki 6 rakip videosuyla benchmark, altı kalıbın örnek karesi kodla (`tools/cizim-kod/katalog.mjs`); yön onayı alındı, `sablon` kalıbı hatta bağlandı. Teslim: `/home/dev/teslim/icerik-hatti/2026-11-02-sablon-katalog/`.
- İlk şablon videosu "Üç boy tuzağı" 15:00 yayında: https://www.instagram.com/reel/DfPQuJigm_3/ (44,7 sn, ~0,21 $). Teslim: `/home/dev/teslim/icerik-hatti/2026-11-02-uc-reels/`.
- 2026-11-02 | Reels sabit şablondan, altı kalıpla üretilir; yalnız grid rengi, kart ve hareket değişir | her videoda sıfırdan tasarım tutarlılığı bozuyor | kullanıcı
- 2026-11-02 | Bugünkü yayın sırası: 15 pazarlama (Üç boy), 18 %50 ortaklık (startup), 22 Claude Code (Televizyon) | gün içinde konu çeşitliliği | kullanıcı
- 2026-11-02 | Videolar Hook, Giriş, Gövde, CTA perdeleriyle kurgulanır; önce TV videosunda denenir | kreatif analizde tutan videolar sonuç ve kanıtla açılıyor | kullanıcı
- %50 ortaklık videosu 19:40 yayında: https://www.instagram.com/reel/DfPwa-AD_fJ/ (47,2 sn, ses ~0,22 $; 18:00 hedefi kaçtı). Kreatif anatomi: `docs/isler/11-sablon/KREATIF-ANATOMI.md`.

- 2026-11-02 | 22:00 videosu Televizyon yerine HyperFrames | reklam kapatma güvenilir bulunmadı, ücretsiz araç türü hesapta önde | kullanıcı
- HyperFrames videosu üretildi (45,2 sn, ses ~0,20 $), 22:00 kaçtı, gönderilmedi; yayın onayı bekliyor. Şablonda ilk sahne başlığı ilk kareden görünür. Senaryo: `docs/isler/11-sablon/hyperframes-senaryo.md`.

## 2026-11-01
- DOMS Reels'i yayında (2 Kas 12:14): https://www.instagram.com/reel/DfO9cusEqga/ · Zernio 6ae8543c05b08582243e498c.
- Jack Ma Reels yayında (19:09): https://www.instagram.com/reel/DfNIEbRFYLg/ ; DOMS onay bekliyor. Gazete çizim şablonu ilk deneme `tools/cizim-kod/gazete*.mjs` (commit yok, yön onayı bekliyor).
- Kitap Reels'i yayında (14:49): https://www.instagram.com/reel/DfMqXIFjvPR/ · Zernio 6ae72725b18b4ddbf3a5087e. Jack Ma ve DOMS paylaşım onayı bekliyor.
- Kitap, Jack Ma, DOMS Reels'i b-roll'suz, kodla çizilmiş tam ekran görsellerle üretildi (`tools/cizim-kod`, çizim kalıbına `cizimTam`); ses 0,50 $; paylaşım onayı bekliyor. Otomatik fiş düzeltmesi dalda: `worktree-agent-a16b5dd3dbf8cbc5a`, birleştirilmedi.
- İlk haftalık Apify taraması: 6 × 30 video, 178 aday, 0,49 $ (tavan 1 $); viral-uyarla `tara` elle, çıktı `kosular/2026-11-01-tarama/` (haftalık sayaç kodu henüz yok).

## 2026-10-26
- Repo şablondan açıldı; mülakat bitti, 6 kazanım onaylandı; üç repo envanteri + YOL + 01-fis, 03-paylas paketleri (`e2e2e67`).
- Deneme "benzeri" video (eski repolar elle zincir, 0 $, Chatterbox ses): VU IG DeZTLK4CeiQ senaryosu → KS fiş → HF render, 39,5 sn. İçerik ve sıra taşındı, görsel kimlik taşınmadı (koyu tek şablon, boş sohbet kutuları). Kullanıcı: "güzel olmuş". Teslim: `/home/dev/teslim/icerik-hatti/deneme-benzeri/`. Bulgular YOL 02'de.
- Devir: klon düzeyi kararı (YOL Müşteriden #1), sonra 01 ve 03 paralel.

## 2026-10-28
- 02-uret bitti (dal `is-02-uret`): `hat uret --fis <fis.md> [--render]`; ElevenLabs tek çağrı (698 karakter, ~0,056 $), sahne=ses parçası, deterministik kalıp eşleme, K24/K26 kapıları. Gerçek koşu `kosular/deneme-02`: final.mp4 1080x1920, 44,8 sn. Teslim: `/home/dev/teslim/icerik-hatti/ilk-video/`. Ayrıntı: `docs/isler/02-uret/RAPOR.md`.
- 01-fis (67 test, deneme fişi 8 sahne) + 03-paylas (kuru koşu; Zernio'da yalnız @aiscale_app bağlı, gerçek gönderim yok) + 02 + 06 main'de, 126 test yeşil (`b2b88e5`). Ses: hesaptaki hazır klon `batu-deneme`, kayıt gerekmedi.
- 06-testimonial: YouTube sunucu IP'sini bot saydı; kaynak Drive `AISCALE_KLIP_ARSIVI/videolar/05_TESTIMONIALS_KANIT` (8 video, tek kadın Buğçe). Kadın derlemesi + 6 varyant, 0 $. Teslim: `/home/dev/teslim/icerik-hatti/testimonial/`.
- 07-tablo (Drive tablosu: `tablo kur`, `tablo yokla`; Sheets hücre bazlı, ekip sütunlarına yazmaz), 08-yon (4 görsel yön + AISCALE teması, katalog `/home/dev/teslim/icerik-hatti/gorsel-yon/`), 09 (karma gerçek karışım + onay geri alınınca Zernio iptali) main'de, 186 test. Gerçek Drive/Zernio denemesi yok.

## 2026-10-29
- İlk BUL'suz gerçek koşu: 15 Eki taramasından nick_saraev "5 Claude Code eklentisi" (IG, 2 M) → fiş (25 sahne, iddialar web'de kontrol edildi, 1,6 milyar token gibi doğrulanmayanlar yumuşatıldı) → ElevenLabs 1.126 karakter (~0,09 $) → karma render 66,4 sn. Teslim: `/home/dev/teslim/icerik-hatti/2026-10-29-5-eklenti/`. Kullanıcı izleme onayı ve paylaşım bekliyor.
- Kırık: `fis` için `WHISPER_PY=/home/dev/.venvs/whisper/bin/python` gerekiyor (.env yok); ses anahtarı sosyal-panel `ELEVENLABS_API_KEY_AISCALE` (düz `ELEVENLABS_API_KEY` batu-deneme sesine 400 veriyor).
- Ses robotikti: hat ayarsız multilingual_v2 kullanıyordu; 18 Eki onaylı Batu ayarları (eleven_v4, 0,5/0,9/0, boost, hız 1,2, sözlük Claude→Klod) hesap konfigüne taşındı (`5186e22`, 193 test). Video yeniden seslendirildi: 1.114 karakter, 0,33 $, 64,8 sn → `final-v4.mp4`. Kullanıcı "Klod uzuyor" dedi: sözlük Claude→Klad, Code→Kod; yeniden seslendirme 0,33 $ → `final-v4-klad.mp4` (bugün ses toplamı ~0,75 $).
- DM dokümanı (5 eklenti, linkler + kurulum, web'den doğrulandı): teslim klasöründe `dokuman.md`; Notion bağlayıcısı yetkisiz, sayfa açılmadı. Son hali kullanıcı Notion'da yayınladı: https://longing-dust-981.notion.site/Claude-Code-i-in-5-eklenti-4085e43269648090a603cc7f29738e48 ; ManyChat metinleri `manychat.md` (teslim klasörü). 10-broll SPEC yazıldı (`6582589`).
- 10-broll: kurucu arşivinden karma b-roll (kanca + CTA + kaynakta konuşan yüz sahneleri; anlatım animasyonda), 11/25 sahne; arşiv .mp4'leri yan yatık kayıtlı → transpose=2, dik .mov olduğu gibi (`92d846b`, `cc859cc`, 211 test). Prototip `final-broll-karma.mp4`, 0 $.
- Konuşmasız kaynak (the_unfair 3D ada) hatta uymuyor: fiş 2 cümleye iniyor; BUL'da konuşma olmayanlar elenmeli.
- 5 eklenti Reels'i Zernio ile @aiscale_app'te yayında (15:31, kapak 1 sn): https://www.instagram.com/reel/DfFA5cSASRt/ · Zernio 6ae33cb74000a42c8178d3e3. ManyChat CLAUDE akışı kuruldu (doküman + seminer). Not: `ZERNIO_API_KEY_PATRON` sosyal-panel .env.local'de boş, genel anahtar elle eşlendi.

## 2026-10-30
- 3 Reels üretildi (5 komut, rakibin reklamları, önce sat): hazır metinden fiş, ElevenLabs 2.189 karakter ~0,66 $, karma render. Kod: rakam kartında ekran yazısı numarası/oranı, sohbet seçiminde ekran yazısındaki tırnak, biten altyazının açıkça gizlenmesi. Teslim: `/home/dev/teslim/icerik-hatti/2026-10-30-uc-reels/`. Paylaşım onayı bekliyor.
- 5 komut Reels'i Zernio ile @aiscale_app'te yayında (19:03, kapak 1 sn): https://www.instagram.com/reel/DfH9uI4ES5w/ · Zernio 6ae4bf6c02f76b5dee6d23d1. Anahtar sosyal-panel `ZERNIO_API_KEY`, `ZERNIO_API_KEY_VARSAYILAN` olarak verildi. ManyChat SEMİNER kuralı bu gönderide denenmedi.

## 2026-10-31
- Rakip videosu "biz denedik" bölümü çıkarılıp (ses ücretsiz kesildi, 34,5 sn) yayınlandı: https://www.instagram.com/reel/DfKbQr-lZZc/
- Önce Sat Reels'i (eski animasyonlu sürüm) Zernio ile @aiscale_app'te yayında (12:07, kapak 1 sn): https://www.instagram.com/reel/DfJzA4BAifE/ · Zernio 6ae5af76fd91af9436d2f21a. ManyChat SEMİNER kuralı bu gönderide denenmedi.

## Kararlar
- 2026-11-04 | Üretim kuralı kalıcı: kanca somut nesne/durum + ters köşe ya da soru, emir kipli öğüt ve "X'e göre" alıntısı yok, süre ≤ 45 sn | 9 Reels analizi (docs/analitik/2026-11-03-reels.md) | kullanıcı
- 2026-11-04 | Ses günlük tavanı 1,20 $ (video başına 0,30 $) | 4 Reels tempo | kullanıcı
- 2026-11-04 | Üretilen ve izlenen Reels, kullanıcı aksini söylemedikçe kendi saatine zamanlanır (video başı ayrı onay beklenmez) | 4 Kas'ta 18/22 akışı | kullanıcı
- 2026-11-03 | Bu gece yalnız pazarlama ve startup üretilir, hukuk yeni şablona kalır | kullanıcı: "Yarın sadece pazarlamayla startup üretsin" | yönetici aktarımı
- 2026-11-03 | Konuları kullanıcı onaylar; 3 Kas için 2 Kas takvimi esas, ücretli ses onaydan sonra | kullanıcı: "takvimdeki konuları at, onaylayayım" | yönetici aktarımı
- 2026-11-03 | Tempo kalıcı: her gün 4 Reels | kullanıcı isteği | yönetici aktarımı
- 2026-11-02 | İlk şablon videosu tamamen animasyon; sonraki bazı videolar ara klip + animasyon | kullanıcı isteği | kullanıcı
- 2026-11-02 | Altı kalıplı katalog ve günde 4 plan onaylandı | ekip onayı | kullanıcı
- 2026-11-02 | Şablon benchmark'ı yalnız diskteki rakip videolarıyla yapılır | kullanıcı yeni indirme istemedi | kullanıcı
- 2026-11-02 | Reels sabit gazete şablonuyla çıkar; animasyonlu sahnede zemin ızgarası rengi, animasyon ve kart farklılaşır | her videoda tanınır görünüm, hızlı üretim | kullanıcı
- 2026-11-02 | 2 Kasım paylaşımları 15:00, 18:00, 22:00; önce bugün ve yarının konuları belirlenir | günde 4 tempoya geçiş | kullanıcı
- 2026-11-01 | Bugünkü videolar b-roll'suz; ekranlar karikatür-sinematik tarz, görseller agy değil kodla | kullanıcı isteği; kota ve bekleme yok | sohbet
- 2026-11-01 | Tüm Reels'te ek doküman yok, çağrı yalnız seminer: yorum anahtarı SEMİNER | kullanıcı isteği | sohbet
- 2026-11-01 | Otomatik fiş kaynağın kişisel anlatımını ("kızım", "benim sesim") taşıyorsa elle düzeltilir; video kendimizden söz etmez | "bizle alakalı olmasın" kararıyla uyum | sohbet
- 2026-10-31 | Rakip videosunda "biz denedik" bölümü yok, video kendimizden söz etmez | kullanıcı isteği; 28 reklam iddiası da böylece çıktı | sohbet
- 2026-10-26 | Hat ilk önce patronun içerik hesabı için; portföyde patron işi, doğrudan Etkin | kullanıcı seçimi | mülakat
- 2026-10-26 | Üç repo (viral-uyarla, kreatif-studyo, sosyal-panel) yerine tek yeni repo; parçalar kopyalanır, eski repolar donar | tek komut, tek yer; Abdürrahim teslimi etkilenmesin | mülakat
- 2026-10-26 | İnsan onayı iki yerde: fiş ve paylaşım | gerisi otomatik | mülakat
- 2026-10-26 | Uyarlama kaynağın birebir görsel klonu, renk/tipografi bizim ve daha profesyonel | tutmuş format korunur, kopya gibi durmaz (onur-aiscale 17 Eki kararıyla aynı) | mülakat
- 2026-10-26 | Ses patronun ElevenLabs klonu | kullanıcı seçimi | mülakat
- 2026-10-26 | Kaynak TikTok + Instagram, hedef yalnız Instagram (Zernio) | ilk sürüm dar | mülakat
- 2026-10-26 | Aradan giriş: video linki/dosyası ya da hazır metin verilince BUL atlanır; iki onay her girişte kalır | "direkt bi video atıp üretelim" | kullanıcı
- 2026-10-26 | Repo herkese açık (public) | kullanıcı isteği; kodda gizli bilgi yok, anahtarlar yalnız .env'de | kullanıcı
- 2026-10-28 | Klon düzeyi ilk sürüm: yapı klonu (akış, sıra, tempo, ekran yazısı konumu; görseller bizim) | bugün bitsin; görsel klon 05'te | kullanıcı
- 2026-10-28 | Giriş kapısı Drive'daki tablo: kaynak link · bizim video · paylaşım zamanı; tabloyu kullanıcı elle doldurur, hat okur (Drive izni salt okuma yeter) | ekip örnek alınan videoyu orada istiyor | kullanıcı
- 2026-10-28 | Ses: patronun ElevenLabs klonu (ücretli, tutar onayı ayrı) | kullanıcı seçimi | kullanıcı
- 2026-10-28 | Testimonial varyasyonları bu repoda ayrı iş: kaynak youtube.com/@baturalp.tunali/shorts, yalnız kadınların olduğu kadın hedefli derleme + yeni kesimler (ffmpeg, 0 $) | AISCALE içeriği tek hatta | kullanıcı
- 2026-10-28 | Hedef hesap Zernio'daki @aiscale_app; anahtar sosyal-panel `.env.local` | patron hesabı = AISCALE | kullanıcı (main onayı)
- 2026-10-28 | Testimonial kaynağı YouTube yerine Drive arşivi | YouTube sunucuyu engelledi, aynı videolar Drive'da | engel
- 2026-10-28 | Apify (BUL) kredi gelene kadar bekler; link tabloya elle | kredi yok | kullanıcı
- 2026-10-28 | Görsel klon (05) yerine önce yön sorusu + AISCALE teması; varsayılan yön karma | 05 1–2 gün ve riskli, yön sorusu yarım gün | kullanıcı
- 2026-10-28 | Tabloda paylaşım onayı geri alınırsa zamanlanmış gönderi otomatik silinir; hata satırları elle sıfırlanır | otomatik tekrar ücretli sesi yeniden tetikler | kullanıcı
- 2026-10-29 | Doğrulanamayan rakam iddiaları (ör. "ayda 1,6 milyar ücretsiz token") birebir uyarlamada da yumuşatılır; yorum anahtarı kaynaktaki gibi CLAUDE | AISCALE tonu: rakam yalnız doğrulanmışsa; kullanıcı onayı | kullanıcı
- 2026-10-29 | B-roll karma: anlatılan yerlerde animasyon, onun dışında kurucu b-roll (ölçüt: kaynakta konuşan yüz) | "full olmasın, karma olsun" | kullanıcı
- 2026-10-29 | Telaffuz: Claude → "Klad", Code → "Kod" (Klod uzuyordu) | kullanıcı kulağı | kullanıcı
- 2026-10-29 | Kaynak vaat eden Reels'te DM iki mesaj: önce vaat edilen doküman, 1 dk sonra seminer linki | 17 Eki "DM seminere gider" kararı korunur, vaat de tutulur | kullanıcı
- 2026-10-28 | Drive tablosunu ve klasörünü hat kendisi açar (`tablo kur`); rclone kendi client_id + scope=drive | ortak client_id 2026'da kapanıyor, yazma izni gerek | kullanıcı
- 2026-10-30 | Bu turdaki 3 Reels için DM ile gönderilecek ek doküman yok; video kendi başına yeter, çağrı yalnız seminere | kullanıcı isteği | kullanıcı
- 2026-10-30 | Pazarlama ve girişimcilik videoları için ücretli tarama yok; konular kendi fikrimizden, hazır metinle hatta girer | kullanıcı isteği | kullanıcı
- 2026-10-31 | Animasyon ekranları gazete görüş sayfası tarzı çizime geçer (krem zemin, lacivert + mavi) | kullanıcı seçimi, örnek: Önce Sat tezgâh görseli | kullanıcı
- 2026-10-31 | Görseller kodla üretilir | agy kotası darboğaz, günde 4 video için kotaya bağlı kalınmaz | kullanıcı
- 2026-10-31 | Tempo günde 4 Reels (12, 15, 18, 22); videolar toplu üretilir, Drive'a yüklenir, onaylanınca saatinde paylaşılır; skill + zamanlanmış görev elle bir tam turdan sonra kurulur | kullanıcı isteği | kullanıcı
- 2026-10-31 | Apify şirket hesabına ve ücretli plana geçer | kullanıcı isteği; "kredi gelene kadar bekler" kararının yerine | kullanıcı
- 2026-10-31 | İçerik yalnız Claude değil; pazarlama ve startup konularında da üretilir, işler aşamalı otomatikleşir | kullanıcı isteği | kullanıcı
- 2026-10-31 | Apify taraması haftalık: aylık 5 $'ın 4 $'ı 4 haftaya bölünür (hafta 1 $, 1 $ yedek onayla), her hafta Claude + pazarlama + startup × TikTok + Instagram, tarama başına en çok 50 video, ilk 10 rapora; ek seçenekler kapalı | güncellik ve deneme bütçesi | kullanıcı
- 2026-10-31 | Haftalık tarama 6 × 30 video (önceki 50'nin yerine); yalnız konu başına en iyi 5 video indirilir (haftada 15), önce ücretsiz yt-dlp, Apify yedek; hafta tavanı 1 $ | indirme en pahalı kalem, bütçeye sığması için | kullanıcı
- 2026-11-05 | Gündüz tek Reels üretimi `reels-uret` skill'i ve `tools/reels.sh` ile yürür; konu seçimi ve paylaşım onayı kullanıcıda kalır | elle 4 tam turdan sonra; her yeni sohbet araçları baştan arıyordu | kullanıcı
