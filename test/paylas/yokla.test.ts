import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

import { fisOku } from "../../src/paylas/fis.ts";
import type { ZernioGonderiDurumu } from "../../src/paylas/istemci.ts";
import { fiseDonusYaz, gonderiyiYokla } from "../../src/paylas/yokla.ts";

const sirali = (durumlar: ZernioGonderiDurumu[]) => ({ gonderiDurumu: vi.fn(async () => durumlar.shift() ?? { status: "publishing" }) });
const bekle = vi.fn(async () => {});

describe("gonderiyiYokla", () => {
  it("publishing → publishing → published: ara durum hata değil, permalink döner", async () => {
    const i = sirali([{ status: "publishing" }, { status: "publishing" }, { status: "published", instagram: { status: "published", permalink: "https://www.instagram.com/reel/ABC/" } }]);
    const s = await gonderiyiYokla(i, "p1", { postId: "p1", status: "publishing" }, { bekle });
    expect(s).toEqual({ kind: "tamam", durum: "published", postId: "p1", permalink: "https://www.instagram.com/reel/ABC/" });
    expect(i.gonderiDurumu).toHaveBeenCalledTimes(3);
  });
  it("oluşturma yanıtı zaten scheduled ise yoklamadan başarı", async () => {
    const i = sirali([]);
    expect(await gonderiyiYokla(i, "p1", { status: "scheduled" }, { bekle })).toMatchObject({ kind: "tamam", durum: "scheduled" });
    expect(i.gonderiDurumu).not.toHaveBeenCalled();
  });
  it("failed → basarisiz, Zernio hata metniyle", async () => {
    const i = sirali([{ status: "failed", instagram: { status: "failed", errorMessage: "video reddedildi" } }]);
    expect(await gonderiyiYokla(i, "p1", undefined, { bekle })).toEqual({ kind: "basarisiz", postId: "p1", neden: "video reddedildi" });
  });
  it("3 dk dolunca zaman_asimi ve son durum; 10 sn aralık", async () => {
    const i = sirali([]);
    const b = vi.fn(async () => {});
    const s = await gonderiyiYokla(i, "p1", undefined, { bekle: b });
    expect(s).toEqual({ kind: "zaman_asimi", postId: "p1", sonDurum: "publishing" });
    expect(i.gonderiDurumu).toHaveBeenCalledTimes(18);
    expect(b).toHaveBeenCalledWith(10_000);
  });
});

describe("fiseDonusYaz", () => {
  it("yalnız durum, zernio_post_id, yayin_url değişir; gövde ve diğer alanlar kalır", () => {
    const yol = join(mkdtempSync(join(tmpdir(), "fis-")), "fis.md");
    writeFileSync(yol, "---\nfis_id: x1\nhesap: patron\npaylasim_onay: evet\ndurum: uretildi\naciklama_taslagi: |\n  Merhaba\n---\n\n# Gövde\n");
    fiseDonusYaz(yol, { kind: "tamam", durum: "published", postId: "p9", permalink: "https://www.instagram.com/reel/Z/" });
    const metin = readFileSync(yol, "utf8");
    expect(metin).toContain("durum: paylasildi");
    expect(metin).toContain('zernio_post_id: "p9"');
    expect(metin).toContain('yayin_url: "https://www.instagram.com/reel/Z/"');
    expect(metin).toContain("fis_id: x1");
    expect(metin.endsWith("\n# Gövde\n")).toBe(true);
    expect(fisOku(metin)).toMatchObject({ hesap: "patron", durum: "paylasildi", aciklama_taslagi: "Merhaba" });
  });
});
