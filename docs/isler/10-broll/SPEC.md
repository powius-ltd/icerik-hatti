# 10-broll: kurucu arşivinden ara kesit ([A])

Kazanım: videoda kanca, bölüm geçişleri ve CTA tam ekran kurucu b-roll klibiyle akar; liste sahneleri yine bizim kartlar. Video "slayt gösterisi" gibi durmaz.

Bağlı: yok (ses ayarı işi ayrı). Süre bütçesi: yarım gün; dolarsa klip seçimi elle (`broll:` satırı) kalır, otomatik eşleme 2. sürüme.

## Sana düşen
- [ ] Yön onayı: ilk prototip videonun 412 px ekran görüntüsü + MP4 (kanca, 1 geçiş, CTA)
- [ ] Elle test: kesit yerleri doğal mı, yazı okunuyor mu

## Kararlar (2026-10-29, kullanıcı)
- Kaynak: AISCALE kurucu arşivi, sunucuda `/home/dev/cikti/aiscale-broll/kaynak/` (02_ARA_GORUNTU_BROLL: 23 BR, 01_KANCALAR_HOOKS: 3 HK; Drive `AISCALE_KLIP_ARSIVI` kopyası). rclone gerekmez; ileride Drive'dan çekme 07-tablo ile.
- Yerleşim: **ara kesit**. Kanca (1. sahne), her "Birincisi/İkincisi…" bölüm başı ve CTA (son sahne) tam ekran klip; üstte yalnız altyazı + kısa ekran yazısı. Diğer sahneler mevcut yön kalıpları.
- Klip kendi sesi kapalı; bizim ses sürer. Klip sahne süresine kırpılır (concat demuxer / `-ss -to`, tek girdiden çok trim yok).
- Okunurluk: klip üstüne tema belirteciyle karartma (`--broll-overlay` yeni belirteç), altyazı mevcut stil.

## Plan (taslak)
1. `config/hesaplar/varsayilan.json`: `broll { kok, klipler[{id, dosya, etiket}] }` (dosya adından etiket: yürüyüş, laptop, koltuk…).
2. Fiş şeması: sahnede isteğe bağlı `broll: <id> | yok`; karma planı kanca/bölüm başı/CTA'ya kendisi atar (deterministik, art arda aynı klip yok), fişteki satır ezer.
3. `src/uret/yon/broll.ts` kalıbı: HF sahnesinde `<video>` katmanı + karartma + ekran yazısı; klip ön kırpması `src/uret/render/` altında ffmpeg ile.
4. Test: plan atama kuralı, şema, kırpma komutu (sahte koşucu).

## Kapsam dışı
Yeni çekim/AI video üretimi, kaynak videonun karesi (kural gereği girmez), klip içerik çözümlemesi (agy ile etiketleme 2. sürüm), Drive'dan otomatik indirme.

## Açık sorular
- Bölüm başı tespiti yalnız "Birinci/İkinci…" kalıbıyla mı, yoksa fişte işaret mi?
- Kanca klibi HK (kameraya yürüyen) mı, BR mi? Öneri: HK.
