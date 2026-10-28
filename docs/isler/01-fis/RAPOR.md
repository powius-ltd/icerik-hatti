Durum: bitti

## Sana düşen
- ELLE-TEST #1–#3: `kosular/deneme/instagram-DeZTLK4CeiQ/fis.md` oku (Türkçe doğal mı, doğrulanacak 7 iddia).
- KARAR GEREKLİ: bkz. aşağıda.

## Yapılan
- 1d6260a 01-fis g1: iskelet (package.json, tsconfig, cli yön
- b286055 01-fis g2: VU ortak + cozumle + asr.py + testler kop
- f12de05 01-fis g3: --video/--url girişi, ekranYazisiKonum a
- ea0b2ff 01-fis g4: fiş şeması, yazıcı, satır düzeyind
- 2c86369 01-fis g5: birebir uyarlama istemi, claude -p çağr
- 4fe0284 01-fis g6: fis komutu (--video/--url/--metin), fisUr
- Verify: `npm run typecheck` temiz; `npm test` 11 dosya / 67 test yeşil.
- Gerçek koşu: `agir --ram 3 --ad hat-01 -- npm run hat -- fis --video <VU kaynak.mp4> --kosu deneme --id instagram-DeZTLK4CeiQ` → fis.md, 8 sahne = analiz.json 8 sahne, düzeltme turu 0.

## Sapmalar / KARAR GEREKLİ
1. Whisper: bu makinede `faster_whisper` kurulu Python yok. Koşuda VU'daki aynı videonun `dokum.json`'u koşu klasörüne kopyalandı (whisper atlandı); agy ve claude gerçek koştu. Whisper kurulumu (uv venv + `WHISPER_PY`) kullanıcıya/yöneticiye.
2. `ekranYazisiKonum` (ust/orta/alt) analiz şemasına ve agy istemine eklendi (VU'da yoktu; yapı klonu için). Eski analiz.json'larda yok, o zaman claude `gorsel`'den çıkarır.
3. `hesap` fişte `--hesap` bayrağıyla, varsayılan "varsayilan"; hesap konfigü 02'de.
4. Fiş `dogrulanacak` listesi frontmatter'da değil, gövdede "Sana düşen" bloğunda.
5. `--url` gerçek bağlantıyla denenmedi (çerez sorusu açık).
