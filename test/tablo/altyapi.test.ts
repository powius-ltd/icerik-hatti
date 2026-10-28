import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { onayUygula } from "../../src/fis/geri-yaz.ts";
import { driveIstemci } from "../../src/tablo/drive.ts";
import { jetonSaglayici, type Kosucu } from "../../src/tablo/erisim.ts";
import { tabloKur } from "../../src/tablo/kur.ts";
import { kilitAl } from "../../src/tablo/komut.ts";
import { satirKimligi, satirlariCoz, zamanBicimle } from "../../src/tablo/satir.ts";
import { sheetsIstemci } from "../../src/tablo/sheets.ts";
import { SUTUNLAR } from "../../src/tablo/tipler.ts";

const ok = (stdout = "") => ({ kod: 0, stdout, stderr: "" });
const yanit = (govde: unknown, status = 200) => new Response(JSON.stringify(govde), { status });

describe("satır ayrıştırma", () => {
  it("tarih: GG.AA.YYYY SS:DD ve varyantlar İstanbul duvar saatine çevrilir", () => {
    expect(zamanBicimle("30.10.2026 14:30")).toBe("2026-10-30 14:30");
    expect(zamanBicimle("5.1.2027 9:05:00")).toBe("2027-01-05 09:05");
    expect(zamanBicimle("2026-10-30 14:30")).toBe("2026-10-30 14:30");
    expect(() => zamanBicimle("31.02.2026 10:00")).toThrow();
    expect(() => zamanBicimle("yarın akşam")).toThrow(/GG\.AA\.YYYY/);
    expect(() => zamanBicimle("")).toThrow();
  });
  it("satır kimliği yalnız linke bağlı ve aday id kuralına uyar", () => {
    expect(satirKimligi(" https://a/b ")).toBe(satirKimligi("https://a/b"));
    expect(satirKimligi("https://a/b")).toMatch(/^[a-z]+-[A-Za-z0-9_-]+$/);
    expect(satirKimligi("https://a/b")).not.toBe(satirKimligi("https://a/c"));
  });
  it("başlık bozuksa reddedilir; kısa satırlar ve boş link güvenle okunur", () => {
    expect(() => satirlariCoz([["a", "b"]])).toThrow(/başlık/);
    const s = satirlariCoz([[...SUTUNLAR], ["https://x", "", "", "Evet"], [], ["", "30.10.2026 10:00"]]);
    expect(s).toHaveLength(1);
    expect(s[0]).toMatchObject({ no: 2, fisOnay: true, paylasimOnay: false, durum: "" });
  });
});

describe("fiş onay yazımı", () => {
  it("yalnız onay alanlarını değiştirir", () => {
    const md = "---\nfis_onay: hayir\nhesap: a\n---\ngövde\n";
    expect(onayUygula(md, { fis_onay: "evet" })).toBe('---\nfis_onay: "evet"\nhesap: a\n---\ngövde\n');
    expect(() => onayUygula(md, { durum: "x" } as never)).toThrow();
  });
});

describe("Sheets istemcisi", () => {
  it("yalnız hat sütunlarına, hücre bazında RAW yazar; ekip sütununu ve başlığı reddeder", async () => {
    const getir = vi.fn(async () => yanit({}));
    const t = sheetsIstemci({ tabloId: "T1", jeton: async () => "j", getir: getir as never });
    await t.yaz(5, { durum: "zamanlandi", not: "" });
    const [url, init] = getir.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toContain("/T1/values:batchUpdate");
    const g = JSON.parse(init.body as string);
    expect(g.valueInputOption).toBe("RAW");
    expect(g.data.map((d: { range: string }) => d.range)).toEqual(["C5", "I5"]);
    await expect(t.yaz(5, { fis_onay: "evet" } as never)).rejects.toThrow(/hat sütunu değil/);
    await expect(t.yaz(1, { durum: "x" })).rejects.toThrow(/başlık/);
    expect(getir).toHaveBeenCalledOnce();
  });
  it("okuma değerleri metne çevirir; hata iletisinde jeton yok", async () => {
    const t = sheetsIstemci({ tabloId: "T1", jeton: async () => "GIZLI-JETON", getir: (async () => yanit({ values: [["a", 1]] })) as never });
    expect(await t.oku()).toEqual([["a", "1"]]);
    const kotu = sheetsIstemci({ tabloId: "T1", jeton: async () => "GIZLI-JETON", getir: (async () => yanit({ error: { message: "izin yok" } }, 403)) as never });
    await expect(kotu.oku()).rejects.toThrow("Google API 403: izin yok");
    await kotu.oku().catch((e: Error) => expect(e.message).not.toContain("GIZLI"));
  });
});

