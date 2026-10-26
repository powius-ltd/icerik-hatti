# Envanter: üç kaynak repodan ne alınır (2026-10-26)

Sana düşen: yok (ajan belgesi). Karar gereken tek nokta "birebir klon" (aşağıda §Boşluk); YOL "Müşteriden".
Kaynak: üç salt okuma taraması (sonnet). Hiçbir şey koşturulmadı; "kanıt" sütunu GUNLUK/kosular kayıtlarına dayanır.
Yollar: `VU` = `/home/dev/projeler/viral-uyarla`, `KS` = `/home/dev/projeler/kreatif-studyo`, `SP` = `/home/dev/projeler/sosyal-panel`.

## Seçim (hangi aşama nereden)
| Aşama | Kaynak | Neden bu | Kanıt | Durum |
|---|---|---|---|---|
| BUL | VU `src/tara`, `src/sec` (+ SP `viral/thresholds.ts` eşikleri) | Supabase'siz CLI, testli, `--max-usd` tavanı | yalnız test + fixture; canlı Apify koşusu YOK | kopyala, eşik uyarla |
| FİŞ (çözümle) | VU `src/cozumle`, `py/asr.py` | indirme (CDN allowlist, yt-dlp yedeği), whisper, agy sahne çözümlemesi | 2 gerçek IG videosu (`VU/kosular/ig-2026-10-16`) | kopyala |
| FİŞ (uyarla) | VU `src/uyarla` | `claude -p` ile Türkçe senaryo + `senaryo.md` "Sana düşen" | aynı 2 video | uyarla: istem "hook yeniden yazılır" → birebir; şablon alanları sadeleşir |
| Fiş dosyası | KS `src/orders/{read-ticket,field-map,write-back}.ts`, `contracts/order.ts` | YAML frontmatter, satır düzeyinde atomik dönüş yazımı | KS iş 06 gerçek koşu | uyarla: `fis_onay` + `paylasim_onay` iki alan, uyarlama metni alanı |
| SES | KS `src/production/voice/*`, `providers/elevenlabs.ts`, `orders/{voice,display-text}.ts`, `production/spend.ts` | ElevenLabs with-timestamps tek çağrı, kelime zamanı, iş başına USD tavanı, telaffuz sözlüğü | Merak #6, UGC (Batu sesi), gerçek ücretli koşular | kopyala |
| ÜRET | KS `src/hf-engine/{produce,compose,render,captions,words,voice,loudness,theme,format,styles,layer}.ts` + `contracts/scene-plan.ts` | HyperFrames 0.8.158, kelime altyazısı, tema belirteçleri; müşteri teslimlerinde kullanılıyor | Simla, Ayfer teslimleri | kopyala; `produce.ts` klip arşivi + `loadWorkspaceConfig` bağı sökülür |
| Kapak + açıklama | KS `src/orders/{cover,caption}.ts` | ffmpeg 4 kare → en ayrıntılı; açıklama fişten ya da 1 LLM çağrısı | KS iş 06 | uyarla (gateway yerine `claude -p`) |
| PAYLAŞ | SP `scripts/zernio-paylas.mts`, `src/lib/zernio/{publish-client,schema,api-key}.ts` | kuru koşu varsayılan; `--onay=<dosya adı>` gerçek gönderim kapısı | 5 gerçek paylaşım (aiscale, 18–20 Eki) | uyarla: DB dalı (`:80-100`) ve `server-only` silinir; `published` yoklaması eklenir |

## Alınmayacaklar
- VU `src/uret` (Playwright kare kare, 7 sabit şablon): ÜRET KS HyperFrames'ten gelir; iki motor tutulmaz.
- VU `src/ses`: SES KS'den; hizalama tek kopya (KS YOL#7).
- KS `edit-director/`, `hf-engine/scenes/*` (aiscale kalıpları), `carousel/`, `clip-archive/`, `researcher/`, `writer/`, `render/` (Python).
- SP `collection/`, `scoring/`, `publish/run-publish.ts`, `panel_jobs`, `studio-order/{run,create-for-idea}.ts`, `src/app`, `supabase/`.

## Boşluk: birebir görsel klon hiçbir repoda yok
- VU `analiz.json` kaynağın sahnelerini yalnız METİN olarak tarif eder (tür, ekran yazısı, konuşma, hareket, süre); kare, yerleşim ve renk çıkarılmaz. VU SPEC bilerek "birebir kopya değil" der.
- KS fişindeki `ornek_video.bicim` (`contracts/order.ts:20-37`) yalnız ölçü (süre, kesme, tempo, yazı konumu); HF sahne planı yalnız KS kalıp adlarını bilir.
- Gereken yeni katman: kaynak kareden yerleşim çıkarımı (agy ile öğe türü + kutu + zamanlama) → genel amaçlı HF sahnesi (renk/tipografi bizim tema belirteçlerinden). Kaynağın görüntüsü ve sesi çıktıya girmez; indirme yalnız çözümleme için.

## Taşımada dikkat
- `@/` takma adları ve `server-only` importları (SP) ilk derleme hatası kaynağı.
- Marka sızıntısı: aiscale/Merak/Simla adları, Batu `voiceId` (KS `config/workspaces/aiscale.json`) kopyaya girmez; patron hesabı konfigü yeni yazılır.
- SP Zernio: `publishing` durumu hata sayılıyor (SP GUNLUK:219, 233); ~80 sn sonra `published` olur.
- Hiçbir testin bugün yeşil olduğu doğrulanmadı; her taşımada önce kaynak testi kopyalanıp burada koşturulur.
