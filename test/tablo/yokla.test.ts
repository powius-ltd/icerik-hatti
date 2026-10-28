import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { geriYaz } from "../../src/fis/geri-yaz.ts";
import { satirKimligi } from "../../src/tablo/satir.ts";
import { SUTUNLAR, type HatAlani } from "../../src/tablo/tipler.ts";
import { yokla, type Baglam } from "../../src/tablo/yokla.ts";

const SIMDI = new Date("2026-10-28T10:00:00Z"); // İstanbul 13:00
const L1 = "https://www.instagram.com/reel/AAA/";
const L2 = "https://www.instagram.com/reel/BBB/";
const IDX = Object.fromEntries(SUTUNLAR.map((s, i) => [s, i])) as Record<string, number>;
const KULLANICI = [0, 1, 3, 4];

const satir = (o: Partial<Record<(typeof SUTUNLAR)[number], string>>) => SUTUNLAR.map((s) => o[s] ?? "");

const FIS = `---
fis_id: x
hesap: aiscale
fis_onay: hayir
paylasim_onay: hayir
durum: taslak
aciklama_taslagi: "Merhaba #ai"
---
gövde
`;

let kok: string;
let grid: string[][];
let yazimlar: Array<[number, HatAlani]>;
let okuSayisi: number;
let okuKancasi: (n: number) => void;

function sahne(satirlar: string[][]) {
  grid = [[...SUTUNLAR], ...satirlar];
  yazimlar = [];
  okuSayisi = 0;
  okuKancasi = () => {};
}

function baglam(ek: Partial<Baglam> = {}): Baglam & { alt: { fis: ReturnType<typeof vi.fn>; uret: ReturnType<typeof vi.fn>; paylas: ReturnType<typeof vi.fn> }; drive: { yukle: ReturnType<typeof vi.fn> }; iptal: ReturnType<typeof vi.fn> } {
  const alt = {
    fis: vi.fn(async ({ id }: { id: string }) => {
      mkdirSync(join(kok, id), { recursive: true });
      writeFileSync(join(kok, id, "fis.md"), FIS);
    }),
    uret: vi.fn(async (fis: string) => {
      expect(readFileSync(fis, "utf8")).toMatch(/fis_onay: "evet"/); // uretimden once fise onay yazilmis olmali
      writeFileSync(join(fis, "..", "final.mp4"), "x");
      await geriYaz(fis, { durum: "uretildi", video: "final.mp4" });
    }),
    paylas: vi.fn(async () => {}),
  };
  const drive = { yukle: vi.fn(async (_y: string, ad: string) => `https://drive.google.com/file/${ad}`) };
  return {
    tablo: {
      oku: async () => {
        okuSayisi += 1;
        okuKancasi(okuSayisi);
        return grid.map((r) => [...r]);
      },
      yaz: async (no: number, alan: HatAlani) => {
        yazimlar.push([no, alan]);
        for (const [k, v] of Object.entries(alan)) grid[no - 1]![IDX[k]!] = v as string;
      },
    },
    drive,
    alt,
    yayin: vi.fn(async () => ({ durum: "yayinda" as const, link: "https://www.instagram.com/reel/XYZ/" })),
    iptal: vi.fn(async () => {}),
    kosuDizini: kok,
    kosuAdi: "tablo",
    simdi: () => SIMDI,
    yaz: () => {},
    kuru: false,
    ...ek,
  } as never;
}

const fisYolu = (link: string) => join(kok, satirKimligi(link), "fis.md");
function fisHazirla(link: string, ekstra = "") {
  mkdirSync(join(kok, satirKimligi(link)), { recursive: true });
  writeFileSync(fisYolu(link), FIS.replace("---\ngövde", `${ekstra}---\ngövde`).replace("durum: taslak", "durum: uretildi\nvideo: final.mp4"));
}

beforeEach(() => {
  kok = mkdtempSync(join(tmpdir(), "tablo-"));
});

