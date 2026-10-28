import { mkdtemp, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { girisHazirla } from "../../src/fis/giris.ts";
import { fisOku } from "../../src/fis/sema.ts";
import { fisUret, type ClaudeSor } from "../../src/fis/uret.ts";
import { fisMd } from "../../src/fis/yaz.ts";

const YANIT = {
  sahneler: [
    { no: 1, basSn: 0, sonSn: 3, tur: "metin-karti", ekranYazisi: "", konum: "yok", metin: "Bu araç işini yarıya indiriyor." },
    { no: 2, basSn: 3, sonSn: 7, tur: "metin-karti", ekranYazisi: "ÜCRETSİZ", konum: "orta", metin: "Üstelik tamamen ücretsiz." },
  ],
  aciklama_taslagi: "İşini yarıya indir. #araç",
  dogrulanacak: [{ iddia: "Araç ücretsizdir" }],
};

describe("--metin girişi", () => {
  it("çözümlemeyi atlar (agy/yt-dlp/ffmpeg çağrılmaz) ve fiş üretir", async () => {
    const dizin = await mkdtemp(path.join(os.tmpdir(), "metin-"));
    const dosya = path.join(dizin, "senaryo.md");
    await writeFile(dosya, "Bu araç işini yarıya indiriyor. Üstelik tamamen ücretsiz.", "utf8");
    const patla = () => {
      throw new Error("çözümleme çağrılmamalı");
    };
    const bag = { kosucu: patla, ortam: {}, gunluk: patla, agy: patla } as never;
    const g = await girisHazirla({ tur: "metin", deger: dosya }, "deneme", undefined, bag);
    expect(g.id).toBe("metin-senaryo");
    expect(g.analiz).toBeUndefined();
    expect(g.kaynak).toEqual({ tur: "metin", dosya });

    const istemler: string[] = [];
    const sahte: ClaudeSor = async (istem) => {
      istemler.push(istem);
      return { nesne: YANIT, metin: JSON.stringify(YANIT) };
    };
    const s = await fisUret({ id: g.id, kaynak: g.kaynak, hesap: "ornek", metin: g.metin }, sahte);
    expect(istemler).toHaveLength(1);
    expect(istemler[0]).toContain("Bu araç işini yarıya indiriyor.");
    expect(s.duzeltmeTuru).toBe(0);
    const fis = fisOku(fisMd(s.fis, s.dogrulanacak));
    expect(fis.kaynak.tur).toBe("metin");
    expect(fis.fis_onay).toBe("hayir");
    expect(fis.sahneler).toHaveLength(2);
  });

  it("boş metin ve eksik dosya açık hata verir", async () => {
    const dizin = await mkdtemp(path.join(os.tmpdir(), "metin-"));
    const bos = path.join(dizin, "bos.md");
    await writeFile(bos, "  \n", "utf8");
    const bag = {} as never;
    await expect(girisHazirla({ tur: "metin", deger: bos }, "deneme", undefined, bag)).rejects.toThrow(/boş/);
    await expect(girisHazirla({ tur: "metin", deger: path.join(dizin, "yok.md") }, "deneme", undefined, bag)).rejects.toThrow(/okunamadı/);
  });

  it("ilk yanıt reddedilirse tek düzeltme turu; yine bozuksa hata", async () => {
    let n = 0;
    const bozuk: ClaudeSor = async () => ({ nesne: { sahneler: [] }, metin: "{}" + n++ });
    await expect(fisUret({ id: "metin-x", kaynak: { tur: "metin" }, hesap: "o", metin: "m" }, bozuk)).rejects.toThrow(/düzeltme turundan sonra/);
    expect(n).toBe(2);
  });
});
