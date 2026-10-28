Durum: yarım

# 06 testimonial: engellendi (indirme)

Sana düşen: YouTube bu sunucunun IP'sini bot diye engelledi. İki yoldan biri gerekli: (a) tarayıcıdan dışa aktarılmış `cookies.txt` -> `/home/dev/cikti/aiscale-testimonial/cookies.txt` (yt-dlp `--cookies` ile koşarım); (b) aday videoları elle indirip `/home/dev/cikti/aiscale-testimonial/kaynak/` altına at (`<id>.mp4`).

- Kanal listesi alındı: 195 short (`kanal-liste.tsv`). Çoğu başlık boş/tarih/İngilizce özet; başlıktan testimonial seçimi zayıf.
- Başlık/isim bazlı ön aday: 10 (`adaylar.tsv`); izlenmedi, kadın sayısı doğrulanamadı (isimden: Bugce kesin, Saadet olası). Kadın testimonial >= 2 doğrulanmadı.
- Denenen yollar (hepsi başarısız): yt-dlp (güncellendi 2026.10.26) player_client tv/mweb/web_safari/android_vr/web_embedded -> "Sign in to confirm you're not a bot"; altyazı indirme de aynı. Halka açık Piped (api.piped.private.coffee) meta verdi ama akış 502, yalnız 360p; Invidious yewtu.be captcha. Çerez/oturum yok, kullanıcının tarayıcı oturumuna dokunulmadı.
- Hazır: yerel whisper `/home/dev/.venvs/whisper` (faster-whisper 1.2.1, medium/large-v3-turbo önbellekte), ffmpeg, agy. Üretim betikleri yazılmadı (kaynak olmadan doğrulanamaz).
- Üretilen dosya: yok. Teslim klasörü boş. Ücret: 0 $.
