---
fis_id: baki-kanal-01
kaynak:
  tur: metin
  dosya: docs/isler/15-izgara-kanca/fisler/baki-kanal.md
hesap: varsayilan
gorsel_yon: karma
fis_onay: evet
paylasim_onay: evet
durum: taslak
# Seri: ÖĞRENCİ KURDU · 02 (01 = aysenur-uygulama). Kanca: 4'lü ızgara (tools/reels.sh izgara), son konuşan Baki ("3. günde kurdum").
# Kaynak: TST-01 / TST-05 dökümü (Baki, 19, İzmir Aliağa; teknik bilgi yok; 3 haftadır toplulukta; her gün yapay zekanın video paylaştığı kanal; "3. günde kurdum").
# Gelir iddiası doğrulanmadı, kullanılmadı. Üç parça Baki'nin birebir araçları değil, "böyle bir kanal nasıl kurulur" anlatımı.
sahneler:
- {no: 1, basSn: 0, sonSn: 7, tur: metin-karti, ekranYazisi: "Üç günde kanal", konum: ust, broll: yok, metin: "Baki on dokuz yaşında, teknik bilgisi sıfır. Her gün kendi kendine video paylaşan bir kanal kurdu, üçüncü günde.", sablon: {kalip: rakam, baslik: "Üç günde *kanal*", satirlar: [{baslik: "19 yaşında", alt: "İzmir", kelime: 2}, {baslik: "Teknik bilgi yok", alt: "sıfırdan", kelime: 5}, {baslik: "3. günde kanal", alt: "her gün kendisi paylaşıyor", kelime: 16, sec: true}]}}
- {no: 2, basSn: 7, sonSn: 12, tur: metin-karti, ekranYazisi: "Üç parça", konum: ust, broll: yok, metin: "Sistem üç parça: konu listesi, üretim, zamanlı paylaşım.", sablon: {kalip: akis, baslik: "Sistem *üç* parça", svg: parcalar.svg, adimlar: [{hedef: a, kelime: 4, hareket: belir}, {hedef: b, kelime: 5, hareket: belir}, {hedef: c, kelime: 6, hareket: belir}]}}
- {no: 3, basSn: 12, sonSn: 18, tur: metin-karti, ekranYazisi: "Konu listesi", konum: ust, broll: yok, metin: "Önce bir tabloya haftanın konularını yaz. Her satır bir video.", sablon: {kalip: gazete, baslik: "1. Konu *listesi*", svg: liste.svg, adimlar: [{hedef: tablo, kelime: 0, hareket: belir}, {hedef: s1, kelime: 4, hareket: belir}, {hedef: s2, kelime: 7, hareket: belir}]}}
- {no: 4, basSn: 18, sonSn: 25, tur: metin-karti, ekranYazisi: "Üretim", konum: ust, broll: yok, metin: "Sonra Claude'a söyle: listedeki sıradaki konuyu al, metnini yaz, videosunu hazırla.", sablon: {kalip: gazete, baslik: "2. *Üretim*", svg: uretim.svg, adimlar: [{hedef: sohbet, kelime: 0, hareket: belir}, {hedef: istem, kelime: 3, hareket: belir}, {hedef: video, kelime: 10, hareket: belir}]}}
- {no: 5, basSn: 25, sonSn: 31, tur: metin-karti, ekranYazisi: "Zamanlı paylaşım", konum: ust, broll: yok, metin: "Son parça saat: her gün aynı saatte kendisi yükler. Sen yalnız listeyi doldurursun.", sablon: {kalip: gazete, baslik: "3. Zamanlı *paylaşım*", svg: saat.svg, adimlar: [{hedef: saat, kelime: 2, hareket: belir}, {hedef: yukle, kelime: 7, hareket: belir}, {hedef: sen, kelime: 9, hareket: belir}]}}
- {no: 6, basSn: 31, sonSn: 38, tur: metin-karti, ekranYazisi: "SEMİNER", konum: ust, broll: yok, metin: "Baki bunu Claude'la kurdu. Nasıl kurulduğunu seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.", sablon: {kalip: kapanis, baslik: "Sıradaki *sen* ol", ust: "YORUMLARA YAZ", damga: "SEMİNER", adimlar: [{hedef: y, kelime: 10, hareket: belir}]}}
aciklama_taslagi: |-
  Teknik bilgisi sıfır olan 19 yaşında biri, her gün kendi kendine video paylaşan bir kanalı üçüncü günde kurdu. 👇

  Baki, AISCALE topluluğunda Claude'u öğrendi. Böyle bir kanal üç parçadan oluşur:

  1. Konu listesi: bir tabloya haftanın konularını yaz, her satır bir video.
  2. Üretim: Claude'a "listedeki sıradaki konuyu al, metnini yaz, videosunu hazırla" de.
  3. Zamanlı paylaşım: her gün aynı saatte kendisi yükler. Sen yalnız listeyi doldurursun.

  Nasıl kurulduğunu seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.

  #yapayzeka #Claude #otomasyon #içerik #seminer
---
