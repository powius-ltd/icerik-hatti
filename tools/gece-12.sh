#!/usr/bin/env bash
# IHT-12 gece koşusu: onaylı Reels'lerin sesi ve videosu, ajan denetimi, teslim. Yayın ve Zernio yok.
#   GUN=2026-11-05 agir --gece --oncelik 5 --ram 5 --ad iht-reels -- bash /home/dev/projeler/icerik-hatti/tools/gece-12.sh 12:a,15:b,18:c,22:d
# GUN yayın günüdür (varsayılan yarın); koşu ve teslim klasörü ona göre açılır.
# Her <id> için fiş gerekir ve fis_onay: evet olmalıdır; yoksa para harcanmadan durur.
#   GUN=2026-11-09 bash tools/gece-12.sh takvim   günün 4 slotu docs/takvim/<yıl>-H<hafta>.tsv'den (fiş yolu, isteğe bağlı ızgara kancası)
#   eski kullanım (saat:id,...): fiş docs/isler/12-dort-reels/fisler/<id>.md, kanca yok
#   bash tools/gece-12.sh bakiye       ElevenLabs bakiyesini okur (ücretsiz)
#   bash tools/gece-12.sh tek <id>     Düzeltilmiş fiş/çizimle anahtarsız yeniden render (ses önbellekten; ajan kullanır)
# Paket: docs/isler/12-dort-reels/SPEC.md
set -uo pipefail

ANA=/home/dev/projeler/icerik-hatti
WT=$ANA/.claude/worktrees/gece-12
DAL=gece-iht-12
GUN=${GUN:-$(TZ=Europe/Istanbul date -d tomorrow +%F)}
KOK=$ANA/kosular/$GUN-reels   # reels.sh ile aynı koşu kökü
export REELS_KOK=$ANA/kosular
TESLIM=/home/dev/teslim/icerik-hatti/$GUN-dort-reels
SES_ID=fwRD2e4Vs09ZX7vfRCka
SES_TAVAN_USD=1.20     # dört video (4 Kas kararı)
VIDEO_TAVAN_USD=0.30   # 1.000 karakter × 0,3 $/1k
KARAKTER_TAVAN=1000
GEREKEN_KARAKTER=2800
BURA=$(cd "$(dirname "$0")/.." && pwd)

source "$BURA/tools/anahtar.sh"   # anahtar()

# Kalan karakteri basar; okunamazsa boş döner.
bakiye() {
  curl -fsS --max-time 20 -H "xi-api-key: $(anahtar)" https://api.elevenlabs.io/v1/user/subscription 2>/dev/null \
    | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);console.log(j.character_limit-j.character_count)}catch{}})'
}

