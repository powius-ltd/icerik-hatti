import { describe, expect, it } from "vitest";
import { fisOku, GORSEL_YONLER, type FisSahne } from "../../src/fis/sema.ts";
import { yonSatiri } from "../../src/fis/yaz.ts";
import { fisMd } from "../../src/fis/yaz.ts";
import { kalipEsle } from "../../src/uret/kalip-esle.ts";
import { etkinYon, yonEsle } from "../../src/uret/yon/esle.ts";
import { cumleler, ikonBul, kirp, logoBul, vurguKelime } from "../../src/uret/yon/metin.ts";
import { planKur, okunusMetni } from "../../src/uret/sahne-plani.ts";
import { composePage } from "../../src/uret/render/sayfa.ts";
import { logoSvg } from "../../src/uret/render/logo.ts";
import { belirtecleriDenetle, temaYukle } from "../../src/uret/render/tema.ts";
import { toWords, type KonusKelime } from "../../src/uret/render/kelimeler.ts";

const s = (o: Partial<FisSahne>): FisSahne => ({ no: 1, basSn: 0, sonSn: 6, tur: "grafik", ekranYazisi: "Claude ile 2.000 mesaj", konum: "ust", metin: "Claude ile başla. Önce kurulumu yap, sonra ayda 2.000 mesaj yaz!", ...o });
const A = { ilk: 10, adet: 12 };
const B = { sira: 3, toplam: 8 };

describe("yön → kalıp eşlemesi", () => {
  it("her yön kendi kalıbına eşler", () => {
    const beklenen: Record<string, string> = { sohbet: "sohbet", terminal: "terminal", "rakam-kart": "rakam-kart", editoryal: "editoryal" };
    for (const [yon, kalip] of Object.entries(beklenen)) expect(yonEsle(yon as never, s({}), A, B).template).toBe(kalip);
  });

  it("karma tek sahnede içeriğe bakar: sayılı yazı rakam-kart, düz yazı editoryal, metin boşsa kart", () => {
    const sayili = s({ metin: "Ayda 2.000 mesaj hakkın var." });
    expect(yonEsle("karma", sayili, A, B).template).toBe("rakam-kart");
    expect(yonEsle("karma", sayili, A, { sira: 1, toplam: 8 }).template).toBe("editoryal"); // kanca
    expect(yonEsle("karma", s({ ekranYazisi: "Kurallar", metin: "Kuralları bil." }), A, B).template).toBe("editoryal");
    expect(yonEsle("karma", s({ ekranYazisi: "", metin: "Claude ile başla." }), A, B)).toMatchObject({ template: "editoryal", params: { baslik: "Claude ile başla." } });
    expect(yonEsle("karma", s({ ekranYazisi: "", metin: " " }), A, B).template).toBe("kart");
  });

  it("sohbet: ben balonu ekran yazısı, ai balonları cümleler; kelime sırası artan ve sahne içinde", () => {
    const k = yonEsle("sohbet", s({}), A, B);
    const m = (k.params as { mesajlar: Array<{ kim: string; word: number; metin: string }> }).mesajlar;
    expect(m[0]).toMatchObject({ kim: "ben", metin: "Claude ile 2.000 mesaj" });
    expect(m.slice(1).every((x) => x.kim === "ai")).toBe(true);
    m.forEach((x, i) => {
      expect(x.word).toBeGreaterThanOrEqual(A.ilk);
      expect(x.word).toBeLessThan(A.ilk + A.adet);
      if (i > 0) expect(x.word).toBeGreaterThan(m[i - 1]!.word);
    });
  });

  it("terminal: komut ekran yazısıdır, yazı yoksa adım etiketi; cümleler ✓ satırı olur", () => {
    expect(yonEsle("terminal", s({}), A, B).params).toMatchObject({ komut: "Claude ile 2.000 mesaj" });
    expect(yonEsle("terminal", s({ ekranYazisi: "" }), A, B).params).toMatchObject({ komut: "adim 3/8" });
    const satirlar = (yonEsle("terminal", s({}), A, B).params as { satirlar: Array<{ tur: string }> }).satirlar;
    expect(satirlar.length).toBe(2);
    expect(satirlar.every((x) => x.tur === "ok")).toBe(true);
  });

  it("rakam-kart: tek sayı sayaç olur, araç adı logo olur, sayı yoksa adım numarası", () => {
    expect(yonEsle("rakam-kart", s({}), A, B).params).toMatchObject({ sayi: 2000, logo: "claude", adim: 3, toplam: 8, startWord: 10 });
    const yok = yonEsle("rakam-kart", s({ ekranYazisi: "Kurulum", metin: "Dosyayı aç, sonra çalıştır." }), A, B);
    expect(yok.params).not.toHaveProperty("sayi");
    expect(yok.params).not.toHaveProperty("logo");
    expect(yok.params).toMatchObject({ ikon: "file", baslik: "Kurulum" });
    expect(yonEsle("rakam-kart", s({ ekranYazisi: "2024 yılında" }), A, B).params).not.toHaveProperty("sayi");
  });

  it("editoryal: yazı varsa başlık o, vurgu başlıkta geçen sayı ya da uzun kelime; yazı yoksa ilk cümle başlık", () => {
    expect(yonEsle("editoryal", s({}), A, B).params).toMatchObject({ baslik: "Claude ile 2.000 mesaj", vurgu: "2.000", adim: 3 });
    const yaziSiz = yonEsle("editoryal", s({ ekranYazisi: "", metin: "Hepsi çok basit. İkinci cümle burada." }), A, B);
    expect(yaziSiz.params).toMatchObject({ baslik: "Hepsi çok basit.", alt: "İkinci cümle burada." });
  });

  it("boş metinli sahne her yönde kart'a düşer (boş kutu yok)", () => {
    for (const yon of ["sohbet", "terminal", "rakam-kart", "editoryal"] as const) {
      const k = yonEsle(yon, s({ metin: "   ", ekranYazisi: "" }), A, B);
      expect(k.template).toBe("kart");
      expect(k.params).toMatchObject({ text: "" });
    }
  });

  it("kuralına uymayan sahne de kart'a düşer (tek kelimelik sahnede rakam-kart)", () => {
    expect(yonEsle("rakam-kart", s({ metin: "Evet." }), { ilk: 0, adet: 1 }, B).template).toBe("kart");
  });

  it("sahne `yon` fişin yönünü ezer; hiçbiri yoksa eski davranış", () => {
    expect(etkinYon(s({ yon: "editoryal" }), "sohbet")).toBe("editoryal");
    expect(etkinYon(s({}), "sohbet")).toBe("sohbet");
    expect(etkinYon(s({}))).toBeUndefined();
    // eski fiş (yön yok) kalipEsle ile birebir aynı
    expect(yonEsle(undefined, s({ ekranYazisi: "" }), A, B)).toEqual(kalipEsle(s({ ekranYazisi: "" }), A));
  });
});

