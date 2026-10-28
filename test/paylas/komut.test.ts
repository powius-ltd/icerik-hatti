import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { GonderiSonucu, ZernioIstemci } from "../../src/paylas/istemci.ts";
import { paylas, PaylasHatasi, type Bagimliliklar } from "../../src/paylas/komut.ts";
import { SaatHatasi, zamanlamaKur } from "../../src/paylas/zaman.ts";

const SIMDI = new Date("2026-10-28T10:00:00Z"); // İstanbul 13:00
let klasor: string;
let video: string;
let aciklama: string;
let fis: string;

function sahteIstemci(olusan?: GonderiSonucu, durumlar: { status: string }[] = []) {
  const i = {
    hesaplar: vi.fn(async () => [{ _id: "acc1", platform: "instagram", username: "patron", isActive: true }]),
    presign: vi.fn(async () => ({ uploadUrl: "https://depo/up", publicUrl: "https://cdn/v.mp4" })),
    yukle: vi.fn(async () => {}),
    gonderiOlustur: vi.fn(async () => olusan ?? ({ kind: "created", httpStatus: 201, state: { postId: "p1", status: "publishing" } } as GonderiSonucu)),
    gonderiSil: vi.fn(async () => {}),
    gonderiDurumu: vi.fn(async () => ({ postId: "p1", ...(durumlar.shift() ?? { status: "published" }), instagram: { permalink: "https://www.instagram.com/reel/ABC/" } })),
  };
  return i satisfies ZernioIstemci;
}

function bagimlilik(i: ZernioIstemci, ek: Partial<Bagimliliklar> = {}) {
  const satirlar: string[] = [];
  const bag: Bagimliliklar = {
    env: { ZERNIO_API_KEY_PATRON: "gizli" },
    istemciKur: () => i,
    simdi: () => SIMDI,
    videoBilgisi: () => undefined,
    yaz: (s) => satirlar.push(s),
    yokla: { bekle: async () => {} },
    ...ek,
  };
  return { bag, satirlar };
}

beforeEach(() => {
  klasor = mkdtempSync(join(tmpdir(), "paylas-"));
  video = join(klasor, "v1.mp4");
  aciklama = join(klasor, "aciklama.txt");
  fis = join(klasor, "fis.md");
  writeFileSync(video, "sahte-video");
  writeFileSync(aciklama, "Merhaba #test");
  writeFileSync(fis, '---\nfis_id: a1\nhesap: patron\nfis_onay: evet\npaylasim_onay: evet\ndurum: uretildi\nvideo: v1.mp4\naciklama_taslagi: |\n  Fişten açıklama #hat\n---\n\n# Senaryo\n');
});

describe("kuru koşu (varsayılan)", () => {
  it("hesabı okur, gövdeyi yazdırır, yükleme ve gönderi yapmaz", async () => {
    const i = sahteIstemci();
    const { bag, satirlar } = bagimlilik(i);
    await paylas(["--video", video, "--aciklama", aciklama], bag);
    expect(i.hesaplar).toHaveBeenCalledOnce();
    expect(i.presign).not.toHaveBeenCalled();
    expect(i.gonderiOlustur).not.toHaveBeenCalled();
    const cikti = satirlar.join("\n");
    expect(cikti).toContain("KURU KOŞU");
    expect(cikti).toContain("@patron");
    expect(cikti).toContain('"publishNow": true');
    expect(cikti).not.toContain("gizli");
  });
  it("fiş kipi: açıklama fişin aciklama_taslagi'ndan, video fişin yanından", async () => {
    const { bag, satirlar } = bagimlilik(sahteIstemci());
    await paylas(["--fis", fis], bag);
    expect(satirlar.join("\n")).toContain("Fişten açıklama #hat");
  });
  it("--saat: zamanlanmış gövde (scheduledFor + timezone)", async () => {
    const { bag, satirlar } = bagimlilik(sahteIstemci());
    await paylas(["--video", video, "--aciklama", aciklama, "--saat", "2026-10-30 18:30"], bag);
    const cikti = satirlar.join("\n");
    expect(cikti).toContain('"scheduledFor": "2026-10-30T18:30:00"');
    expect(cikti).toContain('"timezone": "Europe/Istanbul"');
    expect(cikti).not.toContain("publishNow");
  });
});

