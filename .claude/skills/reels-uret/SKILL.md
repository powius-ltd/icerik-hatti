---
name: reels-uret
description: "@aiscale_app için gündüz tek Reels üretimi: konu → fiş → çizim → patron sesi + render → kare kontrolü → teslim → kullanıcı onayı → Zernio zamanlama. Üç tür: araç Reels, testimonial kanca + gövde, sosyal kanıt mix. \"Video yapalım\", \"bugüne konu\", \"şunu Reels yap\", \"22'ye video\" dendiğinde. Gece toplu dörtlü üretim değil (o tools/gece-12.sh)."
---

# Reels üret (gündüz, tek video)

Benzetme: mutfak tarifi. Malzemeyi (konu) kullanıcı seçer, tabağı (paylaşım) kullanıcı onaylar; arası bu tarif.

```
konu (kullanıcı) → fiş yaz → hazirla → uret (ÜCRETLİ) → [kanca] → kareler → teslim
   → kullanıcı izler → paylasim_onay: evet → paylas <saat> → GUNLUK + commit
```
Bütün komutlar `tools/reels.sh` (başındaki yorum kullanım). `GUN` varsayılanı bugün; koşu `kosular/<GUN>-reels/<id>/`, teslim `/home/dev/teslim/icerik-hatti/<GUN>-reels/`.

## Kapılar (atlanmaz)
- **Konu kullanıcının.** 2–3 seçenek tablo halinde, her birine kazanım + kanca cümlesi; önerini işaretle.
- **Para:** ses ~0,15 $/video (liste fiyatı, 1.000 karakter tavanı); gün tavanı 1,20 $. Tek video bu tavanın içindeyse ayrıca sorma, yanıtta tutarı söyle. Yeniden render ücretsiz (ses önbellekte).
- **Paylaşım geri alınamaz.** Kullanıcı videoyu izleyip "yayınla/pushla/zamanla" demeden `paylasim_onay` açılmaz. İzlediği video, aksini söylemedikçe kendi saatine zamanlanır (4 Kas kararı). Saat geçtiyse hemen gönderilir (`simdi`).
- **Saatler:** 12:00 · 15:00 · 18:00 · 22:00 İstanbul.
- Anahtarlar yalnız `tools/anahtar.sh` ile okunur; ekrana basılmaz. `.env*` açılmaz.
- Kaynak videonun karesi/sesi çıktıya girmez; **istisna:** kendi testimonial arşivimiz (`/home/dev/cikti/aiscale-testimonial/kaynak/`, öğrencilerin izni bizde).

## Neyin tuttuğu (5 Kas analitiği, `docs/analitik/`)
Erişimi kanca değil kaydetme + paylaşma oranı belirliyor. Formül: **ücretsiz araç ya da somut sonuç** + kanca **yüz/tepki ya da sonuç vaadi** + tek akış **≤ 40 sn** + kapanış **yorumlara SEMİNER** (DM'den link). Gövdedeki marka adları dağıtımı kesebilir (Fayda, Giriş engeli 4 Kas'ta 14–17 erişim); doğrulanmamış rakam yazılmaz.

## Üç tür
| Tür | Fiş | Ek adım | Örnek |
|---|---|---|---|
| Araç Reels | araç adı, ne yapar, kime yarar, kurulum, "bilmen gereken" (ücret/sınır), SEMİNER | Aracın gerçek demosu b-roll olarak (`broll: BR-NN`) | `docs/isler/13-arac-reels/fisler/anatomy.md` |
| Testimonial kanca + gövde | gövde: öğrencinin kurduğu şeyin "nasıl"ı, 3 parça | `kanca <spec.json>`: 6–9 sn kesit gövdenin önüne | `docs/isler/14-testimonial-kanca/fisler/hasan-mail.md` + `tools/testimonial/specs/hasan-kanca.json` |
| Sosyal kanıt mix | fiş yok | `python3 tools/testimonial/build.py <spec>` + `cta` alanı; paylaşım `hat paylas --video … --aciklama …` | `tools/testimonial/specs/sosyal-kanit-mix.json` |

## Fiş yazımı
- **Ekranda terminal komutu yok** (6 Kas): kitle kod bilmiyor; kurulum sahnesi "Claude'a söyle: X'i kur" dilinde, komut yalnız açıklamada.
- Fiş `docs/isler/<NN-ad>/fisler/<id>.md`; `fis_onay: evet` (konu onaylıysa), `paylasim_onay: hayir`. Biçim için yukarıdaki örneği kopyala.
- 5–7 sahne, toplam ≤ ~650 karakter (≈ 40 sn). Kancada gövde ≤ ~550 karakter (kanca + gövde ≤ ~45 sn).
- `sablon.kalip`: `rakam` (2–3 satır, `sec: true` vurgulu), `akis` / `gazete` (SVG + `adimlar`), `kapanis` (`damga: SEMİNER`), `cubuk`. Şema: `src/uret/render/sablon.ts`.
- `kelime`: öğenin göründüğü kelime, sahne `metin`inin **0'dan sayılan** kelime sırası (noktalama kelimeye yapışık sayılır).
- `broll: BR-NN` otomatik seçimi ezer; klip sahneden kısa olamaz (gerekirse `setpts` ile yavaşlat). Videoya özel kayıtlar paylaşımdan sonra ortak arşivden (`/home/dev/cikti/aiscale-broll/kaynak/02_ARA_GORUNTU_BROLL`) çıkarılır, yoksa başka videolara atanır.
- SVG'ler `tools/cizim-kod/reels-<id>.mjs` (960×780; `G` renkleri ve `reels-yardimci.mjs`, sabit renk yok); öğe sınıfı = `adimlar.hedef`.
- Telaffuz: Claude → "Klad", Code → "Kod" (hat kendisi çevirir).

## Testimonial kancası
- Döküm: `/home/dev/cikti/aiscale-testimonial/dokum/<TST|SH>-NN.json` (kelime zamanlı). En güçlü 2–3 cümle (ters köşe + sonuç), toplam 6–9 sn; kesitler kelime sınırından `t0/t1`.
- `crop`: konuşmacı paneli (önce bir kare al, Read ile bak); `fgy` kanca yazısının altından başlasın (~420). `fix`: ASR düzeltmesi (CLOUD→CLAUDE).

## Kontrol (teslimden önce)
`kareler <id> [bas] [son]` şeridine Read ile bak; şunları ara: öğe sahne bitmeden görünüyor mu, yazı taşması, altyazı çizimi örtüyor mu, kanca yazısı yüzü kapatıyor mu. Ses düzeyi −14 LUFS civarı (`ffmpeg -af ebur128`). Düzeltme fiş/çizimde, sonra `uret` (ücretsiz).

## Kapanış
- Kullanıcıya: Z:\ yolu kod bloğunda, sahne tablosu, tutar, "bilmen gerekenler"; wrap_up sorusu saat.
- Yayından sonra `GUNLUK.md` o günün başlığına: `- <ad> <saat>'de yayında: <ig linki> · Zernio <id> · <hash>`.
- Fiş + çizim + spec dar commit: `git add -- <yollar> && git commit --only -- <yollar>`; push.
