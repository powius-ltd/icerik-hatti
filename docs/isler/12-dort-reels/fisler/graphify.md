---
fis_id: graphify-01
kaynak:
  tur: metin
  dosya: docs/isler/12-dort-reels/SPEC.md
hesap: varsayilan
gorsel_yon: karma
fis_onay: hayir
paylasim_onay: hayir
durum: taslak
sahneler:
- {no: 1, basSn: 0, sonSn: 5, tur: metin-karti, ekranYazisi: "Limitin nereye gidiyor", konum: ust, broll: yok, metin: "Claude Code her oturumda aynı dosyaları yeniden okuyorsa, limitin orada gidiyor olabilir.", sablon: {kalip: gazete, baslik: "Limitin *nereye* gidiyor?", svg: dongu.svg, adimlar: [{hedef: d1, kelime: 2, hareket: belir}, {hedef: d2, kelime: 4, hareket: belir}, {hedef: d3, kelime: 5, hareket: belir}, {hedef: ok, kelime: 6, hareket: ciz}, {hedef: sayac, kelime: 8, hareket: belir}]}}
- {no: 2, basSn: 5, sonSn: 11, tur: metin-karti, ekranYazisi: "Graphify", konum: ust, broll: yok, metin: "Graphify bunun için var. Açık kaynak, GitHub'da yaklaşık yüz kırk bir bin yıldız almış.", sablon: {kalip: rakam, baslik: "Aracın adı *Graphify*", satirlar: [{baslik: "Graphify", kelime: 0}, {baslik: "Açık kaynak", alt: "Apache 2.0 lisansı", kelime: 4}, {baslik: "141 bin yıldız", alt: "GitHub", kelime: 7, sec: true}]}}
- {no: 3, basSn: 11, sonSn: 17, tur: metin-karti, ekranYazisi: "Bir kez haritalar", konum: ust, broll: yok, metin: "Projeni bir kez haritalıyor. Asistan dosyaları tek tek gezmek yerine haritaya soruyor.", sablon: {kalip: akis, baslik: "Dosya değil, *harita* okur", svg: harita.svg, adimlar: [{hedef: yigin, kelime: 0, hareket: belir}, {hedef: ok, kelime: 2, hareket: ciz}, {hedef: graf, kelime: 3, hareket: belir}]}}
- {no: 4, basSn: 17, sonSn: 22, tur: metin-karti, ekranYazisi: "Kod haritası ücretsiz", konum: ust, broll: yok, metin: "Kod haritası senin bilgisayarında, yapay zekâ kullanılmadan çıkar. O kısım ücretsiz.", sablon: {kalip: rakam, baslik: "Kod haritası *ücretsiz*", satirlar: [{baslik: "Bilgisayarında çalışır", kelime: 2}, {baslik: "Yapay zekâ kullanmaz", alt: "kod haritasında", kelime: 4}, {baslik: "O kısım ücretsiz", kelime: 8, sec: true}]}}
- {no: 5, basSn: 22, sonSn: 28, tur: metin-karti, ekranYazisi: "Kurulum", konum: ust, broll: yok, metin: "Python hazırsa terminalde iki komutla kur. Sonra Claude Code'a graphify nokta yaz.", sablon: {kalip: gazete, baslik: "Üç satırda *kur*", svg: terminal.svg, adimlar: [{hedef: pencere, kelime: 0, hareket: belir}, {hedef: s1, kelime: 2, hareket: belir}, {hedef: s2, kelime: 4, hareket: belir}, {hedef: s3, kelime: 7, hareket: belir}]}}
- {no: 6, basSn: 28, sonSn: 33, tur: metin-karti, ekranYazisi: "Üç dosya", konum: ust, broll: yok, metin: "Sonunda üç dosya gelir: tıklanabilir harita, özet rapor ve haritanın kendisi.", sablon: {kalip: rakam, baslik: "Sonunda üç *dosya*", satirlar: [{baslik: "graph.html", alt: "tıklanabilir harita", kelime: 4}, {baslik: "GRAPH_REPORT.md", alt: "özet rapor", kelime: 6}, {baslik: "graph.json", alt: "haritanın kendisi", kelime: 9, sec: true}]}}
- {no: 7, basSn: 33, sonSn: 41, tur: metin-karti, ekranYazisi: "Bilmen gereken", konum: ust, broll: yok, metin: "Doküman ve görsellerde model devreye girer, orası ücretli olabilir. Claude Code da ücretli, tasarruf da projeye göre değişir.", sablon: {kalip: rakam, baslik: "Bilmen *gereken*", satirlar: [{baslik: "PDF ve görsel: model", alt: "ücretli olabilir", kelime: 0}, {baslik: "Claude Code ücretli", kelime: 9}, {baslik: "Tasarruf değişir", alt: "projeye göre", kelime: 13, sec: true}]}}
- {no: 8, basSn: 41, sonSn: 48, tur: metin-karti, ekranYazisi: "SEMİNER", konum: ust, broll: yok, metin: "Kaydet, akşam dene. Claude Code'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, kayıt linkini DM'den atayım.", sablon: {kalip: kapanis, baslik: "Önce *kaydet*, akşam dene", ust: "YORUMLARA YAZ", damga: "SEMİNER", adimlar: [{hedef: y, kelime: 9, hareket: belir}]}}
aciklama_taslagi: |-
  Claude Code her oturumda aynı dosyaları yeniden okuyorsa, limitin orada gidiyor olabilir. 👇

  Araç: Graphify (GitHub: Graphify-Labs/graphify). Açık kaynak, Apache 2.0 lisanslı. Python 3.10+ ve uv (ya da pipx) gerekir.

  1. uv tool install graphifyy
  2. graphify install
  3. Claude Code'da: /graphify .

  Kod haritası bilgisayarında, yapay zekâ kullanılmadan çıkar. PDF, doküman ve görsellerde model devreye girer, orası ücretli olabilir. Claude Code da ücretli, ayrıca aracın ücretli bir bulut sürümü var. Tasarruf projeye göre değişir.

  Claude Code'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, kayıt linkini DM'den atayım.

  #ClaudeCode #Graphify #yapayzeka #açıkkaynak #seminer
---
