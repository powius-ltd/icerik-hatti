---
fis_id: claude-ekip-01
kaynak:
  tur: metin
  dosya: docs/isler/16-haftalik-hat/SPEC.md
hesap: varsayilan
gorsel_yon: karma
fis_onay: evet
paylasim_onay: hayir
durum: taslak
# Araç: ECC (eski adı Everything Claude Code), github.com/affaan-m/ECC (eski adres everything-claude-code buraya yönleniyor). Doğrulama 15 Kas: GitHub API: MIT lisans, 303.448 yıldız, son push 15 Kas 2026, durum arşivli değil; README: 71 ajan, 314 skill, 98 komut (eski komutların kısayolları) ve hook, kural, hafıza; ajanlar planlama, inceleme, derleme onarımı, güvenlik, mimari ve alan işleri için; Claude Code'a eklenti olarak kurulur (/plugin marketplace add https://github.com/affaan-m/ECC, /plugin install ecc@ecc); Node.js 18+ ve Git gerekir; README aynı anda iki kurulum yöntemini üst üste koymamayı ve yalnız lazım olanı seçmeyi söylüyor (bağlam penceresi uyarısı MCP'ler için yazılmış, "hepsini açma" bağlamı doldurur diye genellendi, kesin değil "doldurabilir" denildi). Kaynak videodaki "hackathon kazandı" iddiası doğrulanmadığı için alınmadı. Resmî olmayan kopya depolar var (ör. WorldFlowAI/everything-claude-code); yazılan rakamlar affaan-m/ECC içindir. Ekranda komut yok; kurulum "Claude'a ... kur de". Kaynak video: instagram.com/p/DfmpzLgCaMs.
sahneler:
- {no: 1, basSn: 0, sonSn: 6, tur: metin-karti, ekranYazisi: "Tek depo, koca ekip", konum: ust, broll: yok, metin: "Claude'u tek depoyla koca bir yazılım ekibine çevirebilirsin.", sablon: {kalip: gazete, baslik: "Tek depo, koca *ekip*", svg: ekip.svg, adimlar: [{hedef: depo, kelime: 2, hareket: belir}, {hedef: ekip, kelime: 6, hareket: belir}]}}
- {no: 2, basSn: 6, sonSn: 12, tur: metin-karti, ekranYazisi: "ECC", konum: ust, broll: yok, metin: "Adı ECC, eski adıyla Everything Claude Code. MIT lisanslı, GitHub'da 300 binden fazla yıldızı var.", sablon: {kalip: rakam, baslik: "Adı *ECC*", satirlar: [{baslik: "ECC", alt: "eski adı Everything Claude Code", kelime: 1}, {baslik: "MIT lisanslı", kelime: 7}, {baslik: "300 binden fazla yıldız", alt: "GitHub'da", kelime: 10, sec: true}]}}
- {no: 3, basSn: 12, sonSn: 18, tur: metin-karti, ekranYazisi: "71 ajan, 314 skill", konum: ust, broll: yok, metin: "İçinde 71 ajan, 314 skill ve 98 komut var, yanında hook'lar da geliyor.", sablon: {kalip: rakam, baslik: "İçinde *neler* var", satirlar: [{baslik: "71 ajan", kelime: 1}, {baslik: "314 skill", kelime: 3}, {baslik: "98 komut", alt: "yanında hook'lar da", kelime: 6, sec: true}]}}
- {no: 4, basSn: 18, sonSn: 25, tur: metin-karti, ekranYazisi: "Her ajan bir iş yapıyor", konum: ust, broll: yok, metin: "Her ajan işin bir parçasını yapıyor: planlıyor, kodluyor, test ediyor, kodu inceliyor.", sablon: {kalip: gazete, baslik: "Her ajan bir *parça*", svg: ajanlar.svg, adimlar: [{hedef: plan, kelime: 6, hareket: belir}, {hedef: kod, kelime: 7, hareket: belir}, {hedef: test, kelime: 8, hareket: belir}, {hedef: inceleme, kelime: 10, hareket: belir}]}}
- {no: 5, basSn: 25, sonSn: 31, tur: metin-karti, ekranYazisi: "Hepsini kurma", konum: ust, broll: yok, metin: "Bilmen gereken: hepsini birden kurmak bağlamı doldurabilir. Yalnız lazım olanı seç.", sablon: {kalip: rakam, baslik: "Hepsini *kurma*", satirlar: [{baslik: "Hepsini birden kurma", kelime: 2}, {baslik: "Bağlam dolabilir", kelime: 5}, {baslik: "Yalnız lazım olanı seç", kelime: 7, sec: true}]}}
- {no: 6, basSn: 31, sonSn: 38, tur: metin-karti, ekranYazisi: "Kurulum", konum: ust, broll: yok, metin: "Kurmak için Claude'a ECC eklentisini kur de. Claude ücretli, kotandan düşer.", sablon: {kalip: rakam, baslik: "Claude'a *kur* de", satirlar: [{baslik: "ECC eklentisini kur de", alt: "Claude'a söyle", kelime: 3, sec: true}, {baslik: "Claude ücretli", alt: "kotandan düşer", kelime: 7}]}}
- {no: 7, basSn: 38, sonSn: 45, tur: metin-karti, ekranYazisi: "SEMİNER", konum: ust, broll: yok, metin: "Kaydet, dene. Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.", sablon: {kalip: kapanis, baslik: "Önce *kaydet*, sonra dene", ust: "YORUMLARA YAZ", damga: "SEMİNER", adimlar: [{hedef: y, kelime: 7, hareket: belir}]}}
aciklama_taslagi: |-
  Claude'u tek depoyla koca bir yazılım ekibine çevirebilirsin. 👇

  Depo: ECC, eski adıyla Everything Claude Code (GitHub: affaan-m/ECC), MIT lisanslı, 300 binden fazla yıldız.
  • İçinde 71 ajan, 314 skill ve 98 komut var, yanında hook'lar da geliyor
  • Her ajan işin bir parçasını yapıyor: planlıyor, kodluyor, test ediyor, kodu inceliyor
  • Claude Code'a eklenti olarak kurulur

  Kurulum: Claude Code'da "ECC eklentisini kur" de ya da şu iki komut:
  /plugin marketplace add https://github.com/affaan-m/ECC
  /plugin install ecc@ecc

  Bilmen gereken: Depo ücretsiz açık kaynak ama Claude ücretli; kotandan düşer. Hepsini birden kurmak Claude'un bağlamını doldurabilir; yalnız işine yarayanı seç. Node.js 18+ ve Git gerekir. Kurulum yöntemlerini üst üste koyma, birini seç.

  Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.

  #yapayzeka #ClaudeCode #yazılım #ajan #seminer
---
