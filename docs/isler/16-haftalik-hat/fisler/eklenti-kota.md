---
fis_id: eklenti-kota-01
kaynak:
  tur: metin
  dosya: docs/isler/16-haftalik-hat/SPEC.md
hesap: varsayilan
gorsel_yon: karma
fis_onay: evet
paylasim_onay: hayir
durum: taslak
# Kaynaklar (doğrulama 13 Kas): Claude Code belgeleri. Maliyet sayfası https://code.claude.com/docs/en/costs ("Reduce MCP server overhead": MCP araç tanımları varsayılan ertelenir, bağlama yalnız araç adları ve sunucu yönergeleri girer; /context neyin yer kapladığını gösterir; /mcp ile kullanılmayan sunucu kapatılır. "Reduce token usage": token maliyeti bağlam boyutuyla artar; tüm konuşma her istekle gönderilir). Skill sayfası https://code.claude.com/docs/en/skills (açıklamalar bağlamda durur, tam içerik yalnız çağrılınca yüklenir). MCP sayfası https://code.claude.com/docs/en/mcp (/mcp panelinden sunucu kapatılınca yapılandırma silinmez). Kesin token sayısı verilmedi: belgede eklenti başına rakam yok. Yumuşatılmış: "kotanı yer" demek yerine "bağlamda yer tutar".
sahneler:
- {no: 1, basSn: 0, sonSn: 6, tur: metin-karti, ekranYazisi: "Eklentiler yer tutuyor", konum: ust, broll: yok, metin: "Kurduğun eklentiler, sen bir şey yazmadan bile bağlamda biraz yer tutuyor.", sablon: {kalip: gazete, baslik: "Eklentiler *yer* tutuyor", svg: bag.svg, adimlar: [{hedef: eklenti, kelime: 1, hareket: belir}, {hedef: yer, kelime: 7, hareket: belir}]}}
- {no: 2, basSn: 6, sonSn: 12, tur: metin-karti, ekranYazisi: "Skill'ler", konum: ust, broll: yok, metin: "Skill'lerde yalnız açıklama hep yüklü. İçeriğin tamamı kullanınca açılıyor.", sablon: {kalip: rakam, baslik: "Skill'lerde *açıklama* hep yüklü", satirlar: [{baslik: "Açıklama hep yüklü", alt: "kısa bir not", kelime: 2}, {baslik: "İçerik kullanınca açılır", kelime: 5, sec: true}]}}
- {no: 3, basSn: 12, sonSn: 18, tur: metin-karti, ekranYazisi: "MCP sunucuları", konum: ust, broll: yok, metin: "MCP sunucularında araç adları hep bağlamda. Ayrıntılar kullanılınca geliyor.", sablon: {kalip: gazete, baslik: "MCP'de *adlar* hep bağlamda", svg: mcp.svg, adimlar: [{hedef: adlar, kelime: 3, hareket: belir}, {hedef: ayrinti, kelime: 6, hareket: belir}]}}
- {no: 4, basSn: 18, sonSn: 23, tur: metin-karti, ekranYazisi: "Bağlam büyüyor", konum: ust, broll: yok, metin: "Bağlam büyüdükçe her mesaj daha çok token harcıyor.", sablon: {kalip: rakam, baslik: "Bağlam *büyüdükçe*", satirlar: [{baslik: "Bağlam büyüdükçe", kelime: 0}, {baslik: "Her mesaj daha çok token", kelime: 2}, {baslik: "Kotan daha hızlı erir", kelime: 6, sec: true}]}}
- {no: 5, basSn: 23, sonSn: 30, tur: metin-karti, ekranYazisi: "Bilmen gereken", konum: ust, broll: yok, metin: "Bilmen gereken: bağlam ekranı neyin ne kadar yer kapladığını gösteriyor.", sablon: {kalip: rakam, baslik: "Bilmen *gereken*", satirlar: [{baslik: "Bağlam ekranı", alt: "neyin yer kapladığı", kelime: 2}, {baslik: "Önce bak, sonra karar ver", kelime: 7, sec: true}]}}
- {no: 6, basSn: 30, sonSn: 36, tur: metin-karti, ekranYazisi: "Kapat", konum: ust, broll: yok, metin: "Kullanmadığın MCP sunucusunu kapat, silmene gerek yok. Ayarı yerinde kalıyor.", sablon: {kalip: rakam, baslik: "Kullanmadığını *kapat*", satirlar: [{baslik: "Kullanmadığını kapat", kelime: 0}, {baslik: "Silmene gerek yok", kelime: 4}, {baslik: "Ayarı yerinde kalır", kelime: 7, sec: true}]}}
- {no: 7, basSn: 36, sonSn: 43, tur: metin-karti, ekranYazisi: "SEMİNER", konum: ust, broll: yok, metin: "Kaydet, kullanmadığını kapat. Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.", sablon: {kalip: kapanis, baslik: "Önce *kaydet*, sonra kapat", ust: "YORUMLARA YAZ", damga: "SEMİNER", adimlar: [{hedef: y, kelime: 8, hareket: belir}]}}
aciklama_taslagi: |-
  Kurduğun eklentiler, sen bir şey yazmadan bile bağlamda biraz yer tutuyor. 👇

  Claude Code belgelerine göre:
  • Skill'lerde yalnız açıklama bağlamda durur, içeriğin tamamı kullanınca yüklenir
  • MCP sunucularında araç adları bağlamda durur, ayrıntılar kullanılınca gelir
  • Token maliyeti bağlam boyutuyla artar; tüm konuşma her istekle gönderilir

  Pratik: Claude Code'da /context neyin yer kapladığını gösterir. /mcp ile kullanmadığın sunucuyu kapatabilirsin; ayarı silinmez.

  Bilmen gereken: Eklenti başına kesin token sayısı yok; bu yüzden "kotanı yer" demiyoruz, "bağlamda yer tutar" diyoruz. Az kullandığını kapatmak yeter.

  Claude'u seminerde canlı gösteriyoruz. Yorumlara SEMİNER yaz, linki DM'den atayım.

  #yapayzeka #ClaudeCode #MCP #skill #seminer
---