describe("erişim jetonu", () => {
  const dump = (access: string, expiry: string) => ok(JSON.stringify({ drive: { type: "drive", token: JSON.stringify({ access_token: access, expiry }) } }));
  it("taze jeton doğrudan kullanılır ve önbelleğe alınır", async () => {
    const k = vi.fn(async () => dump("A1", "2026-10-28T12:00:00Z")) as unknown as Kosucu;
    const j = jetonSaglayici(k, () => Date.parse("2026-10-28T10:00:00Z"));
    expect(await j()).toBe("A1");
    expect(await j()).toBe("A1");
    expect(k).toHaveBeenCalledTimes(1);
  });
  it("süresi dolmuşsa rclone'a yenilettirir ve yeniden okur", async () => {
    const cagrilar: string[][] = [];
    let yenilendi = false;
    const k: Kosucu = async (_c, args) => {
      cagrilar.push(args);
      if (args[0] === "about") yenilendi = true;
      return yenilendi ? dump("A2", "2026-10-28T12:00:00Z") : dump("A0", "2026-10-28T09:00:00Z");
    };
    expect(await jetonSaglayici(k, () => Date.parse("2026-10-28T10:00:00Z"))()).toBe("A2");
    expect(cagrilar.map((a) => a[0])).toEqual(["config", "about", "config"]);
  });
  it("yenilenemezse açık hata verir, jeton sızmaz", async () => {
    const k: Kosucu = async () => dump("ESKI-JETON", "2020-01-01T00:00:00Z");
    await expect(jetonSaglayici(k, () => Date.parse("2026-10-28T10:00:00Z"))()).rejects.toThrow(/yenilenemedi/);
    await jetonSaglayici(k, () => Date.parse("2026-10-28T10:00:00Z"))().catch((e: Error) => expect(e.message).not.toContain("ESKI"));
  });
});

describe("Drive yükleme", () => {
  it("copyto sonra link; link boşsa hata", async () => {
    const k = vi.fn(async (_c: string, a: string[]) => (a[0] === "link" ? ok("https://drive.google.com/file/d/X/view\n") : ok())) as unknown as Kosucu;
    expect(await driveIstemci(k).yukle("/t/v.mp4", "satir-1.mp4")).toBe("https://drive.google.com/file/d/X/view");
    expect((k as unknown as ReturnType<typeof vi.fn>).mock.calls.map((c) => c[1][0])).toEqual(["copyto", "link"]);
    expect((k as unknown as ReturnType<typeof vi.fn>).mock.calls[0]![1][2]).toBe("drive:AISCALE_ICERIK_HATTI/videolar/satir-1.mp4");
    await expect(driveIstemci((async () => ok("")) as Kosucu).yukle("/t/v.mp4", "a.mp4")).rejects.toThrow(/link/);
    await expect(driveIstemci(k).yukle("/t/v.mp4", "../kaç.mp4")).rejects.toThrow(/Geçersiz/);
  });
});

describe("tablo kur", () => {
  it("yoksa klasör + tablo + başlık + doğrulama oluşturur; varsa dokunmaz", async () => {
    const urller: string[] = [];
    const getir = (async (url: string, init: RequestInit) => {
      urller.push(`${init.method} ${url}`);
      return yanit(url.includes("/drive/v3/files") ? { id: "NEW" } : {});
    }) as never;
    const k: Kosucu = async (_c, a) => (a[0] === "lsjson" ? ok("[]") : a[0] === "backend" ? ok("KLASOR1\n") : ok());
    const r = await tabloKur({ kosucu: k, jeton: async () => "j", getir, yaz: () => {} });
    expect(r).toEqual({ tabloId: "NEW", yeni: true });
    expect(urller[0]).toContain("drive/v3/files");
    expect(urller.some((u) => u.includes("values:batchUpdate"))).toBe(true);
    expect(urller.some((u) => u.endsWith("NEW:batchUpdate"))).toBe(true);

    const varsa: Kosucu = async (_c, a) => (a[0] === "lsjson" ? ok(JSON.stringify([{ ID: "VAR", Name: "AISCALE İçerik Hattı.xlsx", MimeType: "application/vnd.google-apps.spreadsheet" }])) : ok());
    const getir2 = vi.fn();
    expect(await tabloKur({ kosucu: varsa, jeton: async () => "j", getir: getir2 as never, yaz: () => {} })).toEqual({ tabloId: "VAR", yeni: false });
    expect(getir2).not.toHaveBeenCalled();
  });
});

describe("tur kilidi", () => {
  it("canlı süreç tutuyorsa false, ölüyse devralır", () => {
    const yol = join(mkdtempSync(join(tmpdir(), "kilit-")), "k");
    expect(kilitAl(yol)).toBe(true);
    expect(kilitAl(yol, () => true)).toBe(false);
    writeFileSync(yol, "999999");
    expect(kilitAl(yol, () => false)).toBe(true);
    expect(readFileSync(yol, "utf8")).toBe(String(process.pid));
  });
});
