# Hasan testimonial Reels ve karma kalıp analizi (6 Kas 2026)

**Sana düşen:** Yok (yalnız okuma analizi). Karar için 3 öneriyi oku.

Kaynak: Zernio `GET /v1/analytics?postId=…` (yalnız GET, ücretsiz), tüm gönderiler 6 Kas 09:01 (06:01 UTC) senkronunda. Tanımlar `2026-11-03-reels.md` ile aynı: 3 sn tutma = 100 − reelsSkipRate; izleme/süre = ort. izleme ÷ video süresi; gövde = izleme/süre ÷ 3 sn tutma (yaklaşık, kaydıranların ~1–2 sn'si ihmal). Yaş, yayından senkrona kadar geçen süre; eşit değil. Rakamlar 5 Kas raporundan biraz farklı çünkü veri güncellendi.

| Video | Tür | Yayın (TR) | Yaş | Süre | Oynatma | Erişim | Beğ. | Yor. | Kayd. | Pay. | Ort. izleme | 3 sn tutma | İzleme/süre | Gövde | Kayd./erişim |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Hasan mail otomasyonu | testimonial kanca + animasyon gövde | 5.11 23:05 | 10 sa | 43 | 180 | 154 | 1 | 1 | 0 | 0 | 9,5 sn | %51 | %22 | %43 | %0 |
| Anatomy | araç (demo kaydı) | 5.11 18:19 | 15 sa | 41 | 358 | 328 | 2 | 0 | 6 | 0 | 5,3 sn | %51 | %13 | %26 | %1,8 |
| Sosyal kanıt | testimonial mix (4 kişi) | 4.11 22:51 | 34 sa | 43 | 223 | 193 | 5 | 0 | 2 | 1 | 9,3 sn | %71 | %22 | %30 | %1,0 |
| Graphify | araç | 4.11 12:02 | 45 sa | 37 | 1.432 | 1.247 | 8 | 2 | 34 | 7 | 6,2 sn | %35 | %17 | %47 | %2,7 |
| Pahalı model | araç | 4.11 22:01 | 35 sa | 39 | 1.383 | 1.277 | 8 | 0 | 21 | 2 | 8,6 sn | %55 | %22 | %40 | %1,6 |

Zernio bu hesapta tutma eğrisi (`retentionCurve` boş), tamamlanma oranı (0) ve takipçi kazanımı (`follows` null) vermiyor: kancadan gövdeye geçişteki kayıp doğrudan ölçülemiyor.

## Fiş ve kanca

- Kanca (TST-07 Hasan kesiti, `tools/testimonial/specs/hasan-kanca.json`): ekran yazısı "BİLGİSAYARI 2011'DE BIRAKTI" 3,5 sn; üç klip toplam ~8,8 sn (4,2 + 1,65 + 2,95 sn).
- Kesit ne diyor (döküm TST-07.json): "2011'de Metin 2 oynuyordum, bilgisayarı o zaman bıraktım" → "Sadece telefon kullanıyordum" → "Claude Code'da bütün otomasyonları yapabilirim". Yani kişisel itiraf + ters köşe (bilgisayarı bırakan adam, otomasyon kuruyor).
- Gövde (fiş hasan-mail, ~34 sn, 6 sahne): Hasan'ın hikâyesi (7 sn) → sistem üç parça (gelen kutusu, büro bilgisi, senin onayın; 3 animasyon sahnesi, 6'şar sn) → kapanış.
- CTA: sahne 6 "Yorumlara SEMİNER yaz, linki DM'den atayım"; açıklamada da aynı.
- Not: Hasan'ın hikâyesi gövdede (sahne 1) kancadan hemen sonra tekrar anlatılıyor; kanca ile gövde girişi aynı bilgiyi veriyor olabilir (yorum, ölçüm yok).

## Bulgular

1. Testimonial kanca 3 sn tutmayı tek başına artırmıyor: Hasan %51, aynı yaşta kuşaktaki Anatomy ile aynı, Pahalı model (%55) altında; yalnız çok kişili Sosyal kanıt mix'i %71 ile en yüksek. Fark kancanın "testimonial" olmasından çok açılışın türünden (4 kişilik hızlı kesit vs. tek kişi) gelmiş olabilir; tek örnekle ayırt edilemez.
2. Gövde tahmini Hasan'da %43, diğer iki karma videodan (Anatomy %26, Sosyal kanıt %30) yüksek ve araç videolarına yakın (Graphify %47, Pahalı %40). Ortalama izleme 9,5 sn; kancayı geçenlerin yaklaşık yarıya kadar (~17 sn) izlediği çıkıyor, ama geçişte tam nerede kayıp olduğu veri yok.
3. Kaydetme ve paylaşma: Hasan 0 kaydetme, 0 paylaşım, 1 yorum (154 erişim). Araç içerikleri 21–34 kaydetme. Hasan 10 saatlik ve erişim 154; Anatomy de 15 saatte 6 kaydetmede. Küçük örnek ve farklı yaş: "kaydedilmiyor" demek için erken, ama testimonial içerik izlenip kaydedilmeyen türe benziyor. SEMİNER yorumu 1 (ManyChat DM kuralı hâlâ elle doğrulanmadı, yorumun içeriği bu veriden bilinmiyor).

## Öneriler (seri için)

1. **Kanca süresi:** Hasan'ın 8,8 sn'lik 3 klibi yerine 3–5 sn'lik tek güçlü cümle + ekran yazısı dene. En iyi tutan Sosyal kanıt (%71) ilk 3 sn'de hızlı kesit/ilk cümle yapısındaydı; kıyas için aynı gövdeyle iki kanca süresi (4 sn tek cümle, 8 sn üç klip) A/B yapılabilir.
2. **Testimonial cümle türü:** Sonuç/ters köşe itirafı ("bilgisayarı bıraktım" gibi kişisel hikâye) 3 sn tutmayı %51'de bıraktı; Sosyal kanıt mix'indeki ilk cümleyi dökümden çıkarıp karşılaştır (bu raporda sahne cümleleri incelenmedi). Aday: tek rakam/sonuç içeren cümle ("ilk müşteriyi aldı", "X'e düşürdü") ve kancadan sonra gövde girişinde aynı hikâyeyi tekrarlama.
3. **Gövde konusu:** Kaydetmeyi araç içeriği taşıyor (Graphify 34, Pahalı 21; Hasan 0, Anatomy 6). Karma kalıp için gövdeyi iş sonucu yerine "kişinin kullandığı araç/komut" (kopyalanıp kaydedilecek somut adım) yap; kanca testimonial, gövde araç. Bu varsayım, 3–4 karma videoyla eşit yaşta (≥34 sa) sınanmalı.

## Kısıtlar

- Hasan erişimi 154, kaydetme 0; tek video, 10 saatlik. Eşit yaşta yeniden alım (7 Kas ~09:00) önerilir.
- Tutma eğrisi yok; "gövdeye geçişte kayıp" yalnız ortalama izlemeden çıkarım.
- Erişim dağıtımı konudan çok güne/öneriye bağlı (önceki raporlar), kanca etkisi izole edilemez.
