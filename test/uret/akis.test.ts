import { mkdtemp, readFile, stat, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import type { Kosucu } from "../../src/cozumle/surec-tipleri.ts";
import { fisOku } from "../../src/fis/sema.ts";
import { uret, uretilebilir } from "../../src/uret/akis.ts";
import { enBuyukBosluk, groupWindow, makeGroups, toWords, type KonusKelime } from "../../src/uret/render/kelimeler.ts";
import { temaYukle } from "../../src/uret/render/tema.ts";
import type { SesSaglayici } from "../../src/uret/ses/saglayici.ts";

const FIS = (onay = "evet") => `---
fis_id: t-1
kaynak: { tur: metin }
hesap: varsayilan
fis_onay: ${onay}
paylasim_onay: hayir
durum: onaylandi
sahneler:
  - { no: 1, basSn: 0, sonSn: 2, tur: grafik, ekranYazisi: "BİLİYOR MUYDUN?", konum: ust, metin: "Birinci cümle burada. Sonra devam eder." }
  - { no: 2, basSn: 2, sonSn: 5, tur: grafik, ekranYazisi: "Her ay 2.000 mesaj", konum: orta, metin: "Ayda 2.000 mesaj hakkın var." }
aciklama_taslagi: "Deneme açıklaması #ai"
---

Gövde yorumu kalır.
`;

function sahteSaglayici(): SesSaglayici & { cagri: number } {
  const s = {
    id: "elevenlabs" as const,
    cagri: 0,
    async konus(istek: { metin: string; sesId: string }) {
      s.cagri += 1;
      const damgalar = istek.metin.split(/\s+/).map((text, i) => ({ text, start: i * 0.5, end: i * 0.5 + 0.4 }));
      return { ses: new Uint8Array([1, 2, 3]), damgalar, model: "m", karakter: istek.metin.length, usd: 0.001 };
    },
  };
  return s;
}

/** ffprobe/ffmpeg/npx sahtesi: ses 6,0 sn, video 1080x1920 ve süre sesten 0,1 sn farklı. */
function sahteKosucu(cagrilar: string[] = []): Kosucu {
  return async (komut, args) => {
    cagrilar.push(`${komut} ${args.slice(0, 2).join(" ")}`);
    const son = args.at(-1)!;
    if (komut === "ffprobe") {
      if (args.includes("json")) return { kod: 0, stderr: "", stdout: JSON.stringify({ streams: [{ width: 1080, height: 1920 }], format: { duration: "6.1" } }) };
      return { kod: 0, stderr: "", stdout: "6.0\n" };
    }
    if (komut === "npx" && args.includes("render")) await writeFile(args[args.indexOf("--output") + 1]!, "mp4");
    if (komut === "ffmpeg" && /\.(png|wav|mp4)$/.test(son)) await writeFile(son, "x");
    if (komut === "ffmpeg" && args.some((a) => a.includes("print_format=json"))) return { kod: 0, stdout: "", stderr: '{"input_i":"-14.1","input_tp":"-1.5","input_lra":"5","input_thresh":"-24","target_offset":"0.1"}' };
    return { kod: 0, stdout: "", stderr: "" };
  };
}

async function kur(onay = "evet"): Promise<string> {
  const dizin = await mkdtemp(path.join(os.tmpdir(), "uret-"));
  const yol = path.join(dizin, "fis.md");
  await writeFile(yol, FIS(onay), "utf8");
  return yol;
}

describe("uret akışı", () => {
  it("onaysız ya da paylaşılmış fiş üretilmez; ses çağrısı yapılmaz", async () => {
    const yol = await kur("hayir");
    const sag = sahteSaglayici();
    await expect(uret({ fisYolu: yol, saglayici: sag, sesId: "v", render: false, brollKok: null }, { kosucu: sahteKosucu(), gunluk: () => {} })).rejects.toThrow(/onaylı değil/);
    expect(sag.cagri).toBe(0);
    expect(() => uretilebilir({ ...fisOku(FIS()), durum: "paylasildi" })).toThrow(/zaten paylaşılmış/);
  });

  it("--render yok: ses + sayfa + açıklama yazılır, fiş durumu değişmez", async () => {
    const yol = await kur();
    const sag = sahteSaglayici();
    const s = await uret({ fisYolu: yol, saglayici: sag, sesId: "v", render: false, brollKok: null }, { kosucu: sahteKosucu(), gunluk: () => {} });
    const klasor = path.dirname(yol);
    expect(s.sureSn).toBe(6);
    expect(await readFile(path.join(klasor, "aciklama.txt"), "utf8")).toBe("Deneme açıklaması #ai\n");
    const html = await readFile(path.join(klasor, "hf", "index.html"), "utf8");
    expect(html).toContain("sc-s1");
    expect(html).toContain("sc-s2");
    expect(html).toContain('data-width="1080" data-height="1920"');
    expect(await readFile(yol, "utf8")).toBe(FIS());
    await expect(stat(path.join(klasor, "final.mp4"))).rejects.toThrow();
  });

  it("--render: final + kapak üretilir, fişe satır düzeyinde durum/video/kapak yazılır, gövde dokunulmaz", async () => {
    const yol = await kur();
    const s = await uret({ fisYolu: yol, saglayici: sahteSaglayici(), sesId: "v", render: true, brollKok: null }, { kosucu: sahteKosucu(), gunluk: () => {} });
    expect(s.final).toBe(path.join(path.dirname(yol), "final.mp4"));
    const fis = await readFile(yol, "utf8");
    expect(fis).toMatch(/^durum: uretildi$/m);
    expect(fis).toMatch(/^video: final\.mp4$/m);
    expect(fis).toMatch(/^kapak: kapak\.png$/m);
    expect(fis).toContain("Gövde yorumu kalır.");
    expect(fisOku(fis).durum).toBe("uretildi");
    await expect(stat(`${s.final}.ham.mp4`)).rejects.toThrow();
  });

  it("aynı metin ikinci koşuda sesi önbellekten alır (ücretli çağrı tekrarlanmaz); --yeniden-ses zorlar", async () => {
    const yol = await kur();
    const sag = sahteSaglayici();
    const bag = { kosucu: sahteKosucu(), gunluk: () => {} };
    await uret({ fisYolu: yol, saglayici: sag, sesId: "v", render: false, brollKok: null }, bag);
    const ikinci = await uret({ fisYolu: yol, saglayici: sag, sesId: "v", render: false, brollKok: null }, bag);
    expect([sag.cagri, ikinci.cagriYapildi]).toEqual([1, false]);
    await uret({ fisYolu: yol, saglayici: sag, sesId: "v", render: false, yeniden: true, brollKok: null }, bag);
    expect(sag.cagri).toBe(2);
  });

  it("karakter tavanı aşılırsa çağrıdan önce durur", async () => {
    const yol = await kur();
    const sag = sahteSaglayici();
    await expect(uret({ fisYolu: yol, saglayici: sag, sesId: "v", render: false, karakterTavani: 20, brollKok: null }, { kosucu: sahteKosucu(), gunluk: () => {} })).rejects.toThrow(/tavan 20/);
    expect(sag.cagri).toBe(0);
  });

  it("render hatasında fişe durum: hata ve tek satırlık not yazılır", async () => {
    const yol = await kur();
    const kosucu: Kosucu = async (komut, args) => (komut === "npx" && args.includes("check") ? { kod: 1, stdout: "", stderr: "bozuk sayfa" } : sahteKosucu()(komut, args));
    await expect(uret({ fisYolu: yol, saglayici: sahteSaglayici(), sesId: "v", render: true, brollKok: null }, { kosucu, gunluk: () => {} })).rejects.toThrow(/HyperFrames check başarısız/);
    const fis = fisOku(await readFile(yol, "utf8"));
    expect(fis.durum).toBe("hata");
    expect(fis.hata_notu).toMatch(/HyperFrames check/);
  });
});

describe("altyazısız boşluk (K26)", () => {
  const kelime = (w: string, s: number): KonusKelime => ({ w, s, e: s + 0.3 });

  it("uzun sessizlikte öbek sonrakinin girişine dek ekranda kalır; boşluk tavanı aşmaz", async () => {
    const tema = await temaYukle("varsayilan");
    // iki sahne arası 3 sn sessizlik, başta 1,5 sn gecikme
    const sozler = [kelime("Bir", 1.5), kelime("iki", 1.9), kelime("üç", 5.5), kelime("dört", 5.9)];
    const plan = { emphasis: [], display: {}, groupStarts: [0, 2] };
    const gruplar = makeGroups(toWords(sozler, plan), plan, tema);
    expect(gruplar.length).toBeGreaterThanOrEqual(2);
    expect(enBuyukBosluk(gruplar, 7, tema)).toBeLessThanOrEqual(1.0);
    const w0 = groupWindow(gruplar, 0, 7, tema);
    expect(w0.start).toBeLessThanOrEqual(1.5 - tema.captions.maxGapSec + 1e-9);
  });
});
