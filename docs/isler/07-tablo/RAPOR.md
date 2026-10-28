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

## 09 eki (2026-10-28): onay geri alınınca iptal
- Karar (kullanıcı): `zamanlandi` iken `paylasim_onay` evet değilse Zernio'daki zamanlanmış gönderi silinir (`gonderiSil`: DELETE /posts/<id>, 404 başarılı sayılır); tablo `durum: video_hazir`, `not: paylaşım iptal edildi (onay geri alındı)`.
- Silmeden önce Zernio'ya durum sorulur: `yayinda` ise SİLİNMEZ, durum yayinda + link, not "onay geri alındı ama gönderi zaten yayında; silinmedi".
- Fişte paylaşım izi geri alınır (`durum: uretildi`, `paylasim_onay: hayir`); aksi hâlde onay yeniden verilince `paylas` "fiş zaten paylaşılmış" derdi. Eski `zernio_post_id` yeni gönderide ezilir.
- Kuru kip: silme, durum sorusu ve yazma yok; yalnız ne yapılacağı yazılır. `zernio_post_id` fişte yoksa ya da silme patlarsa satır `hata` olur.
- Karar: hata satırları ELLE sıfırlanır (otomatik yeniden deneme eklenmedi); önceki "KARAR GEREKLİ" iki maddesi kapandı.
- Testler sahte Zernio ile (gerçek çağrı yok): iptal yolu, yayındakinin silinmemesi, kuru kip, silme hatası, id yok; istemci DELETE testi.
