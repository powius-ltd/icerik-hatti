// Kaynak: viral-uyarla/test/cozumle/indir.test.ts (335b436)
import { mkdtempSync, readFileSync, rmSync, existsSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { izinliAdres, videoIndir } from "../../src/cozumle/indir.ts";
import { sayfaAdresiMi, ytdlpIndir } from "../../src/cozumle/ytdlp.ts";
import { hata, ok, sahteKosucu } from "./yardimci.ts";

const dizin = mkdtempSync(path.join(os.tmpdir(), "vu-indir-"));
afterAll(() => rmSync(dizin, { recursive: true, force: true }));
const SIMDI = new Date("2026-10-17T12:00:00Z");
const CDN = "https://scontent-ams2-1.cdninstagram.com/o1/v/ornek.mp4?oe=7FFFFFFF&sig=GIZLI";

const video = (icerik = "video-baytlari", tur = "video/mp4", ek: Record<string, string> = {}): Response => new Response(icerik, { status: 200, headers: { "content-type": tur, ...ek } });
const fetchSira = (...yanitlar: Response[]): { fetch: typeof fetch; adresler: string[] } => {
  const adresler: string[] = [];
  const f = (async (u: string) => {
    adresler.push(u);
    const y = yanitlar.shift();
    if (!y) throw new Error("beklenmeyen istek");
    return y;
  }) as unknown as typeof fetch;
  return { fetch: f, adresler };
};

describe("izinli adres", () => {
  it("platform CDN'ini kabul eder", () => {
    expect(izinliAdres(CDN, SIMDI).hostname).toBe("scontent-ams2-1.cdninstagram.com");
    expect(izinliAdres("https://v16-webapp.tiktokcdn.com/a.mp4", SIMDI).hostname).toBe("v16-webapp.tiktokcdn.com");
  });

  it.each([
    ["http://x.cdninstagram.com/a.mp4", /https/],
    ["https://evil.cdninstagram.com.attacker.com/a.mp4", /izinli değil/],
    ["https://notcdninstagram.com/a.mp4", /izinli değil/],
    ["https://cdninstagram.com/a.mp4", /izinli değil/],
    ["https://user:pw@x.cdninstagram.com/a.mp4", /kimlik/],
    ["https://x.cdninstagram.com:8443/a.mp4", /bağlantı noktası/],
    ["https://127.0.0.1/a.mp4", /izinli değil/],
    ["https://x.cdninstagram.com/a.mp4?oe=1", /süresi dolmuş/],
    ["bu bir adres değil", /geçersiz/],
  ])("reddeder: %s", (adres, desen) => {
    expect(() => izinliAdres(adres, SIMDI)).toThrow(desen);
  });
});

describe("videoIndir", () => {
  it("videoyu dosyaya yazar", async () => {
    const hedef = path.join(dizin, "a.mp4");
    const s = fetchSira(video("abc"));
    expect(await videoIndir(CDN, hedef, { fetch: s.fetch, simdi: () => SIMDI })).toBe(3);
    expect(readFileSync(hedef, "utf8")).toBe("abc");
  });

  it("izinli yönlendirmeyi izler, izinsiz yönlendirmeyi reddeder", async () => {
    const yon = (konum: string): Response => new Response(null, { status: 302, headers: { location: konum } });
    const hedef = path.join(dizin, "b.mp4");
    const iyi = fetchSira(yon("https://video.fbcdn.net/b.mp4"), video("xyz"));
    expect(await videoIndir(CDN, hedef, { fetch: iyi.fetch, simdi: () => SIMDI })).toBe(3);
    expect(iyi.adresler[1]).toBe("https://video.fbcdn.net/b.mp4");
    const kotu = fetchSira(yon("https://attacker.example/steal"));
    await expect(videoIndir(CDN, hedef, { fetch: kotu.fetch, simdi: () => SIMDI })).rejects.toThrow(/izinli değil/);
    expect(kotu.adresler).toHaveLength(1); // ikinci istek HİÇ atılmadı
  });

  it("video olmayan yanıtı, tavanı aşan boyutu ve HTTP hatasını reddeder; yarım dosya kalmaz", async () => {
    const hedef = path.join(dizin, "c.mp4");
    await expect(videoIndir(CDN, hedef, { fetch: fetchSira(video("<html>", "text/html")).fetch, simdi: () => SIMDI })).rejects.toThrow(/video değil/);
    await expect(videoIndir(CDN, hedef, { fetch: fetchSira(video("x".repeat(100), "video/mp4", { "content-length": "100" })).fetch, simdi: () => SIMDI, azamiBayt: 10 })).rejects.toThrow(/sınır/);
    await expect(videoIndir(CDN, hedef, { fetch: fetchSira(video("x".repeat(100))).fetch, simdi: () => SIMDI, azamiBayt: 10 })).rejects.toThrow(/sınırını aşıyor/);
    expect(existsSync(hedef)).toBe(false);
    await expect(videoIndir(CDN, hedef, { fetch: fetchSira(new Response("", { status: 403 })).fetch, simdi: () => SIMDI })).rejects.toThrow(/HTTP 403/);
  });

  it("hata iletisine imzalı adres yazılmaz", async () => {
    const s = fetchSira(new Response("", { status: 404 }));
    const h = await videoIndir(CDN, path.join(dizin, "d.mp4"), { fetch: s.fetch, simdi: () => SIMDI }).catch((x: Error) => x);
    expect((h as Error).message).not.toContain("GIZLI");
    expect((h as Error).message).not.toContain("sig=");
  });

  it("ağ hatası net ve adressiz bildirilir", async () => {
    const f = (async () => {
      throw new TypeError("fetch failed https://x.cdninstagram.com/?sig=GIZLI");
    }) as unknown as typeof fetch;
    const h = await videoIndir(CDN, path.join(dizin, "e.mp4"), { fetch: f, simdi: () => SIMDI }).catch((x: Error) => x);
    expect((h as Error).message).toBe("Video indirilemedi (ağ hatası).");
  });
});

describe("yt-dlp yedeği", () => {
  it("yalnız TikTok/Instagram https sayfa adresi", () => {
    expect(sayfaAdresiMi("https://www.tiktok.com/@ornek/video/7600000000000000001")).toBe(true);
    expect(sayfaAdresiMi("https://www.instagram.com/p/DxAmple001/")).toBe(true);
    expect(sayfaAdresiMi("https://evil.example/?u=https://www.tiktok.com/")).toBe(false);
    expect(sayfaAdresiMi("http://www.tiktok.com/@a/video/1")).toBe(false);
    expect(sayfaAdresiMi("file:///etc/passwd")).toBe(false);
  });

  it("argümanlar `--` ayracıyla verilir; env temel; çıkış kodu sıfır değilse açık hata", async () => {
    const hedef = path.join(dizin, "yt.mp4");
    const { kosucu, cagrilar } = sahteKosucu([hata(1, "ERROR: Unable to extract\nlogin required")]);
    await expect(ytdlpIndir("https://www.tiktok.com/@a/video/1", hedef, kosucu, {})).rejects.toThrow(/yt-dlp indiremedi.*login required/);
    expect(cagrilar[0]!.args.slice(-2)).toEqual(["--", "https://www.tiktok.com/@a/video/1"]);
    expect(Object.keys(cagrilar[0]!.secenek.env ?? {}).sort()).toEqual(["HOME", "LANG", "PATH", "TMPDIR"]);
    await expect(ytdlpIndir("https://evil.example/x", hedef, sahteKosucu([ok("")]).kosucu, {})).rejects.toThrow(/yalnız TikTok/);
  });
});
