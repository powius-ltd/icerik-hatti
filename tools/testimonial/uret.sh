#!/bin/bash
# Tum cikti setini (kadin derlemesi + 6 varyant) uretir; tekrar kosulabilir. Cikis 75 = agir kuyrugu.
cd "$(dirname "$0")"
for s in specs/*.json; do
  agir --ram 2 --ad testimonial -- ./build.py "$s" || echo "HATA/KUYRUK: $s ($?)"
done
