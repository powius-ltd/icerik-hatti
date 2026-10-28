# 02 Üret: görevler

- [x] 1. ElevenLabs sağlayıcısı (damgalı uç, karakter→kelime) + testi · `src/uret/ses/` · verify: `npm test -- elevenlabs`
- [x] 2. Render motoru kopyası (sayfa, altyazı, tema, kalıplar chat-window/big-stat, yeni kart) · `src/uret/render/` · verify: `npm run typecheck`
- [x] 3. Kalıp eşleme + sahne=ses parçası planı + testleri · `src/uret/{kalip-esle,sahne-plani}.ts` · verify: `npm test -- kalip-esle sahne-plani`
- [x] 4. `uret` komutu: ses önbelleği, karakter tavanı, check/render, kapak, açıklama, fişe dönüş, K26 boşluk kapısı · `src/uret/{akis,komut,kapak,aciklama}.ts` · verify: `npm test -- akis`
- [x] 5. Gerçek koşu: `deneme-02` fişi, ElevenLabs 1 çağrı, `agir --ram 4 --ad hat-02` · verify: ffprobe 1080x1920, süre ≈ ses ±0,5 sn
- [ ] Chatterbox yolu (isteğe bağlı, yapılmadı)
