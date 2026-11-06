---
fis_id: aysenur-uygulama-01
kaynak:
  tur: metin
  dosya: docs/isler/15-izgara-kanca/fisler/aysenur-uygulama.md
hesap: varsayilan
gorsel_yon: karma
fis_onay: evet
paylasim_onay: hayir
durum: taslak
# Kanca bu fişte değil: 4'lü ızgara kancası (tools/testimonial/izgara.py, specs/izgara-prototip.json) gövdenin önüne eklenir.
# Kaynak: SH-05 dökümü (Ayşenur: Viyana, uluslararası ilişkiler mezunu, pedagoji; arkadaşının ödevi için uygulama, "4 saat sürmüş").
# Uygulamanın adı dökümde anlaşılmıyor (ASR bozuk), kullanılmadı. Üç adım Ayşenur'un birebir yöntemi değil, "böyle bir uygulama nasıl kurulur" anlatımı.
sahneler:
- {no: 1, basSn: 0, sonSn: 7, tur: metin-karti, ekranYazisi: "Dört saatte uygulama", konum: ust, broll: yok, metin: "Ayşenur uluslararası ilişkiler mezunu, kodla hiç arası yok. Arkadaşının ödevi için bir uygulama kurdu, dört saatte.", sablon: {kalip: rakam, baslik: "Dört saatte *uygulama*", satirlar: [{baslik: "Uluslararası ilişkiler", alt: "mezun", kelime: 1}, {baslik: "Kod yok", alt: "hiç yazmadı", kelime: 5}, {baslik: "4 saatte uygulama", alt: "arkadaşının ödevi için", kelime: 12, sec: true}]}}
- {no: 2, basSn: 7, sonSn: 12, tur: metin-karti, ekranYazisi: "Üç adım", konum: ust, broll: yok, metin: "Dört saat, üç adım: fikir, ilk istem, dene ve düzelt.", sablon: {kalip: akis, baslik: "Dört saat, *üç* adım", svg: adimlar.svg, adimlar: [{hedef: a, kelime: 4, hareket: belir}, {hedef: b, kelime: 5, hareket: belir}, {hedef: c, kelime: 7, hareket: belir}]}}
- {no: 3, basSn: 12, sonSn: 18, tur: metin-karti, ekranYazisi: "Tek cümle", konum: ust, broll: yok, metin: "Önce fikri tek cümleye indir: kim kullanacak, ne yapacak, ekranda ne görecek.", sablon: {kalip: gazete, baslik: "1. Tek *cümle*", svg: cumle.svg, adimlar: [{hedef: kart, kelime: 0, hareket: belir}, {hedef: t1, kelime: 5, hareket: belir}, {hedef: t2, kelime: 7, hareket: belir}, {hedef: t3, kelime: 9, hareket: belir}]}}
- {no: 4, basSn: 18, sonSn: 25, tur: metin-karti, ekranYazisi: "Önce soru sor", konum: ust, broll: yok, metin: "Sonra Claude'a bu cümleyi ver ve ekle: kurmadan önce bana beş soru sor. Planı cevaplarından o çıkarır.", sablon: {kalip: gazete, baslik: "2. Önce *soru* sor", svg: istem.svg, adimlar: [{hedef: sohbet, kelime: 0, hareket: belir}, {hedef: istem, kelime: 7, hareket: belir}, {hedef: plan, kelime: 13, hareket: belir}]}}
- {no: 5, basSn: 25, sonSn: 31, tur: metin-karti, ekranYazisi: "Dene, düzelt", konum: ust, broll: yok, metin: "İlk sürümü aç, bozuk yeri tek cümleyle söyle. Her turda biraz daha düzelir.", sablon: {kalip: gazete, baslik: "3. Dene, *düzelt*", svg: duzelt.svg, adimlar: [{hedef: ekran, kelime: 0, hareket: belir}, {hedef: hata, kelime: 4, hareket: belir}, {hedef: tik, kelime: 9, hareket: belir}]}}
- {no: 6, basSn: 31, sonSn: 38, tur: metin-karti, ekranYazisi: "SEMİNER", konum: ust, broll: yok, metin: "Ayşenur bunu Claude'la kurdu. Nasıl kurulduğunu seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.", sablon: {kalip: kapanis, baslik: "Sıradaki *sen* ol", ust: "YORUMLARA YAZ", damga: "SEMİNER", adimlar: [{hedef: y, kelime: 10, hareket: belir}]}}
aciklama_taslagi: |-
  Kodla hiç arası olmayan bir uluslararası ilişkiler mezunu, arkadaşının ödevi için dört saatte uygulama kurdu. 👇

  Ayşenur, AISCALE topluluğunda Claude'u öğrendi. Böyle bir uygulama üç adımda kurulur:

  1. Fikri tek cümleye indir: kim kullanacak, ne yapacak, ekranda ne görecek.
  2. Claude'a bu cümleyi ver ve ekle: "Kurmadan önce bana beş soru sor." Planı cevaplarından o çıkarır.
  3. İlk sürümü aç, bozuk yeri tek cümleyle söyle. Her turda biraz daha düzelir.

  Nasıl kurulduğunu seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.

  #yapayzeka #Claude #uygulama #girişimcilik #seminer
---
