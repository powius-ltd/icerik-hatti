---
fis_id: claude-ilk-is-01
kaynak:
  tur: metin
  dosya: docs/isler/16-haftalik-hat/SPEC.md
hesap: varsayilan
gorsel_yon: karma
fis_onay: evet
paylasim_onay: hayir
durum: taslak
# Kaynaklar (doğrulama 14 Kas 2026, support.claude.com): (1) https://support.claude.com/en/articles/10185728-understanding-claude-s-personalization-features : Settings > Your Claude (eski düzende Account) altında "Instructions"; "Any instructions you add here will be applied to all of your conversations with Claude." Sayfada plan kısıtı yazmıyor. Aynı sayfa proje talimatını "paid plans only" diye anıyor, projeler sayfası ise çelişiyor: bu yüzden ekranda proje talimatı için plan iddiası yok. (2) https://support.claude.com/en/articles/9517075-what-are-projects : "Projects are available to all users, including those with free Claude accounts."; ücretsizde en çok beş proje; proje bilgisine dosya/metin eklenir, proje talimatı tanımlanır; RAG ile genişletilmiş bilgi kapasitesi yalnız ücretli planlarda. (3) https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context : hafıza Free, Pro, Max ve Ultra'da varsayılan açık (web, Desktop, mobil); Team ve Enterprise'da sahibi karar verir; Settings > Your Claude altında "Generate memory from chats" kapatılır, "Manage" ile "Your memory" konuları görülür/düzenlenir; neyi hatırlayıp unutacağı sohbette de söylenebilir. Geçmiş sohbet araması ücretli planlarda; videoda anılmadı. Menü adları kaynaktaki gibi İngilizce bırakıldı. Ekranda komut yok. Başka vaat yok.
sahneler:
- {no: 1, basSn: 0, sonSn: 5, tur: metin-karti, ekranYazisi: "İlk gün, üç ayar", konum: ust, broll: yok, metin: "Claude'u ilk açtıysan üç şeyi hemen ayarla.", sablon: {kalip: gazete, baslik: "İlk gün, *üç* ayar", svg: ilk.svg, adimlar: [{hedef: uc, kelime: 3, hareket: belir}, {hedef: ayar, kelime: 5, hareket: belir}]}}
- {no: 2, basSn: 5, sonSn: 11, tur: metin-karti, ekranYazisi: "1. Talimat", konum: ust, broll: yok, metin: "Birincisi: Ayarlar'da Your Claude. Kendin ve tarzın için talimat yaz, her sohbete uygulanır.", sablon: {kalip: gazete, baslik: "Birincisi: *talimat*", svg: profil.svg, adimlar: [{hedef: talimat, kelime: 8, hareket: belir}, {hedef: sohbet, kelime: 11, hareket: belir}]}}
- {no: 3, basSn: 11, sonSn: 16, tur: metin-karti, ekranYazisi: "2. Proje", konum: ust, broll: yok, metin: "İkincisi: proje aç. Dosyalarını ve talimatını oraya ekle.", sablon: {kalip: gazete, baslik: "İkincisi: *proje*", svg: proje.svg, adimlar: [{hedef: dosya, kelime: 3, hareket: belir}, {hedef: talimat, kelime: 5, hareket: belir}]}}
- {no: 4, basSn: 16, sonSn: 22, tur: metin-karti, ekranYazisi: "3. Hafıza", konum: ust, broll: yok, metin: "Üçüncüsü: hafıza. Ayarlar'da Your Claude bölümünden aç ya da kapat.", sablon: {kalip: rakam, baslik: "Üçüncüsü: *hafıza*", satirlar: [{baslik: "Ayarlar", kelime: 2}, {baslik: "Your Claude", kelime: 3}, {baslik: "Aç ya da kapat", kelime: 6, sec: true}]}}
- {no: 5, basSn: 22, sonSn: 29, tur: metin-karti, ekranYazisi: "Bilmen gereken", konum: ust, broll: yok, metin: "Bilmen gereken: ücretsiz planda en çok beş proje açılır. Hafıza ücretsizde de açık gelir.", sablon: {kalip: rakam, baslik: "Bilmen *gereken*", satirlar: [{baslik: "Ücretsizde en çok 5 proje", kelime: 2}, {baslik: "Hafıza ücretsizde de açık", kelime: 9, sec: true}]}}
- {no: 6, basSn: 29, sonSn: 34, tur: metin-karti, ekranYazisi: "Sohbette söyle", konum: ust, broll: yok, metin: "Neyi hatırlayıp neyi unutacağını sohbette de söyleyebilirsin.", sablon: {kalip: rakam, baslik: "Sohbette *de* söyle", satirlar: [{baslik: "Neyi hatırlasın", kelime: 0}, {baslik: "Neyi unutsun", kelime: 2, sec: true}]}}
- {no: 7, basSn: 34, sonSn: 41, tur: metin-karti, ekranYazisi: "SEMİNER", konum: ust, broll: yok, metin: "Kaydet, bu üçünü bugün yap. Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.", sablon: {kalip: kapanis, baslik: "Önce *kaydet*, sonra ayarla", ust: "YORUMLARA YAZ", damga: "SEMİNER", adimlar: [{hedef: y, kelime: 10, hareket: belir}]}}
aciklama_taslagi: |-
  Claude'u ilk açtıysan üç şeyi hemen ayarla. 👇

  Adım adım:
  1. Ayarlar > Your Claude altında talimat yaz. Her sohbete uygulanır.
  2. Proje aç, dosyalarını ve talimatını ekle.
  3. Hafızayı yine Your Claude bölümünden aç ya da kapat. Claude'a neyi hatırlayıp unutacağını sohbette de söyleyebilirsin.

  Bilmen gereken: Projeler ücretsiz hesaplarda da var ama en çok beş tane. Yardım sayfaları proje talimatının hangi planda olduğunu net yazmıyor; kendi hesabında kontrol et. Hafıza Free, Pro, Max ve Ultra'da varsayılan açık; Team ve Enterprise'da sahibi karar verir. Menü adları arayüz sürümüne göre değişebilir.

  Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.

  #yapayzeka #Claude #yapayzekaaraçları #verimlilik #seminer
---
