# Elle test maddeleri

Kapı (K3): paket grubu bitince önce Claude turu (terminal, madde başına kanıt + geçti/kaldı), sonra kullanıcı. İkisi "tamam" demeden bağımlı paket koşmaz.
Kanıt: `elle` (mutlaka kullanıcı dener, ör. ses, his) · `terminal`.

## Grup A: 01 + 02 + 03 (link → yayın)
| # | Adım (kullanıcı ne yapar / ne der) | Beklenen | Kanıt | Claude turu | Kullanıcı |
|---|---|---|---|---|---|
| 1 | Bir Instagram/TikTok video linki verir | `fis.md` oluşur; sahne sayısı ve sırası kaynakla aynı | terminal | | |
| 2 | Fişi okur | Türkçe doğal, anlamca birebir; en üstte doğrulanacak iddialar | elle | | |
| 3 | Hazır metin verir | çözümleme atlanır, fiş oluşur | terminal | | |
| 4 | `fis_onay: evet` yapar | video + kapak + açıklama fişin yanında; ses patronun sesi | elle | | |
| 5 | `paylas` kuru koşu, sonra `--onay` | kuru koşu gövdeyi gösterir; onaylı koşu Instagram'da yayında, fiş `paylasildi` | elle | | |

## Bilinen sınırlamalar
- (henüz yok)
