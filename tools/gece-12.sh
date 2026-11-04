#!/usr/bin/env bash
# IHT-12 gece koşusu: onaylı Reels'lerin sesi ve videosu, ajan denetimi, teslim. Yayın ve Zernio yok.
#   GUN=2026-11-05 agir --gece --oncelik 5 --ram 5 --ad iht-reels -- bash /home/dev/projeler/icerik-hatti/tools/gece-12.sh 12:a,15:b,18:c,22:d
# GUN yayın günüdür (varsayılan yarın); koşu ve teslim klasörü ona göre açılır.
# Her <id> için docs/isler/12-dort-reels/fisler/<id>.md gerekir ve fis_onay: evet olmalıdır; yoksa para harcanmadan durur.
#   bash tools/gece-12.sh bakiye       ElevenLabs bakiyesini okur (ücretsiz)
#   bash tools/gece-12.sh tek <id>     Düzeltilmiş fiş/çizimle anahtarsız yeniden render (ses önbellekten; ajan kullanır)
# Paket: docs/isler/12-dort-reels/SPEC.md
set -uo pipefail

ANA=/home/dev/projeler/icerik-hatti
WT=$ANA/.claude/worktrees/gece-12
DAL=gece-iht-12
GUN=${GUN:-$(TZ=Europe/Istanbul date -d tomorrow +%F)}
KOK=$ANA/kosular/$GUN-dort-reels
TESLIM=/home/dev/teslim/icerik-hatti/$GUN-dort-reels
SES_ID=fwRD2e4Vs09ZX7vfRCka
SES_TAVAN_USD=1.20     # dört video (4 Kas kararı)
VIDEO_TAVAN_USD=0.30   # 1.000 karakter × 0,3 $/1k
KARAKTER_TAVAN=1000
GEREKEN_KARAKTER=2800
BURA=$(cd "$(dirname "$0")/.." && pwd)

anahtar() { sed -n 's/^ELEVENLABS_API_KEY_AISCALE=//p' /home/dev/projeler/sosyal-panel/.env.local | head -1 | tr -d '"'"'"'\r'; }

# Kalan karakteri basar; okunamazsa boş döner.
bakiye() {
  curl -fsS --max-time 20 -H "xi-api-key: $(anahtar)" https://api.elevenlabs.io/v1/user/subscription 2>/dev/null \
    | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);console.log(j.character_limit-j.character_count)}catch{}})'
}

harcanan() {  # Koşu klasöründeki ses.json toplamı (USD)
  node -e 'const fs=require("fs");let t=0;for(const i of process.argv.slice(2)){try{t+=JSON.parse(fs.readFileSync(i)).usd}catch{}}console.log(t.toFixed(3))' "$KOK"/*/ses.json
}

hazirla() {  # id: fişi ve çizimleri koşu klasörüne koyar
  mkdir -p "$KOK/$1/cizimler"
  cp "$BURA/docs/isler/12-dort-reels/fisler/$1.md" "$KOK/$1/fis.md"
  node "$BURA/tools/cizim-kod/dort-reels.mjs" "$1" "$KOK/$1/cizimler"
}

case "${1:-}" in
  bakiye) echo "kalan karakter: $(bakiye)"; exit 0 ;;
  tek)
    hazirla "$2" || exit 1
    cd "$BURA" && ELEVENLABS_VOICE_ID=$SES_ID ELEVENLABS_API_KEY=anahtarsiz npm run -s hat -- uret --fis "$KOK/$2/fis.md" --render
    exit $? ;;
esac

[ $# -eq 1 ] || { echo "kullanım: gece-12.sh <saat:id,saat:id,...>; konu onayı olmadan koşmaz, para harcanmadı"; exit 2; }
SLOTLAR=${1//,/ }
IDLER=""
for s in $SLOTLAR; do
  id=${s#*:}
  f=$BURA/docs/isler/12-dort-reels/fisler/$id.md
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
    BASARI="$BASARI $id"
  else
    echo "$id: üretim başarısız"
  fi
done
unset ANAHTAR
echo "== ses toplamı $(harcanan) \$; üretilen:$BASARI"

if [ -n "$BASARI" ]; then
  cd "$WT" || exit 1
  gece-claude 3 '/goal docs/isler/12-dort-reels/SPEC.md PAKET denetimini yap. Videolar: '"$KOK"'/<id>/final.mp4, id listesi:'"$BASARI"'. Her videonun her sahnesinin sonundan ffmpeg ile bir kare al (sahne sınırı: ses.json + fis.md), Read ile bak; yazı taşması, öğe çakışması, altyazının çizimi örtmesi, boş kalan sahne ara. Hata varsa yalnız tools/cizim-kod/dort-reels.mjs ya da docs/isler/12-dort-reels/fisler/<id>.md içinde sablon alanını düzelt (metin ve aciklama_taslagi rakamlarını değiştirme), `bash tools/gece-12.sh tek <id>` ile yeniden render et; bu komut ücretsizdir, ses önbellekten gelir. Hata verirse ses çağrısı denemeye kalkma. Sosyal-panel .env dosyalarını okuma; hat paylas, hat tablo, Zernio yasak; agir kullanma; port açma. Bitti: her sahne incelendi (video başına sahne sayısı raporda), kalan hata 0; dar commit gece-iht-12 dalında (git add -- <yollar>, git commit --only -- <yollar>); docs/isler/12-dort-reels/RAPOR.md ilk satırı "Durum: bitti", altında video başına tek satır bulgu. Ya da 8 turda dur, ilk satır "Durum: yarım", kalan aynı dosyada. Soru sorma; karar gerekiyorsa RAPOR.md içine "Karar: ..." yaz.'
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
cp "$ANA/docs/isler/12-dort-reels/SPEC.md" "$TESLIM/SPEC.md"
[ -f "$WT/docs/isler/12-dort-reels/RAPOR.md" ] && cp "$WT/docs/isler/12-dort-reels/RAPOR.md" "$TESLIM/RAPOR.md"

git -C "$WT" push -u origin "$DAL" || echo "push başarısız"
echo "== $(TZ=Europe/Istanbul date '+%F %T') bitti; ses $(harcanan) \$; eksik:${EKSIK:- yok}"
[ -z "$EKSIK" ]
