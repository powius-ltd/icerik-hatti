---
fis_id: haftalik-rapor-01
kaynak:
  tur: metin
  dosya: docs/isler/16-haftalik-hat/SPEC.md
hesap: varsayilan
gorsel_yon: karma
fis_onay: evet
paylasim_onay: hayir
durum: taslak
# Kaynak: pratik araç videosu, dış belge yok. Ekranda Claude dışında marka/ürün adı yok; komut yok; sayı ve istatistik yok. Özellik iddiası yok: yalnız "notları yapıştır, istemle başlıkları söyle" akışı. İstemin tam hali açıklamada. Yumuşatılmış: "hatasız rapor" demek yerine "göndermeden önce kendin oku".
sahneler:
- {no: 1, basSn: 0, sonSn: 5, tur: metin-karti, ekranYazisi: "Dağınık notlar", konum: ust, broll: yok, metin: "Haftanın dağınık notlarını tek istemle rapora çevir.", sablon: {kalip: gazete, baslik: "Dağınık notlar, *tek istem*", svg: dagin.svg, adimlar: [{hedef: dagin, kelime: 1, hareket: belir}, {hedef: rapor, kelime: 5, hareket: belir}]}}
- {no: 2, basSn: 5, sonSn: 11, tur: metin-karti, ekranYazisi: "Hepsini yapıştır", konum: ust, broll: yok, metin: "Mesajları, yapılacakları ve toplantı notlarını olduğu gibi yapıştır.", sablon: {kalip: rakam, baslik: "Hepsini *yapıştır*", satirlar: [{baslik: "Mesajlar", kelime: 0}, {baslik: "Yapılacaklar", kelime: 1}, {baslik: "Toplantı notları", kelime: 3, sec: true}]}}
- {no: 3, basSn: 11, sonSn: 17, tur: metin-karti, ekranYazisi: "Altına istem", konum: ust, broll: yok, metin: "Notların altına kısa bir istem ekle.", sablon: {kalip: gazete, baslik: "Notların altına *istem*", svg: istem.svg, adimlar: [{hedef: notlar, kelime: 0, hareket: belir}, {hedef: istem, kelime: 4, hareket: belir}]}}
- {no: 4, basSn: 17, sonSn: 24, tur: metin-karti, ekranYazisi: "Dört başlık", konum: ust, broll: yok, metin: "Raporda dört başlık iste: biten, devam eden, takılan, gelecek hafta.", sablon: {kalip: gazete, baslik: "Raporda *dört başlık*", svg: rapor.svg, adimlar: [{hedef: biten, kelime: 4, hareket: belir}, {hedef: devam, kelime: 5, hareket: belir}, {hedef: takilan, kelime: 7, hareket: belir}, {hedef: gelecek, kelime: 8, hareket: belir}]}}
- {no: 5, basSn: 24, sonSn: 30, tur: metin-karti, ekranYazisi: "Uydurmasın", konum: ust, broll: yok, metin: "Notta olmayan bilgiyi eklemesin, eksik yeri sorsun.", sablon: {kalip: rakam, baslik: "Notta yoksa *eklemesin*", satirlar: [{baslik: "Notta yoksa eklemesin", kelime: 0}, {baslik: "Eksik yeri sorsun", kelime: 4, sec: true}]}}
- {no: 6, basSn: 30, sonSn: 36, tur: metin-karti, ekranYazisi: "Bilmen gereken", konum: ust, broll: yok, metin: "Bilmen gereken: göndermeden önce raporu kendin oku.", sablon: {kalip: rakam, baslik: "Bilmen *gereken*", satirlar: [{baslik: "Göndermeden önce", kelime: 2}, {baslik: "Raporu kendin oku", kelime: 4, sec: true}]}}
- {no: 7, basSn: 36, sonSn: 43, tur: metin-karti, ekranYazisi: "SEMİNER", konum: ust, broll: yok, metin: "Kaydet, haftalık raporda dene. Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.", sablon: {kalip: kapanis, baslik: "Önce *kaydet*, sonra dene", ust: "YORUMLARA YAZ", damga: "SEMİNER", adimlar: [{hedef: y, kelime: 9, hareket: belir}]}}
aciklama_taslagi: |-
  Haftanın dağınık notlarını tek istemle rapora çevir. 👇

  Notlarını Claude'a yapıştır, altına şu istemi ekle:

  "Aşağıdaki notlar bu haftaya ait: mesajlar, yapılacaklar, toplantı notları. Bunlardan düzenli bir haftalık rapor hazırla. Dört başlık olsun: Bu hafta biten, Devam eden, Takılan, Gelecek hafta. Her başlığın altında kısa maddeler yaz. Notlarda olmayan bilgiyi ekleme. Eksik ya da belirsiz bir yer varsa raporun sonunda bana soru olarak sor.

  Notlar:
  [buraya yapıştır]"

  Pratik: Başlıkları kendi işine göre değiştirebilirsin.

  Bilmen gereken: Claude yalnız yapıştırdığın notlara bakar. Notlar eksikse rapor da eksik çıkar, göndermeden önce kendin oku.

  Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.

  #yapayzeka #Claude #haftalıkrapor #verimlilik #seminer
---
