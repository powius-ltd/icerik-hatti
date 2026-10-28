// Kaynak: viral-uyarla/test/cozumle/agy.test.ts (335b436)
import { describe, expect, it } from "vitest";
import { agyArgumanlari, agyAyariOku, agyCalistir, KOTA_BEKLEMELERI_MS, kotaHatasiMi } from "../../src/cozumle/agy.ts";
import { bulunamadi } from "../../src/cozumle/surec-tipleri.ts";
import { agyBagimliligi, hata, ok, sahteKosucu } from "./yardimci.ts";

const girdi = { dizin: "/tmp/x", semaYolu: "/tmp/x/response-schema.json", istem: "merhaba" };
const yeniIst = () => ({ cagri: 0, kotaYenidenDeneme: 0, duzeltmeTuru: 0 });

describe("agy istemcisi", () => {
  it("ortamdan ayar okur; sandbox yalnız AGY_SANDBOX=off ile kapanır", () => {
    expect(agyAyariOku({})).toMatchObject({ bin: "agy", model: "gemini-3.8-flash-medium", zamanAsimiMs: 480000, sandbox: true });
    expect(agyAyariOku({ AGY_BIN: "/opt/agy", AGY_MODEL: "m", AGY_TIMEOUT_MS: "1000", AGY_SANDBOX: "off" })).toMatchObject({ bin: "/opt/agy", model: "m", zamanAsimiMs: 1000, sandbox: false });
    expect(agyArgumanlari(agyAyariOku({ AGY_SANDBOX: "off" }), girdi)).not.toContain("--sandbox");
    expect(agyArgumanlari(agyAyariOku({ AGY_TIMEOUT_MS: "90000" }), girdi)).toContain("90s");
  });

  it("kota hatasında 8 sn ve 16 sn bekleyip yeniden dener", async () => {
    const bekleme: number[] = [];
    const { kosucu } = sahteKosucu([hata(1, "429 RESOURCE_EXHAUSTED"), hata(1, "quota exceeded"), ok("{}")]);
    const ist = yeniIst();
    expect(await agyCalistir(girdi, agyBagimliligi(kosucu, bekleme), ist)).toBe("{}");
    expect(bekleme).toEqual([...KOTA_BEKLEMELERI_MS]);
    expect(ist).toMatchObject({ cagri: 3, kotaYenidenDeneme: 2 });
  });

  it("kota sürerse üçüncü denemeden sonra vazgeçer; kota dışı hata hemen yükselir", async () => {
    const a = sahteKosucu([hata(1, "429"), hata(1, "429"), hata(1, "429")]);
    await expect(agyCalistir(girdi, agyBagimliligi(a.kosucu, []), yeniIst())).rejects.toThrow(/kota/);
    const b = sahteKosucu([hata(2, "bilinmeyen model")]);
    await expect(agyCalistir(girdi, agyBagimliligi(b.kosucu, []), yeniIst())).rejects.toThrow(/çıkış kodu 2[\s\S]*bilinmeyen model/);
    expect(b.cagrilar).toHaveLength(1);
  });

  it("agy kurulu değilse açık hata", async () => {
    const kosucu = async (): Promise<never> => {
      throw Object.assign(new Error("spawn agy ENOENT"), { code: "ENOENT" });
    };
    await expect(agyCalistir(girdi, agyBagimliligi(kosucu), yeniIst())).rejects.toThrow(/agy bulunamadı/);
    expect(bulunamadi(Object.assign(new Error("x"), { code: "ENOENT" }))).toBe(true);
    expect(kotaHatasiMi("", "ok")).toBe(false);
  });
});
