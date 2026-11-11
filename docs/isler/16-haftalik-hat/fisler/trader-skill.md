---
fis_id: trader-skill-01
kaynak:
  tur: metin
  dosya: docs/isler/16-haftalik-hat/SPEC.md
hesap: varsayilan
gorsel_yon: karma
fis_onay: evet
paylasim_onay: hayir
durum: taslak
# Araç: Day Trader Skill (github.com/Jakeschincariol/day-trader-skill). Doğrulama 11 Kas: MIT, 11 skill, standart Python + ücretsiz veri (Yahoo, SEC); varsayılan sanal (paper) hesap, onaysız emir yok; Time Machine son 60 günün 5 dk mumlarıyla günün kalanını 10.000 kez simüle eder. %29/%26/%45 README örneği. Yumuşatılmış: gelir iddiası yok, risk uyarısı var, vaat/DM linki yok. Kaynak video: instagram.com/p/DfFr4vdzV4f (auraguy.ai).
sahneler:
- {no: 1, basSn: 0, sonSn: 5, tur: metin-karti, ekranYazisi: "Günü 10.000 kez oynatıyor", konum: ust, broll: yok, metin: "Bu ücretsiz Claude paketi, işleme girmeden önce günün kalanını on bin kez oynatıyor.", sablon: {kalip: gazete, baslik: "Günü *10.000 kez* oynatıyor", svg: masa.svg, adimlar: [{hedef: ekran, kelime: 2, hareket: belir}, {hedef: demet, kelime: 7, hareket: belir}, {hedef: sayi, kelime: 9, hareket: belir}]}}
- {no: 2, basSn: 5, sonSn: 11, tur: metin-karti, ekranYazisi: "Day Trader Skill", konum: ust, broll: yok, metin: "Adı Day Trader Skill. Claude Code için on bir skill, GitHub'da açık kaynak.", sablon: {kalip: rakam, baslik: "Adı *Day Trader Skill*", satirlar: [{baslik: "Day Trader Skill", alt: "11 skill", kelime: 1}, {baslik: "Claude Code için", kelime: 4}, {baslik: "Açık kaynak", alt: "MIT lisansı", kelime: 10, sec: true}]}}
- {no: 3, basSn: 11, sonSn: 18, tur: metin-karti, ekranYazisi: "Küçük bir işlem masası", konum: ust, broll: yok, metin: "Biri grafikleri tarar, biri haberleri izler, biri giriş anını, biri zararı durdurma noktasını söyler.", sablon: {kalip: akis, baslik: "Küçük bir *işlem masası*", svg: akis.svg, adimlar: [{hedef: a1, kelime: 0, hareket: belir}, {hedef: a2, kelime: 3, hareket: belir}, {hedef: a3, kelime: 6, hareket: belir}, {hedef: a4, kelime: 9, hareket: belir}]}}
- {no: 4, basSn: 18, sonSn: 25, tur: metin-karti, ekranYazisi: "Zaman Makinesi", konum: ust, broll: yok, metin: "Zaman Makinesi, hissenin son altmış günlük verisiyle günün kalanını on bin kez dener ve oranları gösterir.", sablon: {kalip: gazete, baslik: "*Zaman* Makinesi", svg: zaman.svg, adimlar: [{hedef: b1, kelime: 9, hareket: belir}, {hedef: b2, kelime: 12, hareket: belir}, {hedef: b3, kelime: 14, hareket: belir}]}}
- {no: 5, basSn: 25, sonSn: 33, tur: metin-karti, ekranYazisi: "Bilmen gereken", konum: ust, broll: yok, metin: "Varsayılan kâğıt üstünde işlem, senin onayın olmadan emir gitmez. Yatırım tavsiyesi değil, günlük işlem yapanların çoğu para kaybeder.", sablon: {kalip: rakam, baslik: "Bilmen *gereken*", satirlar: [{baslik: "Önce sanal hesap", alt: "kâğıt üstünde işlem", kelime: 0}, {baslik: "Onaysız emir yok", kelime: 4}, {baslik: "Tavsiye değil", alt: "çoğu kişi kaybeder", kelime: 9, sec: true}]}}
- {no: 6, basSn: 33, sonSn: 37, tur: metin-karti, ekranYazisi: "Kurulum", konum: ust, broll: yok, metin: "Kurmak için Claude'a depo adresini ver, kur de. Gerisini o yapar.", sablon: {kalip: rakam, baslik: "Claude'a *kur* de", satirlar: [{baslik: "Adresi Claude'a ver", alt: "adres açıklamada", kelime: 2}, {baslik: "Kur de", kelime: 6}, {baslik: "Gerisini o yapar", kelime: 8, sec: true}]}}
- {no: 7, basSn: 37, sonSn: 44, tur: metin-karti, ekranYazisi: "SEMİNER", konum: ust, broll: yok, metin: "Kaydet, önce sanal hesapta dene. Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.", sablon: {kalip: kapanis, baslik: "Önce *kaydet*, sanalda dene", ust: "YORUMLARA YAZ", damga: "SEMİNER", adimlar: [{hedef: y, kelime: 10, hareket: belir}]}}
aciklama_taslagi: |-
  Bu ücretsiz Claude paketi, işleme girmeden önce günün kalanını 10.000 kez oynatıyor. 👇

  Araç: Day Trader Skill (GitHub: Jakeschincariol/day-trader-skill), Claude Code için 11 skill, açık kaynak (MIT).
  • Grafik tarayıcı, haber takibi, giriş zamanlayıcı, stop ve hedef planlayıcı
  • Zaman Makinesi: hissenin son 60 günlük 5 dakikalık verisiyle günün kalanını 10.000 kez simüle eder, hedef mi stop mu önce gelir oranını gösterir
  • Risk ve bütçe kontrolü

  Kurulum: Claude'a depo adresini ver, "bunu kur" de.

  Bilmen gereken: Varsayılan kâğıt üstünde (sanal) işlemdir; senin onayın olmadan emir gitmez. Simülasyon tahmin değildir. Yatırım tavsiyesi değildir; günlük işlem yapanların çoğu para kaybeder.

  Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.

  #yapayzeka #ClaudeCode #skill #borsa #seminer
---
