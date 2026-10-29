# icerik-hatti: yol haritası

Sana düşen: "birebir klon" düzeyi kararı (Müşteriden #1); patronun ses kaydı, Zernio hesabı, son tarih.

Patron işi (2026-10-26). Son tarih: <bekliyor>. Bitti = patron hesabında, tek link verilerek üretilen ilk video iki onaydan geçip Instagram'da yayında.
Benzetme: üç ayrı dükkân (bulan, pişiren, kargolayan) tek mutfakta; malzemeyi istediğin istasyondan bırakırsın.

```
(BUL: TikTok+IG) ─┐
(link / dosya) ───┼─► ÇÖZÜMLE ─► FİŞ ─► [fis_onay] ─► SES (patron klonu) + ÜRET ─► [paylasim_onay] ─► Zernio ─► Instagram
(hazır metin) ────┴────────────► FİŞ
```

## Kararlar özeti
Patron hesabı için tek yeni repo; parçalar viral-uyarla, kreatif-studyo, sosyal-panel'den kopyalanır, onlar donar. İki insan onayı: fiş ve paylaşım. Uyarlama birebir (akış, kesit, ekran yazısı konumu korunur), renk/tipografi bizim. Ses patronun ElevenLabs klonu. Kaynak TikTok + Instagram, hedef Instagram. Aradan giriş: link/dosya ya da hazır metin. Ayrıntı: `GUNLUK.md` Kararlar; neyin nereden geldiği: `docs/ENVANTER.md`.

## Aşamalar
| # | Kazanım: bitince ne var | Paketler | Elle test kapısı |
|---|---|---|---|
| A1 | Link ver → onaylanacak Türkçe fiş; onaylı videoyu Zernio'ya kuru/gerçek gönder | 01, 03 | yok (02 ile birlikte) |
| A2 | Onaylı fişten patron sesli, kapaklı, açıklamalı video | 02 | **K3 grup A: 01+02+03** (link → yayın, uçtan uca) |
| A3 | Hiçbir şey vermeden haftanın tutan videoları fiş olarak önüne gelir | 04 | K3 grup B |
| A4 | Video kaynağın görsel klonu (yerleşim + zamanlama) | 05 | K3 grup C |

## Senin kapıların
| | Kapı | Paket / grup | Ne yaparsın | Süre | Ne zaman |
|---|---|---|---|---|---|
| [ ] | Karar | 02, 05 | birebir klon düzeyi | 1 dk | şimdi |
| [ ] | K1 Kazanım | 01, 03 | kazanım onayı (01: 0 $; 03: 0 $, kuru koşu) | 2 dk | 01 başlamadan |
| [ ] | K5 Para / dış | 02 | ElevenLabs klon + ilk ses tutarı | 1 dk | 02'den önce |
| [ ] | K3 Elle test | grup A | `docs/ELLE-TEST.md` grup A: link ver, fişi onayla, videoyu izle, paylaşımı onayla | 20 dk | 01+02+03 bitince |
| [ ] | K5 Para / dış | 04 | Apify tavanı (öneri 0,3 $ ilk koşu) | 1 dk | 04'ten önce |

## Şimdi (≤ 2)
- **[M] 01-fis**: video linki/dosyası ya da hazır metin ver → onaylanacak Türkçe birebir fiş. SPEC: `docs/isler/01-fis/SPEC.md`
- **[M] 03-paylas**: onaylı videoyu patron hesabına Zernio ile kuru koşuda gönder; `--onay` ile gerçek. SPEC: `docs/isler/03-paylas/SPEC.md`

## Sonra
- [M] 02-uret-ses: onaylı fişten ElevenLabs patron sesi + HyperFrames video + kapak + açıklama (KS `production/voice`, `hf-engine`, `orders/{cover,caption}`). Klon kararına bağlı: "yapı klonu" ise genel HF sahneleri, "görsel klon" ise 05'i bekler.
  26 Eki deneme bulguları (KS kapısı 4 denemenin hiçbirinde temiz geçmedi): (1) KS `orders/display-text.ts` "Birinci" → "1." yapıyor, `edit-director/sentences.ts:12-16` ". " ile bölüyor → metin/ses cümle sayısı tutmuyor (K24); (2) K26 altyazısız boşluk > 1,0 sn denetimi düzeltme turundan sonra da kalıyor; (3) yönetmen LLM'i her koşuda farklı plan → kapı kararsız; bu hatta yönetmen alınmaz, sahne planı fişten deterministik çıkar; (4) sohbet kutuları yarım yazı kalıyor, komut/liste sahneleri görünmüyor; (5) edge ses yolu bozuk (`edge-speak.py:20` WordBoundary), Chatterbox çalışıyor ama robotik.
- [M] 04-bul: TikTok + Instagram'da tutan video (VU `tara`/`sec`, SP eşikleri: izlenme/takipçi ≥ 3, ≥ 10.000, ≤ 30 gün) → aday listesi → seçilen fişe.
  28 Eki ek (kullanıcı fikri, iki yeni kaynak kipi; 04 ile birlikte planlanır):
  - Aktif içerik üreticiler: izlenen hesaplar listesi (TikTok/IG); listedekilerin yeni videoları düzenli taranır, tutanlar aday olur. Kazanım: "kimi takip ettiğimizi" tek yerde tutarız, aday akışı kendiliğinden gelir.
  - Kişi bazlı kopyalama: tek hesap adı ver → o kişinin son N videosu (ya da en çok tutanları) fiş adayı olur, istersen toplu fişe gider. Kazanım: beğendiğin bir üreticinin formatını videoyla değil kişiyle başlatırsın.
  Açık: liste nerede (Drive tablosunda yeni sekme mi, repoda dosya mı), "son N" ve tarama sıklığı; ikisi de Apify kredisine bağlı.

- [A] 10-broll: kurucu arşivinden ara kesit (kanca, bölüm başları, CTA tam ekran klip). SPEC: `docs/isler/10-broll/SPEC.md`. Önce yön onayı + 412 px görüntü.
- [M] DM dokümanı: CTA'da söz verilen link (ör. 5 eklenti) her video için Notion sayfası; fiş onayında "doküman hazır mı" satırı.

## Daha sonra
- [M] 05-klon: kaynak kareden yerleşim çıkarımı (agy: öğe türü + kutu + zamanlama) → genel HF sahnesi; renk/tipografi patron temasından.
- Fiş ve paylaşım onayı için telefondan onay (Telegram ya da basit sayfa).

## Müşteriden (Açık sorular)
1. Birebir klon düzeyi: ilk sürüm "yapı klonu" (sıra, tempo, ekran yazısı konumu; bizim sahnelerle) mi, yoksa görsel klon (05) beklenip mi çıkılsın?
2. Son tarih.
3. Patronun ses kaydı + ElevenLabs klon izni; klon hangi ElevenLabs hesabında?
4. Patronun Zernio hesabı ve anahtarı; Instagram bağlı mı?
5. Patron markası: renk, font, logo (tema belirteçleri için).
