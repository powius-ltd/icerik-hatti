/** Model yanıtını şemayla ve kaynakla denetler: sahne sayısı/sırası/süresi/ekran yazısı konumu kaynakla aynı olmalı. */
import type { Analiz } from "../ortak/tipler.ts";
import { fisModelSema, type FisModel } from "./sema.ts";

export type DenetimSonucu = { tamam: true; govde: FisModel } | { tamam: false; sorunlar: string[] };

const TOLERANS_SN = 0.15;

export function fisDenetle(ham: unknown, analiz?: Analiz): DenetimSonucu {
  if (ham === undefined) return { tamam: false, sorunlar: ["yanıtta çözümlenebilir bir JSON nesnesi yok"] };
  const sonuc = fisModelSema.safeParse(ham);
  if (!sonuc.success) {
    return { tamam: false, sorunlar: sonuc.error.issues.slice(0, 12).map((s) => `${s.path.join(".") || "(kök)"}: ${s.message}`) };
  }
  const govde = sonuc.data;
  const sorunlar: string[] = [];
  govde.sahneler.forEach((s, i) => {
    if (s.no !== i + 1) sorunlar.push(`sahneler.${i}.no: ${i + 1} olmalı (ardışık), ${s.no} gelmiş`);
    if (s.sonSn <= s.basSn) sorunlar.push(`sahneler.${i}: sonSn basSn'den büyük olmalı`);
    if (s.ekranYazisi === "" && s.konum !== "yok") sorunlar.push(`sahneler.${i}.konum: ekran yazısı yoksa "yok" olmalı`);
    if (s.ekranYazisi !== "" && s.konum === "yok") sorunlar.push(`sahneler.${i}.konum: ekran yazısı varsa "ust", "orta" ya da "alt" olmalı`);
  });
  if (analiz) {
    if (govde.sahneler.length !== analiz.sahneler.length) {
      sorunlar.push(`sahne sayısı kaynakla aynı olmalı: kaynakta ${analiz.sahneler.length}, yanıtta ${govde.sahneler.length}`);
    } else {
      analiz.sahneler.forEach((k, i) => {
        const s = govde.sahneler[i]!;
        if (Math.abs(s.basSn - k.basSn) > TOLERANS_SN || Math.abs(s.sonSn - k.sonSn) > TOLERANS_SN) {
          sorunlar.push(`sahneler.${i}: süre kaynakla aynı olmalı (${k.basSn}–${k.sonSn} sn), yanıtta ${s.basSn}–${s.sonSn}`);
        }
        if (s.tur !== k.tur) sorunlar.push(`sahneler.${i}.tur: kaynakta "${k.tur}", yanıtta "${s.tur}"`);
        const kaynakta = (k.ekranYazisi ?? "").trim() !== "";
        if (kaynakta && s.ekranYazisi.trim() === "") sorunlar.push(`sahneler.${i}.ekranYazisi: kaynak sahnede ekran yazısı var (${JSON.stringify(k.ekranYazisi)}), fişte boş`);
        if (!kaynakta && s.ekranYazisi.trim() !== "") sorunlar.push(`sahneler.${i}.ekranYazisi: kaynak sahnede ekran yazısı yok, fişe eklenmemeli`);
        if (kaynakta && k.ekranYazisiKonum && s.konum !== k.ekranYazisiKonum) {
          sorunlar.push(`sahneler.${i}.konum: kaynakta "${k.ekranYazisiKonum}", yanıtta "${s.konum}"`);
        }
      });
    }
  }
  return sorunlar.length ? { tamam: false, sorunlar } : { tamam: true, govde };
}

/** Denetimden geçen yanıtta süre/tür/konum kaynaktan AYNEN yazılır (model tolerans içinde sapmış olsa da). */
export function kaynagaSabitle(govde: FisModel, analiz: Analiz): FisModel {
  return {
    ...govde,
    sahneler: govde.sahneler.map((s, i) => {
      const k = analiz.sahneler[i]!;
      return { ...s, no: k.no, basSn: k.basSn, sonSn: k.sonSn, tur: k.tur, konum: k.ekranYazisiKonum ?? s.konum };
    }),
  };
}
