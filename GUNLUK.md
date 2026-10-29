# Günlük

## Bekleyen
- Karar: 04-bul'a eklenen iki kip (aktif üretici listesi + kişi bazlı kopyalama): liste Drive tablosunda yeni sekme mi, repoda dosya mı; kişi başı kaç video (öneri son 10, tutanlar önce).
- Karar: son tarih.
- Kullanıcı: rclone kendi client_id + tam Drive izni (Google Cloud adımları); sonra `tablo kur` + gerçek deneme (07 RAPOR komutları).
- Kullanıcı: AISCALE logo dosyası (şimdilik yazı markası).
- Ekranın alt %40'ı boş (kart üstte, altyazı ortada): sonraki görsel iyileştirme.
- Fişte ürün adı ASR hatası (Kapso → CAPSO): fiş onayında kontrol.
- rclone ortak client_id 2026'da kapanıyor: kendi Google client_id'si (~10 dk).

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
- Konuşmasız kaynak (the_unfair 3D ada) hatta uymuyor: fiş 2 cümleye iniyor; BUL'da konuşma olmayanlar elenmeli.

## Kararlar
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
- 2026-10-28 | Drive tablosunu ve klasörünü hat kendisi açar (`tablo kur`); rclone kendi client_id + scope=drive | ortak client_id 2026'da kapanıyor, yazma izni gerek | kullanıcı
