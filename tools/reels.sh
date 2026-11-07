#!/usr/bin/env bash
# Gündüz Reels üretimi: tek video, adım adım. Akış ve kurallar: .claude/skills/reels-uret/SKILL.md
#   bash tools/reels.sh hazirla <fis.md> [GUN]        fişi koşu klasörüne kopyalar, çizimleri üretir (ücretsiz)
#   agir --ram 4 --ad iht-<id> -- bash tools/reels.sh uret <id> [GUN]   ses + render (ÜCRETLİ, ses önbellekte varsa ücretsiz)
#   bash tools/reels.sh kanca <spec.json> <id> [GUN]  testimonial kancasını gövdenin önüne ekler (ücretsiz)
#   agir --ram 3 --ad iht-izgara -- bash tools/reels.sh izgara <spec.json> <id> [GUN]  4'lü ızgara kancası (gövdesiz spec) render + gövdeye ekler
#   bash tools/reels.sh kareler <id> [GUN] [bas] [son] kontrol şeridi: scratch'e PNG (Read ile bakılır)
#   bash tools/reels.sh teslim <id> [GUN]             teslim klasörüne mp4 + kapak + açıklama
#   bash tools/reels.sh paylas <id> <SS:DD|simdi> [GUN]   fişte paylasim_onay: evet olmalı; GERİ ALINAMAZ
# GUN yayın günü (varsayılan bugün, İstanbul). Koşu: kosular/<GUN>-reels/<id>/ (REELS_KOK ile kök değişir); fiş id'si = fiş dosya adı.
set -uo pipefail
BURA=$(cd "$(dirname "$0")/.." && pwd)
source "$BURA/tools/anahtar.sh"
SES_ID=fwRD2e4Vs09ZX7vfRCka
KARAKTER_TAVAN=1000
bugun() { TZ=Europe/Istanbul date +%F; }
kok() { echo "${REELS_KOK:-$BURA/kosular}/${1:-$(bugun)}-reels"; }  # REELS_KOK: gece betiği worktree'den ana kosular/ klasörünü gösterir
sure() { ffprobe -v error -show_entries format=duration -of csv=p=0 "$1"; }

# kanca mp4'ünü gövdenin önüne ekler: birlestir <kanca.mp4> <koşu klasörü>. .kancali: final.mp4 birleşik mi? uret yeniden koştuysa final yeni gövdedir.
birlestir() {
  local KAN=$1 K=$2
  if [ ! -f "$K/.kancali" ] || [ "$K/final.mp4" -nt "$K/.kancali" ]; then mv "$K/final.mp4" "$K/govde.mp4" || return 1; fi
  ffmpeg -v error -y -i "$KAN" -i "$K/govde.mp4" -filter_complex "[0:v]fps=30,setsar=1,format=yuv420p[v0];[1:v]fps=30,setsar=1,format=yuv420p[v1];[0:a]aresample=48000,aformat=channel_layouts=stereo[a0];[1:a]aresample=48000,aformat=channel_layouts=stereo[a1];[v0][a0][v1][a1]concat=n=2:v=1:a=1[v][a]" \
    -map "[v]" -map "[a]" -c:v libx264 -preset medium -crf 20 -c:a aac -b:a 192k -movflags +faststart "$K/final.mp4" || return 1
  touch "$K/.kancali"; ffmpeg -v error -y -ss 1 -i "$K/final.mp4" -frames:v 1 "$K/kapak.png"
}

case "${1:-}" in
  hazirla)
    f=$2; id=$(basename "$f" .md); K=$(kok "${3:-}")/$id
    grep -q '^fis_onay: evet$' "$f" || { echo "$id: fiş onaylı değil"; exit 2; }
    mkdir -p "$K/cizimler" && cp "$f" "$K/fis.md"
    if [ -f "$BURA/tools/cizim-kod/reels-$id.mjs" ]; then node "$BURA/tools/cizim-kod/dort-reels.mjs" "$id" "$K/cizimler" || exit 1; fi
    echo "hazır: $K ($(ls "$K/cizimler" | tr '\n' ' '))" ;;
  uret)
    K=$(kok "${3:-}")/$2; A=$(anahtar); [ -n "$A" ] || { echo "ElevenLabs anahtarı bulunamadı; para harcanmadı"; exit 1; }
    cd "$BURA" && ELEVENLABS_VOICE_ID=$SES_ID ELEVENLABS_API_KEY=$A npm run -s hat -- uret --fis "$K/fis.md" --render --karakter-tavan "$KARAKTER_TAVAN" ;;
  kanca)
    spec=$2; K=$(kok "${4:-}")/$3; ad=$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["out"])' "$spec") || exit 1
    python3 "$BURA/tools/testimonial/build.py" "$spec" || exit 1
    KAN=/home/dev/cikti/aiscale-testimonial/cikti/$ad.mp4
    birlestir "$KAN" "$K" || exit 1
    echo "kanca + gövde: $K/final.mp4 ($(sure "$K/final.mp4") sn)" ;;
  izgara)
    spec=$2; K=$(kok "${4:-}")/$3; ad=$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1]))["out"])' "$spec") || exit 1
    python3 "$BURA/tools/testimonial/izgara.py" "$spec" --ciktidir "$K/izgara" || exit 1
    birlestir "$K/izgara/$ad.mp4" "$K" || exit 1
    echo "ızgara kanca + gövde: $K/final.mp4 ($(sure "$K/final.mp4") sn)" ;;
  kareler)
    K=$(kok "${3:-}")/$2; bas=${4:-0}; son=${5:-$(sure "$K/final.mp4")}
    O=${SCRATCH:-/tmp}/kareler-$2-$bas.png
    ara=$(awk -v b="$bas" -v s="$son" 'BEGIN{printf "%.2f", (s-b)/10}')
    ffmpeg -v error -y -ss "$bas" -t "$(awk -v b="$bas" -v s="$son" 'BEGIN{print s-b}')" -i "$K/final.mp4" -vf "fps=1/$ara,scale=270:-2,tile=5x2" -frames:v 1 "$O" && echo "$O" ;;
  teslim)
    G=${3:-$(bugun)}; K=$(kok "$G")/$2; T=/home/dev/teslim/icerik-hatti/$G-reels
    [ -s "$K/final.mp4" ] || { echo "$2: final.mp4 yok; önce uret"; exit 1; }
    mkdir -p "$T" && cp "$K/final.mp4" "$T/$2.mp4" && cp "$K/kapak.png" "$T/$2-kapak.png" && cp "$K/aciklama.txt" "$T/$2-aciklama.txt" || exit 1
    echo "$T/$2.mp4 ($(sure "$T/$2.mp4") sn)" ;;
  paylas)
    G=${4:-$(bugun)}; K=$(kok "$G")/$2
    grep -q '^paylasim_onay: evet$' "$K/fis.md" || { echo "$2: fişte paylasim_onay: evet yok; gönderilmedi"; exit 2; }
    SAAT=(); [ "$3" = simdi ] || SAAT=(--saat "$G $3")
    export ZERNIO_API_KEY_VARSAYILAN; ZERNIO_API_KEY_VARSAYILAN=$(zernio_anahtar)
    cd "$BURA" && npm run -s hat -- paylas --fis "$K/fis.md" "${SAAT[@]}" --kapak-ms 1000 --hesap varsayilan --ig aiscale_app --onay final.mp4 ;;
  *) sed -n '2,9p' "$0"; exit 2 ;;
esac
