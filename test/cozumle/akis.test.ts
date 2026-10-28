// Kaynak: viral-uyarla/test/cozumle/akis.test.ts (335b436)
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { hedefiCozumle, type AkisBagimlilik } from "../../src/cozumle/akis.ts";
import { hedefleriBul, yerelKimlik } from "../../src/cozumle/hedefler.ts";
import { kosuYollari } from "../../src/ortak/kosu.ts";
import { analizSema, dokumSema } from "../../src/ortak/tipler.ts";
import { yazJson } from "../../src/ortak/dosya.ts";
import { agyBagimliligi, modelYaniti, ok, zarf, ornekDokum, type Cagri } from "./yardimci.ts";

let kok: string;
let eskiKok: string | undefined;
beforeEach(() => {
  kok = mkdtempSync(path.join(os.tmpdir(), "vu-akis-"));
  eskiKok = process.env.HAT_KOSU_KOK;
  process.env.HAT_KOSU_KOK = path.join(kok, "kosular");
});
afterEach(() => {
  if (eskiKok === undefined) delete process.env.HAT_KOSU_KOK;
  else process.env.HAT_KOSU_KOK = eskiKok;
  rmSync(kok, { recursive: true, force: true });
});

/** ffprobe/python/agy'yi komut adına göre taklit eden koşucu. */
function sahteAraclar(agyYaniti: string[] = [zarf(modelYaniti())]) {
  const cagrilar: Cagri[] = [];
  const agyHazir = [...agyYaniti];
  const kosucu: AkisBagimlilik["kosucu"] = async (komut, args, secenek = {}) => {
    cagrilar.push({ komut, args, secenek });
    if (komut === "ffprobe") return ok("19.5\n");
    if (komut.endsWith("python3") || komut === "python3") {
      writeFileSync(args.at(-1)!, JSON.stringify(ornekDokum()));
      return ok("en: 2 segment");
    }
    if (komut === "agy") {
      // agy çalışırken video kopyası klasörde olmalı
      expect(existsSync(path.join(secenek.cwd!, "video.mp4"))).toBe(true);
      return ok(agyHazir.shift()!);
    }
    throw new Error(`beklenmeyen komut ${komut}`);
  };
  return { kosucu, cagrilar };
}

function bag(kosucu: AkisBagimlilik["kosucu"], gunluk: string[] = []): AkisBagimlilik {
  return { kosucu, ortam: {}, gunluk: (s) => gunluk.push(s), agy: agyBagimliligi(kosucu) };
}

function yerelVideo(): string {
  const yol = path.join(kok, "ornek.mp4");
  writeFileSync(yol, "sahte-video-baytlari");
  return yol;
}

