// Kaynak: viral-uyarla/test/cozumle/ffmpeg.test.ts (335b436)
import { mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { agyIcinHazirla, kucultmeArgumanlari, sureOlc } from "../../src/cozumle/ffmpeg.ts";
import { hata, ok, sahteKosucu } from "./yardimci.ts";

const dizin = mkdtempSync(path.join(os.tmpdir(), "vu-ffmpeg-"));
afterAll(() => rmSync(dizin, { recursive: true, force: true }));

describe("ffmpeg yardımcıları", () => {
  it("eşik altındaki video kopyalanır, ffmpeg çağrılmaz", async () => {
    const kaynak = path.join(dizin, "k1.mp4");
    writeFileSync(kaynak, "kucuk");
    const { kosucu, cagrilar } = sahteKosucu([]);
    expect(await agyIcinHazirla(kaynak, path.join(dizin, "h1.mp4"), kosucu, {}, 100)).toEqual({ bayt: 5, kucultuldu: false });
    expect(cagrilar).toHaveLength(0);
    expect(readFileSync(path.join(dizin, "h1.mp4"), "utf8")).toBe("kucuk");
  });

  it("eşiği aşan video 480p'ye küçültülür; küçültülmüş dosya özgünden büyükse özgün kalır", async () => {
    const kaynak = path.join(dizin, "k2.mp4");
    writeFileSync(kaynak, "x".repeat(50));
    const yaz = (n: number) => async (c: { args: string[] }) => (writeFileSync(c.args.at(-1)!, "y".repeat(n)), ok(""));
    const kucuk = sahteKosucu([yaz(10)]);
    expect(await agyIcinHazirla(kaynak, path.join(dizin, "h2.mp4"), kucuk.kosucu, {}, 20)).toEqual({ bayt: 10, kucultuldu: true });
    expect(kucuk.cagrilar[0]!.args.join(" ")).toMatch(/scale=-2:'min\(480,ih\)'/);
    const buyuk = sahteKosucu([yaz(80)]);
    expect(await agyIcinHazirla(kaynak, path.join(dizin, "h3.mp4"), buyuk.kosucu, {}, 20)).toEqual({ bayt: 50, kucultuldu: false });
    expect(statSync(path.join(dizin, "h3.mp4")).size).toBe(50);
  });

  it("ffmpeg hatası ve eksikliği açık bildirilir", async () => {
    const kaynak = path.join(dizin, "k4.mp4");
    writeFileSync(kaynak, "x".repeat(50));
    await expect(agyIcinHazirla(kaynak, path.join(dizin, "h4.mp4"), sahteKosucu([hata(1, "Invalid data")]).kosucu, {}, 20)).rejects.toThrow(/küçültülemedi.*Invalid data/);
    const yok = async (): Promise<never> => {
      throw Object.assign(new Error("spawn ENOENT"), { code: "ENOENT" });
    };
    await expect(agyIcinHazirla(kaynak, path.join(dizin, "h5.mp4"), yok, {}, 20)).rejects.toThrow(/ffmpeg bulunamadı/);
  });

  it("süre ölçümü: ffprobe çıktısı; hata/yokluk → undefined (0 değil)", async () => {
    expect(await sureOlc("/x.mp4", sahteKosucu([ok("59.4501\n")]).kosucu)).toBe(59.45);
    expect(await sureOlc("/x.mp4", sahteKosucu([hata(1, "x")]).kosucu)).toBeUndefined();
    expect(await sureOlc("/x.mp4", sahteKosucu([ok("N/A")]).kosucu)).toBeUndefined();
    expect(kucultmeArgumanlari("/a.mp4", "/b.mp4").slice(-1)).toEqual(["/b.mp4"]);
  });
});
