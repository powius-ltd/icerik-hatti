#!/bin/bash
# Kullanim: asr_liste.sh dosya1.mp4 dosya2.mp4 ...  (dokumu varsa atlar) -> dokum/<TST-NN | ad>.json
K=/home/dev/cikti/aiscale-testimonial
cd "$(dirname "$0")"
for f in "$@"; do
  b=$(basename "$f" .mp4); id=${b%%_*}
  [[ $b == TST-* ]] || id=$(echo "$b" | tr " ,'" "___")
  [ -s "$K/dokum/$id.json" ] || agir --ram 4 --ad tst-asr -- ./asr.py "$f" "$K/dokum/$id.json"
done