describe("çözümleme akışı (yerel video)", () => {
  it("dokum.json + analiz.json yazar, şemaya uyar; --sakla yoksa kaynak.mp4 silinir, agy kopyası kalmaz", async () => {
    const { kosucu, cagrilar } = sahteAraclar();
    const [hedef] = await hedefleriBul("deneme", { video: yerelVideo() });
    expect(hedef!.id).toBe("yerel-ornek");
    const analiz = await hedefiCozumle("deneme", hedef!, { sakla: false, yeniden: false }, bag(kosucu));
    const yol = kosuYollari("deneme").aday("yerel-ornek");
    expect(dokumSema.safeParse(JSON.parse(await readFile(yol.dokum, "utf8"))).success).toBe(true);
    const yazilan = analizSema.parse(JSON.parse(await readFile(yol.analiz, "utf8")));
    expect(yazilan).toEqual(analiz);
    expect(yazilan.adayId).toBe("yerel-ornek");
    expect(yazilan.sureSn).toBe(19.5);
    expect(existsSync(yol.kaynakVideo)).toBe(false);
    expect(existsSync(path.join(yol.calisma, "agy"))).toBe(false);
    // döküm agy istemine VERİ olarak girdi
    const agy = cagrilar.find((c) => c.komut === "agy")!;
    expect(agy.secenek.girdi).toContain("Example tool lets you build an app");
  });

  it("--sakla ile kaynak.mp4 kalır", async () => {
    const { kosucu } = sahteAraclar();
    const [hedef] = await hedefleriBul("deneme", { video: yerelVideo(), id: "yerel-v23" });
    await hedefiCozumle("deneme", hedef!, { sakla: true, yeniden: false }, bag(kosucu));
    expect(existsSync(kosuYollari("deneme").aday("yerel-v23").kaynakVideo)).toBe(true);
  });

  it("agy hatasında kaynak ve döküm yeniden deneme için kalır; ikinci koşuda whisper atlanır", async () => {
    const ilk = sahteAraclar([JSON.stringify({ response: "bozuk" }), JSON.stringify({ response: "yine bozuk" })]);
    const [hedef] = await hedefleriBul("deneme", { video: yerelVideo(), id: "yerel-hata" });
    await expect(hedefiCozumle("deneme", hedef!, { sakla: false, yeniden: false }, bag(ilk.kosucu))).rejects.toThrow(/geçersiz/);
    const yol = kosuYollari("deneme").aday("yerel-hata");
    expect(existsSync(yol.kaynakVideo)).toBe(true);
    expect(existsSync(yol.dokum)).toBe(true);
    expect(existsSync(yol.analiz)).toBe(false);

    const ikinci = sahteAraclar();
    const gunluk: string[] = [];
    await hedefiCozumle("deneme", { id: "yerel-hata" }, { sakla: false, yeniden: false }, bag(ikinci.kosucu, gunluk));
    expect(ikinci.cagrilar.some((c) => c.komut.includes("python"))).toBe(false);
    expect(gunluk.join("\n")).toMatch(/whisper atlandı/);
    expect(existsSync(yol.analiz)).toBe(true);
    expect(existsSync(yol.kaynakVideo)).toBe(false);
  });

  it("indirilemeyen adayda sebepler ve elle çıkış yolu söylenir", async () => {
    const { kosucu } = sahteAraclar();
    const hedef = { id: "tiktok-7600000000000000001", videoUrl: "https://evil.example/v.mp4", sayfaUrl: "https://evil.example/p" };
    const h = await hedefiCozumle("deneme", hedef, { sakla: false, yeniden: false }, bag(kosucu)).catch((x: Error) => x);
    expect((h as Error).message).toMatch(/videoUrl: .*izinli değil/);
    expect((h as Error).message).toMatch(/yt-dlp: .*yalnız TikTok/);
    expect((h as Error).message).toMatch(/--video/);
  });
});

describe("hedefler", () => {
  it("yerel kimlik dosya adından türetilir", () => {
    expect(yerelKimlik("/a/b/Benim Video (1).mp4")).toBe("yerel-Benim-Video-1");
    expect(yerelKimlik("/a/b/!!!.mp4")).toBe("yerel-video");
    expect(yerelKimlik("/a/b/x.mp4", "yerel-v23")).toBe("yerel-v23");
  });

  it("--id secim.json'dan, yoksa tara.json'dan; --ilk secim.json'dan; geçersiz kimlik reddedilir", async () => {
    const yol = kosuYollari("k1");
    const aday = (id: string) => ({ id, platform: "tiktok", url: `https://www.tiktok.com/@a/video/${id.split("-")[1]}`, hesap: "a", izlenme: 5, yayinTarihi: "2026-09-01T00:00:00.000Z", arama: "x", videoUrl: "https://v.tiktokcdn.com/a.mp4", aciklama: "açıklama" });
    await yazJson(yol.tara, [aday("tiktok-111"), aday("tiktok-222")]);
    await yazJson(yol.secim, [{ ...aday("tiktok-111"), sira: 1, puan: 5, neden: "x" }, { ...aday("tiktok-333"), sira: 2, puan: 4, neden: "y" }]);
    expect((await hedefleriBul("k1", { id: "tiktok-222" }))[0]).toMatchObject({ id: "tiktok-222", videoUrl: "https://v.tiktokcdn.com/a.mp4", aciklama: "açıklama" });
    expect((await hedefleriBul("k1", { ilk: 1 })).map((h) => h.id)).toEqual(["tiktok-111"]);
    await expect(hedefleriBul("k1", { id: "tiktok-999" })).rejects.toThrow(/içinde değil|içinde/);
    await expect(hedefleriBul("k1", { video: "/x.mp4", id: "../kaçış" })).rejects.toThrow(/Geçersiz aday id/);
    await expect(hedefleriBul("k1", {})).rejects.toThrow(/Hedef gerekli/);
    await expect(hedefleriBul("yok", { ilk: 2 })).rejects.toThrow(/sec/);
  });
});
