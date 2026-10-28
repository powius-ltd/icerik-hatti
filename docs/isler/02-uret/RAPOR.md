Durum: bitti

# 02 Üret: rapor

- Komut: `npm run hat -- uret --fis <fis.md> [--ses elevenlabs] [--render]` (Chatterbox bağlanmadı, `--ses chatterbox` açık hata verir).
- Verify: `npm run typecheck && npm test` yeşil (19 dosya, 126 test). Yeni testler: `test/uret/{kalip-esle,sahne-plani,akis,elevenlabs}.test.ts`.
- Gerçek koşu: `agir --ram 4 --ad hat-02 -- npm run hat -- uret --fis kosular/deneme-02/fis.md --render` (agir kuyruğa atmadı, çıkış 0, ~2 dk).
  - `final.mp4`: h264/aac, 1080x1920, 44,8 sn; ses 44,8 sn (fark 0). Gürlük −14,3 LUFS.
  - ElevenLabs: 1 çağrı, 698 karakter (~0,056 $), ses `fwRD2e4Vs09ZX7vfRCka`, `eleven_multilingual_v2`.
  - Kalıplar: 1 kart · 2 big-stat (2.000) · 3-8 kart (adım rozetleri); aciklama.txt fiş taslağı aynen.
  - Altyazısız boşluk: plan pencerelerinden hesaplanan en büyük boşluk 0 sn (tavan 1,0 sn; aşarsa üretim durur).
- Fiş: `durum: uretildi`, `video: final.mp4`, `kapak: kapak.png` satır düzeyinde yazıldı (`durum` listesine `uretildi` eklendi).
- Teslim: `/home/dev/teslim/icerik-hatti/ilk-video/{final.mp4,kapak.png,aciklama.txt}`.

## 26 Eki bulgularının durumu
- K24 (cümle sayısı): çözüldü; display-text ve ". " bölme yok, sahne = ses parçası (test var).
- K26 (altyazısız boşluk): çözüldü; öbek sonrakinin girişine dek ekranda kalır, > 1,0 sn ise üretim durur.
- Yönetmen kararsızlığı: çözüldü; plan fişten deterministik.
- Sohbet kutusu yarım/boş: çözüldü; metin boşsa ya da kural tutmuyorsa kart'a düşer (test var).
- edge ses: alınmadı; Chatterbox ikinci sürüm.

## Bilinen sınırlar
- Kart kalıbı basit: ekranın ortası boş (yazı üstte, altyazı altta). Görsel zenginlik 05 / patron teması.
- Bu fişte sohbet kalıbı tetiklenmedi (tüm sahneler `grafik`); `chat-window` yalnız birim testle doğrulandı, gerçek render görülmedi.
- Kelime zamanları ElevenLabs damgasından; KS `retime` (sessizliğe oturtma) alınmadı. Altyazı kayması gözle denetlenmeli.
- Boşluk ölçümü plan pencerelerinden, videodan bağımsız ölçüm değil.

## KARAR GEREKLİ
- Yok. (Tema: aiscale ekran teması geçici; patron renk/font/logo gelince `config/hesaplar/<slug>.json`.)
