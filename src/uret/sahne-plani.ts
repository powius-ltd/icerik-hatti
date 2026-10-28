/**
 * Fiş + sesin kelime zamanları → render planı. Sahne = bir ses parçası: fiş sahnesinin `metin`'i sesin ardışık kelime aralığıdır;
 * sahne süresi o aralığın süresidir (sınır, iki sahne arası sessizliğin ortası). Ses tek çağrıda üretilir, sınırlar kelime sayısından çıkar.
 */
import type { Fis } from "../fis/sema.ts";
import { harfAnahtari, kalipEsle, kelimeler, type KelimeAraligi } from "./kalip-esle.ts";
import type { Plan } from "./render/plan.ts";
import type { KonusKelime } from "./render/kelimeler.ts";

const yuvarla = (n: number): number => Math.round(n * 1000) / 1000;

/** Sesi okunacak tek metin: sahne metinleri sırayla, tek boşlukla birleşik. */
export function okunusMetni(fis: Fis): string {
  return fis.sahneler.map((s) => kelimeler(s.metin).join(" ")).join(" ");
}

/** Her fiş sahnesinin sesteki kelime aralığı (bitişik, boşluksuz). */
export function kelimeAraliklari(fis: Fis): KelimeAraligi[] {
  let ilk = 0;
  return fis.sahneler.map((s) => {
    const adet = kelimeler(s.metin).length;
    const a = { ilk, adet };
    ilk += adet;
    return a;
  });
}

/** Sahne sınırları (video saniyesi): ilk sahne 0'da başlar, sonuncusu ses sonunda biter; araları kelimeler arası sessizliğin ortasıdır. */
export function sahneSiniri(sozler: readonly KonusKelime[], araliklar: readonly KelimeAraligi[], sureSn: number): Array<{ start: number; end: number }> {
  const toplam = araliklar.reduce((n, a) => n + a.adet, 0);
  if (toplam !== sozler.length) throw new Error(`Sahnelerin ${toplam} kelimesi var ama ses ${sozler.length} kelime verdi; sahne sınırları kurulamaz.`);
  const baslar = araliklar.map((a, i) => {
    if (i === 0) return 0;
    const onceki = sozler[a.ilk - 1]!;
    const bu = sozler[a.ilk]!;
    return yuvarla(Math.max(onceki.s, Math.min((onceki.e + bu.s) / 2, bu.s)));
  });
  return baslar.map((start, i) => ({ start, end: i + 1 < baslar.length ? baslar[i + 1]! : yuvarla(sureSn) }));
}

/** Vurgulanacak kelimeler: sahnenin ekran yazısındaki (≥ 4 harf) kelimeler ve sayılar; sahne başına en çok ikisi. */
export function vurgular(ekranYazisi: string, sozler: readonly string[], ilk: number): number[] {
  const hedef = new Set(kelimeler(ekranYazisi).map(harfAnahtari).filter((k) => k.length >= 4));
  const bulunan: number[] = [];
  sozler.forEach((k, i) => {
    if (bulunan.length < 2 && (hedef.has(harfAnahtari(k)) || /\d/.test(k))) bulunan.push(ilk + i);
  });
  return bulunan;
}

export interface PlanSonucu {
  plan: Plan;
  /** Sahne başına seçilen kalıp ve nedeni. */
  kalipler: Array<{ no: number; template: string; neden: string }>;
}

export function planKur(fis: Fis, sozler: readonly KonusKelime[], sureSn: number): PlanSonucu {
  const araliklar = kelimeAraliklari(fis);
  const sinirlar = sahneSiniri(sozler, araliklar, sureSn);
  const emphasis: number[] = [];
  const kalipler: PlanSonucu["kalipler"] = [];
  const scenes = fis.sahneler.map((s, i) => {
    const a = araliklar[i]!;
    const secim = kalipEsle(s, a);
    emphasis.push(...vurgular(s.ekranYazisi, kelimeler(s.metin), a.ilk));
    kalipler.push({ no: s.no, template: secim.template, neden: secim.neden });
    const { start, end } = sinirlar[i]!;
    return { id: `s${s.no}`, start, end, kind: secim.kind, template: secim.template, params: secim.params };
  });
  const plan: Plan = { size: { w: 1080, h: 1920 }, captions: { emphasis, display: {}, groupStarts: araliklar.map((a) => a.ilk) }, scenes };
  return { plan, kalipler };
}
