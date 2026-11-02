---
fis_id: cok-pahali-01
kaynak:
  tur: metin
  dosya: docs/isler/12-dort-reels/SPEC.md
hesap: varsayilan
gorsel_yon: karma
fis_onay: evet
paylasim_onay: hayir
durum: taslak
sahneler:
- {no: 1, basSn: 0, sonSn: 4, tur: metin-karti, ekranYazisi: "Fiyatı hemen indirme", konum: ust, broll: yok, metin: "Müşteri çok pahalı dediğinde fiyatı hemen indirme.", sablon: {kalip: gazete, baslik: "Fiyatı *hemen* indirme", svg: itiraz.svg, adimlar: [{hedef: kisi, kelime: 0, hareket: belir}, {hedef: balon, kelime: 1, hareket: belir}, {hedef: etiket, kelime: 4, hareket: belir}]}}
- {no: 2, basSn: 4, sonSn: 8, tur: metin-karti, ekranYazisi: "Neye göre", konum: ust, broll: yok, metin: "Önce şunu sor: neye göre pahalı? Çünkü aklındaki karşılaştırmayı bilmiyorsun.", sablon: {kalip: gazete, baslik: "Önce sor: *neye göre?*", svg: soru.svg, adimlar: [{hedef: balon, kelime: 3, hareket: belir}, {hedef: terazi, kelime: 6, hareket: belir}]}}
- {no: 3, basSn: 8, sonSn: 13, tur: metin-karti, ekranYazisi: "Cevaba göre davran", konum: ust, broll: yok, metin: "Rakibe göreyse farkını göster. Bütçeyeyse kapsamı küçült. Değeri anlamadıysa sonucu anlat.", sablon: {kalip: rakam, baslik: "Cevaba göre *davran*", satirlar: [{baslik: "Rakibe göre", alt: "farkını göster", kelime: 0}, {baslik: "Bütçeye göre", alt: "kapsamı küçült", kelime: 4}, {baslik: "Değeri görmüyor", alt: "sonucu anlat", kelime: 7, sec: true}]}}
- {no: 4, basSn: 13, sonSn: 19, tur: metin-karti, ekranYazisi: "İndirim yerine kapsam", konum: ust, broll: yok, metin: "Aynı işi daha ucuza verirsen, ilk fiyatın neden o kadardı sorusu gelir. İndirim yerine kapsamı küçült.", sablon: {kalip: akis, baslik: "İndirim değil, *kapsam*", svg: kapsam.svg, adimlar: [{hedef: a, kelime: 0, hareket: belir}, {hedef: b, kelime: 5, hareket: belir}, {hedef: c, kelime: 12, hareket: belir}]}}
- {no: 5, basSn: 19, sonSn: 27, tur: metin-karti, ekranYazisi: "Günlük anlat", konum: ust, broll: yok, metin: "Bir de sunuş var. Gourville'in deneylerinde aynı tutar günlük anlatılınca insanlar onu küçük günlük harcamalarla kıyasladı, teklife daha sıcak baktı.", sablon: {kalip: rakam, baslik: "Aynı tutar, *günlük* anlat", satirlar: [{baslik: "Gourville, 1998", alt: "laboratuvar deneyleri", kelime: 4}, {baslik: "Aynı tutar, günlük", kelime: 6}, {baslik: "Küçük harcamayla kıyas", alt: "teklife daha sıcak bakış", kelime: 12, sec: true}]}}
- {no: 6, basSn: 27, sonSn: 35, tur: metin-karti, ekranYazisi: "Günde on lira", konum: ust, broll: yok, metin: "Yılda üç bin altı yüz elli lira yerine günde on lira de. Toplamı da söyle. Bu laboratuvar sonucu, her satışta tutmayabilir.", sablon: {kalip: gazete, baslik: "Toplamı da *söyle*", svg: gunluk.svg, adimlar: [{hedef: yil, kelime: 0, hareket: belir}, {hedef: gun, kelime: 8, hareket: belir}, {hedef: not, kelime: 12, hareket: belir}]}}
- {no: 7, basSn: 35, sonSn: 41, tur: metin-karti, ekranYazisi: "Üç şey dene", konum: ust, broll: yok, metin: "Bu hafta bir sonraki itirazda üç şey dene: neye göre diye sor, kapsamı küçült, fiyatı günlük söyle.", sablon: {kalip: rakam, baslik: "Bu hafta *dene*", satirlar: [{baslik: "Neye göre diye sor", kelime: 8}, {baslik: "Kapsamı küçült", kelime: 12}, {baslik: "Fiyatı günlük söyle", kelime: 14, sec: true}]}}
- {no: 8, basSn: 41, sonSn: 48, tur: metin-karti, ekranYazisi: "SEMİNER", konum: ust, broll: yok, metin: "Kaydet. Claude'u pazarlamada kullanmayı seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, kayıt linkini DM'den atayım.", sablon: {kalip: kapanis, baslik: "Önce *kaydet*, sonra dene", ust: "YORUMLARA YAZ", damga: "SEMİNER", adimlar: [{hedef: y, kelime: 8, hareket: belir}]}}
aciklama_taslagi: |-
  Müşteri "çok pahalı" dediğinde fiyatı hemen indirme. 👇

  Önce sor: neye göre pahalı?
  Rakibe göreyse farkını göster. Bütçeye göreyse kapsamı küçült. Değeri görmüyorsa sonucu anlat.

  Sunuş da etkiler. Gourville'in 1998 tarihli laboratuvar deneylerinde aynı tutar günlük anlatılınca insanlar onu küçük günlük harcamalarla kıyasladı. Toplamı da söyle; bu sonuç her satışta tutmayabilir.

  Bu hafta bir sonraki itirazda dene:
  1. Neye göre diye sor.
  2. Kapsamı küçült.
  3. Fiyatı günlük söyle.

  Claude'u pazarlamada kullanmayı seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, kayıt linkini DM'den atayım.

  #pazarlama #satış #fiyatlandırma #Claude #seminer
---
