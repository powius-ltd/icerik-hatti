---
fis_id: premium-istem-01
kaynak:
  tur: metin
  dosya: docs/isler/16-haftalik-hat/SPEC.md
hesap: varsayilan
gorsel_yon: karma
fis_onay: evet
paylasim_onay: hayir
durum: taslak
# Araç: emilkowalski/skills (github.com/emilkowalski/skills). Doğrulama 15 Kas: GitHub API (gh api repos/emilkowalski/skills): MIT lisans, 57.039 yıldız, son push 13 Kas 2026, açıklama "Skills for Designers and Engineers". Depoda skills/ altında 19 skill klasörü var (kaynak videodaki "16" güncel değil, sayı yazılmadı; "çoğu animasyon ve hareket" README listesinden). apple-design SKILL.md: "Respond on pointer-down, not on release" (düğme basıldığı anda tepki versin) doğrulandı. Kurulum README'den: npx skills@latest add emilkowalski/skills (komut yalnız açıklamada; ekranda "Claude'a kur de"). Skill'ler yazılı kural dosyaları; Claude'a ek bir ücret getirmez ama Claude ücretli. Kaynaktaki Vercel/Linear iş geçmişi ve Apple konferans iddiası marka adı olduğu için alınmadı. Aynı koleksiyonu türeten başka topluluk depoları var, resmî olan emilkowalski/skills. Kaynak video: instagram.com/p/DfZCcI6t2XC (@leowiedemann); yalnız fikir alındı, kare/ses kullanılmadı.
sahneler:
- {no: 1, basSn: 0, sonSn: 6, tur: metin-karti, ekranYazisi: "'Premium yap' yazma", konum: ust, broll: yok, metin: "'Premium yap' yazma. Claude bunun ne demek olduğunu bilmiyor.", sablon: {kalip: gazete, baslik: "'Premium yap' *yazma*", svg: premium.svg, adimlar: [{hedef: istem, kelime: 0, hareket: belir}, {hedef: bilmez, kelime: 3, hareket: belir}]}}
- {no: 2, basSn: 6, sonSn: 12, tur: metin-karti, ekranYazisi: "Emil Kowalski'nin skill'leri", konum: ust, broll: yok, metin: "Çözüm, Emil Kowalski'nin skill koleksiyonu. GitHub'da 57 binden fazla yıldızı var.", sablon: {kalip: rakam, baslik: "Claude'a *zevk* öğreten koleksiyon", satirlar: [{baslik: "Emil Kowalski", kelime: 1}, {baslik: "Skill koleksiyonu", kelime: 3}, {baslik: "57 binden fazla yıldız", alt: "GitHub'da", kelime: 6, sec: true}]}}
- {no: 3, basSn: 12, sonSn: 18, tur: metin-karti, ekranYazisi: "Zevk yazılı kural", konum: ust, broll: yok, metin: "Zevk dediğin şey burada yazılı kural. Skill'ler bu kuralları Claude'a okutuyor.", sablon: {kalip: gazete, baslik: "Zevk, *yazılı* kural", svg: kural.svg, adimlar: [{hedef: kurallar, kelime: 4, hareket: belir}, {hedef: claude, kelime: 9, hareket: belir}]}}
- {no: 4, basSn: 18, sonSn: 25, tur: metin-karti, ekranYazisi: "Basınca tepki versin", konum: ust, broll: yok, metin: "Mesela apple-design: düğme basıldığı anda tepki versin, bırakınca değil.", sablon: {kalip: gazete, baslik: "Düğme *basınca* tepki versin", svg: dugme.svg, adimlar: [{hedef: basis, kelime: 3, hareket: belir}, {hedef: birak, kelime: 7, hareket: belir}]}}
- {no: 5, basSn: 25, sonSn: 31, tur: metin-karti, ekranYazisi: "19 skill var", konum: ust, broll: yok, metin: "Depoda 19 skill var, çoğu animasyon ve hareket üzerine. Hepsi açık kaynak.", sablon: {kalip: rakam, baslik: "Depoda *19* skill var", satirlar: [{baslik: "19 skill", kelime: 1}, {baslik: "Çoğu animasyon", alt: "ve hareket üzerine", kelime: 5}, {baslik: "Hepsi açık kaynak", alt: "MIT lisanslı", kelime: 9, sec: true}]}}
- {no: 6, basSn: 31, sonSn: 38, tur: metin-karti, ekranYazisi: "Kurulum", konum: ust, broll: yok, metin: "Bilmen gereken: Claude ücretli, kotandan düşer. Kurmak için Claude'a Emil Kowalski'nin skills deposunu kur de.", sablon: {kalip: rakam, baslik: "Claude'a *kur* de", satirlar: [{baslik: "Claude ücretli", alt: "kotandan düşer", kelime: 2}, {baslik: "Emil Kowalski'nin deposu", alt: "emilkowalski/skills", kelime: 9}, {baslik: "Skills deposunu kur de", alt: "Claude'a söyle", kelime: 13, sec: true}]}}
- {no: 7, basSn: 38, sonSn: 45, tur: metin-karti, ekranYazisi: "SEMİNER", konum: ust, broll: yok, metin: "Kaydet, dene. Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.", sablon: {kalip: kapanis, baslik: "Önce *kaydet*, sonra dene", ust: "YORUMLARA YAZ", damga: "SEMİNER", adimlar: [{hedef: y, kelime: 7, hareket: belir}]}}
aciklama_taslagi: |-
  "Premium yap" yazma: Claude bunun ne demek olduğunu bilmiyor. Bu koleksiyon ona tasarım zevkini yazılı kuralla öğretiyor. 👇

  Koleksiyon: emilkowalski/skills (GitHub, Emil Kowalski), MIT lisanslı, 57 binden fazla yıldız.
  • Skill'ler Claude'a tasarım ve animasyon kurallarını yazılı verir
  • Mesela apple-design: düğme basıldığı anda tepki versin, bırakınca değil
  • Depoda 19 skill var, çoğu animasyon ve hareket üzerine

  Kurulum: Claude'a "Emil Kowalski'nin skills deposunu kur" de ya da terminalde:
  npx skills@latest add emilkowalski/skills

  Bilmen gereken: Skill'ler ücretsiz açık kaynak ama Claude ücretli; kotandan düşer. Kurulum için Node.js gerekir. Skill'ler Claude'u mucize yapmaz, kuralları yazılı hatırlatır; sonucu yine sen kontrol et.

  Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.

  #yapayzeka #ClaudeCode #tasarım #vibecoding #seminer
---
