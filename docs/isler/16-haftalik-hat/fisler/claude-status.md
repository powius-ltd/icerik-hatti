---
fis_id: claude-status-01
kaynak:
  tur: metin
  dosya: docs/isler/16-haftalik-hat/SPEC.md
hesap: varsayilan
gorsel_yon: karma
fis_onay: evet
paylasim_onay: hayir
durum: taslak
# Kaynak: https://status.claude.com (doğrulama 13 Kas 2026). Sayfada listelenen bileşenler: claude.ai, Claude Console, Claude API, Claude Code, Claude Cowork ve bulut platformu satırları. "Past Incidents" bölümü ve "Incident History" bağlantısı var; 90 günlük kesinti görünümü var. Abonelik: e-posta, SMS, Slack, Microsoft Teams, webhook, Atom ve RSS. Doğrulama günü sayfada açık olaylar vardı; kalıcı bilgi olmadığı için ne tarih ne rakam ne bileşen durumu yazıldı. Ekranda komut yok; adres ekranda yazabilir. Yumuşatılmış: "kesinti sende değil" yerine "sorun sende olmayabilir".
sahneler:
- {no: 1, basSn: 0, sonSn: 5, tur: metin-karti, ekranYazisi: "Sorun sende olmayabilir", konum: ust, broll: yok, metin: "Claude cevap vermiyorsa sorun sende olmayabilir.", sablon: {kalip: gazete, baslik: "Sorun *sende* olmayabilir", svg: durum.svg, adimlar: [{hedef: kesinti, kelime: 0, hareket: belir}, {hedef: sende, kelime: 4, hareket: belir}]}}
- {no: 2, basSn: 5, sonSn: 10, tur: metin-karti, ekranYazisi: "Önce durum sayfası", konum: ust, broll: yok, metin: "Önce status.claude.com'a bak. Resmî durum sayfası.", sablon: {kalip: rakam, baslik: "Önce *durum sayfası*", satirlar: [{baslik: "Önce durum sayfasına bak", kelime: 0}, {baslik: "status.claude.com", alt: "resmî durum sayfası", kelime: 1, sec: true}]}}
- {no: 3, basSn: 10, sonSn: 16, tur: metin-karti, ekranYazisi: "Parça parça", konum: ust, broll: yok, metin: "Sayfada claude.ai, API ve Claude Code ayrı ayrı listeleniyor.", sablon: {kalip: gazete, baslik: "Hepsi *ayrı* listede", svg: bilesen.svg, adimlar: [{hedef: liste, kelime: 1, hareket: belir}, {hedef: ayri, kelime: 6, hareket: belir}]}}
- {no: 4, basSn: 16, sonSn: 21, tur: metin-karti, ekranYazisi: "Geçmiş olaylar", konum: ust, broll: yok, metin: "Geçmiş olaylar da aynı sayfada duruyor.", sablon: {kalip: rakam, baslik: "Geçmiş *olaylar* da var", satirlar: [{baslik: "Geçmiş olaylar", kelime: 0}, {baslik: "Aynı sayfada duruyor", kelime: 3, sec: true}]}}
- {no: 5, basSn: 21, sonSn: 28, tur: metin-karti, ekranYazisi: "Bilmen gereken", konum: ust, broll: yok, metin: "Bilmen gereken: sayfada sorun görünmüyorsa kendi internetini ve oturumunu kontrol et.", sablon: {kalip: rakam, baslik: "Bilmen *gereken*", satirlar: [{baslik: "Sayfada sorun yoksa", kelime: 2}, {baslik: "İnternetini kontrol et", kelime: 6}, {baslik: "Oturumunu kontrol et", kelime: 8, sec: true}]}}
- {no: 6, basSn: 28, sonSn: 34, tur: metin-karti, ekranYazisi: "Abone ol", konum: ust, broll: yok, metin: "İstersen abone ol. E-posta, SMS, Slack ya da RSS ile haber gelir.", sablon: {kalip: rakam, baslik: "İstersen *abone* ol", satirlar: [{baslik: "E-posta ve SMS", kelime: 3}, {baslik: "Slack", kelime: 5}, {baslik: "RSS", kelime: 8, sec: true}]}}
- {no: 7, basSn: 34, sonSn: 41, tur: metin-karti, ekranYazisi: "SEMİNER", konum: ust, broll: yok, metin: "Kaydet, durum sayfasına bak. Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.", sablon: {kalip: kapanis, baslik: "Önce *kaydet*, sonra bak", ust: "YORUMLARA YAZ", damga: "SEMİNER", adimlar: [{hedef: y, kelime: 9, hareket: belir}]}}
aciklama_taslagi: |-
  Claude cevap vermiyorsa sorun sende olmayabilir. 👇

  status.claude.com resmî durum sayfası:
  • claude.ai, API ve Claude Code gibi bileşenler ayrı ayrı listeleniyor
  • Geçmiş olaylar aynı sayfada duruyor
  • E-posta, SMS, Slack, Microsoft Teams, webhook, Atom ya da RSS ile abone olabilirsin

  Pratik: Claude yavaşladığında önce bu sayfaya bak. Kullandığın bileşende sorun görünüyorsa beklemek yeter.

  Bilmen gereken: Sayfada sorun görünmüyorsa kendi internetini ve oturumunu kontrol et. Sayfa her kullanıcının yaşadığı sorunu göstermeyebilir.

  Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.

  #yapayzeka #Claude #ClaudeCode #yapayzekaaraçları #seminer
