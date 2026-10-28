Durum: bitti

## Sana düşen
- `.env`'e `ZERNIO_API_KEY_PATRON=` yaz (patronun Zernio anahtarı); patronun Instagram'ı Zernio'ya bağlı olmalı.
- KARAR: sosyal-panel'deki anahtar `@aiscale_app` hesabına ait, patronun değil. Patron anahtarı gelene kadar gerçek gönderim yapılmaz.

## Yapılan
- `src/paylas/{istemci,sema,anahtar,zaman,fis,yokla,komut}.ts`, `test/paylas/*` (33 test), `.env.example`, `src/cli.ts` kaydı.
- Komut: `npm run hat -- paylas (--fis <fis.md> | --video <mp4> --aciklama <txt>) [--saat "YYYY-AA-GG SS:DD"] [--kapak-ms N] [--onay <video dosya adı>] [--hesap <slug>] [--ig <kullanıcı>]`
- Varsayılan kuru koşu; gerçek gönderim `--onay` = dosya adı + fişte `paylasim_onay: evet`. Geçmiş saat her kipte red. Yoklama 10 sn / 3 dk.

## Verify
typecheck + 33 test yeşil. Gerçek anahtarla kuru koşu yalnız GET /accounts yaptı; yükleme/gönderi yok.