describe("kapılar", () => {
  it("onaysız: gerçek gönderim yok (kuru koşu)", async () => {
    const i = sahteIstemci();
    await paylas(["--fis", fis], bagimlilik(i).bag);
    expect(i.gonderiOlustur).not.toHaveBeenCalled();
  });
  it("yanlış dosya adı: red, ağa yazılmaz", async () => {
    const i = sahteIstemci();
    await expect(paylas(["--video", video, "--aciklama", aciklama, "--onay", "baska.mp4"], bagimlilik(i).bag)).rejects.toThrow(/dosya adı olmalı \(v1\.mp4\)/);
    expect(i.presign).not.toHaveBeenCalled();
  });
  it('fişte paylasim_onay "evet" değilse red', async () => {
    writeFileSync(fis, readFileSync(fis, "utf8").replace("paylasim_onay: evet", "paylasim_onay: hayir"));
    const i = sahteIstemci();
    await expect(paylas(["--fis", fis, "--onay", "v1.mp4"], bagimlilik(i).bag)).rejects.toThrow(/paylasim_onay: evet/);
    expect(i.presign).not.toHaveBeenCalled();
  });
  it("geçmiş saat: red (kuru koşuda bile)", async () => {
    const i = sahteIstemci();
    await expect(paylas(["--video", video, "--aciklama", aciklama, "--saat", "2026-10-28 12:00"], bagimlilik(i).bag)).rejects.toThrow(/geçmişte/);
    expect(i.hesaplar).not.toHaveBeenCalled();
  });
  it("anahtar yoksa red, genel ZERNIO_API_KEY kullanılmaz", async () => {
    const { bag } = bagimlilik(sahteIstemci(), { env: { ZERNIO_API_KEY: "genel" } });
    await expect(paylas(["--video", video, "--aciklama", aciklama], bag)).rejects.toThrow(/ZERNIO_API_KEY_PATRON/);
  });
  it("Instagram bağlı değilse red", async () => {
    const i = sahteIstemci();
    i.hesaplar.mockResolvedValueOnce([]);
    await expect(paylas(["--video", video, "--aciklama", aciklama], bagimlilik(i).bag)).rejects.toThrow(PaylasHatasi);
  });
});

describe("gerçek gönderim (sahte Zernio)", () => {
  it("onaylı: yükle → gönder → publishing→published yoklaması → fişe yaz", async () => {
    const i = sahteIstemci(undefined, [{ status: "publishing" }]);
    const { bag, satirlar } = bagimlilik(i);
    await paylas(["--fis", fis, "--onay", "v1.mp4"], bag);
    expect(i.presign).toHaveBeenCalledOnce();
    expect(i.gonderiOlustur).toHaveBeenCalledOnce();
    expect(i.gonderiDurumu).toHaveBeenCalledTimes(2);
    expect(satirlar.join("\n")).toContain("YAYINLANDI");
    const metin = readFileSync(fis, "utf8");
    expect(metin).toContain("durum: paylasildi");
    expect(metin).toContain('zernio_post_id: "p1"');
    expect(metin).toContain('yayin_url: "https://www.instagram.com/reel/ABC/"');
  });
  it("zamanlı gönderim scheduled dönünce yoklamadan başarı sayılır", async () => {
    const i = sahteIstemci({ kind: "created", httpStatus: 201, state: { postId: "p2", status: "scheduled" } });
    const { bag, satirlar } = bagimlilik(i);
    await paylas(["--fis", fis, "--onay", "v1.mp4", "--saat", "2026-10-30 18:30"], bag);
    expect(satirlar.join("\n")).toContain("ZAMANLANDI");
    expect(i.gonderiDurumu).not.toHaveBeenCalled();
    expect(readFileSync(fis, "utf8")).toContain('zernio_post_id: "p2"');
  });
  it("duplicate: hata, fiş değişmez", async () => {
    const onceki = readFileSync(fis, "utf8");
    const i = sahteIstemci({ kind: "duplicate", existingPostId: "p0" });
    await expect(paylas(["--fis", fis, "--onay", "v1.mp4"], bagimlilik(i).bag)).rejects.toThrow(/24 saatte/);
    expect(readFileSync(fis, "utf8")).toBe(onceki);
  });
  it("failed: hata, fiş değişmez", async () => {
    const onceki = readFileSync(fis, "utf8");
    const i = sahteIstemci(undefined, [{ status: "failed" }]);
    await expect(paylas(["--fis", fis, "--onay", "v1.mp4"], bagimlilik(i).bag)).rejects.toThrow(/gönderi başarısız/);
    expect(readFileSync(fis, "utf8")).toBe(onceki);
  });
  it("paylaşılmış fiş ikinci kez gönderilmez", async () => {
    writeFileSync(fis, readFileSync(fis, "utf8").replace("durum: uretildi", "durum: paylasildi"));
    const i = sahteIstemci();
    await expect(paylas(["--fis", fis, "--onay", "v1.mp4"], bagimlilik(i).bag)).rejects.toThrow(/zaten paylaşılmış/);
  });
});

describe("zamanlamaKur", () => {
  it("İstanbul saati UTC+3 ile karşılaştırılır", () => {
    expect(zamanlamaKur("2026-10-28 13:01", SIMDI)).toBe("2026-10-28T13:01:00");
    expect(() => zamanlamaKur("2026-10-28 13:00", SIMDI)).toThrow(SaatHatasi);
  });
  it("geçersiz biçim ve takvim reddedilir", () => {
    expect(() => zamanlamaKur("28.10.2026 18:00", SIMDI)).toThrow(/biçimi/);
    expect(() => zamanlamaKur("2026-02-30 18:00", SIMDI)).toThrow(/geçerli bir tarih/);
  });
});
