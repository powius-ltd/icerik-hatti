// Kaynak: viral-uyarla/src/cozumle/json-ayikla.ts (335b436)
/**
 * Model çıktısından JSON ayıklama (sosyal-panel `llm/json-extract.ts`'ten): çitli (```json … ```) ya da çitsiz, öncesinde/sonrasında
 * düz metin olabilir. Sıra: (1) tüm metin JSON mu (2) çitli bloklar (3) dengeli {…}/[…] taraması (4) sondaki virgül onarımı.
 * JSON'a benzeyen ama geçersiz parça yutulmaz: hiçbiri çözülemezse `ok: false` + sebep.
 */
export type JsonSonucu = { ok: true; deger: unknown } | { ok: false; sebep: string };

const CIT = /```([A-Za-z0-9_-]*)[ \t]*\r?\n?([\s\S]*?)```/g;

function dene(metin: string): { deger: unknown } | undefined {
  const kirpik = metin.trim();
  if (kirpik === "") return undefined;
  try {
    return { deger: JSON.parse(kirpik) };
  } catch {
    return undefined;
  }
}

/** `bas`taki `{`/`[`ten eşleşen kapanışa kadar parça (dize/kaçış farkındalığıyla); kapanmıyorsa undefined. */
function dengeliParca(metin: string, bas: number): string | undefined {
  const yigin: string[] = [];
  let dizede = false;
  let kacis = false;
  for (let i = bas; i < metin.length; i++) {
    const c = metin[i]!;
    if (dizede) {
      if (kacis) kacis = false;
      else if (c === "\\") kacis = true;
      else if (c === '"') dizede = false;
      continue;
    }
    if (c === '"') dizede = true;
    else if (c === "{") yigin.push("}");
    else if (c === "[") yigin.push("]");
    else if (c === "}" || c === "]") {
      if (yigin.pop() !== c) return undefined;
      if (yigin.length === 0) return metin.slice(bas, i + 1);
    }
  }
  return undefined;
}

function* adaylar(metin: string): Generator<string> {
  for (let i = 0; i < metin.length; i++) {
    if (metin[i] !== "{" && metin[i] !== "[") continue;
    const parca = dengeliParca(metin, i);
    if (parca) yield parca;
  }
}

/** Sondaki virgülleri (`,}` `,]`) dize DIŞINDA siler. */
function sondakiVirgulSil(metin: string): string {
  let cikti = "";
  let dizede = false;
  let kacis = false;
  for (let i = 0; i < metin.length; i++) {
    const c = metin[i]!;
    if (dizede) {
      cikti += c;
      if (kacis) kacis = false;
      else if (c === "\\") kacis = true;
      else if (c === '"') dizede = false;
    } else if (c === '"') {
      dizede = true;
      cikti += c;
    } else if (c === ",") {
      let j = i + 1;
      while (j < metin.length && /\s/.test(metin[j]!)) j++;
      if (metin[j] !== "}" && metin[j] !== "]") cikti += c;
    } else cikti += c;
  }
  return cikti;
}

export function jsonAyikla(ham: string): JsonSonucu {
  const metin = ham.replace(/^﻿/, "");
  if (metin.trim() === "") return { ok: false, sebep: "Yanıt boş." };
  const tum = dene(metin);
  if (tum) return { ok: true, deger: tum.deger };

  const citler = [...metin.matchAll(CIT)].map((m) => ({ etiket: m[1]!.toLowerCase(), govde: m[2]! }));
  for (const { govde } of [...citler.filter((c) => c.etiket === "json"), ...citler.filter((c) => c.etiket !== "json")]) {
    const bulunan = dene(govde);
    if (bulunan) return { ok: true, deger: bulunan.deger };
    for (const parca of adaylar(govde)) {
      const ic = dene(parca);
      if (ic) return { ok: true, deger: ic.deger };
    }
  }
  for (const parca of adaylar(metin)) {
    const bulunan = dene(parca);
    if (bulunan) return { ok: true, deger: bulunan.deger };
  }
  for (const parca of [metin, ...adaylar(metin)]) {
    const onarilan = dene(sondakiVirgulSil(parca));
    if (onarilan && typeof onarilan.deger === "object" && onarilan.deger !== null) return { ok: true, deger: onarilan.deger };
  }
  return { ok: false, sebep: "Yanıtta çözülebilir JSON bulunamadı." };
}
