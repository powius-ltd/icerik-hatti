/**
 * fis --video <yol> | --url <link> | --metin <dosya.md> [--kosu <ad>] [--id <ad>] [--hesap <slug>] [--yeniden] [--dil <kod>] [--uzerine]
 * Çıktı: kosular/<kosu>/<id>/{kaynak.mp4, dokum.json, analiz.json, fis.md}. `--metin` çözümlemeyi atlar.
 * Ortam: CLAUDE_BIN, CLAUDE_MODEL, CLAUDE_TIMEOUT_MS, YTDLP_BIN, HAT_KOSU_KOK.
 */
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { agyAyariOku } from "../cozumle/agy.ts";
import { argumanlar, kosuYollari } from "../ortak/kosu.ts";
import { calistir as surecCalistir } from "../ortak/surec.ts";
import { claudeSor } from "./claude.ts";
import { girisCoz, girisHazirla } from "./giris.ts";
import { fisOku } from "./sema.ts";
import { fisUret } from "./uret.ts";
import { fisMd } from "./yaz.ts";

const KULLANIM = `Kullanım: npm run hat -- fis --video <yol> | --url <link> | --metin <dosya.md> [--kosu <ad>] [--id <ad>] [--hesap <slug>] [--yeniden] [--dil <kod>] [--uzerine]
  Çıktı: kosular/<kosu>/<id>/fis.md (fis_onay: hayir). Var olan onaylı/ilerlemiş fişin üstüne yazmak için --uzerine.`;

export async function calistir(argv: string[]): Promise<void> {
  const { bayrak } = argumanlar(argv);
  if (bayrak.yardim) return console.log(KULLANIM);
  const giris = girisCoz(bayrak);
  const kosu = typeof bayrak.kosu === "string" ? bayrak.kosu : "varsayilan";
  const ortam = process.env;
  const bag = {
    kosucu: surecCalistir,
    ortam,
    gunluk: (satir: string) => console.log(`  ${satir}`),
    agy: { kosucu: surecCalistir, bekle: (ms: number) => new Promise<void>((coz) => setTimeout(coz, ms)), ayar: agyAyariOku(ortam) },
  };

  console.log(giris.tur === "metin" ? "[1/2] hazır metin okunuyor (çözümleme atlandı)…" : "[1/2] kaynak çözümleniyor…");
  const g = await girisHazirla(giris, kosu, typeof bayrak.id === "string" ? bayrak.id : undefined, bag, {
    yeniden: bayrak.yeniden === true,
    dil: typeof bayrak.dil === "string" ? bayrak.dil : undefined,
  });
  const yol = kosuYollari(kosu).aday(g.id);

  const mevcut = await stat(yol.fis).then(() => true).catch(() => false);
  if (mevcut && bayrak.uzerine !== true) {
    const onceki = fisOku(await readFile(yol.fis, "utf8"));
    if (onceki.fis_onay === "evet" || onceki.durum !== "taslak") {
      throw new Error(`${yol.fis} zaten onaylı ya da ilerlemiş (durum: ${onceki.durum}); ezmek için --uzerine ver.`);
    }
  }

  console.log("[2/2] claude -p ile birebir uyarlama fişi yazılıyor…");
  const hesap = typeof bayrak.hesap === "string" ? bayrak.hesap : "varsayilan";
  const sonuc = await fisUret({ id: g.id, kaynak: g.kaynak, hesap, analiz: g.analiz, dokum: g.dokum, metin: g.metin }, claudeSor);
  await mkdir(yol.kok, { recursive: true });
  await writeFile(yol.fis, fisMd(sonuc.fis, sonuc.dogrulanacak), "utf8");
  console.log(`yazıldı: ${yol.fis}\n${sonuc.fis.sahneler.length} sahne${g.analiz ? ` (kaynak ${g.analiz.sahneler.length})` : ""}, doğrulanacak iddia: ${sonuc.dogrulanacak.length}, düzeltme turu: ${sonuc.duzeltmeTuru}`);
}
