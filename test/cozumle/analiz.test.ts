// Kaynak: viral-uyarla/test/cozumle/analiz.test.ts (335b436)
import { describe, expect, it } from "vitest";
import { analizEt, anlamsalSorunlar } from "../../src/cozumle/analiz.ts";
import { analizSema } from "../../src/ortak/tipler.ts";
import { agyBagimliligi, modelYaniti, ornekDokum, ok, zarf, sahteKosucu } from "./yardimci.ts";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll } from "vitest";

const dizin = mkdtempSync(path.join(os.tmpdir(), "vu-analiz-"));
afterAll(() => rmSync(dizin, { recursive: true, force: true }));

const girdi = { adayId: "tiktok-7600000000000000001", dizin, videoAdi: "video.mp4", dokum: ornekDokum(), aciklama: "Örnek açıklama", sureSn: 19.5 };

describe("analiz doğrulama + düzeltme akışı", () => {
  it("geçerli yanıt tek çağrıda kabul edilir; adayId eklenir, ölçülen süre yazılır, şemaya uyar", async () => {
    const { kosucu, cagrilar } = sahteKosucu([ok(zarf(modelYaniti()))]);
    const s = await analizEt(girdi, agyBagimliligi(kosucu));
    expect(cagrilar).toHaveLength(1);
    expect(s.istatistik).toEqual({ cagri: 1, kotaYenidenDeneme: 0, duzeltmeTuru: 0 });
    expect(analizSema.safeParse(s.analiz).success).toBe(true);
    expect(s.analiz.adayId).toBe("tiktok-7600000000000000001");
    expect(s.analiz.sureSn).toBe(19.5); // modelin 20'si yerine ffprobe ölçümü
    expect(s.kullanim.toplamToken).toBe(150);
  });

  it("agy argümanları: model, json çıktı, şema, izole klasör, sandbox; istem stdin'de; env yalnız temel", async () => {
    process.env.APIFY_TOKEN = "apify_api_SIZMAMALI";
    try {
      const { kosucu, cagrilar } = sahteKosucu([ok(zarf(modelYaniti()))]);
      await analizEt(girdi, agyBagimliligi(kosucu));
      const c = cagrilar[0]!;
      expect(c.komut).toBe("agy");
      expect(c.args).toEqual(expect.arrayContaining(["--output-format", "json", "--json-schema", path.join(dizin, "response-schema.json"), "--add-dir", dizin, "--sandbox"]));
      expect(c.secenek.cwd).toBe(dizin);
      expect(c.secenek.girdi).toContain("TRUST BOUNDARY");
      expect(Object.keys(c.secenek.env ?? {}).sort()).toEqual(["HOME", "LANG", "PATH", "TMPDIR"]);
      expect(JSON.stringify(c)).not.toContain("SIZMAMALI");
    } finally {
      delete process.env.APIFY_TOKEN;
    }
  });

  it("şemaya uymayan yanıt: tek düzeltme turu, hatalar istemde, ikinci yanıt kabul", async () => {
    const bozuk = modelYaniti();
    delete bozuk.hook;
    bozuk.sahneler = [];
    const { kosucu, cagrilar } = sahteKosucu([ok(zarf(bozuk)), ok(zarf(modelYaniti()))]);
    const s = await analizEt(girdi, agyBagimliligi(kosucu));
    expect(cagrilar).toHaveLength(2);
    expect(s.istatistik.duzeltmeTuru).toBe(1);
    const duzeltme = cagrilar[1]!.secenek.girdi!;
    expect(duzeltme).toContain("CORRECTION");
    expect(duzeltme).toMatch(/hook/);
    expect(duzeltme).toMatch(/sahneler/);
    expect(s.kullanim.toplamToken).toBe(300); // iki turun toplamı
  });

  it("düzeltmeden sonra da geçersizse açık hata verir (üçüncü çağrı yok)", async () => {
    const { kosucu, cagrilar } = sahteKosucu([ok(zarf({ dil: "en" })), ok(zarf({ dil: "en" }))]);
    await expect(analizEt(girdi, agyBagimliligi(kosucu))).rejects.toThrow(/düzeltme turundan sonra da geçersiz/);
    expect(cagrilar).toHaveLength(2);
  });

  it("JSON olmayan metin yanıtı da düzeltme turuna girer; çitli JSON kabul edilir", async () => {
    const metinZarf = (m: string): string => JSON.stringify({ status: "SUCCESS", response: m });
    const { kosucu, cagrilar } = sahteKosucu([ok(metinZarf("Üzgünüm, yapamadım.")), ok(metinZarf(`Buyur:\n\`\`\`json\n${JSON.stringify(modelYaniti())}\n\`\`\``))]);
    const s = await analizEt(girdi, agyBagimliligi(kosucu));
    expect(s.analiz.hook.tur).toBe("iddia");
    expect(cagrilar[1]!.secenek.girdi).toContain("Üzgünüm, yapamadım.");
  });

  it("zamanlaması tutarsız sahneler (çakışma, ters aralık) düzeltme turuna gider", async () => {
    const tutarsiz = modelYaniti();
    (tutarsiz.sahneler as Array<Record<string, number>>)[1]!.basSn = 4; // 1. sahneyle çakışıyor
    const { kosucu, cagrilar } = sahteKosucu([ok(zarf(tutarsiz)), ok(zarf(modelYaniti()))]);
    await analizEt(girdi, agyBagimliligi(kosucu));
    expect(cagrilar[1]!.secenek.girdi).toMatch(/çakışıyor/);
  });

  it("sahne numaraları modelin yazdığına bakmadan 1..n yapılır", async () => {
    const y = modelYaniti();
    (y.sahneler as Array<Record<string, number>>).forEach((s) => (s.no = 7));
    const { kosucu } = sahteKosucu([ok(zarf(y))]);
    const s = await analizEt(girdi, agyBagimliligi(kosucu));
    expect(s.analiz.sahneler.map((x) => x.no)).toEqual([1, 2]);
  });
});

describe("anlamsal kontrol", () => {
  it("geçerli analiz sorunsuz; video süresini aşan son sahne yakalanır", () => {
    const a = analizSema.parse({ adayId: "yerel-x", ...modelYaniti() });
    expect(anlamsalSorunlar(a)).toEqual([]);
    const uzun = { ...a, sahneler: [{ ...a.sahneler[0]!, basSn: 0, sonSn: 40 }] };
    expect(anlamsalSorunlar(uzun).join()).toMatch(/aşıyor/);
  });
});
