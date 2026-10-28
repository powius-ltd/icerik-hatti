// Kaynak: viral-uyarla/src/ortak/kosu.ts (335b436)
import path from "node:path";

/** Koşu klasörünün yolları. Tek yerde: başka dosya yol birleştirmesin. */
export function kosuYollari(kosu: string) {
  if (!/^[A-Za-z0-9._-]+$/.test(kosu)) throw new Error(`Geçersiz koşu adı: ${kosu}`);
  const kok = path.resolve(process.env.HAT_KOSU_KOK ?? "kosular", kosu);
  return {
    kok,
    tara: path.join(kok, "tara.json"),
    secim: path.join(kok, "secim.json"),
    aday(id: string) {
      if (!/^[a-z]+-[A-Za-z0-9_-]+$/.test(id)) throw new Error(`Geçersiz aday id: ${id}`);
      const k = path.join(kok, id);
      return {
        kok: k,
        kaynakVideo: path.join(k, "kaynak.mp4"),
        dokum: path.join(k, "dokum.json"),
        analiz: path.join(k, "analiz.json"),
        fis: path.join(k, "fis.md"),
        senaryo: path.join(k, "senaryo.json"),
        senaryoMd: path.join(k, "senaryo.md"),
        calisma: path.join(k, "calisma"),
        cikti: path.join(k, "cikti"),
      };
    },
  };
}

/** `--ad deger` ya da `--bayrak` biçimindeki argümanları okur. */
export function argumanlar(argv: string[]): { konum: string[]; bayrak: Record<string, string | true> } {
  const konum: string[] = [];
  const bayrak: Record<string, string | true> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]!;
    if (a.startsWith("--")) {
      const ad = a.slice(2);
      const sonraki = argv[i + 1];
      if (sonraki !== undefined && !sonraki.startsWith("--")) {
        bayrak[ad] = sonraki;
        i++;
      } else bayrak[ad] = true;
    } else konum.push(a);
  }
  return { konum, bayrak };
}