harcanan() {  # Koşu klasöründeki ses.json toplamı (USD)
  node -e 'const fs=require("fs");let t=0;for(const i of process.argv.slice(2)){try{t+=JSON.parse(fs.readFileSync(i)).usd}catch{}}console.log(t.toFixed(3))' "$KOK"/*/ses.json
}

declare -A FIS KANCA   # id → fiş yolu (repo içi), id → ızgara spec yolu
SPECDOSYA=docs/isler/12-dort-reels/SPEC.md
RAPOR=docs/isler/12-dort-reels/RAPOR.md

hazirla() {  # id: fişi ve çizimleri koşu klasörüne koyar (reels.sh hazirla ile aynı yol)
  bash "$BURA/tools/reels.sh" hazirla "$BURA/${FIS[$1]}" "$GUN" >/dev/null
}

kanca_ekle() {  # id: kanca alanı doluysa ızgara kancasını gövdeye ekler (ücretsiz)
  [ -n "${KANCA[$1]:-}" ] || return 0
  bash "$BURA/tools/reels.sh" izgara "$BURA/${KANCA[$1]}" "$1" "$GUN"
}

takvimden() {  # GUN günün satırlarını FIS/KANCA/SLOTLAR'a yükler
  local satirlar saat id fis kanca
  satirlar=$(bash "$BURA/tools/takvim.sh" "$GUN") || return 2
  SLOTLAR=""
  while IFS=$'\t' read -r saat id fis kanca; do
    FIS[$id]=$fis; [ "$kanca" = "-" ] || KANCA[$id]=$kanca
    SLOTLAR="$SLOTLAR ${saat%%:*}:$id"
  done <<< "$satirlar"
  SPECDOSYA=docs/isler/16-haftalik-hat/SPEC.md; RAPOR=docs/takvim/RAPOR-$GUN.md
}

case "${1:-}" in
  bakiye) echo "kalan karakter: $(bakiye)"; exit 0 ;;
  tek)
    if [ -f "$BURA/docs/takvim/$(date -d "$GUN" +%G-H%V).tsv" ]; then takvimden || exit 1; fi
    [ -n "${FIS[$2]:-}" ] || FIS[$2]=docs/isler/12-dort-reels/fisler/$2.md
    hazirla "$2" || exit 1
    (cd "$BURA" && ELEVENLABS_VOICE_ID=$SES_ID ELEVENLABS_API_KEY=anahtarsiz npm run -s hat -- uret --fis "$KOK/$2/fis.md" --render) || exit 1
    kanca_ekle "$2"
    exit $? ;;
esac

[ $# -eq 1 ] || { echo "kullanım: gece-12.sh <saat:id,saat:id,...> | takvim; konu onayı olmadan koşmaz, para harcanmadı"; exit 2; }
if [ "$1" = takvim ]; then
  takvimden || exit 2
else
  SLOTLAR=${1//,/ }
  for s in $SLOTLAR; do FIS[${s#*:}]=docs/isler/12-dort-reels/fisler/${s#*:}.md; done
fi
IDLER=""
for s in $SLOTLAR; do
  id=${s#*:}
  f=$BURA/${FIS[$id]}
  [ -f "$f" ] || { echo "$id: fiş yok; para harcanmadı"; exit 2; }
  grep -q '^fis_onay: evet$' "$f" || { echo "$id: fiş onaylı değil; para harcanmadı"; exit 2; }
  IDLER="$IDLER $id"
done

echo "== $(TZ=Europe/Istanbul date '+%F %T') gece koşusu başladı:$IDLER"
if [ ! -d "$WT" ]; then
  git -C "$ANA" worktree add -B "$DAL" "$WT" main || { echo "worktree açılamadı"; exit 1; }
fi
ln -sfn "$ANA/node_modules" "$WT/node_modules"
BURA=$WT
mkdir -p "$KOK" "$TESLIM"

ANAHTAR=$(anahtar)
[ -n "$ANAHTAR" ] || { echo "ElevenLabs anahtarı bulunamadı; para harcanmadı"; exit 1; }
KALAN=$(bakiye)
if [ -z "$KALAN" ]; then
  echo "bakiye okunamadı; tavanlarla devam"
elif [ "$KALAN" -lt "$GEREKEN_KARAKTER" ]; then
  echo "bakiye yetmiyor ($KALAN < $GEREKEN_KARAKTER karakter); para harcanmadı"; exit 1
else
  echo "bakiye: $KALAN karakter"
fi

BASARI=""
for id in $IDLER; do
  hazirla "$id" || { echo "$id: hazırlık başarısız"; continue; }
  H=$(harcanan)
  if awk -v h="$H" -v v="$VIDEO_TAVAN_USD" -v t="$SES_TAVAN_USD" 'BEGIN { exit !(h + v > t) }'; then
    echo "ses tavanı: $H \$ harcandı, tavan $SES_TAVAN_USD \$; durdu"; break
  fi
  echo "== $id üretiliyor (harcanan $H \$)"
  if (cd "$WT" && ELEVENLABS_VOICE_ID=$SES_ID ELEVENLABS_API_KEY=$ANAHTAR npm run -s hat -- uret --fis "$KOK/$id/fis.md" --render --karakter-tavan "$KARAKTER_TAVAN"); then
    kanca_ekle "$id" || echo "$id: ızgara kancası eklenemedi; kancasız teslim edilir"
    BASARI="$BASARI $id"
  else
    echo "$id: üretim başarısız"
  fi
done
unset ANAHTAR
echo "== ses toplamı $(harcanan) \$; üretilen:$BASARI"

if [ -n "$BASARI" ]; then
  cd "$WT" || exit 1
  gece-claude 3 '/goal '"$SPECDOSYA"' PAKET denetimini yap. Videolar: '"$KOK"'/<id>/final.mp4, id listesi:'"$BASARI"'; fiş yolları:'"$(for i in $BASARI; do echo -n " $i=${FIS[$i]}"; done)"'. Her videonun her sahnesinin sonundan ffmpeg ile bir kare al (sahne sınırı: ses.json + fis.md), Read ile bak; yazı taşması, öğe çakışması, altyazının çizimi örtmesi, boş kalan sahne ara. Hata varsa yalnız tools/cizim-kod/reels-<id>.mjs (eski dort-reels.mjs) ya da yukarıdaki fiş yolundaki dosyada sablon alanını düzelt (metin ve aciklama_taslagi rakamlarını değiştirme), `GUN='"$GUN"' bash tools/gece-12.sh tek <id>` ile yeniden render et; bu komut ücretsizdir, ses önbellekten gelir. Hata verirse ses çağrısı denemeye kalkma. Sosyal-panel .env dosyalarını okuma; hat paylas, hat tablo, Zernio yasak; agir kullanma; port açma. Bitti: her sahne incelendi (video başına sahne sayısı raporda), kalan hata 0; dar commit gece-iht-12 dalında (git add -- <yollar>, git commit --only -- <yollar>); '"$RAPOR"' ilk satırı "Durum: bitti", altında video başına tek satır bulgu. Ya da 8 turda dur, ilk satır "Durum: yarım", kalan aynı dosyada. Soru sorma; karar gerekiyorsa RAPOR.md içine "Karar: ..." yaz.'
  echo "== ajan çıkış $?"
fi

# Teslim: ajan yarım kalsa da üretilenler çıkar; saat öneki yayın sırasıdır.
EKSIK=""
kopyala() {  # saat ad klasör
  if [ ! -s "$3/final.mp4" ]; then EKSIK="$EKSIK $2"; return; fi
  cp "$3/final.mp4" "$TESLIM/$1-$2.mp4"; cp "$3/kapak.png" "$TESLIM/$1-$2-kapak.png"; cp "$3/aciklama.txt" "$TESLIM/$1-$2-aciklama.txt"
  OLCU=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -show_entries format=duration -of csv=p=0 "$TESLIM/$1-$2.mp4" | tr '\n' ' ')
  echo "$1 $2: $OLCU"
}
for s in $SLOTLAR; do kopyala "${s%%:*}" "${s#*:}" "$KOK/${s#*:}"; done
cp "$ANA/$SPECDOSYA" "$TESLIM/SPEC.md"
[ -f "$WT/$RAPOR" ] && cp "$WT/$RAPOR" "$TESLIM/RAPOR.md"

git -C "$WT" push -u origin "$DAL" || echo "push başarısız"
echo "== $(TZ=Europe/Istanbul date '+%F %T') bitti; ses $(harcanan) \$; eksik:${EKSIK:- yok}"
[ -z "$EKSIK" ]