const FIS_MD = (ek: string, sahneEk = "") => `---
fis_id: t-1
kaynak: { tur: metin }
hesap: varsayilan
${ek}fis_onay: evet
paylasim_onay: hayir
durum: onaylandi
sahneler:
  - { no: 1, basSn: 0, sonSn: 2, tur: grafik, ekranYazisi: "BİLİYOR MUYDUN?", konum: ust, metin: "Birinci cümle burada. Sonra devam eder."${sahneEk} }
  - { no: 2, basSn: 2, sonSn: 5, tur: grafik, ekranYazisi: "Her ay 2.000 mesaj", konum: orta, metin: "Ayda 2.000 mesaj hakkın var." }
aciklama_taslagi: "x"
---
`;

describe("fiş şeması ve plan", () => {
  it("eski fiş (gorsel_yon yok) geçerli; plan karma kalıpları verir", () => {
    const fis = fisOku(FIS_MD(""));
    expect(fis.gorsel_yon).toBeUndefined();
    const sozler: KonusKelime[] = okunusMetni(fis).split(" ").map((w, i) => ({ w, s: i * 0.5, e: i * 0.5 + 0.4 }));
    const { kalipler } = planKur(fis, sozler, sozler.length * 0.5);
    expect(kalipler.map((k) => k.template)).toEqual(["kart", "big-stat"]);
    expect(kalipler.every((k) => k.yon === "eski")).toBe(true);
  });

  it("gorsel_yon her sahneye uygulanır, sahne yon'ü yalnız o sahneyi çeker", () => {
    const fis = fisOku(FIS_MD("gorsel_yon: editoryal\nyon_gerekce: fikir ağırlıklı\n", ", yon: terminal"));
    expect(fis.yon_gerekce).toBe("fikir ağırlıklı");
    const sozler: KonusKelime[] = okunusMetni(fis).split(" ").map((w, i) => ({ w, s: i * 0.5, e: i * 0.5 + 0.4 }));
    const { kalipler } = planKur(fis, sozler, sozler.length * 0.5);
    expect(kalipler.map((k) => k.template)).toEqual(["terminal", "editoryal"]);
  });

  it("geçersiz yön reddedilir; yön listesi beş seçenektir", () => {
    expect(() => fisOku(FIS_MD("gorsel_yon: neon\n"))).toThrow(/gorsel_yon/);
    expect(GORSEL_YONLER).toEqual(["sohbet", "terminal", "rakam-kart", "editoryal", "karma"]);
  });

  it("fiş gövdesindeki 'Sana düşen' görsel yön satırı öneriyi, gerekçeyi ve seçenekleri söyler; gidiş-dönüş bozulmaz", () => {
    const fis = fisOku(FIS_MD("gorsel_yon: terminal\nyon_gerekce: adım adım kurulum anlatıyor\n"));
    const md = fisMd(fis, []);
    expect(md).toContain("Görsel yön: terminal — adım adım kurulum anlatıyor (seçenekler: sohbet · terminal · rakam-kart · editoryal · karma) — değiştirmek için `gorsel_yon:` satırını düzelt");
    expect(md.indexOf("Görsel yön")).toBeLessThan(md.indexOf("## Okuma metni"));
    expect(fisOku(md)).toEqual(fis);
    expect(yonSatiri(fisOku(FIS_MD("")))).toContain("Görsel yön: karma (varsayılan)");
  });
});

