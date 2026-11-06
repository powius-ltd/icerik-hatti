---
fis_id: grill-me-01
kaynak:
  tur: metin
  dosya: docs/isler/13-arac-reels/fisler/grill-me.md
hesap: varsayilan
gorsel_yon: karma
fis_onay: evet
paylasim_onay: hayir
durum: taslak
# Araç: grill-me (github.com/mattpocock/skills). Doğrulama 6 Kas: planı tek tek sorularla netleştirir, her soruya önerilen cevap verir, kod yazmaz, ortak anlayış onaylanmadan plana geçmez. Kurulum: npx skills add https://github.com/mattpocock/skills --skill grill-me, sonra /grill-me.
# Yıldız/kurulum sayıları kaynaklar arasında tutarsız, kullanılmadı. Araç demosu kaydı yok: broll alanı boş sahnelerde kurucu arşivinden otomatik b-roll (1 ve 3).
sahneler:
- {no: 1, basSn: 0, sonSn: 6, tur: metin-karti, ekranYazisi: "Seni sorguya çeken skill", konum: ust, metin: "Claude'a iş verdin, yanlış şeyi kurdu. Sorun Claude değil, eksik anlattığın plan."}
- {no: 2, basSn: 6, sonSn: 12, tur: metin-karti, ekranYazisi: "Grill Me", konum: ust, broll: yok, metin: "Bunun için ücretsiz bir skill var: Grill Me. Kod yazmadan önce seni sorguya çekiyor.", sablon: {kalip: rakam, baslik: "Aracın adı *Grill Me*", satirlar: [{baslik: "Ücretsiz skill", alt: "Claude Code için", kelime: 4}, {baslik: "Grill Me", alt: "beni sorguya çek", kelime: 7}, {baslik: "Önce soru, sonra kod", alt: "kod yazmadan önce", kelime: 9, sec: true}]}}
- {no: 3, basSn: 12, sonSn: 19, tur: metin-karti, ekranYazisi: "Tek tek soru", konum: ust, broll: BR-56, metin: "Planını anlatırsın, sana tek tek soru sorar. Her sorunun yanında önerdiği cevap da olur."}
- {no: 4, basSn: 19, sonSn: 25, tur: metin-karti, ekranYazisi: "Anlaşmadan kurmaz", konum: ust, broll: yok, metin: "İkiniz aynı şeyi anlayana kadar tek satır kod yazmaz. Yanlış iş baştan elenir.", sablon: {kalip: gazete, baslik: "Anlaşmadan *kurmaz*", svg: anlasma.svg, adimlar: [{hedef: soru, kelime: 0, hareket: belir}, {hedef: kilit, kelime: 5, hareket: belir}, {hedef: tik, kelime: 9, hareket: belir}]}}
- {no: 5, basSn: 25, sonSn: 31, tur: metin-karti, ekranYazisi: "Kurulum", konum: ust, broll: yok, metin: "Kurulum tek satır, komut ekranda. Sonra planını yaz ve slash grill me de.", sablon: {kalip: gazete, baslik: "Tek satırda *kur*", svg: kurulum.svg, adimlar: [{hedef: pencere, kelime: 0, hareket: belir}, {hedef: s1, kelime: 3, hareket: belir}, {hedef: s2, kelime: 8, hareket: belir}]}}
- {no: 6, basSn: 31, sonSn: 36, tur: metin-karti, ekranYazisi: "Bilmen gereken", konum: ust, broll: yok, metin: "Skill ücretsiz, Claude ücretli; sorular kotandan düşer. Kısa işte gerek yok, büyük işte kullan.", sablon: {kalip: rakam, baslik: "Bilmen *gereken*", satirlar: [{baslik: "Claude ücretli", alt: "kotandan düşer", kelime: 2}, {baslik: "Kısa işte gerek yok", alt: "büyük işte kullan", kelime: 9, sec: true}]}}
- {no: 7, basSn: 36, sonSn: 42, tur: metin-karti, ekranYazisi: "SEMİNER", konum: ust, broll: yok, metin: "Kaydet, ilk büyük işinde dene. Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.", sablon: {kalip: kapanis, baslik: "Önce *kaydet*, sonra dene", ust: "YORUMLARA YAZ", damga: "SEMİNER", adimlar: [{hedef: y, kelime: 11, hareket: belir}]}}
aciklama_taslagi: |-
  Claude'a iş verdin, yanlış şeyi kurdu. Sorun çoğu zaman Claude değil, eksik anlatılan plan. 👇

  Araç: Grill Me (GitHub: mattpocock/skills). Claude Code'u kod yazmadan önce seni sorguya çekmeye zorlayan ücretsiz bir skill. Planını tek tek sorularla netleştirir, her soruya önerdiği cevabı da yazar; ikiniz aynı şeyi anlayana kadar koda geçmez.

  1. npx skills add https://github.com/mattpocock/skills --skill grill-me
  2. Planını yaz, sonra: /grill-me

  Skill ücretsiz ama Claude ücretli; sorular kullanım kotandan düşer. Kısa işte gerek yok, büyük işte kullan.

  Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.

  #yapayzeka #ClaudeCode #skill #verimlilik #seminer
---
