#!/usr/bin/env bash
# Haftalık takvimden bir günün satırlarını okur: bash tools/takvim.sh <GUN>  → "saat<TAB>id<TAB>fis<TAB>kanca" (boş kanca "-").
# Dosya: docs/takvim/<ISO yıl>-H<ISO hafta>.tsv (başlık: tarih saat id fis kanca). Paket: docs/isler/16-haftalik-hat/SPEC.md
set -uo pipefail
BURA=$(cd "$(dirname "$0")/.." && pwd)
GUN=${1:?kullanım: takvim.sh <YYYY-AA-GG>}
D=$(date -d "$GUN" +%G-H%V) || exit 2
F=$BURA/docs/takvim/$D.tsv
[ -f "$F" ] || { echo "takvim yok: docs/takvim/$D.tsv; para harcanmadı" >&2; exit 2; }
S=$(awk -F'\t' -v g="$GUN" 'NR>1 && $1==g { print $2 "\t" $3 "\t" $4 "\t" ($5==""?"-":$5) }' "$F")
[ -n "$S" ] || { echo "takvimde $GUN satırı yok; para harcanmadı" >&2; exit 2; }
echo "$S"