describe("metin yardımcıları", () => {
  it("cümleler kelime sırasını korur; kırpma kelime ortasında kesmez", () => {
    const c = cumleler("Bir iki üç. Dört beş? Altı");
    expect(c).toEqual([{ metin: "Bir iki üç.", sira: 0 }, { metin: "Dört beş?", sira: 3 }, { metin: "Altı", sira: 5 }]);
    expect(kirp("Merhaba dünya nasılsın bugün", 18)).toBe("Merhaba dünya…");
    expect(kirp("kısa", 18)).toBe("kısa");
  });
  it("logo, ikon ve vurgu seçimi", () => {
    expect(logoBul("ChatGPT ile Gemini")).toBe("openai");
    expect(logoBul("hiçbiri")).toBeUndefined();
    expect(ikonBul("5 dakikada")).toBe("clock");
    expect(vurguKelime("Hepsi 3 adımda")).toBe("3");
    expect(vurguKelime("on iki")).toBeUndefined();
  });
});

describe("sayfa ve tema", () => {
  const sozler: KonusKelime[] = Array.from({ length: 40 }, (_, i) => ({ w: `k${i}`, s: i * 0.4, e: i * 0.4 + 0.3 }));

  it("her yönün kalıbı AISCALE temasıyla sayfa üretir; marka köşede, sabit renk yok", async () => {
    const tema = await temaYukle("varsayilan");
    expect(tema.marka).toBe("AISCALE");
    for (const yon of ["sohbet", "terminal", "rakam-kart", "editoryal"] as const) {
      const k = yonEsle(yon, s({}), { ilk: 0, adet: 12 }, B);
      const plan = { size: { w: 1080, h: 1920 }, captions: { emphasis: [], display: {} }, scenes: [{ id: "s1", start: 0, end: 5, kind: k.kind, template: k.template, params: k.params }] };
      const sayfa = await composePage({ plan, words: toWords(sozler, plan.captions), durationSec: 16, theme: tema, audioSrc: "a.wav", hesap: "varsayilan" });
      expect(sayfa.html).toContain(`id="sc-s1"`);
      expect(sayfa.html).toContain("AISCALE");
      expect(sayfa.html).toContain("Poppins");
      const sahneCss = sayfa.html.slice(sayfa.html.indexOf("<style>"), sayfa.html.indexOf("</style>"));
      const govde = sahneCss.slice(sahneCss.indexOf("\n.sc{"));
      expect(govde.replace(/rgba?\([^)]*\)/g, "").match(/#[0-9a-fA-F]{3,8}\b/g)).toBeNull();
    }
  });

  it("rakam-kart araç adı geçince logoyu ortaya koyar", async () => {
    expect(await logoSvg("claude", 100)).toMatch(/^<svg width="100" height="100" fill="currentColor"/);
    await expect(logoSvg("yok", 10)).rejects.toThrow(/Logo dosyası yok/);
    await expect(logoSvg("../x", 10)).rejects.toThrow(/Geçersiz logo/);
  });

  it("temada eksik belirteç anlamlı hatayla durur", async () => {
    const tema = await temaYukle("varsayilan");
    const eksik = { ...tema, tokens: { ...tema.tokens } };
    delete eksik.tokens["accent-soft"];
    expect(() => belirtecleriDenetle(eksik, ".x{color:var(--accent-soft);background:var(--accent)}", "aiscale")).toThrow(/--accent-soft.*config\/hesaplar\/aiscale\.json/);
    expect(() => belirtecleriDenetle(tema, ".x{color:var(--accent-soft)}")).not.toThrow();
    const plan = { size: { w: 1080, h: 1920 }, captions: { emphasis: [], display: {} }, scenes: [{ id: "s1", start: 0, end: 5, kind: "motion" as const, template: "kart", params: { text: "x" } }] };
    await expect(composePage({ plan, words: toWords(sozler, plan.captions), durationSec: 16, theme: eksik, audioSrc: "a.wav", hesap: "aiscale" })).rejects.toThrow(/Tema belirteci eksik \(aiscale\): --accent-soft/);
  });
});
