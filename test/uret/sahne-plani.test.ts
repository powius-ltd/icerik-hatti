import { describe, expect, it } from "vitest";
import { cizimEsle } from "../../src/uret/yon/esle.ts";
import { cizimBaslikBoyu } from "../../src/uret/render/cizim.ts";
import { fisOku } from "../../src/fis/sema.ts";
import { kelimeAraliklari, okunusMetni, planKur, sahneSiniri, vurgular } from "../../src/uret/sahne-plani.ts";
import type { KonusKelime } from "../../src/uret/render/kelimeler.ts";

const FIS = fisOku(`---
fis_id: t-1
kaynak: { tur: metin }
hesap: varsayilan
fis_onay: evet
paylasim_onay: hayir
durum: onaylandi
sahneler:
  - { no: 1, basSn: 0, sonSn: 2, tur: grafik, ekranYazisi: "BİLİYOR MUYDUN?", konum: ust, metin: "Birinci cümle burada. Yoksa bölünür mü?" }
  - { no: 2, basSn: 2, sonSn: 5, tur: grafik, ekranYazisi: "Her ay 2.000 mesaj", konum: orta, metin: "Ayda 2.000 mesaj hakkın var." }
  - { no: 3, basSn: 5, sonSn: 6, tur: yuz, ekranYazisi: "", konum: yok, metin: "Bitti." }
aciklama_taslagi: "x"
---
`);

/** Her kelimeye 0,4 sn, kelimeler arası 0,1 sn; sahne arasına ek 0,5 sn sessizlik. */
function sahteKelimeler(): KonusKelime[] {
  const sozler = okunusMetni(FIS).split(" ");
  const araliklar = kelimeAraliklari(FIS);
  let t = 0;
  return sozler.map((w, i) => {
    if (araliklar.some((a, j) => j > 0 && a.ilk === i)) t += 0.5;
    const k = { w, s: t, e: t + 0.4 };
    t += 0.5;
    return k;
  });
}

describe("sahne = ses parçası", () => {
  it("okunuş metni sahne metinlerinin birleşimidir; '1.' dönüşümü ya da cümle bölme yok (K24)", () => {
    expect(okunusMetni(FIS)).toBe("Birinci cümle burada. Yoksa bölünür mü? Ayda 2.000 mesaj hakkın var. Bitti.");
    expect(okunusMetni(FIS)).not.toMatch(/\b1\./);
  });

  it("kelime aralıkları bitişik ve eksiksizdir; toplamı sesin kelime sayısıdır", () => {
    const a = kelimeAraliklari(FIS);
    expect(a).toEqual([{ ilk: 0, adet: 6 }, { ilk: 6, adet: 5 }, { ilk: 11, adet: 1 }]);
    expect(a.reduce((n, x) => n + x.adet, 0)).toBe(okunusMetni(FIS).split(" ").length);
  });

  it("sahne sınırları kesintisiz örter: ilk 0'da, son ses sonunda; her sahne kendi ilk kelimesini içerir", () => {
    const sozler = sahteKelimeler();
    const sure = sozler.at(-1)!.e + 0.2;
    const sinir = sahneSiniri(sozler, kelimeAraliklari(FIS), sure);
    expect(sinir[0]!.start).toBe(0);
    expect(sinir.at(-1)!.end).toBeCloseTo(sure, 3);
    sinir.forEach((b, i) => {
      if (i > 0) expect(b.start).toBe(sinir[i - 1]!.end);
      const a = kelimeAraliklari(FIS)[i]!;
      expect(b.start).toBeLessThanOrEqual(sozler[a.ilk]!.s);
      expect(b.end).toBeGreaterThanOrEqual(sozler[a.ilk + a.adet - 1]!.e);
    });
  });

  it("sesin kelime sayısı sahnelerinkiyle tutmuyorsa para harcanmış olsa bile açık hatayla durur", () => {
    expect(() => sahneSiniri(sahteKelimeler().slice(1), kelimeAraliklari(FIS), 9)).toThrow(/12 kelimesi var ama ses 11 kelime/);
  });

  it("planKur: sahne sayısı fişle aynı, kalıplar tablodan, öbek sınırları sahne başları", () => {
    const sozler = sahteKelimeler();
    const { plan, kalipler } = planKur(FIS, sozler, sozler.at(-1)!.e + 0.2);
    expect(plan.scenes).toHaveLength(FIS.sahneler.length);
    expect(kalipler.map((k) => k.template)).toEqual(["kart", "big-stat", "kart"]);
    expect(plan.captions.groupStarts).toEqual([0, 6, 11]);
    expect(plan.scenes.map((s) => s.id)).toEqual(["s1", "s2", "s3"]);
  });

  it("vurgu: ekran yazısındaki uzun kelimeler ve sayılar, sahne başına en çok iki", () => {
    expect(vurgular("Her ay 2.000 ücretsiz mesaj", ["Ayda", "2.000", "ücretsiz", "mesaj", "hakkın"], 6)).toEqual([7, 8]);
  });
});

describe("çizim sahnesi", () => {
  it("fişte cizim satırı kalıbı cizim yapar, başlık satırları tırnaksız gelir", () => {
    expect(cizimEsle({ no: 4, basSn: 0, sonSn: 2, tur: "grafik", ekranYazisi: '"Tek soru"\nAnaliz hazır\nfazla', konum: "orta", metin: "Sor.", cizim: "s4.png" }, "s4.png")).toMatchObject({ template: "cizim", params: { src: "assets/cizim/s4.png", satirlar: ["Tek soru", "Analiz hazır"] } });
  });
  it("başlık boyu uzun satırda küçülür", () => {
    expect(cizimBaslikBoyu(["28 reklam"])).toBe(92);
    expect(cizimBaslikBoyu(["Neredeyse kimse: ne zaman ne değişir"])).toBe(54);
  });
});
