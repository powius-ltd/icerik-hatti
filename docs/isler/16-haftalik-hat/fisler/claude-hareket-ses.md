---
fis_id: claude-hareket-ses-01
kaynak:
  tur: metin
  dosya: docs/isler/16-haftalik-hat/SPEC.md
hesap: varsayilan
gorsel_yon: karma
fis_onay: evet
paylasim_onay: hayir
durum: taslak
# Araç: earshot (github.com/Leonxlnx/earshot). Doğrulama 15 Kas: README: "ears for coding agents", yalnız CPU, kod MIT lisanslı (modeller kendi lisanslarıyla iner); critique = tanıtım videosu karnesi + zaman damgalı düzeltmeler; forge = sesi kodla üretip dinleyerek iyileştirir; kit = ses bankasından film için efekt kiti, model ve ağ gerekmez; Claude Code'a MCP olarak eklenir; uv ve ffmpeg gerekir, ilk çalıştırmada modeller iner. İkinci araç: Openverse API (api.openverse.org/v1/), canlı denendi: ses araması sonuç döndürüyor, her kayıtta lisans alanı var; "ücretsiz" ve "5 milyon" iddiası doğrulanmadığı için yazılmadı, kayıt başına lisans değişir. Kaynak videodaki "real SFX" aracı web'de bulunamadı, yazılmadı. "Zamana tam kareyle yerleştirir" iddiası doğrulanmadı, yazılmadı. Ekranda komut yok; kurulum "Claude'a ... kur de". Kaynak video: instagram.com/p/DfII6u2Nl_p.
sahneler:
- {no: 1, basSn: 0, sonSn: 6, tur: metin-karti, ekranYazisi: "Ses efektleri hâlâ kötü", konum: ust, broll: yok, metin: "Claude hareketli grafikte harika ama eklediği ses efektleri hâlâ kötü. Bu açık kaynak araç onu düzeltiyor.", sablon: {kalip: gazete, baslik: "Ses efektleri *hâlâ* kötü", svg: ses.svg, adimlar: [{hedef: kotu, kelime: 5, hareket: belir}, {hedef: duzelt, kelime: 10, hareket: belir}]}}
- {no: 2, basSn: 6, sonSn: 12, tur: metin-karti, ekranYazisi: "earshot", konum: ust, broll: yok, metin: "Adı earshot. MIT lisanslı, yalnız işlemciyle çalışıyor, Claude Code'a MCP olarak ekleniyor.", sablon: {kalip: rakam, baslik: "Adı *earshot*", satirlar: [{baslik: "earshot", alt: "kodlama ajanına kulak", kelime: 1}, {baslik: "MIT lisanslı", alt: "yalnız işlemci", kelime: 2}, {baslik: "Claude Code'a eklenir", kelime: 7, sec: true}]}}
- {no: 3, basSn: 12, sonSn: 18, tur: metin-karti, ekranYazisi: "Dinleyip puanlıyor", konum: ust, broll: yok, metin: "Tanıtım videonu dinleyip puanlıyor ve zaman damgalı düzeltmeler öneriyor.", sablon: {kalip: gazete, baslik: "Dinleyip *puanlıyor*", svg: dinle.svg, adimlar: [{hedef: dalga, kelime: 1, hareket: belir}, {hedef: puan, kelime: 3, hareket: belir}, {hedef: isaret, kelime: 5, hareket: belir}]}}
- {no: 4, basSn: 18, sonSn: 25, tur: metin-karti, ekranYazisi: "Sesi kodla üretiyor", konum: ust, broll: yok, metin: "Sesi kodla üretip dinleyerek iyileştiriyor. İnternetsiz ses kiti de çıkarıyor.", sablon: {kalip: gazete, baslik: "Sesi *kodla* üretiyor", svg: uret.svg, adimlar: [{hedef: kod, kelime: 1, hareket: belir}, {hedef: ses, kelime: 6, hareket: belir}]}}
- {no: 5, basSn: 25, sonSn: 31, tur: metin-karti, ekranYazisi: "Hazır ses de var", konum: ust, broll: yok, metin: "Openverse API ses efekti aramaya izin veriyor. Her kaydın lisansı yanında yazıyor.", sablon: {kalip: rakam, baslik: "Hazır ses *de* var", satirlar: [{baslik: "Openverse API", alt: "açık lisanslı ses araması", kelime: 0}, {baslik: "Ses efekti arar", kelime: 2}, {baslik: "Lisansı yanında yazar", alt: "kayıt başına değişir", kelime: 9, sec: true}]}}
- {no: 6, basSn: 31, sonSn: 38, tur: metin-karti, ekranYazisi: "Kurulum", konum: ust, broll: yok, metin: "Bilmen gereken: Claude ücretli, kotandan düşer. Earshot ilk kurulumda modelleri indirir. Kurmak için Claude'a earshot'ı kur de.", sablon: {kalip: rakam, baslik: "Claude'a *kur* de", satirlar: [{baslik: "Claude ücretli", alt: "kotandan düşer", kelime: 2}, {baslik: "İlk kurulumda modeller iner", kelime: 7}, {baslik: "earshot'ı kur de", alt: "Claude'a söyle", kelime: 14, sec: true}]}}
- {no: 7, basSn: 38, sonSn: 45, tur: metin-karti, ekranYazisi: "SEMİNER", konum: ust, broll: yok, metin: "Kaydet, sesi dene. Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.", sablon: {kalip: kapanis, baslik: "Önce *kaydet*, sonra dene", ust: "YORUMLARA YAZ", damga: "SEMİNER", adimlar: [{hedef: y, kelime: 8, hareket: belir}]}}
aciklama_taslagi: |-
  Claude hareketli grafikte harika ama eklediği ses efektleri hâlâ kötü. Bu açık kaynak araç onu düzeltiyor. 👇

  Araç: earshot (GitHub: Leonxlnx/earshot), kod MIT lisanslı, yalnız işlemciyle çalışır.
  • Tanıtım videonu dinleyip puanlar, zaman damgalı düzeltmeler önerir
  • Sesi kodla üretip dinleyerek iyileştirir
  • Hazır bir banktan, ağa gerek kalmadan film için ses kiti çıkarır
  • Claude Code'a MCP olarak eklenir

  Hazır ses lazımsa: Openverse API'si ses efekti aramaya izin veriyor, her kaydın lisansı yanında yazıyor (lisans kayıttan kayda değişir). Adres: api.openverse.org/v1/

  Kurulum: Claude'a "earshot'ı kur" de ya da terminalde:
  uv tool install "earshot[mcp] @ git+https://github.com/Leonxlnx/earshot"
  earshot doctor --fetch

  Bilmen gereken: Araç ücretsiz açık kaynak ama Claude ücretli; kotandan düşer. uv ve ffmpeg gerekir, ilk çalıştırmada modeller iner (yaklaşık 1,1 GB).

  Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.

  #yapayzeka #ClaudeCode #videokurgu #sesefekti #seminer
---