describe("tablo yoklama durum makinesi", () => {
  it("yeni satır: fiş üretilir, durum fis_hazir; kullanıcı hücrelerine dokunulmaz", async () => {
    sahne([satir({ ornek_link: L1, paylasim_zamani: "30.10.2026 14:30" })]);
    const b = baglam();
    const o = await yokla(b);
    expect(b.alt.fis).toHaveBeenCalledWith({ url: L1, kosu: "tablo", id: satirKimligi(L1) });
    expect(grid[1]![IDX.durum!]).toBe("fis_hazir");
    expect(o).toEqual({ islenen: 1, atlanan: 0, hata: 0 });
    expect(grid[1]![0]).toBe(L1);
    expect(grid[1]![1]).toBe("30.10.2026 14:30");
  });

  it("fiş zaten varsa yeniden üretilmez", async () => {
    sahne([satir({ ornek_link: L1 })]);
    fisHazirla(L1);
    const b = baglam();
    await yokla(b);
    expect(b.alt.fis).not.toHaveBeenCalled();
    expect(grid[1]![IDX.durum!]).toBe("fis_hazir");
  });

  it("fis_hazir + fis_onay hayır: üretim yok, fişteki onay hayıra çekilir", async () => {
    sahne([satir({ ornek_link: L1, durum: "fis_hazir", fis_onay: "hayır" })]);
    fisHazirla(L1, "x: 1\n");
    writeFileSync(fisYolu(L1), readFileSync(fisYolu(L1), "utf8").replace("fis_onay: hayir", "fis_onay: evet"));
    const b = baglam();
    await yokla(b);
    expect(b.alt.uret).not.toHaveBeenCalled();
    expect(readFileSync(fisYolu(L1), "utf8")).toMatch(/fis_onay: "?hayir"?/);
  });

  it("fis_hazir + fis_onay evet: fişe onay yazılır, üretilir, Drive'a yüklenir, link+caption yazılır", async () => {
    sahne([satir({ ornek_link: L1, durum: "fis_hazir", fis_onay: "evet" })]);
    fisHazirla(L1);
    const b = baglam();
    await yokla(b);
    expect(b.alt.uret).toHaveBeenCalledOnce();
    expect(b.drive.yukle).toHaveBeenCalledWith(join(kok, satirKimligi(L1), "final.mp4"), `${satirKimligi(L1)}.mp4`);
    expect(grid[1]![IDX.durum!]).toBe("video_hazir");
    expect(grid[1]![IDX.video_link!]).toContain("drive.google.com");
    expect(grid[1]![IDX.caption!]).toBe("Merhaba #ai");
  });

  it("onay üretimden hemen önce geri alınırsa üretim yapılmaz", async () => {
    sahne([satir({ ornek_link: L1, durum: "fis_hazir", fis_onay: "evet" })]);
    fisHazirla(L1);
    okuKancasi = (n) => {
      if (n === 2) grid[1]![IDX.fis_onay!] = "hayır";
    };
    const b = baglam();
    const o = await yokla(b);
    expect(b.alt.uret).not.toHaveBeenCalled();
    expect(o.atlanan).toBe(1);
    expect(yazimlar).toHaveLength(0);
  });

  it("video_hazir + paylasim_onay evet: İstanbul saatiyle zamanlanır → zamanlandi", async () => {
    sahne([satir({ ornek_link: L1, paylasim_zamani: "30.10.2026 14:30", durum: "video_hazir", paylasim_onay: "evet" })]);
    fisHazirla(L1);
    const b = baglam();
    await yokla(b);
    expect(b.alt.paylas).toHaveBeenCalledWith({ fisYolu: fisYolu(L1), saat: "2026-10-30 14:30", onay: "final.mp4" });
    expect(grid[1]![IDX.durum!]).toBe("zamanlandi");
    expect(readFileSync(fisYolu(L1), "utf8")).toMatch(/paylasim_onay: "evet"/);
  });

  it("paylaşım onayı yoksa zamanlanmaz; geçmiş saat hata olur ve paylaş çağrılmaz", async () => {
    sahne([
      satir({ ornek_link: L1, paylasim_zamani: "30.10.2026 14:30", durum: "video_hazir", paylasim_onay: "hayır" }),
      satir({ ornek_link: L2, paylasim_zamani: "01.01.2026 10:00", durum: "video_hazir", paylasim_onay: "evet" }),
    ]);
    fisHazirla(L1);
    fisHazirla(L2);
    const b = baglam();
    const o = await yokla(b);
    expect(b.alt.paylas).not.toHaveBeenCalled();
    expect(grid[1]![IDX.durum!]).toBe("video_hazir");
    expect(grid[2]![IDX.durum!]).toBe("hata");
    expect(grid[2]![IDX.not!]).toMatch(/geçmiş/);
    expect(o.hata).toBe(1);
  });

  it("zamanlandi: saat geçmişse yayın durumu sorulur → yayinda + instagram_link; erkense dokunulmaz", async () => {
    sahne([
      satir({ ornek_link: L1, paylasim_zamani: "28.10.2026 12:00", durum: "zamanlandi", paylasim_onay: "evet" }),
      satir({ ornek_link: L2, paylasim_zamani: "30.10.2026 12:00", durum: "zamanlandi", paylasim_onay: "evet" }),
    ]);
    fisHazirla(L1, 'zernio_post_id: "p1"\n');
    fisHazirla(L2, 'zernio_post_id: "p2"\n');
    const b = baglam();
    await yokla(b);
    expect(b.yayin).toHaveBeenCalledOnce();
    expect(grid[1]![IDX.durum!]).toBe("yayinda");
    expect(grid[1]![IDX.instagram_link!]).toContain("instagram.com/reel/XYZ");
    expect(grid[2]![IDX.durum!]).toBe("zamanlandi");
  });

  describe("paylaşım onayı geri alınırsa (zamanlandi + paylasim_onay evet değil)", () => {
    const PAYLASILDI = (id: string) => `zernio_post_id: "${id}"\n`;
    const paylasilmisFis = (link: string, id: string) => {
      fisHazirla(link, PAYLASILDI(id));
      writeFileSync(fisYolu(link), readFileSync(fisYolu(link), "utf8").replace("durum: uretildi", "durum: paylasildi").replace("paylasim_onay: hayir", "paylasim_onay: evet"));
    };

    it("zamanlanmış gönderi Zernio'da silinir; durum video_hazir, not iptal; fişte paylaşım izi geri alınır", async () => {
      sahne([satir({ ornek_link: L1, paylasim_zamani: "30.10.2026 14:30", durum: "zamanlandi", paylasim_onay: "hayır" })]);
      paylasilmisFis(L1, "p1");
      const b = baglam({ yayin: vi.fn(async () => ({ durum: "bekliyor" as const })) });
      const o = await yokla(b);
      expect(b.iptal).toHaveBeenCalledExactlyOnceWith("p1", "aiscale");
      expect(grid[1]![IDX.durum!]).toBe("video_hazir");
      expect(grid[1]![IDX.not!]).toBe("paylaşım iptal edildi (onay geri alındı)");
      expect(o).toEqual({ islenen: 1, atlanan: 0, hata: 0 });
      const fis = readFileSync(fisYolu(L1), "utf8");
      expect(fis).toMatch(/durum: uretildi/);
      expect(fis).toMatch(/paylasim_onay: "?hayir"?/);
      for (const [, alan] of yazimlar) for (const k of Object.keys(alan)) expect(["durum", "video_link", "caption", "instagram_link", "not"]).toContain(k);
      expect([grid[1]![0], grid[1]![1], grid[1]![3], grid[1]![4]]).toEqual([L1, "30.10.2026 14:30", "", "hayır"]); // ekip hücrelerine dokunulmadı
    });

    it("yayında olan gönderi silinmez; yalnız not yazılır, durum yayinda", async () => {
      sahne([satir({ ornek_link: L1, paylasim_zamani: "28.10.2026 12:00", durum: "zamanlandi", paylasim_onay: "hayır" })]);
      paylasilmisFis(L1, "p1");
      const b = baglam();
      await yokla(b);
      expect(b.iptal).not.toHaveBeenCalled();
      expect(grid[1]![IDX.durum!]).toBe("yayinda");
      expect(grid[1]![IDX.not!]).toMatch(/yayında; silinmedi/);
      expect(grid[1]![IDX.instagram_link!]).toContain("instagram.com/reel/XYZ");
    });

    it("kuru kip: silme yok, hiçbir yazma yok, yalnız ne yapılacağı yazılır", async () => {
      sahne([satir({ ornek_link: L1, paylasim_zamani: "30.10.2026 14:30", durum: "zamanlandi", paylasim_onay: "" })]);
      paylasilmisFis(L1, "p1");
      const satirlar: string[] = [];
      const b = baglam({ kuru: true, yaz: (x: string) => satirlar.push(x) });
      await yokla(b);
      expect(b.iptal).not.toHaveBeenCalled();
      expect(b.yayin).not.toHaveBeenCalled();
      expect(yazimlar).toHaveLength(0);
      expect(satirlar.join("\n")).toMatch(/SİLİNECEK/);
      expect(readFileSync(fisYolu(L1), "utf8")).toMatch(/durum: paylasildi/);
    });

    it("silme patlarsa satır hata olur ve elle sıfırlanır (otomatik düzeltme yok)", async () => {
      sahne([satir({ ornek_link: L1, paylasim_zamani: "30.10.2026 14:30", durum: "zamanlandi", paylasim_onay: "" })]);
      paylasilmisFis(L1, "p1");
      const b = baglam({ yayin: vi.fn(async () => ({ durum: "bekliyor" as const })), iptal: vi.fn(async () => { throw new Error("Zernio gönderisi silinemedi (500)"); }) });
      const o = await yokla(b);
      expect(o.hata).toBe(1);
      expect(grid[1]![IDX.durum!]).toBe("hata");
      expect(readFileSync(fisYolu(L1), "utf8")).toMatch(/durum: paylasildi/);
    });

    it("zernio_post_id yoksa silinemez: hata", async () => {
      sahne([satir({ ornek_link: L1, paylasim_zamani: "30.10.2026 14:30", durum: "zamanlandi", paylasim_onay: "" })]);
      fisHazirla(L1);
      const b = baglam();
      await yokla(b);
      expect(b.iptal).not.toHaveBeenCalled();
      expect(grid[1]![IDX.not!]).toMatch(/zernio_post_id yok/);
    });
  });

  it("bir satır patlarsa durum=hata + not yazılır, diğer satırlar sürer", async () => {
    sahne([satir({ ornek_link: L1 }), satir({ ornek_link: L2 })]);
    const b = baglam();
    const orijinal = b.alt.fis.getMockImplementation()!;
    b.alt.fis.mockImplementationOnce(async () => {
      throw new Error("fis: kaynak indirilemedi\nayrıntı");
    });
    const o = await yokla(b);
    expect(grid[1]![IDX.durum!]).toBe("hata");
    expect(grid[1]![IDX.not!]).toBe("fis: kaynak indirilemedi");
    expect(grid[2]![IDX.durum!]).toBe("fis_hazir");
    expect(o).toEqual({ islenen: 1, atlanan: 0, hata: 1 });
    expect(orijinal).toBeDefined();
  });

  it("hata satırı atlanır (ekip durumu silene kadar)", async () => {
    sahne([satir({ ornek_link: L1, durum: "hata", not: "eski" })]);
    const b = baglam();
    await yokla(b);
    expect(b.alt.fis).not.toHaveBeenCalled();
    expect(yazimlar).toHaveLength(0);
  });

  it("geçersiz link ve yinelenen link hata olur", async () => {
    sahne([satir({ ornek_link: "bu bir link değil" }), satir({ ornek_link: L1 }), satir({ ornek_link: L1 })]);
    const b = baglam();
    const o = await yokla(b);
    expect(grid[1]![IDX.not!]).toMatch(/URL/);
    expect(grid[2]![IDX.durum!]).toBe("fis_hazir");
    expect(grid[3]![IDX.not!]).toMatch(/birden çok/);
    expect(o.hata).toBe(2);
  });

  it("satır kayarsa (araya satır eklendi) yazım linke göre doğru satıra gider", async () => {
    sahne([satir({ ornek_link: L1 })]);
    okuKancasi = (n) => {
      if (n === 2) grid.splice(1, 0, satir({ ornek_link: L2, paylasim_zamani: "yeni eklenen" }));
    };
    const b = baglam();
    await yokla(b);
    expect(yazimlar.map(([no]) => no)).toEqual([3]);
    expect(grid[2]![0]).toBe(L1);
    expect(grid[2]![IDX.durum!]).toBe("fis_hazir");
    expect(grid[1]![IDX.durum!]).toBe("");
  });

  it("kullanıcı sütunlarına hiçbir tur yazmaz (tüm geçişler boyunca)", async () => {
    sahne([satir({ ornek_link: L1, paylasim_zamani: "30.10.2026 14:30", fis_onay: "evet", paylasim_onay: "evet" })]);
    const once = grid[1]!.filter((_, i) => KULLANICI.includes(i));
    const b = baglam();
    for (let i = 0; i < 4; i += 1) await yokla(b);
    expect(grid[1]![IDX.durum!]).toBe("zamanlandi");
    expect(grid[1]!.filter((_, i) => KULLANICI.includes(i))).toEqual(once);
    for (const [, alan] of yazimlar) for (const k of Object.keys(alan)) expect(["durum", "video_link", "caption", "instagram_link", "not"]).toContain(k);
  });

  it("kuru kip: hiçbir yazma, alt komut, yükleme ve fiş değişikliği yok", async () => {
    sahne([
      satir({ ornek_link: L1 }),
      satir({ ornek_link: L2, durum: "fis_hazir", fis_onay: "evet", paylasim_zamani: "30.10.2026 14:30" }),
      satir({ ornek_link: "https://x.com/a", durum: "video_hazir", paylasim_onay: "evet", paylasim_zamani: "30.10.2026 14:30" }),
    ]);
    fisHazirla(L2);
    fisHazirla("https://x.com/a");
    const onceki = readFileSync(fisYolu(L2), "utf8");
    const satirlar: string[] = [];
    const b = baglam({ kuru: true, yaz: (s) => satirlar.push(s) });
    const o = await yokla(b);
    expect(yazimlar).toHaveLength(0);
    for (const f of [b.alt.fis, b.alt.uret, b.alt.paylas, b.drive.yukle, b.yayin, b.iptal]) expect(f).not.toHaveBeenCalled();
    expect(readFileSync(fisYolu(L2), "utf8")).toBe(onceki);
    expect(existsSync(fisYolu(L1))).toBe(false);
    expect(o.islenen).toBe(3);
    expect(satirlar.join("\n")).toMatch(/fiş üretilecek/);
  });
});
