#!/bin/bash
# kaynak/ icindeki her mp4 icin (dokumu yoksa) ASR; TST-* + laptop short'lari
K=/home/dev/cikti/aiscale-testimonial
cd "$(dirname "$0")"
for f in "$K"/kaynak/*.mp4; do
  b=$(basename "$f" .mp4); id=${b%%_*}; [[ $b == TST-* ]] || id=$(echo "$b" | tr ' ,'"'" '___')
  [ -s "$K/dokum/$id.json" ] && continue
  agir --ram 4 --ad tst-asr -- ./asr.py "$f" "$K/dokum/$id.json"
done
