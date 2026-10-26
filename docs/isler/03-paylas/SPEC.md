# 03 Paylaş ([M])

**Kazanım:** Onaylı bir videoyu tek komutla patron hesabına Zernio üzerinden gönderebilirsin; varsayılan kuru koşu, gerçek gönderim yalnız açık onayla.
Bağlı: yok (fiş alanları 01 SPEC'teki adlarla; 01 bitmeden fişsiz `--video --aciklama` kipi çalışır). Süre bütçesi: 1 oturum (~2 saat).

## Sana düşen
- [ ] K1 kazanım onayı (0 $: testler sahte; gerçek gönderim bu pakette yok)
- [ ] K3: grup A'da, ELLE-TEST #4–#5

## Kullanıcıya düşen (RAPOR bunu tek blokta verir)
- anahtar: `ZERNIO_API_KEY_PATRON` (`.env`'e sen yazarsın) · hesap: patronun Zernio hesabına Instagram bağlı olmalı

## Sorun
Kanıtlı Zernio betiği sosyal-panel'de Supabase'e ve Next `server-only`'ye bağlı; `publishing` durumunu hata sayıyor.

## PAKET
1. **Kazanım:** yukarıdaki cümle.
2. **Plan:** 4 adım (GOREVLER.md). Dokunulacak: `src/paylas/`, `test/paylas/`, `.env.example` (yalnız Zernio satırı), `src/cli.ts` (yalnız `paylas` kaydı). Dokunulmayacak: `src/fis/`, `src/cozumle/`, kaynak repolar.
3. **Kararlar:**
   - Kaynak: SP = `/home/dev/projeler/sosyal-panel`. Kopyalanır: `src/lib/zernio/{publish-client,schema,api-key}.ts` (`server-only` satırı silinir), `scripts/zernio-paylas.mts` → `src/paylas/komut.ts` (DB dalı `:80-100` atılır, açıklama `--aciklama` ya da fişin `aciklama_taslagi`).
   - Komut: `npm run hat -- paylas (--fis <fis.md> | --video <mp4> --aciklama <txt>) [--saat "YYYY-AA-GG SS:DD"] [--kapak-ms N] [--onay <video dosya adı>]`. Varsayılan kuru koşu (hesap okur, gövdeyi yazdırır). Gerçek gönderim: `--onay` = video dosya adı VE fişte `paylasim_onay: evet` (fişsiz kipte yalnız `--onay`).
   - Yoklama: `GET /posts/<id>` 10 sn arayla en çok 3 dk; `publishing` ara durumdur, `published` ya da `scheduled` başarı; başarıda fişe `durum: paylasildi`, `zernio_post_id`, `yayin_url`.
   - Anahtar: `ZERNIO_API_KEY_<SLUG>` (SP `api-key.ts:19`); genel `ZERNIO_API_KEY` kullanılmaz.
4. **Goal:** `/goal docs/isler/03-paylas/SPEC.md PAKET'ini uygula. Bitti: npm run typecheck && npm test yeşil; sahte Zernio ile kuru koşu, onaysız red, yanlış dosya adı red, publishing→published yoklama testleri geçer; RAPOR.md ilk satırı "Durum: bitti". Ya da 8 turda dur.`
5. **Sigorta:** Sonnet; dal `is-03-paylas`; gerçek Zernio isteği YOK (anahtar yok); aynı hata 3 kez → dur.
6. **Koşu:** gündüz ya da gece kuyruğu: `agir --gece --ram 1 --ad hat-03 -- bash tools/gece-03.sh`.

## Kapsam dışı
- Zernio analytics / 7. gün ölçümü; çoklu platform; zamanlanmış kuyruk.

## Açık sorular
- Patronun Zernio planı video boyutu/süre sınırı (ilk kuru koşuda `GET /accounts` ile okunur) (kullanıcıya).
