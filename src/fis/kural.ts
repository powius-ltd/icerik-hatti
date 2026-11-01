/** Yayın kuralları (fiş metni): yabancı alfabe, kaynağın kişisel anlatımı, görüntü tarifi, seminer çağrısı. Saf fonksiyonlar. */
import type { FisModel } from "./sema.ts";

/** Son sahnenin sonunda sözlü olarak geçmesi gereken çağrı (kaynağın kendi CTA'sı taşınmaz). */
export const CTA_CUMLESI = "Yorumlara SEMİNER yaz.";

const YABANCI_ALFABE = /[\p{Script=Arabic}\p{Script=Devanagari}\p{Script=Cyrillic}\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}\p{Script=Hebrew}\p{Script=Thai}\p{Script=Greek}\p{Script=Bengali}\p{Script=Tamil}]/u;
const HARF_ONCESI = "(?<![\\p{L}\\p{N}])";
const HARF_SONRASI = "(?![\\p{L}\\p{N}])";
/** Kaynak konuşmacıya ait kişisel anlatım: birinci tekil zamir ve yakınlık adları. */
const KISISEL = new RegExp(`${HARF_ONCESI}(ben|benim|bana|beni|bende|benden|bence|kızım\\p{L}*|oğlum\\p{L}*|karım\\p{L}*|kocam\\p{L}*|çocuğum\\p{L}*|sesim\\p{L}*)${HARF_SONRASI}`, "iu");
/** Görüntüyü tarif eden kalıplar (anlatı değil). */
const GORUNTU_TARIFI = new RegExp(`${HARF_ONCESI}(görülüyor|gösteriliyor|görünüyor|izleniyor|yer alıyor|kadrajda|ekranda|sahnede)${HARF_SONRASI}`, "iu");
/** Ek doküman / bağlantı vaadi. */
const EK_VAAT = new RegExp(`${HARF_ONCESI}(pdf|doküman\\p{L}*|dokuman\\p{L}*|e-?kitap\\p{L}*|bağlantı\\p{L}*|link\\p{L}*|biyografi\\p{L}*|bio|dm|rehber\\p{L}*)${HARF_SONRASI}`, "iu");

export function yabanciAlfabeVar(s: string): boolean {
  return YABANCI_ALFABE.test(s);
}

/** `kaynakliGiris`: video/url girişi (kaynağın kişisel anlatımı ve CTA'sı denetlenir); hazır metinde yalnız alfabe denetlenir. */
export function yayinSorunlari(govde: FisModel, kaynakliGiris: boolean): string[] {
  const sorunlar: string[] = [];
  const n = govde.sahneler.length;
  govde.sahneler.forEach((s, i) => {
    for (const [alan, deger] of [["metin", s.metin], ["ekranYazisi", s.ekranYazisi]] as const) {
      if (yabanciAlfabeVar(deger)) sorunlar.push(`sahneler.${i}.${alan}: yabancı alfabe karakteri var (Arapça, Hintçe, Kiril vb.); tamamen Türkçe (Latin harfli) yaz, çevir`);
    }
    if (!kaynakliGiris) return;
    for (const [alan, deger] of [["metin", s.metin], ["ekranYazisi", s.ekranYazisi]] as const) {
      const k = KISISEL.exec(deger);
      if (k) sorunlar.push(`sahneler.${i}.${alan}: kaynak konuşmacının kişisel anlatımı ("${k[0]}") kendimize mal edilmiş; tarafsız anlatıya çevir ("bir baba", "bir kız çocuğu" ya da doğrudan "sen")`);
    }
    const g = GORUNTU_TARIFI.exec(s.metin);
    if (g) sorunlar.push(`sahneler.${i}.metin: görüntü tarifi gibi ("${g[0]}"); videoda ne olduğunu değil, izleyiciye konuşan bir anlatıyı yaz`);
    if (i >= n - 2) {
      const v = EK_VAAT.exec(s.metin);
      if (v) sorunlar.push(`sahneler.${i}.metin: ek doküman/bağlantı vaadi ("${v[0]}") olamaz; çağrı yalnız "${CTA_CUMLESI}"`);
    }
  });
  if (yabanciAlfabeVar(govde.aciklama_taslagi)) sorunlar.push("aciklama_taslagi: yabancı alfabe karakteri var; tamamen Türkçe olmalı");
  if (kaynakliGiris) {
    const k = KISISEL.exec(govde.aciklama_taslagi);
    if (k) sorunlar.push(`aciklama_taslagi: kaynak konuşmacının kişisel anlatımı ("${k[0]}") var; tarafsız yaz`);
    const son = govde.sahneler[n - 1]?.metin.replace(/\s+/g, " ").trim() ?? "";
    if (!son.endsWith(CTA_CUMLESI)) sorunlar.push(`sahneler.${n - 1}.metin: son sahne "${CTA_CUMLESI}" cümlesiyle bitmeli`);
  }
  return sorunlar;
}
