import { mkdir, mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { Kosucu } from "../../src/cozumle/surec-tipleri.ts";
import { fisOku, fisSahneSema } from "../../src/fis/sema.ts";
import { brollUygula } from "../../src/uret/broll-uygula.ts";
import { uret } from "../../src/uret/akis.ts";
import { toWords, type KonusKelime } from "../../src/uret/render/kelimeler.ts";
import { baslangicSn, KIRPMA_PAYI_SN, klipleriKes, kesimArgumanlari } from "../../src/uret/render/klip-kes.ts";
import { kliplerBul, type BrollKlip } from "../../src/uret/render/klip-tara.ts";
import { composePage } from "../../src/uret/render/sayfa.ts";
import { temaYukle } from "../../src/uret/render/tema.ts";
import { planKur } from "../../src/uret/sahne-plani.ts";
import { bolumBasiMi, brollAta, type BrollSahnesi } from "../../src/uret/yon/broll.ts";

const klip = (id: string, sureSn = 8): BrollKlip => ({ id, dosya: `/k/${id}.mp4`, etiket: "", sureSn });
const HAVUZ: BrollKlip[] = [klip("HK-01"), klip("HK-03"), klip("HK-04"), ...[8, 10, 11, 12, 14, 15, 16, 17, 19, 20].map((n) => klip(`BR-${String(n).padStart(2, "0")}`))];

/** 25 sahne: 1 kanca, 6/11/16/21 "Birincisi…Dördüncüsü", 25 CTA; her sahne 2 sn. */
function sahneler(n = 25): BrollSahnesi[] {
  const bolumler = new Map([[6, "Birincisi, bir şey."], [11, "İkincisi, başka şey."], [16, "Üçüncüsü: üçüncü şey."], [21, "Son olarak, sonuncu."]]);
  return Array.from({ length: n }, (_, i) => ({ id: `s${i + 1}`, start: i * 2, end: i * 2 + 2, metin: bolumler.get(i + 1) ?? "Düz bir cümle." }));
}

describe("bölüm başı tespiti", () => {
  it("Birincisi/İkincisi/…/Son olarak ile başlayanı yakalar, cümle ortasındakini yakalamaz", () => {
    for (const m of ["Birincisi, hızlı.", "İkincisi kolay.", "Üçüncüsü:", "Dördüncüsü bu", "Beşincisi", "Altıncısı", "Son olarak, bitir.", "  Birinci adım", "Üçüncüsünün adı Headroom.", "Ve son olarak Task Observer."]) expect(bolumBasiMi(m)).toBe(true);
    for (const m of ["Bu birincisi değil.", "İkinciler gibi", "Sonra olarak", "Son olaylar"]) expect(bolumBasiMi(m)).toBe(false);
  });
});

describe("brollAta", () => {
  it("25 sahnede yalnız kanca, bölüm başları ve CTA atanır; kanca HK, diğerleri BR", () => {
    const a = brollAta("f1", sahneler(), HAVUZ);
    expect(a.map((x) => `${x.sahneId}:${x.neden}`)).toEqual(["s1:kanca", "s6:bolum", "s11:bolum", "s16:bolum", "s21:bolum", "s25:cta"]);
    expect(a[0]!.klip.id).toMatch(/^HK-/);
    for (const x of a.slice(1)) expect(x.klip.id).toMatch(/^BR-/);
  });

  it("aynı videoda aynı klip yok; aynı fiş kimliği aynı sonucu verir, başka kimlik farklı sıra", () => {
    const a = brollAta("f1", sahneler(), HAVUZ);
    expect(new Set(a.map((x) => x.klip.id)).size).toBe(a.length);
    expect(brollAta("f1", sahneler(), HAVUZ).map((x) => x.klip.id)).toEqual(a.map((x) => x.klip.id));
    expect(brollAta("baska", sahneler(), HAVUZ).map((x) => x.klip.id)).not.toEqual(a.map((x) => x.klip.id));
  });

  it("sabit çıktı (regresyon): f1 tohumu", () => {
    expect(brollAta("f1", sahneler(), HAVUZ).map((x) => x.klip.id)).toMatchInlineSnapshot(`
      [
        "HK-01",
        "BR-11",
        "BR-10",
        "BR-20",
        "BR-16",
        "BR-08",
      ]
    `);
  });

  it("fişteki broll satırı ezer: istenen klip, yok = kapat; ezilen klip otomatik atamada tekrar kullanılmaz", () => {
    const s = sahneler();
    s[2]!.broll = "BR-12"; // 3. sahne normalde atanmaz
    s[0]!.broll = "yok"; // kanca kapalı
    const a = brollAta("f1", s, HAVUZ);
    expect(a.find((x) => x.sahneId === "s1")).toBeUndefined();
    expect(a.find((x) => x.sahneId === "s3")).toMatchObject({ neden: "fis", klip: { id: "BR-12" } });
    expect(a.filter((x) => x.klip.id === "BR-12")).toHaveLength(1);
  });

  it("fişteki geçersiz seçim açık hata verir: bilinmeyen klip, çift kullanım, kısa klip", () => {
    const s = sahneler();
    s[2]!.broll = "BR-99";
    expect(() => brollAta("f1", s, HAVUZ)).toThrow(/BR-99 arşivde yok/);
    s[2]!.broll = "BR-12";
    s[3]!.broll = "BR-12";
    expect(() => brollAta("f1", s, HAVUZ)).toThrow(/birden çok sahnede/);
    s[3]!.broll = undefined;
    expect(() => brollAta("f1", s, [...HAVUZ.filter((k) => k.id !== "BR-12"), klip("BR-12", 2.1)])).toThrow(/gerektiriyor/);
  });

  it("kısa klip atlanır (döngü yok): sahneye yeten başka klip seçilir; hiçbiri yetmezse sahne atanmaz", () => {
    const uzun = sahneler(3).map((s, i) => (i === 0 ? { ...s, end: 7 } : s)); // kanca 7 sn
    const havuz = [klip("HK-01", 5), klip("HK-03", 9), klip("BR-08", 3)];
    const a = brollAta("f1", uzun, havuz);
    expect(a.find((x) => x.sahneId === "s1")!.klip.id).toBe("HK-03");
    expect(a.find((x) => x.sahneId === "s3")!.klip.id).toBe("BR-08");
    expect(brollAta("f1", uzun, [klip("HK-01", 5)])).toEqual([]);
  });

  it("klip yoksa ya da tek sahnede: kanca kazanır, hata yok", () => {
    expect(brollAta("f1", sahneler(), [])).toEqual([]);
    expect(brollAta("f1", sahneler(1), HAVUZ).map((x) => x.neden)).toEqual(["kanca"]);
  });
});

describe("fiş şeması", () => {
  const taban = { no: 1, basSn: 0, sonSn: 1, tur: "grafik", ekranYazisi: "", konum: "yok", metin: "x" };
  it("broll isteğe bağlı; BR-12, HK-01 ve yok geçerli, başkası değil; eski fiş geçerli kalır", () => {
    expect(fisSahneSema.safeParse(taban).success).toBe(true);
    for (const b of ["BR-12", "HK-01", "yok"]) expect(fisSahneSema.safeParse({ ...taban, broll: b }).success).toBe(true);
    for (const b of ["br-12", "XX-1", "", "BR-"]) expect(fisSahneSema.safeParse({ ...taban, broll: b }).success).toBe(false);
  });
});

describe("klip kırpma", () => {
  it("ffmpeg argümanları: orta kırpma, 1080x1920, sessiz, tek girdi; sahne süresi + pay", () => {
    const args = kesimArgumanlari({ klip: "/k/BR-12.mp4", klipSureSn: 10, sahneSureSn: 3, cikti: "/o/s6.mp4" });
    expect(args).toEqual(["-v", "error", "-y", "-ss", "3.4", "-t", "3.2", "-i", "/k/BR-12.mp4", "-vf", "crop=ih*9/16:ih,scale=1080:1920,fps=30", "-an", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "/o/s6.mp4"]);
    expect(args.filter((a) => a === "-i")).toHaveLength(1);
    expect(KIRPMA_PAYI_SN).toBe(0.2);
  });

  it("başlangıç klibin ortasına yakın ve sığar; tam sığan klip 0'dan başlar", () => {
    expect(baslangicSn(12, 4)).toBe(4);
    expect(baslangicSn(4, 4)).toBe(0);
    expect(baslangicSn(3, 4)).toBe(0);
  });

  it("sırayla çalışır, çıktı klasörünü açar; ffmpeg hatası Türkçe tek cümleyle durur", async () => {
    const dizin = await mkdtemp(path.join(os.tmpdir(), "klip-"));
    const cagrilar: string[] = [];
    const ok: Kosucu = async (k, a) => {
      cagrilar.push(`${k}:${a.at(-1)}`);
      return { kod: 0, stdout: "", stderr: "" };
    };
    const ist = (ad: string) => ({ klip: "/k/a.mp4", klipSureSn: 8, sahneSureSn: 2, cikti: path.join(dizin, "assets", "broll", `${ad}.mp4`) });
    await klipleriKes([ist("s1"), ist("s6")], ok);
    expect(cagrilar).toEqual([`ffmpeg:${dizin}/assets/broll/s1.mp4`, `ffmpeg:${dizin}/assets/broll/s6.mp4`]);
    const kotu: Kosucu = async () => ({ kod: 1, stdout: "", stderr: "x\nboom" });
    await expect(klipleriKes([ist("s1")], kotu)).rejects.toThrow(/kesilemedi \(a\.mp4\): boom/);
  });
});

describe("klip tarama", () => {
  it("iki klasörü tarar, kimliği ve etiketi dosya adından çıkarır, süreyi ffprobe'dan okur", async () => {
    const kok = await mkdtemp(path.join(os.tmpdir(), "broll-"));
    await mkdir(path.join(kok, "01_KANCALAR_HOOKS"));
    await mkdir(path.join(kok, "02_ARA_GORUNTU_BROLL"));
    for (const [k, ad] of [["01_KANCALAR_HOOKS", "HK-01_Yuruyen_Adam.mp4"], ["02_ARA_GORUNTU_BROLL", "BR-12_Laptop.mp4"], ["02_ARA_GORUNTU_BROLL", "BR-41_Buggy.mov"], ["02_ARA_GORUNTU_BROLL", "notlar.txt"]] as const) await writeFile(path.join(kok, k, ad), "x");
    const kosucu: Kosucu = async (_k, a) => ({ kod: 0, stdout: `${a.at(-1)!.endsWith(".mov") ? 6 : 9}\n`, stderr: "" });
    const k = await kliplerBul({ kok, yaklasma: 1.04 }, kosucu);
    expect(k.map((x) => [x.id, x.etiket, x.sureSn])).toEqual([["HK-01", "Yuruyen Adam", 9], ["BR-12", "Laptop", 9], ["BR-41", "Buggy", 6]]);
    await expect(kliplerBul({ kok: path.join(kok, "yok"), yaklasma: 1 }, kosucu)).rejects.toThrow(/klasörü bulunamadı/);
  });
});

const FIS = `---
fis_id: t-1
kaynak: { tur: metin }
hesap: varsayilan
fis_onay: evet
paylasim_onay: hayir
durum: onaylandi
sahneler:
  - { no: 1, basSn: 0, sonSn: 2, tur: grafik, ekranYazisi: "BİLİYOR MUYDUN?", konum: ust, metin: "Kanca cümlesi burada." }
  - { no: 2, basSn: 2, sonSn: 5, tur: grafik, ekranYazisi: "Birincisi", konum: orta, metin: "Birincisi, ilk şey." }
  - { no: 3, basSn: 5, sonSn: 6, tur: grafik, ekranYazisi: "", konum: yok, metin: "Orta sahne burada." }
  - { no: 4, basSn: 6, sonSn: 7, tur: yuz, ekranYazisi: "Takip et", konum: yok, metin: "Takip et bitti." }
aciklama_taslagi: "x"
---
`;
const sozler: KonusKelime[] = Array.from({ length: 12 }, (_, i) => ({ w: `k${i}`, s: i * 0.5, e: i * 0.5 + 0.4 }));

describe("plana uygulama ve kalıp", () => {
  const kosucu: Kosucu = async () => ({ kod: 0, stdout: "9\n", stderr: "" });
  async function kokKur(): Promise<string> {
    const kok = await mkdtemp(path.join(os.tmpdir(), "broll-"));
    await mkdir(path.join(kok, "01_KANCALAR_HOOKS"));
    await mkdir(path.join(kok, "02_ARA_GORUNTU_BROLL"));
    for (const [k, ad] of [["01_KANCALAR_HOOKS", "HK-01_A.mp4"], ["02_ARA_GORUNTU_BROLL", "BR-08_B.mp4"], ["02_ARA_GORUNTU_BROLL", "BR-10_C.mp4"], ["02_ARA_GORUNTU_BROLL", "BR-11_D.mp4"]] as const) await writeFile(path.join(kok, k, ad), "x");
    return kok;
  }

  it("broll yoksa plan aynen kalır; fişte seçim varken ayar yoksa açık hata", async () => {
    const fis = fisOku(FIS);
    const ps = planKur(fis, sozler, 6.2);
    const s = await brollUygula(fis, ps, undefined, "/hf", kosucu);
    expect(s.plan).toBe(ps.plan);
    expect(s.kesimler).toEqual([]);
    const secili = fisOku(FIS.replace("konum: ust,", "konum: ust, broll: BR-08,"));
    await expect(brollUygula(secili, planKur(secili, sozler, 6.2), undefined, "/hf", kosucu)).rejects.toThrow(/hesapta broll ayarı yok/);
  });

  it("kanca, bölüm başı ve CTA 'broll' kalıbına döner, orta sahne kalır; kırpma istekleri hf/assets/broll altına", async () => {
    const fis = fisOku(FIS);
    const ps = planKur(fis, sozler, 6.2);
    const s = await brollUygula(fis, ps, { kok: await kokKur(), yaklasma: 1.04 }, "/hf", kosucu);
    expect(s.plan.scenes.map((x) => x.template === "broll")).toEqual([true, true, false, true]);
    expect(s.plan.scenes[0]!.params).toEqual({ src: "assets/broll/s1.mp4", baslik: "BİLİYOR MUYDUN?" });
    expect(s.plan.scenes[2]!.template).toBe(ps.plan.scenes[2]!.template);
    expect(s.kesimler.map((k) => k.cikti)).toEqual(["/hf/assets/broll/s1.mp4", "/hf/assets/broll/s2.mp4", "/hf/assets/broll/s4.mp4"]);
    expect(s.kalipler[0]).toMatchObject({ template: "broll", neden: expect.stringContaining("HK-01") });
  });

  it("kalıp HTML'i: video zamanlı ve sessiz, karartma tema belirteciyle, sabit renk yok; altyazı üstte", async () => {
    const fis = fisOku(FIS);
    const tema = await temaYukle("varsayilan");
    const s = await brollUygula(fis, planKur(fis, sozler, 6.2), { kok: await kokKur(), yaklasma: 1.04 }, "/hf", kosucu);
    const sayfa = await composePage({ plan: s.plan, words: toWords(sozler, s.plan.captions), durationSec: 6.2, theme: tema, audioSrc: "a.wav", hesap: "varsayilan" });
    expect(sayfa.html).toMatch(/<video id="sc-s1-v" class="br-v" src="assets\/broll\/s1\.mp4" data-start="0" data-duration="[\d.]+" data-track-index="1" data-media-start="0" muted playsinline>/);
    expect(sayfa.html).toContain("background:var(--broll-overlay)");
    expect(sayfa.html).toContain("scale:1.04");
    expect(sayfa.html.indexOf('class="br-v"')).toBeLessThan(sayfa.html.indexOf('class="clip cap-g'));
    const css = sayfa.html.slice(sayfa.html.indexOf("<style>"), sayfa.html.indexOf("</style>"));
    const govde = css.slice(css.indexOf("\n.sc{"));
    expect(govde.replace(/rgba?\([^)]*\)/g, "").match(/#[0-9a-fA-F]{3,8}\b/g)).toBeNull();
  });
});

describe("uret akışı + b-roll", () => {
  it("hesapta broll varken klipler kırpılır, sayfa klibi içerir; brollKok: null kapatır", async () => {
    const dizin = await mkdtemp(path.join(os.tmpdir(), "uret-broll-"));
    const kok = await mkdtemp(path.join(os.tmpdir(), "broll-"));
    await mkdir(path.join(kok, "01_KANCALAR_HOOKS"));
    await mkdir(path.join(kok, "02_ARA_GORUNTU_BROLL"));
    await writeFile(path.join(kok, "01_KANCALAR_HOOKS", "HK-01_A.mp4"), "x");
    await writeFile(path.join(kok, "02_ARA_GORUNTU_BROLL", "BR-08_B.mp4"), "x");
    const fisYolu = path.join(dizin, "fis.md");
    await writeFile(fisYolu, FIS.replace(/sahneler:[\s\S]*aciklama/, `sahneler:\n  - { no: 1, basSn: 0, sonSn: 2, tur: grafik, ekranYazisi: "BİLİYOR MUYDUN?", konum: ust, metin: "Birinci cümle burada." }\n  - { no: 2, basSn: 2, sonSn: 5, tur: grafik, ekranYazisi: "Takip et", konum: orta, metin: "Takip et lütfen." }\naciklama`), "utf8");
    const ffmpegCiktilari: string[] = [];
    const kosucu: Kosucu = async (komut, args) => {
      if (komut === "ffprobe") return { kod: 0, stderr: "", stdout: "9\n" };
      if (komut === "ffmpeg" && args.includes("libx264")) ffmpegCiktilari.push(args.at(-1)!);
      if (komut === "ffmpeg" && /\.(wav|mp4)$/.test(args.at(-1)!)) await writeFile(args.at(-1)!, "x");
      return { kod: 0, stdout: "", stderr: "" };
    };
    const saglayici = {
      id: "elevenlabs" as const,
      async konus(istek: { metin: string }) {
        const damgalar = istek.metin.split(/\s+/).map((text, i) => ({ text, start: i * 0.5, end: i * 0.5 + 0.4 }));
        return { ses: new Uint8Array([1]), damgalar, model: "m", karakter: istek.metin.length, usd: 0 };
      },
    };
    const bag = { kosucu, gunluk: () => {} };
    const s = await uret({ fisYolu, saglayici, sesId: "v", render: false, brollKok: kok }, bag);
    expect(ffmpegCiktilari.map((c) => path.basename(c))).toEqual(["s1.mp4", "s2.mp4"]);
    expect(await readFile(path.join(s.hfDir, "index.html"), "utf8")).toContain("assets/broll/s2.mp4");
    ffmpegCiktilari.length = 0;
    await uret({ fisYolu, saglayici, sesId: "v", render: false, brollKok: null, yeniden: true }, bag);
    expect(ffmpegCiktilari).toEqual([]);
  });
});
