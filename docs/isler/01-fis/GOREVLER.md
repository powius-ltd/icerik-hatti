# 01 Fiş: görevler

Ajan görev ya da test silmez, yalnız işaretler (`[x]`, `[~] yarım: <neden>`).

- [x] 1. İskelet: `package.json` (`hat`, `typecheck`, `test`), `tsconfig.json`, `.env.example`, `src/cli.ts` yönlendirici · dosyalar: kök + `src/cli.ts` · verify: `npm run typecheck`
- [x] 2. VU `src/ortak` + `src/cozumle` + `py/asr.py` ve testleri kopyala (başa `// Kaynak:` satırı) · verify: `npm test -- cozumle`
- [x] 3. `--url` girişi (yt-dlp) ve `--video` girişi `fis` komutunda · dosyalar: `src/fis/giris.ts` · verify: `npm test -- giris`
- [x] 4. Fiş şeması + YAML yazıcı + satır düzeyinde dönüş yazımı · dosyalar: `src/fis/{sema,yaz,geri-yaz}.ts` · verify: `npm test -- fis`
- [x] 5. Birebir uyarlama istemi + `claude -p` çağrısı + denetim (sahne sayısı/sırası kaynakla aynı) · dosyalar: `src/fis/{istem,claude,denetle}.ts` · verify: `npm test -- istem denetle`
- [x] 6. `--metin` kısayolu + gerçek video koşusu (VU `kosular/ig-2026-10-16/instagram-DeZTLK4CeiQ/kaynak.mp4`) · verify: `agir --ram 3 --ad hat-01 -- npm run hat -- fis --video <yol> --kosu deneme` → `fis.md` var, `npm run typecheck && npm test`
