#!/usr/bin/env bash
# Ucuz konu taraması (15 Kas kararı): tek etiket, 10 Reels, takipçi adımı yok; ~0,03 $ (tavan 0,05 $).
#   bash tools/tara.sh [etiket=claudecode] [adet=10]
# Çıktı: kosular/<bugün>-tarama/<etiket>.json + beğeni+yorum'a göre sıralı liste (açıklama başı, link).
# Video indirilmez; gerekirse kayıttaki videoUrl ücretsiz indirilir.
set -euo pipefail
BURA=$(cd "$(dirname "$0")/.." && pwd); cd "$BURA"
source tools/anahtar.sh
E=${1:-claudecode}; N=${2:-10}; O=kosular/$(TZ=Europe/Istanbul date +%F)-tarama; mkdir -p "$O"
T=$(_env_oku APIFY_TOKEN); [ -n "$T" ] || { echo "Apify anahtarı yok; para harcanmadı"; exit 1; }
curl -s -X POST "https://api.apify.com/v2/acts/apify~instagram-hashtag-scraper/run-sync-get-dataset-items?token=$T&maxTotalChargeUsd=0.05&timeout=200" \
  -H 'Content-Type: application/json' -d "{\"hashtags\":[\"$E\"],\"resultsType\":\"reels\",\"resultsLimit\":$N}" -o "$O/$E.json"
python3 - "$O/$E.json" <<'P'
import json,sys
d=json.load(open(sys.argv[1]))
for p in sorted(d,key=lambda p:-((p.get("likesCount") or 0)+3*(p.get("commentsCount") or 0))):
    print(p.get("videoPlayCount") or 0, p.get("likesCount"), p.get("commentsCount"), "@"+p["ownerUsername"], p["url"], "|", (p.get("caption") or "")[:100].replace("\n"," "))
P
