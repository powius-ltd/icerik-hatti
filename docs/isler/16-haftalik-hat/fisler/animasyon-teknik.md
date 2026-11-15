---
fis_id: animasyon-teknik-01
kaynak:
  tur: metin
  dosya: docs/isler/16-haftalik-hat/SPEC.md
hesap: varsayilan
gorsel_yon: karma
fis_onay: evet
paylasim_onay: hayir
durum: taslak
# Araç: awesome-ai-motion (github.com/gongnyang/awesome-ai-motion; kaynak videodaki Rusça paylaşım depo adını yazmıyordu, GitHub aramasında repo açıklaması "637 motion techniques for AI video, infographics and scroll decks" ile bulundu). Doğrulama 15 Kas: GitHub API: 356 yıldız, son push 30 Eyl 2026, arşivli değil, LICENSE dosyası MIT (API "NOASSERTION" gösteriyor; README: özgün işler MIT, GSAP ve paketli fontlar kendi lisanslarında); README başlığı: 637 teknik, 128 referans klip, 11 tarif, 7 tasarım yolu; effects/ klasöründe 637 öğe; her efekt kartı tanım, ayar tablosu ve Claude Code için hazır istem içerir (effects/mask-reveal/README.md örneğinde görüldü); README: gezmek, kartları okumak ve skill için bağımlılık kurulumu gerekmez, yerel klip üretmek için Node.js 20+, ffmpeg ve Playwright gerekir; skill, depoyu ~/.claude/skills altına bağlayarak kullanılır. Kaynak videoda/yazıda Codex da geçiyor, alınmadı. Kurulum adımı sahnede "skill klasörüne bağla" diye anlatıldı, ekranda komut yok. Rakamlar: yıldız "350'den fazla" (356). Kaynak video: instagram.com/p/DfoyWlbACex (@promptcookies).
sahneler:
- {no: 1, basSn: 0, sonSn: 6, tur: metin-karti, ekranYazisi: "Hareketi doğru anlat", konum: ust, broll: yok, metin: "Claude'a \"hareketlendir\" demek yetmiyor, hangi hareketi istediğini bilmen lazım. Bu depo onu çözüyor.", sablon: {kalip: gazete, baslik: "Claude'a *hareketi* anlat", svg: hareket.svg, adimlar: [{hedef: sozcuk, kelime: 1, hareket: belir}, {hedef: hareket, kelime: 9, hareket: belir}]}}
- {no: 2, basSn: 6, sonSn: 12, tur: metin-karti, ekranYazisi: "awesome-ai-motion", konum: ust, broll: yok, metin: "Adı awesome-ai-motion. 637 hareket tekniği var, MIT lisanslı, GitHub'da 350'den fazla yıldızı var.", sablon: {kalip: rakam, baslik: "Adı *awesome-ai-motion*", satirlar: [{baslik: "637 hareket tekniği", alt: "awesome-ai-motion", kelime: 2, sec: true}, {baslik: "MIT lisanslı", kelime: 6}, {baslik: "350'den fazla yıldız", alt: "GitHub'da", kelime: 9}]}}
- {no: 3, basSn: 12, sonSn: 18, tur: metin-karti, ekranYazisi: "Her efekt bir kart", konum: ust, broll: yok, metin: "Her efekt ayrı bir kart: tanımı, ayar değerleri, örnekleri ve Claude Code için hazır istemi.", sablon: {kalip: gazete, baslik: "Her efekt bir *kart*", svg: kart.svg, adimlar: [{hedef: kart, kelime: 1, hareket: belir}, {hedef: istem, kelime: 10, hareket: belir}]}}
- {no: 4, basSn: 18, sonSn: 25, tur: metin-karti, ekranYazisi: "637 hareket tekniği", konum: ust, broll: yok, metin: "Yumuşak hızlanma, ezilip uzama, sırayla giriş, sonsuz yakınlaşma, kamera uçuşu, hareketli yazı.", sablon: {kalip: gazete, baslik: "Hepsi *tek* depoda", svg: teknik.svg, adimlar: [{hedef: yumusak, kelime: 0, hareket: belir}, {hedef: ezil, kelime: 2, hareket: belir}, {hedef: kamera, kelime: 8, hareket: belir}]}}
- {no: 5, basSn: 25, sonSn: 31, tur: metin-karti, ekranYazisi: "128 hazır örnek klip", konum: ust, broll: yok, metin: "128 hazır örnek klip var, hepsi aynı tasarımda. Böylece yalnız hareketi karşılaştırırsın.", sablon: {kalip: rakam, baslik: "Sadece *hareketi* kıyasla", satirlar: [{baslik: "128 hazır örnek klip", kelime: 0}, {baslik: "Hepsi aynı tasarımda", kelime: 5}, {baslik: "Yalnız hareket değişir", alt: "karşılaştırması kolay", kelime: 9, sec: true}]}}
- {no: 6, basSn: 31, sonSn: 38, tur: metin-karti, ekranYazisi: "Kurulum", konum: ust, broll: yok, metin: "Bilmen gereken: Claude ücretli, kotandan düşer. Depoyu skill klasörüne bağla, Claude efekti seçsin.", sablon: {kalip: rakam, baslik: "Depoyu *bağla*, seçtir", satirlar: [{baslik: "Claude ücretli", alt: "kotandan düşer", kelime: 2}, {baslik: "Depoyu skill klasörüne bağla", alt: "kurulum gerekmez", kelime: 6, sec: true}, {baslik: "Claude efekti seçsin", kelime: 10}]}}
- {no: 7, basSn: 38, sonSn: 45, tur: metin-karti, ekranYazisi: "SEMİNER", konum: ust, broll: yok, metin: "Kaydet, dene. Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.", sablon: {kalip: kapanis, baslik: "Önce *kaydet*, sonra dene", ust: "YORUMLARA YAZ", damga: "SEMİNER", adimlar: [{hedef: y, kelime: 7, hareket: belir}]}}
aciklama_taslagi: |-
  Claude'a "hareketlendir" demek yetmiyor: hangi hareketi istediğini bilmen lazım. Bu depo onu çözüyor. 👇

  Depo: awesome-ai-motion (github.com/gongnyang/awesome-ai-motion), MIT lisanslı, 350'den fazla yıldız.
  • 637 hareket tekniği: yumuşak hızlanma, ezilip uzama, sırayla giriş, sonsuz yakınlaşma, kamera uçuşu, hareketli yazı
  • Her efekt ayrı bir kart: tanım, ayar değerleri, örnekler ve Claude Code için hazır istem
  • 128 hazır örnek klip, hepsi aynı tasarımda; yalnız hareketi karşılaştırırsın
  • Depoyu Claude Code'un skill klasörüne bağlarsan Claude sahneye uygun efekti seçebilir

  Bilmen gereken: Depo ücretsiz açık kaynak ama Claude ücretli; kotandan düşer. Gezmek ve skill için ek kurulum gerekmez; kendi klibini üretmek istersen Node.js 20+, ffmpeg ve Playwright lazım. Efekt kartlarının kaynakları ve bazı parçaların (GSAP, yazı tipleri) lisansı ayrı, paylaşmadan önce depodaki atıf dosyasına bak.

  Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.

  #yapayzeka #ClaudeCode #motiondesign #animasyon #seminer
---
