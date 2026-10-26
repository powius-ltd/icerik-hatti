# 01 Fiş ([M])

**Kazanım:** Bir video linki, video dosyası ya da hazır metin verince, onaylayacağın Türkçe birebir uyarlama fişi (`fis.md`) çıkar.
Bağlı: yok. Süre bütçesi: 1 oturum (~3 saat); dolarsa "hazır metin" girişi kesilir, 02'ye kalır.

## Sana düşen
- [ ] K1 kazanım onayı (0 $: agy ve `claude -p` abonelik)
- [ ] K3: grup A'da (01+02+03), ELLE-TEST #1–#3

## Kullanıcıya düşen (RAPOR bunu tek blokta verir)
- İzin satırları: yok · anahtar: yok · hesap: yok

## Sorun
Fiş üreten kod viral-uyarla'da dağınık: link girişi yok, istem "hook yeniden yazılır" diyor (birebir değil), onay alanı yok.

## PAKET
1. **Kazanım:** yukarıdaki cümle.
2. **Plan:** 6 adım (GOREVLER.md). Dokunulacak: `package.json`, `tsconfig.json`, `.env.example`, `src/cli.ts`, `src/ortak/`, `src/cozumle/`, `src/fis/`, `py/asr.py`, `test/`. Dokunulmayacak: üç kaynak repo (yalnız okunur), `src/uret`, `src/ses`, `src/paylas`.
3. **Kararlar:**
   - Kaynak: VU = `/home/dev/projeler/viral-uyarla` (`335b436`). Kopyalanır: `src/cli.ts`, `src/ortak/*`, `src/cozumle/{komut,indir,ytdlp,ffmpeg,agy,analiz,sema,istem,hedefler}.ts` (+ dizindeki diğer gerekli dosyalar), `py/asr.py`, ilgili `test/cozumle/*`. `src/uyarla/{claude,istem,denetle,senaryo-md}.ts` `src/fis/` altına uyarlanır.
   - Komut: `npm run hat -- fis --video <yol> | --url <link> | --metin <dosya.md> [--kosu <ad>] [--id <ad>]`. `--url` yt-dlp ile indirir (VU `ytdlp.ts`); `--metin` çözümlemeyi atlar, yalnız fiş yazar.
   - İstem: birebir uyarlama. Sahne sayısı, sırası, süreleri ve ekran yazısı konumları kaynakla aynı; metin anlamca birebir Türkçeye, doğal konuşma diliyle. Hook yeniden yazılmaz, yalnız çevrilir. Şablon adı alanları kalkar (VU `sablon-veri-sema.ts` alınmaz).
   - Fiş biçimi (`src/fis/sema.ts`, zod): YAML frontmatter `fis_id, kaynak{tur: video|url|metin, url?, dosya?}, hesap, fis_onay: hayir, paylasim_onay: hayir, durum: taslak, sahneler[{no, basSn, sonSn, tur, ekranYazisi, konum, metin}], aciklama_taslagi` + gövdede okunur senaryo ve en üstte "Sana düşen" (doğrulanacak iddialar, VU `senaryo-md.ts` fikri). Dönüş yazımı KS `src/orders/write-back.ts` kalıbıyla satır düzeyinde (yalnız `durum`, `video`, `kapak`, `hata_notu`).
   - Çıktı: `kosular/<kosu>/<id>/{kaynak.mp4, dokum.json, analiz.json, fis.md}`; `kaynak.mp4` gitignore'da.
4. **Goal:** `/goal docs/isler/01-fis/SPEC.md PAKET'ini uygula. Bitti: npm run typecheck && npm test yeşil; fis.md şema testi + --metin girişi testi + istem birebir testi geçer; VU kosular/ig-2026-10-16/instagram-DeZTLK4CeiQ/kaynak.mp4 ile --video koşusu bir fis.md üretir (sahne sayısı analiz.json ile aynı); RAPOR.md ilk satırı "Durum: bitti". Ya da 12 turda dur, "Durum: yarım", kalan GUNLUK "Bekleyen"e.`
5. **Sigorta:** Sonnet; dal `is-01-fis`; ücretli servis yok; aynı hata 3 kez → dur; soru yok, karar GUNLUK "Bekleyen"e. Gerçek video koşusu `agir --ram 3 --ad hat-01 -- npm run hat -- fis ...`.
6. **Koşu:** gündüz proje oturumunda ya da gece kuyruğu (yönetici): `agir --gece --ram 3 --ad hat-01 -- bash tools/gece-01.sh`.

## Kapsam dışı
- BUL (Apify), ses, render, paylaşım; görsel klon (yerleşim çıkarımı, 05).
- Fiş onayının telefondan verilmesi (Daha sonra).

## Açık sorular
- Instagram/TikTok sayfa linkinden yt-dlp indirmesi oturum çerezi ister mi? İlk gerçek linkte denenir; olmazsa `--video` yolu kalır (kullanıcıya).
