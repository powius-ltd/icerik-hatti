/**
 * B-roll ara kesidini sahne planına uygular: atanan sahnelerin kalıbı `broll` olur, klip ön kırpması istekleri döner.
 * Hesapta `broll` yoksa plan aynen kalır (fişte `broll:` satırı varsa açık hata: sessizce yutulmaz).
 */
import path from "node:path";
import type { Kosucu } from "../cozumle/surec-tipleri.ts";
import type { Fis } from "../fis/sema.ts";
import type { Plan } from "./render/plan.ts";
import type { KesimIstegi } from "./render/klip-kes.ts";
import { kliplerBul } from "./render/klip-tara.ts";
import type { BrollAyari } from "./render/tema.ts";
import { brollAta } from "./yon/broll.ts";
import { kirp } from "./yon/metin.ts";
import type { PlanSonucu } from "./sahne-plani.ts";

export interface BrollSonucu {
  plan: Plan;
  kalipler: PlanSonucu["kalipler"];
  /** `hfDir` verilince mutlak çıktı yollarıyla ön kırpma istekleri. */
  kesimler: KesimIstegi[];
}

export async function brollUygula(fis: Fis, planSonucu: PlanSonucu, ayar: BrollAyari | undefined, hfDir: string, kosucu: Kosucu): Promise<BrollSonucu> {
  const bos: BrollSonucu = { plan: planSonucu.plan, kalipler: planSonucu.kalipler, kesimler: [] };
  const acik = fis.sahneler.some((s) => s.broll !== undefined && s.broll !== "yok");
  if (!ayar) {
    if (acik) throw new Error("Fişte broll: seçimi var ama hesapta broll ayarı yok (config/hesaplar/<hesap>.json).");
    return bos;
  }
  const klipler = await kliplerBul(ayar, kosucu);
  const sahneler = planSonucu.plan.scenes.map((s, i) => ({ id: s.id, start: s.start, end: s.end, metin: fis.sahneler[i]!.metin, broll: fis.sahneler[i]!.broll }));
  const atamalar = new Map(brollAta(fis.fis_id, sahneler, klipler).map((a) => [a.sahneId, a]));
  const kesimler: KesimIstegi[] = [];
  const scenes = planSonucu.plan.scenes.map((s, i) => {
    const a = atamalar.get(s.id);
    if (!a) return s;
    kesimler.push({ klip: a.klip.dosya, klipSureSn: a.klip.sureSn, sahneSureSn: s.end - s.start, cikti: path.join(hfDir, "assets", "broll", `${s.id}.mp4`) });
    const baslik = kirp(fis.sahneler[i]!.ekranYazisi, 40);
    return { ...s, kind: "screen" as const, template: "broll", params: { src: `assets/broll/${s.id}.mp4`, ...(baslik && { baslik }) } };
  });
  const kalipler = planSonucu.kalipler.map((k, i) => {
    const a = atamalar.get(planSonucu.plan.scenes[i]!.id);
    return a ? { ...k, template: "broll", neden: `broll ${a.klip.id} (${a.neden})` } : k;
  });
  return { plan: { ...planSonucu.plan, scenes }, kalipler, kesimler };
}
