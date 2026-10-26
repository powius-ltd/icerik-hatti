# Kod kuralları

Akış: (BUL | link/dosya | hazır metin) → çözümle → fiş (`fis.md`, `fis_onay`) → ses + üret (video, kapak, açıklama) → `paylasim_onay` → Zernio → Instagram.

- Yığın: Node ≥ 22, TypeScript (ESM), `tsx`, `zod` 4, `yaml`, `vitest`. Tek giriş: `npm run hat -- <adım> [bayraklar]` (`src/cli.ts`); her adım `src/<adım>/komut.ts` içinde `calistir(argv)`.
- Dış ikili / servis: ffmpeg/ffprobe, Python + faster-whisper (`py/`), `agy` (çözümleme), `claude -p` (uyarlama, açıklama), `npx hyperframes@0.8.158` (render), yt-dlp (isteğe bağlı). Ücretli: Apify, ElevenLabs, Zernio.
- Komutlar: `npm run typecheck`, `npm test` (`vitest run --maxWorkers=2`). Verify: `npm run typecheck && npm test`. Render ve gerçek video koşusu `agir` ile.
- Durum dosyada: koşu klasörü `kosular/<kosu>/<id>/` (`HAT_KOSU_KOK`); fiş `fis.md` (YAML frontmatter). Veritabanı yok.
- Kaynak repodan kopyalanan dosyanın başına tek satır: `// Kaynak: <repo>/<yol> (<kısa hash>)`. Testi de birlikte kopyalanır.
- Her dosya tek iş, ≤ 400 satır; geçecekse önce böl. Aynı mantık ikinci kez yazılmaz (ses hizalama tek kopya).
- Görsel değerler yalnız tema belirteçlerinden (`src/uret/tema.ts`, hesap konfigü `config/hesaplar/<slug>.json`); sahnede sabit renk yok.
- Gizli anahtar yalnız ortam değişkeninden (`.env.example` adları listeler); `.env*` okunmaz, commit'lenmez. Zernio anahtarı `ZERNIO_API_KEY_<SLUG>`.
- Testler gerçek ücretli servise istek atmaz; sağlayıcı sahtelenir, Apify için `fixtures/apify/*`.
- Paylaşım: `paylasim_onay: evet` VE `--onay=<video dosya adı>` olmadan gerçek gönderim yok; varsayılan kuru koşu.
- Kaynak videonun karesi ve sesi çıktıya girmez; indirme yalnız çözümleme için.
- Hata iletileri Türkçe, tek cümle.
