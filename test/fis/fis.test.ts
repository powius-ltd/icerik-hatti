import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { geriYaz, geriYazUygula } from "../../src/fis/geri-yaz.ts";
import { fisOku, fisSema, type Fis } from "../../src/fis/sema.ts";
import { fisMd } from "../../src/fis/yaz.ts";

const FIS: Fis = {
  fis_id: "instagram-X1",
  kaynak: { tur: "url", url: "https://www.instagram.com/reel/X1/" },
  hesap: "ornek",
  fis_onay: "hayir",
  paylasim_onay: "hayir",
  durum: "taslak",
  sahneler: [
    { no: 1, basSn: 0, sonSn: 8, tur: "yuz", ekranYazisi: "1 DAKİKADA UYGULAMA: evet", konum: "ust", metin: "Bir dakikada uygulama yapabiliyorsun." },
    { no: 2, basSn: 8, sonSn: 20, tur: "ekran-kaydi", ekranYazisi: "", konum: "yok", metin: "Tek komut yazıyorsun, bitti." },
  ],
  aciklama_taslagi: "Bir dakikada uygulama.\nYorumlara REHBER yaz.\n#yazılım",
};

describe("fiş şeması", () => {
  it("yazılan fiş geri okunur ve şemaya uyar (gidiş-dönüş)", () => {
    const md = fisMd(FIS, [{ iddia: "1 dakikada uygulama", kaynakSn: 2 }]);
    expect(md.startsWith("---\n")).toBe(true);
    expect(fisOku(md)).toEqual(FIS);
    expect(md).toContain("> **Sana düşen**");
    expect(md.indexOf("Sana düşen")).toBeLessThan(md.indexOf("## Okuma metni"));
    expect(md).toContain("Doğrula: 1 dakikada uygulama");
  });

  it("onay alanları varsayılan hayır; geçersiz değer ve boş sahne reddedilir", () => {
    expect(fisSema.safeParse({ ...FIS, fis_onay: "belki" }).success).toBe(false);
    expect(fisSema.safeParse({ ...FIS, sahneler: [] }).success).toBe(false);
    expect(fisSema.safeParse({ ...FIS, durum: "bilinmez" }).success).toBe(false);
    expect(fisOku(fisMd(FIS, [])).fis_onay).toBe("hayir");
    expect(() => fisOku("merhaba")).toThrow(/frontmatter/);
  });
});

describe("dönüş yazımı", () => {
  const md = fisMd(FIS, []);

  it("yalnız hedef satırlar değişir, gövde ve öteki alanlar bayt düzeyinde aynı kalır", () => {
    const yeni = geriYazUygula(md, { durum: "hazir", video: "cikti/video.mp4", hata_notu: "ses: yok, tekrar dene" });
    const eski = md.split("\n");
    const yen = yeni.split("\n");
    const degisen = yen.filter((l) => !eski.includes(l));
    expect(degisen.sort()).toEqual(['hata_notu: "ses: yok, tekrar dene"', "durum: hazir", "video: cikti/video.mp4"].sort());
    expect(yeni.slice(yeni.indexOf("\n---\n"))).toBe(md.slice(md.indexOf("\n---\n")));
    const f = fisOku(yeni);
    expect(f.durum).toBe("hazir");
    expect(f.video).toBe("cikti/video.mp4");
    expect(f.fis_onay).toBe("hayir");
  });

  it("izinsiz alan ve geçersiz durum reddedilir; fis_onay'a yazılamaz", () => {
    expect(() => geriYazUygula(md, { fis_onay: "evet" } as never)).toThrow(/yazılamaz/);
    expect(() => geriYazUygula(md, { durum: "x" as never })).toThrow(/Geçersiz durum/);
  });

  it("dosyaya atomik yazar", async () => {
    const dizin = await mkdtemp(path.join(os.tmpdir(), "fis-"));
    const yol = path.join(dizin, "fis.md");
    await writeFile(yol, md, "utf8");
    await geriYaz(yol, { durum: "uretiliyor" });
    expect(fisOku(await readFile(yol, "utf8")).durum).toBe("uretiliyor");
  });
});
