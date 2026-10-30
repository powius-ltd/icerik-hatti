/**
 * Karma yön: videonun sahnelerini içeriğe göre dört yöne dağıtır (deterministik, LLM yok).
 * Sahne başına aday sırası (özelden genele): sohbet → terminal → rakam-kart → editoryal.
 *
 *   sohbet      soru cümlesi (? ya da "mı/misin" eki) ya da tırnak içinde kullanıcı isteği / diyalog
 *   terminal    komut / kurulum fiilleri (kur, komut, çalıştır, terminal, kod, yaz), ya da tırnak içinde komut
 *   rakam-kart  rakam ya da "Birinci / İki / Üç adım" ifadesi
 *   editoryal   geri kalan her şey (her sahne için daima uygun)
 *
 * Görsel çeşitlilik: art arda 3'ten fazla aynı yön olmaz; 4. sahne adayları arasındaki bir sonraki uygun yöne çevrilir.
 * İlk sahne (kanca) her zaman editoryal ya da sohbet.
 */
import type { FisSahne, GorselYon } from "../../fis/sema.ts";

export type SomutYon = Exclude<GorselYon, "karma">;

export const EN_COK_ART_ARDA = 3;

const TIRNAK = /["“„]([^"“”„]{3,160})["”]/;
const KOMUT_KOKU = /^\s*(?:[$>`]|npm\b|npx\b|pnpm\b|yarn\b|git\b|pip\b|brew\b|claude\b|curl\b|cd\b|sudo\b)/i;
const SORU_EKI = /(?<![\p{L}])m[ıiuü](?:s[ıiuü]n(?:[ıi]z)?|y[ıiuü]m|y[ıiuü]z)?(?![\p{L}])/iu;
const KOMUT_FIILI = /(?<![\p{L}])(?:kur(?:un|ar|du|ulum\p{L}*|ulur|ulu)?|komut\p{L}*|çalıştır\p{L}*|terminal\p{L}*|kod\p{L}*|yaz(?:ın|ar|ıyor|ıp|dır\p{L}*)?)(?![\p{L}])/iu;
const ADIM = /(?<![\p{L}])(?:birinci|ikinci|üçüncü|dördüncü|beşinci|bir|iki|üç|dört|beş)\s+adım|(?<![\p{L}])adım\s*\d|^\s*(?:bir|iki|üç|dört|beş)\s*[:.]/iu;

const duz = (s: string): string => s.replace(/\s+/g, " ").trim();

/** Sahnenin uygun yönleri, en özelden başlayarak; sonda daima editoryal. */
export function adayYonler(s: FisSahne): SomutYon[] {
  const metin = duz(s.metin);
  const yazi = duz(s.ekranYazisi);
  const hepsi = `${metin} ${yazi}`;
  const tirnak = (TIRNAK.exec(metin) ?? TIRNAK.exec(yazi))?.[1]?.trim();
  const komutTirnagi = tirnak !== undefined && KOMUT_KOKU.test(tirnak);
  const adaylar: SomutYon[] = [];
  if (!komutTirnagi && (tirnak !== undefined || hepsi.includes("?") || SORU_EKI.test(metin))) adaylar.push("sohbet");
  if (komutTirnagi || /`[^`]+`/.test(hepsi) || KOMUT_FIILI.test(metin)) adaylar.push("terminal");
  if (/\d/.test(hepsi) || ADIM.test(metin)) adaylar.push("rakam-kart");
  adaylar.push("editoryal");
  return adaylar;
}

/** Her sahne için somut yön (sahne sırasıyla). */
export function karmaYonleri(sahneler: readonly FisSahne[]): SomutYon[] {
  const sonuc: SomutYon[] = [];
  sahneler.forEach((s, i) => {
    const adaylar = adayYonler(s);
    let yon = adaylar[0]!;
    if (i === 0 && yon !== "sohbet" && yon !== "editoryal") yon = adaylar.includes("sohbet") ? "sohbet" : "editoryal";
    const son = sonuc.slice(-EN_COK_ART_ARDA);
    if (son.length === EN_COK_ART_ARDA && son.every((y) => y === yon)) {
      yon = adaylar.find((y) => y !== yon) ?? (yon === "editoryal" ? "sohbet" : "editoryal");
    }
    sonuc.push(yon);
  });
  return sonuc;
}
