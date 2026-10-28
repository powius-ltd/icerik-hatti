# 03 Paylaş: görevler

Ajan görev ya da test silmez, yalnız işaretler (`[x]`, `[~] yarım: <neden>`).

- [x] 1. SP Zernio istemcisi + şema + anahtar seçici kopyası (`server-only` yok) ve testleri · dosyalar: `src/paylas/{istemci,sema,anahtar}.ts` · verify: `npm test -- paylas`
- [ ] 2. `paylas` komutu: kuru koşu varsayılan, `--onay` = dosya adı kapısı, fiş `paylasim_onay` kapısı · dosyalar: `src/paylas/komut.ts`, `src/cli.ts` · verify: `npm test -- paylas`
- [ ] 3. `publishing` → `published` yoklaması + fişe dönüş yazımı · dosyalar: `src/paylas/yokla.ts` · verify: `npm test -- yokla`
- [ ] 4. `.env.example` Zernio satırı + tam verify · verify: `npm run typecheck && npm test`
