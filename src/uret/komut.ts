/**
 * uret --fis <fis.md> [--ses elevenlabs|chatterbox] [--render] [--yeniden-ses] [--karakter-tavan N]
 * Onaylı fişten 9:16 video (patron klon sesi, kelime vurgulu altyazı), kapak.png ve aciklama.txt üretir; fişin klasörüne yazar.
 * --render olmadan: ses + sayfa + `hyperframes check` + açıklama (video yok, fiş durumu değişmez).
 * Ortam: ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID, (isteğe bağlı) ELEVENLABS_MODEL. Ücretli: ses çağrısı yalnız önbellekte yoksa.
 */
import { parseArgs } from "node:util";
import { calistir as surecCalistir } from "../ortak/surec.ts";
import { uret } from "./akis.ts";
import { KARAKTER_TAVANI, saglayiciKur } from "./ses/sentez.ts";

const KULLANIM = `Kullanım: npm run hat -- uret --fis <fis.md> [--ses elevenlabs|chatterbox] [--render] [--yeniden-ses] [--karakter-tavan N]
  Çıktı (fişin klasörüne): ses.mp3, hf/, final.mp4, kapak.png, aciklama.txt; fişe durum: uretildi, video, kapak yazılır.
  --render yoksa video üretilmez (ses + sayfa + check + açıklama).`;

export async function calistir(argv: string[]): Promise<void> {
  const { values } = parseArgs({
    args: argv,
    options: { fis: { type: "string" }, ses: { type: "string" }, render: { type: "boolean" }, "yeniden-ses": { type: "boolean" }, "karakter-tavan": { type: "string" }, yardim: { type: "boolean" } },
  });
  if (values.yardim) return console.log(KULLANIM);
  if (!values.fis) throw new Error(`--fis zorunlu.\n${KULLANIM}`);
  const tavan = values["karakter-tavan"] === undefined ? KARAKTER_TAVANI : Number(values["karakter-tavan"]);
  if (!Number.isInteger(tavan) || tavan <= 0) throw new Error("--karakter-tavan pozitif tam sayı olmalı.");
  const { saglayici, sesId } = saglayiciKur(values.ses ?? "elevenlabs");
  const s = await uret(
    { fisYolu: values.fis, saglayici, sesId, render: values.render === true, yeniden: values["yeniden-ses"] === true, karakterTavani: tavan },
    { kosucu: surecCalistir, gunluk: (satir) => console.log(`  ${satir}`) },
  );
  console.log(`tamam: ${s.klasor}\n  süre ${s.sureSn} sn, ${s.karakter} karakter${s.cagriYapildi ? " (ElevenLabs çağrıldı)" : " (ses önbellekten)"}, en büyük altyazısız boşluk ${s.enBuyukBoslukSn} sn${s.final ? `\n  ${s.final}\n  ${s.kapak}` : "\n  render yapılmadı (--render)"}`);
}
