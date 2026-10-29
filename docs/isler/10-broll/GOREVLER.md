# 10-broll görevleri

- [x] 1. Hesap konfigü `broll { kok, yaklasma, klipler? }` + `broll-overlay` belirteci (`tema.ts`, `config/hesaplar/varsayilan.json`); klip tarama `render/klip-tara.ts`
- [x] 2. Fiş şeması: sahnede isteğe bağlı `broll: BR-12 | HK-01 | yok` (`fis/sema.ts`)
- [x] 3. Atama kuralı `yon/broll.ts` (kanca HK, bölüm başı BR, CTA BR; tekrar yok; fiş ezer; sabit tohum)
- [x] 4. Kalıp `render/broll.ts` + `kayit.ts` kaydı
- [x] 5. Ön kırpma `render/klip-kes.ts`; `broll-uygula.ts` + `akis.ts` bağlantısı (`brollKok` ezmesi/kapatma)
- [x] 6. Testler `test/uret/broll.test.ts` (atama, şema, kırpma argümanları, tarama, kalıp HTML, akış)
- [ ] 7. Gerçek render + 412 px ekran görüntüsü (ana oturum, `agir` ile) — yön onayı
