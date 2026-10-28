/**
 * Fiş (`fis.md`) frontmatter'ı: yalnız bu adımın ihtiyacı olan üst düzey alanlar okunur/yazılır (hesap, paylasim_onay, durum, video,
 * aciklama_taslagi). Dönüş yazımı satır düzeyindedir: yalnız `durum`, `zernio_post_id`, `yayin_url` değişir, gerisine dokunulmaz.
 */
export interface FisAlanlari {
  hesap?: string;
  paylasim_onay?: string;
  durum?: string;
  video?: string;
  aciklama_taslagi?: string;
}

const CIT = /^---\r?\n([\s\S]*?)\r?\n---(\r?\n|$)/;

function skalerCoz(ham: string): string {
  const t = ham.trim();
  if (/^".*"$/.test(t)) {
    try {
      return JSON.parse(t) as string;
    } catch {
      return t.slice(1, -1);
    }
  }
  if (/^'.*'$/.test(t)) return t.slice(1, -1).replace(/''/g, "'");
  return t;
}

export function fisOku(metin: string): FisAlanlari {
  const cit = CIT.exec(metin);
  if (!cit) throw new Error("fişte frontmatter (---) yok.");
  const satirlar = (cit[1] as string).split(/\r?\n/);
  const alan: Record<string, string> = {};
  for (let i = 0; i < satirlar.length; i += 1) {
    const m = /^([A-Za-z_][\w]*):(?:\s+(.*))?$/.exec(satirlar[i] as string);
    if (!m) continue;
    const ad = m[1] as string;
    const deger = (m[2] ?? "").trim();
    if (/^[|>][+-]?$/.test(deger)) {
      const govde: string[] = [];
      while (i + 1 < satirlar.length && /^(\s+|$)/.test(satirlar[i + 1] as string)) govde.push((satirlar[(i += 1)] as string).replace(/^ {1,2}/, ""));
      alan[ad] = govde.join(deger.startsWith(">") ? " " : "\n").trim();
    } else alan[ad] = skalerCoz(deger);
  }
  const cikti: FisAlanlari = {};
  for (const ad of ["hesap", "paylasim_onay", "durum", "video", "aciklama_taslagi"] as const) if (alan[ad]) cikti[ad] = alan[ad];
  return cikti;
}

function degerYaz(metin: string, ad: string, deger: string): string {
  const cit = CIT.exec(metin);
  if (!cit) throw new Error("fişte frontmatter (---) yok.");
  const ic = (cit[1] as string).split(/\r?\n/);
  const satir = `${ad}: ${JSON.stringify(deger)}`;
  const idx = ic.findIndex((s) => s.startsWith(`${ad}:`));
  if (idx >= 0) ic[idx] = ad === "durum" ? `${ad}: ${deger}` : satir;
  else ic.push(ad === "durum" ? `${ad}: ${deger}` : satir);
  return `---\n${ic.join("\n")}\n---${cit[2] ?? ""}${metin.slice(cit[0].length)}`;
}

/** Paylaşım başarılı: `durum: paylasildi`, `zernio_post_id`, varsa `yayin_url`. */
export function fisPaylasildiYaz(metin: string, postId: string, yayinUrl?: string): string {
  let cikti = degerYaz(metin, "durum", "paylasildi");
  cikti = degerYaz(cikti, "zernio_post_id", postId);
  if (yayinUrl) cikti = degerYaz(cikti, "yayin_url", yayinUrl);
  return cikti;
}
