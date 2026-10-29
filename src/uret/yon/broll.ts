/**
 * B-roll ara kesit ataması (deterministik, LLM yok). Hesapta broll tanımlıysa:
 *   kanca      1. sahne            → HK klibi
 *   bölüm başı "Birincisi / İkincisi / … / Son olarak" ile başlayan sahne metni → BR klibi
 *   CTA        son sahne           → BR klibi
 * Fişteki sahne `broll:` satırı ezer (klip kimliği; `yok` = bu sahnede kapalı). Aynı videoda aynı klip iki kez kullanılmaz;
 * seçim fiş kimliğiyle tohumlanmış sabit sırayla yapılır. Klip sahne süresinden (+ kırpma payı) kısaysa atlanır (döngü yok);
 * uygun klip kalmadıysa sahne kendi kalıbında kalır.
 */
import type { BrollKlip } from "../render/klip-tara.ts";
import { KIRPMA_PAYI_SN } from "../render/klip-kes.ts";

export type BrollNedeni = "kanca" | "bolum" | "cta" | "fis";

export interface BrollSahnesi {
  id: string;
  start: number;
  end: number;
  metin: string;
  /** Fişteki `broll:` satırı. */
  broll?: string | undefined;
}

export interface BrollAtamasi {
  sahneId: string;
  klip: BrollKlip;
  neden: BrollNedeni;
}

const SIRALAR = "birinci|ikinci|üçüncü|dördüncü|beşinci|altıncı|yedinci|sekizinci|dokuzuncu|onuncu";
// "Üçüncüsünün adı …" (iyelik + tamlayan) ve "Ve son olarak …" de bölüm başıdır.
const BOLUM_BASI = new RegExp(`^(?:ve\\s+)?(?:(?:${SIRALAR})(?:si|sı|su|sü)?(?:nin|nın|nun|nün)?|son olarak)(?![\\p{L}])`, "u");

/** Sahne metni bölüm başı mı ("Birincisi, …", "İkincisi …", "Son olarak, …"). */
export function bolumBasiMi(metin: string): boolean {
  return BOLUM_BASI.test(metin.trim().toLocaleLowerCase("tr"));
}

function fnv(s: string): number {
  let h = 2166136261;
  for (const c of s) h = Math.imul(h ^ c.codePointAt(0)!, 16777619) >>> 0;
  return h;
}

/** Tohumlu, sabit karıştırma (mulberry32); girdi sırası kimliğe göre sabitlenir. */
function karistir(klipler: readonly BrollKlip[], tohum: string): BrollKlip[] {
  const liste = [...klipler].sort((a, b) => a.id.localeCompare(b.id));
  let a = fnv(tohum);
  const rnd = (): number => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = liste.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [liste[i], liste[j]] = [liste[j]!, liste[i]!];
  }
  return liste;
}

export function brollAta(fisId: string, sahneler: readonly BrollSahnesi[], klipler: readonly BrollKlip[]): BrollAtamasi[] {
  const kimlikle = new Map(klipler.map((k) => [k.id, k]));
  const kullanilan = new Set<string>();
  const sonuc = new Map<string, BrollAtamasi>();
  const gerekenSn = (s: BrollSahnesi): number => s.end - s.start + KIRPMA_PAYI_SN;

  // 1) Fişteki açık seçimler (önce yer ayrılır ki otomatik atama onlarla çakışmasın).
  for (const s of sahneler) {
    if (s.broll === undefined || s.broll === "yok") continue;
    const klip = kimlikle.get(s.broll);
    if (!klip) throw new Error(`Sahne ${s.id}: broll ${s.broll} arşivde yok.`);
    if (kullanilan.has(klip.id)) throw new Error(`Sahne ${s.id}: broll ${klip.id} fişte birden çok sahnede seçilmiş.`);
    if (klip.sureSn < gerekenSn(s)) throw new Error(`Sahne ${s.id}: broll ${klip.id} ${klip.sureSn.toFixed(1)} sn, sahne ${gerekenSn(s).toFixed(1)} sn gerektiriyor.`);
    kullanilan.add(klip.id);
    sonuc.set(s.id, { sahneId: s.id, klip, neden: "fis" });
  }

  // 2) Kurala göre kalanlar; havuz başına tek sabit sıra.
  const havuz = { HK: karistir(klipler.filter((k) => k.id.startsWith("HK-")), `${fisId}/HK`), BR: karistir(klipler.filter((k) => k.id.startsWith("BR-")), `${fisId}/BR`) };
  sahneler.forEach((s, i) => {
    if (s.broll !== undefined) return;
    const neden: BrollNedeni | undefined = i === 0 ? "kanca" : bolumBasiMi(s.metin) ? "bolum" : i === sahneler.length - 1 ? "cta" : undefined;
    if (!neden) return;
    const klip = havuz[neden === "kanca" ? "HK" : "BR"].find((k) => !kullanilan.has(k.id) && k.sureSn >= gerekenSn(s));
    if (!klip) return;
    kullanilan.add(klip.id);
    sonuc.set(s.id, { sahneId: s.id, klip, neden });
  });
  return sahneler.flatMap((s) => sonuc.get(s.id) ?? []);
}
