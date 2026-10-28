Durum: bitti (birim testler + kuru kip; gerçek Google/Zernio denemesi YAPILMADI, jeton salt okumaydı)

## Sana düşen
Yetkilendirme bitince aşağıdaki komut dizisi; ilk satır senin işin.

## Gerçek deneme (sırayla)
```
rclone config reconnect drive:        # client_id + scope=drive ile (kullanıcı)
cd /home/dev/projeler/icerik-hatti-is-07-tablo
npm run hat -- tablo kur              # klasör + tablo + liste doğrulama; .hat/tablo.json
# tabloya bir satır: ornek_link + paylasim_zamani (GG.AA.YYYY SS:DD, ileri tarih)
npm run hat -- tablo yokla --kuru     # yalnız plan, hiçbir yazma yok
npm run hat -- tablo yokla            # yeni -> fis_hazir (claude çağrısı)
# tabloda fis_onay=evet
agir --ram 4 --ad hat-tablo -- npm run hat -- tablo yokla   # uret --render (ElevenLabs ücreti, ~0,06 $) -> video_hazir
# tabloda paylasim_onay=evet (Zernio'ya gerçek zamanlama; geçmiş/yakın saat verme)
npm run hat -- tablo yokla            # -> zamanlandi
```
Zamanlama: cron (ör. `*/10 * * * * cd <repo> && agir --ram 4 --ad hat-tablo -- npm run -s hat -- tablo yokla`) ya da systemd timer. Üst üste binen tur `.hat/tablo.kilit` ile atlanır.

## Commit
- 81e68f1 tablo: kod + testler + SPEC/GOREVLER (src/tablo/*, geri-yaz.ts onayUygula/onayYaz, cli.ts)

## Verify

 Test Files  21 passed (21)
      Tests  152 passed (152)

## Notlar
- Yeniden deneme: hata satırında ekip `durum`u siler (yeni) ya da fis_hazir/video_hazir yazar.
- fis_onay/paylasim_onay üretim/zamanlamadan hemen önce tablodan yeniden okunur; hayırsa yapılmaz.
- Rclone `lsjson` Google Sheet adını uzantılı gösterebilir; eşleme MimeType + ad öneki ile (kur.ts). Gerçek denemede doğrulanacak.

## KARAR GEREKLİ
- Hata satırı otomatik yeniden denensin mi (şimdi elle sıfırlama)? Varsayılan: elle, ücretli tekrar riski yok.
- Zamanlanmış gönderi, paylasim_onay sonradan hayır olunca Zernio'dan iptal edilsin mi? (şimdi iptal yok)
