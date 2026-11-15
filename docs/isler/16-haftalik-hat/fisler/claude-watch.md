---
fis_id: claude-watch-01
kaynak:
  tur: metin
  dosya: docs/isler/16-haftalik-hat/SPEC.md
hesap: varsayilan
gorsel_yon: karma
fis_onay: evet
paylasim_onay: hayir
durum: taslak
# Araç: /watch skill'i (github.com/bradautomates/claude-video). Doğrulama 15 Kas: GitHub API: MIT lisans, 20.853 yıldız, son push 25 Eyl 2026; README: URL ya da yerel dosyayı zaman damgalı kare + yazıya çevirip ajana verir; önce yerel altyazıyı kullanır, altyazı yoksa isteğe bağlı yerel WhisperX (anahtarsız, ~3 GB disk) ya da Groq/OpenAI; yerel motor için Python 3.10+, ffmpeg ve güncel yt-dlp gerekir (YouTube için JavaScript çalışma zamanı da); Claude Code'a eklenti olarak kurulur (/plugin marketplace add bradautomates/claude-video, /plugin install watch@claude-video); Claude Sohbet ve Cowork'te çalışmaz. Aynı adlı başka topluluk skill'leri de var, hepsi resmî değil; yazılan yıldız/lisans bradautomates içindir. Kaynak videodaki "Hormozi/müşteri mektubu" örnekleri doğrulanmadığı için alınmadı, yerine genel "satış eğitimi" örneği ve "Mesela" ifadesi. Ekranda komut yok; kurulum "Claude'a ... kur de". Telif notu "Bilmen gereken"de. Kaynak video: instagram.com/p/DfeCnF1O6U_.
sahneler:
- {no: 1, basSn: 0, sonSn: 6, tur: metin-karti, ekranYazisi: "Claude artık video izliyor", konum: ust, broll: yok, metin: "Claude artık YouTube videosunu izleyip anlıyor. Hem görüntüsünü hem konuşmasını okuyor.", sablon: {kalip: gazete, baslik: "Claude artık *video* izliyor", svg: izle.svg, adimlar: [{hedef: video, kelime: 3, hareket: belir}, {hedef: konusma, kelime: 7, hareket: belir}]}}
- {no: 2, basSn: 6, sonSn: 12, tur: metin-karti, ekranYazisi: "/watch", konum: ust, broll: yok, metin: "Adı /watch. MIT lisanslı, GitHub'da 20 binden fazla yıldızı var.", sablon: {kalip: rakam, baslik: "Adı */watch*", satirlar: [{baslik: "/watch", alt: "Claude Code skill'i", kelime: 1}, {baslik: "MIT lisanslı", kelime: 2}, {baslik: "20 binden fazla yıldız", alt: "GitHub'da", kelime: 5, sec: true}]}}
- {no: 3, basSn: 12, sonSn: 18, tur: metin-karti, ekranYazisi: "Kare kare yazıya çeviriyor", konum: ust, broll: yok, metin: "Videoyu kare kare ayırıp zaman damgalı yazıya çeviriyor, sonra Claude'a okutuyor.", sablon: {kalip: gazete, baslik: "Kare kare *yazıya* çeviriyor", svg: cevir.svg, adimlar: [{hedef: kareler, kelime: 1, hareket: belir}, {hedef: yazi, kelime: 6, hareket: belir}]}}
- {no: 4, basSn: 18, sonSn: 25, tur: metin-karti, ekranYazisi: "Eğitimi izletip not al", konum: ust, broll: yok, metin: "Mesela bir satış eğitimini izletip not çıkarttırabilirsin.", sablon: {kalip: gazete, baslik: "Eğitimi izlet, *not* al", svg: ornek.svg, adimlar: [{hedef: egitim, kelime: 2, hareket: belir}, {hedef: not, kelime: 5, hareket: belir}]}}
- {no: 5, basSn: 25, sonSn: 31, tur: metin-karti, ekranYazisi: "Altyazı yoksa", konum: ust, broll: yok, metin: "Altyazısı olmayan videoda konuşmayı bilgisayarında yazıya dökme seçeneği de var.", sablon: {kalip: rakam, baslik: "Altyazı yoksa *da* olur", satirlar: [{baslik: "Altyazısız video", kelime: 0}, {baslik: "Konuşmayı yazıya döker", alt: "kendi bilgisayarında", kelime: 3}, {baslik: "API anahtarı gerekmez", alt: "yerel seçenekte", kelime: 4, sec: true}]}}
- {no: 6, basSn: 31, sonSn: 38, tur: metin-karti, ekranYazisi: "Kurulum", konum: ust, broll: yok, metin: "Bilmen gereken: Claude ücretli, kotandan düşer. Kurmak için Claude'a watch eklentisini kur de. Başkasının videosunu yalnız öğrenmek için kullan.", sablon: {kalip: rakam, baslik: "Claude'a *kur* de", satirlar: [{baslik: "Claude ücretli", alt: "kotandan düşer", kelime: 2}, {baslik: "watch eklentisini kur de", alt: "Claude'a söyle", kelime: 9, sec: true}, {baslik: "Başkasının videosu", alt: "yalnız öğrenmek için", kelime: 13}]}}
- {no: 7, basSn: 38, sonSn: 45, tur: metin-karti, ekranYazisi: "SEMİNER", konum: ust, broll: yok, metin: "Kaydet, dene. Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.", sablon: {kalip: kapanis, baslik: "Önce *kaydet*, sonra dene", ust: "YORUMLARA YAZ", damga: "SEMİNER", adimlar: [{hedef: y, kelime: 7, hareket: belir}]}}
aciklama_taslagi: |-
  Claude artık YouTube videosunu izleyip anlıyor: görüntüsünü ve konuşmasını okuyor. 👇

  Skill: /watch (GitHub: bradautomates/claude-video), MIT lisanslı.
  • Video linkini ya da dosyayı zaman damgalı kareler ve yazıya çeviriyor, sonra Claude'a okutuyor
  • Mesela bir satış eğitimini izletip not çıkarttırabilirsin
  • Altyazısı olmayan videoda konuşmayı kendi bilgisayarında yazıya dökme seçeneği de var

  Kurulum: Claude Code'da "watch eklentisini kur" de ya da şu iki komut:
  /plugin marketplace add bradautomates/claude-video
  /plugin install watch@claude-video

  Bilmen gereken: Skill ücretsiz açık kaynak ama Claude ücretli; kotandan düşer. Python 3.10+, ffmpeg ve yt-dlp gerekir; sesi yerelde yazıya dökmek istersen yaklaşık 3 GB boş alan lazım. Claude Sohbet ve Cowork'te çalışmaz, Claude Code'da çalışır. Başkasının videosunu yalnız öğrenmek için kullan, izinsiz paylaşma.

  Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.

  #yapayzeka #ClaudeCode #youtube #yapayzekaaraçları #seminer
---
