# 02 Üret: SPEC

## Kazanım
Onaylı fişten (`fis.md`) tek komutla 9:16 (1080x1920), patronun ElevenLabs klon sesiyle, kelime vurgulu altyazılı video + `kapak.png` + `aciklama.txt`.
`npm run hat -- uret --fis <fis.md> [--ses elevenlabs|chatterbox] [--render]`; çıktı fişin klasörüne, fişe `durum: uretildi`, `video`, `kapak` yazılır.

## Plan
```
fis.md (fis_onay: evet) → ses (TEK ElevenLabs çağrısı, karakter damgası → kelime zamanı) → sahne planı (fişten deterministik)
  → HyperFrames sayfası (hf/index.html) → check → render → gürlük −14 LUFS → kapak.png + aciklama.txt → fişe dönüş
```
- Sahne = bir ses parçası: fiş sahnesinin `metin`'i sesin ardışık kelime aralığı; sahne süresi o aralığın süresi (`src/uret/sahne-plani.ts`). Cümle bölme yok, "Birinci"→"1." dönüşümü yok (K24).
- Kalıp eşleme tablosu `src/uret/kalip-esle.ts`: ekran türü + tırnaklı istem → `chat-window`; tek sayı ≥ 10 → `big-stat`; gerisi `kart` (varsayılan düşüş). Boş/uymayan metinde kalıp seçilmez, `kart`a düşülür (K26 bulgu 4).
- Altyazı: kelime zamanına bağlı öbekler, kelime vurgusu (soluk→parlak, ekran yazısındaki kelime ve sayılar vurgu renginde); altyazısız boşluk ≤ 0,6 sn tasarım, > 1,0 sn ise üretim durur (K26).
- Para: karakter tavanı 1.200 (çağrıdan önce), aynı metin + ses için `ses.json` önbelleği (ikinci koşu ücretsiz).
- Tema: `config/hesaplar/<hesap>.json` (yoksa `varsayilan.json`); yazı tipleri `assets/fonts/`.

## Kararlar
- Yönetmen LLM'i yok; sahne planı deterministik (26 Eki bulgu 3). Yapı klonu: sıra, tempo, ekran yazısı konumu kaynakla aynı, görsel bizim.
- Ses tek çağrı (tutarlı tonlama); sahne sınırı kelime sayısından, iki sahne arası sessizliğin ortası.
- Fiş `durum` listesine `uretildi` eklendi (`src/fis/sema.ts`).
- Ekran-terminal kalıbı alınmadı: kaynağı sabit 5 adımlı bir "Claude limit" senaryosu, genel değil.

## Kapsam dışı
Chatterbox sesi (isteğe bağlı, ikinci sürüm); görsel klon (05); kaynak karesi/sesi kullanımı; ses hızlandırma; müzik; ses kelime zamanını sessizliğe oturtma (KS `retime`).

## Açık sorular
- Kart kalıbı ekranın ortasını boş bırakıyor (yazı üstte, altyazı altta); patron temasıyla (renk/logo/font) 05 ya da arayüz paketinde zenginleşir.
- Patron markası (YOL "Müşteriden" 5): tema belirteçleri şimdilik aiscale ekran teması.
