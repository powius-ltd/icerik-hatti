---
fis_id: pahali-model-01
kaynak:
  tur: metin
  dosya: docs/isler/12-dort-reels/SPEC.md
hesap: varsayilan
gorsel_yon: karma
fis_onay: evet
paylasim_onay: hayir
durum: taslak
sahneler:
- {no: 1, basSn: 0, sonSn: 7, tur: metin-karti, ekranYazisi: "Duvarı mimar mı örer", konum: ust, broll: yok, metin: "Duvar örmek için mimar tutar mısın? Claude Code'da her işi en pahalı modele verirsen tam bunu yapıyorsun.", sablon: {kalip: gazete, baslik: "Duvarı *mimar* mı örer?", svg: mimar.svg, adimlar: [{hedef: duvar, kelime: 0, hareket: belir}, {hedef: mimar, kelime: 3, hareket: belir}, {hedef: etiket, kelime: 11, hareket: belir}]}}
- {no: 2, basSn: 7, sonSn: 12, tur: metin-karti, ekranYazisi: "İşi üçe böl", konum: ust, broll: yok, metin: "İş üçe bölünür: planı Opus yapar, kodu Sonnet yazar, dosya aramayı Haiku.", sablon: {kalip: gazete, baslik: "İşi *üçe* böl", svg: bolme.svg, adimlar: [{hedef: o, kelime: 4, hareket: belir}, {hedef: s, kelime: 7, hareket: belir}, {hedef: h, kelime: 11, hareket: belir}]}}
- {no: 3, basSn: 12, sonSn: 18, tur: metin-karti, ekranYazisi: "Birinci yol", konum: ust, broll: yok, metin: "Birinci yol, opus plan. Plan modunda Opus çalışır, koda geçilince Sonnet devralır.", sablon: {kalip: gazete, baslik: "Birinci yol: *opusplan*", svg: komut.svg, adimlar: [{hedef: pencere, kelime: 0, hareket: belir}, {hedef: s1, kelime: 2, hareket: belir}, {hedef: s2, kelime: 6, hareket: belir}, {hedef: s3, kelime: 10, hareket: belir}]}}
- {no: 4, basSn: 18, sonSn: 25, tur: metin-karti, ekranYazisi: "İkinci yol", konum: ust, broll: yok, metin: "İkinci yol, alt ajan. Ajan dosyasındaki model satırına haiku yazılırsa o iş hafif modelde döner.", sablon: {kalip: gazete, baslik: "İkinci yol: *alt ajan*", svg: ajan.svg, adimlar: [{hedef: d, kelime: 4, hareket: belir}, {hedef: m, kelime: 8, hareket: belir}]}}
- {no: 5, basSn: 25, sonSn: 29, tur: metin-karti, ekranYazisi: "Model yazılmazsa", konum: ust, broll: yok, metin: "Ayar yoksa alt ajan, ana sohbetin modelinde çalışır.", sablon: {kalip: rakam, baslik: "Model yazılmazsa *ne olur*", satirlar: [{baslik: "Model satırı yok", kelime: 0}, {baslik: "Ana sohbetin modeli", alt: "ajan onu kullanır", kelime: 4}, {baslik: "Opus'ta ajan da Opus", kelime: 6, sec: true}]}}
- {no: 6, basSn: 29, sonSn: 35, tur: metin-karti, ekranYazisi: "Bilmen gereken", konum: ust, broll: yok, metin: "Tasarruf işe göre değişir. Zor kararı küçük modele bırakmak kalite düşürebilir.", sablon: {kalip: rakam, baslik: "Bilmen *gereken*", satirlar: [{baslik: "Tasarruf işe göre değişir", kelime: 0}, {baslik: "Zor karar: büyük model", kelime: 4}, {baslik: "Küçük modelde kalite düşebilir", kelime: 9, sec: true}]}}
- {no: 7, basSn: 35, sonSn: 43, tur: metin-karti, ekranYazisi: "SEMİNER", konum: ust, broll: yok, metin: "Kaydet, sıradaki işte dene. Claude Code'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, kayıt linkini DM'den atayım.", sablon: {kalip: kapanis, baslik: "Önce *kaydet*, sıradaki işte dene", ust: "YORUMLARA YAZ", damga: "SEMİNER", adimlar: [{hedef: y, kelime: 9, hareket: belir}]}}
aciklama_taslagi: |-
  Duvar örmek için mimar tutar mısın? Claude Code'da her işi en pahalı modele verirsen tam bunu yapıyorsun. 👇

  İşi modele göre bölmenin iki yolu var:

  1. /model opusplan: plan modunda Opus, kodu yazarken otomatik Sonnet çalışır.
  2. Alt ajan dosyasına (.claude/agents/) model: haiku satırı yaz; o ajanın işi hafif modelde döner. Model satırı yoksa alt ajan ana sohbetin modelini kullanır.

  Tasarruf işe göre değişir. Zor kararı küçük modele bırakmak kaliteyi düşürebilir. Kaynak: code.claude.com/docs (model-config, sub-agents).

  Claude Code'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, kayıt linkini DM'den atayım.

  #ClaudeCode #Claude #yapayzeka #yazılım #seminer
---
