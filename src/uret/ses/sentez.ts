// Kaynak: kreatif-studyo/src/production/voice/synthesize.ts + orders/voice.ts (b6aff3d); sağlayıcı seçimi, önbellek ve karakter tavanı eklendi, bütçe/maliyet kaydı yok
/**
 * Ses adımı: fişin okunuş metni TEK çağrıda seslendirilir (`ses.mp3`), kelime zamanları `ses.json`'a yazılır. Sahne sınırları kelime sayısından çıkar (`../sahne-plani.ts`).
 * Para korumaları: karakter tavanı çağrıdan ÖNCE denetlenir; aynı metin + ses için `ses.json` varsa API tekrar çağrılmaz (`yeniden: true` ile zorlanır).
 */
import { createHash } from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { Kosucu } from "../../cozumle/surec-tipleri.ts";
import { temelEnv } from "../../ortak/surec.ts";
import type { KonusKelime } from "../render/kelimeler.ts";
import { damgalariGeriEsle, okunusKur, type SesAyari, type SozlukGirdisi } from "./ayar.ts";
import { createElevenLabsProvider } from "./elevenlabs.ts";
import type { SesSaglayici } from "./saglayici.ts";

export const KARAKTER_TAVANI = 1200;

const SesKaydi = z.object({
  metinHash: z.string(),
  sesId: z.string(),
  saglayici: z.string(),
  model: z.string(),
  karakter: z.number(),
  usd: z.number(),
  sureSn: z.number().positive(),
  kelimeler: z.array(z.object({ w: z.string(), s: z.number(), e: z.number() })).min(1),
});
export type SesKaydi = z.infer<typeof SesKaydi>;

export interface SesGirdisi {
  metin: string;
  klasor: string;
  saglayici: SesSaglayici;
  sesId: string;
  kosucu: Kosucu;
  /** Telaffuz sözlüğü: yalnız sağlayıcıya giden metne uygulanır; `ses.json` kelimeleri gösterim yazımında kalır. */
  sozluk?: readonly SozlukGirdisi[];
  karakterTavani?: number;
  yeniden?: boolean;
  gunluk?: (satir: string) => void;
}

export interface SesSonucu extends SesKaydi {
  mp3: string;
  /** Bu koşuda ücretli çağrı yapıldı mı (önbellekten gelmediyse). */
  cagriYapildi: boolean;
}

const hash = (s: string): string => createHash("sha256").update(s).digest("hex").slice(0, 16);
const var_ = (yol: string): Promise<boolean> => access(yol).then(() => true).catch(() => false);

/** Ses dosyasının süresi (sn); ölçülemezse fırlatır (0 dönmez). */
export async function sureOlc(yol: string, kosucu: Kosucu): Promise<number> {
  const s = await kosucu("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", yol], { env: temelEnv(), timeoutMs: 30_000 });
  const sn = Number(s.stdout.trim());
  if (s.kod !== 0 || !Number.isFinite(sn) || sn <= 0) throw new Error(`${yol}: ses süresi ölçülemedi (ffprobe çıktısı: "${s.stdout.trim()}").`);
  return Math.round(sn * 1000) / 1000;
}

export async function sesUret(g: SesGirdisi): Promise<SesSonucu> {
  const mp3 = path.join(g.klasor, "ses.mp3");
  const json = path.join(g.klasor, "ses.json");
  const okunus = okunusKur(g.metin, g.sozluk);
  // İmza: sağlayıcı + model/ses ayarı + ses + sözlük + gösterim metni; biri değişince eski ses.json kullanılmaz.
  const imza = hash(`${g.saglayici.id}|${g.saglayici.imza ?? ""}|${g.sesId}|${JSON.stringify(g.sozluk ?? [])}|${g.metin}`);
  if (!g.yeniden && (await var_(mp3)) && (await var_(json))) {
    const kayit = SesKaydi.safeParse(JSON.parse(await readFile(json, "utf8")));
    if (kayit.success && kayit.data.metinHash === imza) {
      g.gunluk?.(`ses önbellekte (${kayit.data.karakter} karakter, ${kayit.data.sureSn} sn): API çağrılmadı`);
      return { ...kayit.data, mp3, cagriYapildi: false };
    }
  }
  const tavan = g.karakterTavani ?? KARAKTER_TAVANI;
  if (okunus.metin.length > tavan) throw new Error(`Okunuş metni ${okunus.metin.length} karakter; tavan ${tavan}. Para harcanmadan durdu: fişi kısaltın ya da tavanı bilerek yükseltin.`);
  g.gunluk?.(`${g.saglayici.id} çağrılıyor: ${okunus.metin.length} karakter`);
  const s = await g.saglayici.konus({ metin: okunus.metin, sesId: g.sesId });
  await mkdir(g.klasor, { recursive: true });
  await writeFile(mp3, s.ses);
  const sureSn = await sureOlc(mp3, g.kosucu);
  const kelimeler: KonusKelime[] = damgalariGeriEsle(g.metin, okunus, s.damgalar).map((d) => ({ w: d.text, s: d.start, e: d.end }));
  const son = kelimeler.at(-1)!;
  if (son.e > sureSn + 0.5) throw new Error(`${mp3}: son kelime "${son.w}" ${son.e} sn'de bitiyor ama ses ${sureSn} sn; kelime zamanları ses dosyasını tutmuyor.`);
  const kayit: SesKaydi = { metinHash: imza, sesId: g.sesId, saglayici: g.saglayici.id, model: s.model, karakter: s.karakter, usd: s.usd, sureSn, kelimeler };
  await writeFile(json, `${JSON.stringify(kayit, null, 2)}\n`, "utf8");
  return { ...kayit, mp3, cagriYapildi: true };
}

/**
 * `--ses` bayrağından sağlayıcı fabrikası. Anahtar ve ses kimliği yalnız ortamdan (`ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`).
 * Hesabın ses ayarı fişten sonra bilinir: `kur(ayar)` onunla sağlayıcıyı kurar; `ELEVENLABS_MODEL` verilirse modeli yine ezer.
 */
export function saglayiciKur(ad: string, ortam: NodeJS.ProcessEnv = process.env, fetchImpl?: typeof fetch): { kur: (ayar?: SesAyari) => SesSaglayici; sesId: string } {
  if (ad === "chatterbox") throw new Error("--ses chatterbox bu sürümde bağlı değil (yerel TTS ikinci sürüm); --ses elevenlabs kullanın.");
  if (ad !== "elevenlabs") throw new Error(`Bilinmeyen ses sağlayıcı: ${ad} (elevenlabs).`);
  const sesId = ortam.ELEVENLABS_VOICE_ID?.trim();
  if (!sesId) throw new Error("ELEVENLABS_VOICE_ID tanımlı değil: patron klon sesinin kimliği ortam değişkeninden verilir.");
  const model = ortam.ELEVENLABS_MODEL?.trim();
  const kur = (ayar?: SesAyari): SesSaglayici =>
    createElevenLabsProvider({
      apiKey: ortam.ELEVENLABS_API_KEY ?? "",
      ...(fetchImpl && { fetchImpl }),
      ...((model || ayar?.modelId) && { modelId: model || ayar!.modelId }),
      ...(ayar && { voiceSettings: ayar.settings, usdPer1kChars: ayar.usdPer1kChars }),
    });
  return { kur, sesId };
}
