# Rapor 08-yon
Verify: typecheck temiz, 20 test dosyası / 145 test geçti.
Katalog: /home/dev/teslim/icerik-hatti/gorsel-yon/katalog.png (+ final-<yon>.mp4). ElevenLabs: tek çağrı, 727 karakter.

## KARAR GEREKLİ
1. AISCALE logo dosyası yok; wordmark kullanıldı. Logo gelirse `assets/logo/` + marka katmanı.
2. Karma bu fişte editoryal ile aynı görünür (ekran yazısı boş); render edilmedi.
3. Terminal kalıbında ekran yazısı yoksa komut satırı yer tutucu ("adim N/8").
4. Sohbet yönü yeni çok balonlu `sohbet` kalıbını kullanır, eski chat-window kalıbını değil.

## 09 eki (2026-10-28): karma gerçek karışım
- Karar (kullanıcı): `karma` varsayılan yön ve gerçek karışım; eski `kalipEsle` yedeği kalktı. Kural `src/uret/yon/karma.ts`, deterministik, LLM yok.
- Sahne başına aday sırası özelden genele: sohbet (soru ?, "mı/misin" eki, tırnaklı istem/diyalog) → terminal (kur/komut/çalıştır/terminal/kod/yaz fiili, tırnaklı komut) → rakam-kart (rakam ya da "Birinci/İki/Üç… adım") → editoryal (kalan).
- Art arda en çok 3 aynı yön; 4. sahne adayları arasındaki sonraki uygun yöne döner. Kanca (1. sahne) yalnız editoryal ya da sohbet.
- Plan, karma fişte tüm sahnelere birlikte bakar (`karmaYonleri`); `kalipler[].neden` "karma → <yön>: …" der. Sahnenin kendi `yon`'ü yine karmayı ezer.
- Fiş istemi: varsayılan öneri `karma` (`fis-2026-10-v3`); gerekçe satırı (`yon_gerekce`) kalır.
- Doğrulama: yon-deneme/karma fişi 8 sahne = sohbet, rakam-kart, rakam-kart, terminal, sohbet, sohbet, rakam-kart, terminal. Şerit: /home/dev/teslim/icerik-hatti/gorsel-yon/karma-serit.png, video final-karma.mp4. Ses önbellekten, 0 karakter.
- Sınır: kural kelime-kökü eşlemesi; "yaz" fiili CTA'da ("Yorumlara … yaz") terminal çıkar, istenmezse sahneye `yon: editoryal` yazılır.
- 08 raporundaki 2. madde ("karma editoryal ile aynı görünür") kapandı.
