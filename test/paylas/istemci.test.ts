// Kaynak: sosyal-panel/src/lib/zernio/publish-client.test.ts + client.test.ts (c960b96)
import { describe, expect, it, vi } from "vitest";

import { reelGovdesiKur, zernioIstemciKur, ZernioHata } from "../../src/paylas/istemci.ts";

const json = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

function istemci(yanitlar: Response[]) {
  const fetchImpl = vi.fn(async () => yanitlar.shift() ?? json(500, {}));
  return { istemci: zernioIstemciKur({ apiKey: "gizli-anahtar", fetchImpl: fetchImpl as unknown as typeof fetch }), fetchImpl };
}
const cagrilar = (f: ReturnType<typeof vi.fn>) => f.mock.calls.map((c) => `${(c[1] as RequestInit).method} ${String(c[0]).replace("https://zernio.com/api/v1", "")}`);

describe("reelGovdesiKur", () => {
  it("zamanlı gönderi: scheduledFor + timezone, publishNow YOK", () => {
    const g = reelGovdesiKur({ caption: "x", mediaUrl: "https://m/v.mp4", accountId: "a1", thumbOffsetMs: 0, scheduledFor: "2026-10-30T18:00:00" });
    expect(g).toMatchObject({ scheduledFor: "2026-10-30T18:00:00", timezone: "Europe/Istanbul", platforms: [{ accountId: "a1", platformSpecificData: { shareToFeed: true, thumbOffset: 0 } }] });
    expect(g).not.toHaveProperty("publishNow");
  });
  it("saat yoksa hemen yayın", () => {
    expect(reelGovdesiKur({ caption: "x", mediaUrl: "u", accountId: "a1", thumbOffsetMs: 0 })).toMatchObject({ publishNow: true });
  });
});

describe("zernioIstemciKur", () => {
  it("hesaplar: GET /accounts", async () => {
    const { istemci: i, fetchImpl } = istemci([json(200, { accounts: [{ _id: "a1", platform: "instagram", username: "patron", isActive: true }] })]);
    await expect(i.hesaplar()).resolves.toEqual([{ _id: "a1", platform: "instagram", username: "patron", isActive: true }]);
    expect(cagrilar(fetchImpl as never)).toEqual(["GET /accounts"]);
  });

  it("sıra: presign → PUT → POST /posts; anahtar imzalı adrese gönderilmez", async () => {
    const { istemci: i, fetchImpl } = istemci([
      json(200, { uploadUrl: "https://storage.example/up?sig=1", publicUrl: "https://cdn.example/v.mp4" }),
      new Response(null, { status: 200 }),
      json(201, { post: { _id: "p1", status: "scheduled", platforms: [{ platform: "instagram", status: "scheduled" }] } }),
    ]);
    const yuva = await i.presign({ filename: "v.mp4", size: 3, contentType: "video/mp4" });
    await i.yukle(yuva.uploadUrl, new Uint8Array([1, 2, 3]), "video/mp4");
    const sonuc = await i.gonderiOlustur(reelGovdesiKur({ caption: "c", mediaUrl: yuva.publicUrl, accountId: "a1", thumbOffsetMs: 0, scheduledFor: "2026-10-30T18:00:00" }));
    expect(cagrilar(fetchImpl as never)).toEqual(["POST /media/presign", "PUT https://storage.example/up?sig=1", "POST /posts"]);
    expect(sonuc).toMatchObject({ kind: "created", httpStatus: 201, state: { postId: "p1", status: "scheduled" } });
    const putBasliklar = ((fetchImpl.mock.calls as unknown as [string, RequestInit][])[1]?.[1]?.headers ?? {}) as Record<string, string>;
    expect(putBasliklar.Authorization).toBeUndefined();
  });

  it("409 hata değil: mevcut gönderi kimliğiyle duplicate döner", async () => {
    const { istemci: i } = istemci([json(409, { error: "dup", details: { existingPostId: "p0" } })]);
    await expect(i.gonderiOlustur(reelGovdesiKur({ caption: "c", mediaUrl: "u", accountId: "a1", thumbOffsetMs: 0 }))).resolves.toEqual({ kind: "duplicate", existingPostId: "p0" });
  });

  it("hata iletisinde anahtar ve gövde yok; yeniden deneme yok", async () => {
    const { istemci: i, fetchImpl } = istemci([json(500, { error: "patladı", email: "kisi@ornek.com" })]);
    const hata = await i.gonderiOlustur(reelGovdesiKur({ caption: "c", mediaUrl: "u", accountId: "a1", thumbOffsetMs: 0 })).catch((e: unknown) => e);
    expect(hata).toBeInstanceOf(ZernioHata);
    expect((hata as Error).message).toContain("500");
    expect((hata as Error).message).not.toContain("gizli-anahtar");
    expect((hata as Error).message).not.toContain("kisi@ornek.com");
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });

  it("gonderiDurumu: liste şekli kimliğe göre seçilir, Instagram girdisi okunur", async () => {
    const govde = { posts: [{ _id: "p0", status: "scheduled" }, { _id: "p1", status: "published", platforms: [{ platform: "instagram", status: "published", platformPostUrl: "https://www.instagram.com/reel/ABC/" }] }] };
    const { istemci: i } = istemci([json(200, govde)]);
    await expect(i.gonderiDurumu("p1")).resolves.toEqual({ postId: "p1", status: "published", instagram: { status: "published", permalink: "https://www.instagram.com/reel/ABC/" } });
  });
});
