/**
 * Görsel yön → sahne kalıbı (deterministik, LLM yok). Fiş `gorsel_yon` verir, sahnenin `yon`'ü onu ezer; ikisi de yoksa (eski fiş) `kalipEsle` aynen.
 *
 *   karma       → içeriğe göre sahne başına dört yönden biri (`karma.ts`: soru/istem → sohbet, komut → terminal, rakam/adım → rakam-kart, kalan → editoryal)
 *   sohbet      → sohbet (balonlar, yazıyor göstergesi)           terminal → terminal (komut + ✓ satırları)
 *   rakam-kart  → rakam-kart (halka: logo/ikon + büyük rakam)     editoryal → editoryal (büyük tipografi + vurgu)
 *
 * Kalıba verilecek metin boşsa (sahne metni yalnız boşluk) kalıp seçilmez, `kart`a düşülür (boş kutu çizilmez).
 * Kelime sırası parametreleri sesin genel sırasıdır; sahne `aralik.ilk`'ten başlar.
 */
import type { FisSahne, GorselYon } from "../../fis/sema.ts";
import { kalipEsle, kelimeler, type KalipSecimi, type KelimeAraligi } from "../kalip-esle.ts";
import { adayYonler, karmaYonleri, type SomutYon } from "./karma.ts";
import { butceyeSigdir, cumleler, ikonBul, kirp, logoBul, vurguKelime, type Cumle } from "./metin.ts";

export interface YonBaglami {
  /** Sahnenin videodaki sırası (1'den) ve sahne sayısı. */
  sira: number;
  toplam: number;
}

const SAYI = /\d{1,3}(?:\.\d{3})+|\d+/g;
const bosluksuz = (s: string): string => s.replace(/\s+/g, " ").trim();

/** Sahnenin geçerli yönü: sahne `yon`'ü, yoksa fişinki; ikisi de yoksa undefined (eski fiş: `kalipEsle` davranışı aynen). */
export const etkinYon = (sahne: FisSahne, fisYonu?: GorselYon): GorselYon | undefined => sahne.yon ?? fisYonu;

function kartaDus(s: FisSahne, neden: string): KalipSecimi {
  const yazi = bosluksuz(s.ekranYazisi);
  return { template: "kart", kind: "motion", params: { text: yazi, konum: s.konum === "yok" ? "orta" : s.konum }, neden };
}

const genel = (a: KelimeAraligi, c: Cumle): number => a.ilk + c.sira;

/** Kelime sıraları artan olmalı (şablon kuralı): çakışan sırayı bir ileri iter, sahne sonunu aşanı atar. */
function artanSira<T extends { word: number }>(liste: T[], ilk: number, son: number): T[] {
  const sonuc: T[] = [];
  for (const m of liste) {
    const w = Math.max(m.word, (sonuc.at(-1)?.word ?? ilk - 1) + 1);
    if (w <= son) sonuc.push({ ...m, word: w });
  }
  return sonuc;
}

function sohbet(s: FisSahne, a: KelimeAraligi): KalipSecimi | undefined {
  const yazi = bosluksuz(s.ekranYazisi);
  const liste = cumleler(s.metin);
  if (liste.length === 0) return undefined;
  const mesajlar: Array<{ kim: "ben" | "ai"; metin: string; word: number }> = [];
  if (yazi !== "" && yazi.length <= 90) mesajlar.push({ kim: "ben", metin: yazi, word: a.ilk });
  for (const c of butceyeSigdir(liste.slice(0, 4 - mesajlar.length), 330 - yazi.length, 160)) mesajlar.push({ kim: c.metin.endsWith("?") ? "ben" : "ai", metin: c.metin, word: genel(a, c) });
  return { template: "sohbet", kind: "screen", params: { mesajlar: artanSira(mesajlar, a.ilk, a.ilk + a.adet - 1) }, neden: "sohbet yönü: söz balonlara dolar" };
}

function terminal(s: FisSahne, a: KelimeAraligi, b: YonBaglami): KalipSecimi | undefined {
  const yazi = bosluksuz(s.ekranYazisi);
  const liste = butceyeSigdir(cumleler(s.metin).slice(0, 5), 420, 170);
  if (liste.length === 0) return undefined;
  const duzgun = artanSira(liste.map((c) => ({ metin: c.metin, word: genel(a, c), tur: c.metin.endsWith("?") ? "cikti" : "ok" })), a.ilk, a.ilk + a.adet - 1);
  const komut = yazi !== "" && yazi.length <= 60 ? yazi : `adim ${b.sira}/${b.toplam}`;
  return { template: "terminal", kind: "screen", params: { komut, satirlar: duzgun }, neden: "terminal yönü: komut + çıktı satırları" };
}

/** "Birinci adım: ücretsiz hesap aç." gibi kısa etiketli cümlede etiketi atar (adım numarası zaten ayrı gösterilir). */
function etiketsiz(cumle: string): string {
  const m = /^(\S+(?:\s\S+)?):\s+(\S.*)$/.exec(cumle);
  return m ? m[2]!.charAt(0).toLocaleUpperCase("tr") + m[2]!.slice(1) : cumle;
}

function baslikAlt(s: FisSahne, enBaslik: number, enAlt: number): { baslik: string; alt?: string } {
  const yazi = bosluksuz(s.ekranYazisi);
  const liste = cumleler(s.metin);
  if (yazi !== "") return { baslik: kirp(yazi, enBaslik), ...(liste[0] && { alt: kirp(liste[0].metin, enAlt) }) };
  const [ilk, ...geri] = liste;
  return { baslik: kirp(etiketsiz(ilk?.metin ?? ""), enBaslik), ...(geri.length > 0 && { alt: kirp(geri.map((c) => c.metin).join(" "), enAlt) }) };
}

/** Ekran yazısının ilk satırı "3" ya da "15 / 28" ise kartın büyük yazısı odur, kalan satırlar başlık olur. */
const BUYUK_YAZI = /^(\d{1,3})(?:\s*\/\s*(\d{1,3}))?\s*\n([\s\S]+)$/;

function rakamKart(s: FisSahne, a: KelimeAraligi, b: YonBaglami): KalipSecimi | undefined {
  if (a.adet < 2) return undefined;
  const buyuk = BUYUK_YAZI.exec(s.ekranYazisi.trim());
  if (buyuk) {
    const baslikYazi = bosluksuz(buyuk[3]!);
    const liste = cumleler(s.metin);
    const buyukYazi = buyuk[2] ? `${buyuk[1]}/${buyuk[2]}` : buyuk[1]!.padStart(2, "0");
    const altYazi = liste[0] ? kirp(etiketsiz(liste[0].metin), 80) : undefined;
    const params = { adim: b.sira, toplam: b.toplam, buyukYazi, baslik: kirp(baslikYazi, 64), ...(altYazi && { alt: altYazi }), ikon: ikonBul(`${baslikYazi} ${s.metin}`), startWord: a.ilk, landWord: a.ilk + 1 };
    return { template: "rakam-kart", kind: "motion", params, neden: "rakam-kart yönü, ekran yazısındaki numara" };
  }
  const { baslik, alt } = baslikAlt(s, 64, 80);
  if (baslik === "") return undefined;
  const yazi = bosluksuz(s.ekranYazisi);
  const kaynak = yazi !== "" ? yazi : bosluksuz(s.metin);
  const tek = kaynak.match(SAYI) ?? [];
  const ham = tek.length === 1 ? tek[0]! : undefined;
  const deger = ham ? Number(ham.replaceAll(".", "")) : undefined;
  const sayi = deger !== undefined && deger >= 10 && !(deger >= 1900 && deger <= 2100 && !ham!.includes(".")) ? deger : undefined;
  const at = ham ? kelimeler(s.metin).findIndex((k) => k.includes(ham)) : -1;
  const land = Math.min(a.ilk + a.adet - 1, a.ilk + Math.max(1, at));
  const logo = logoBul(`${yazi} ${s.metin}`);
  const params = { adim: b.sira, toplam: b.toplam, baslik, ...(alt && { alt }), ...(sayi !== undefined && { sayi }), ikon: ikonBul(`${yazi} ${s.metin}`), ...(logo && { logo }), startWord: a.ilk, landWord: land };
  return { template: "rakam-kart", kind: "motion", params, neden: `rakam-kart yönü${logo ? ` (logo: ${logo})` : ""}${sayi !== undefined ? `, sayaç ${sayi}` : ", adım numarası"}` };
}

function editoryal(s: FisSahne, _a: KelimeAraligi, b: YonBaglami): KalipSecimi | undefined {
  const { baslik, alt } = baslikAlt(s, 90, 130);
  if (baslik === "") return undefined;
  const vurgu = vurguKelime(baslik);
  const params = { adim: b.sira, toplam: b.toplam, baslik, ...(vurgu && baslik.includes(vurgu) && { vurgu }), ...(alt && { alt }) };
  return { template: "editoryal", kind: "motion", params, neden: "editoryal yönü: büyük tipografi + vurgu" };
}

/**
 * Karma: sahnenin içeriğine göre yön (`karma.ts`); tek sahne verilirse geçmişsiz (çeşitlilik kuralı yok).
 * Plan kurulurken sahnelerin tümü için `karmaYonleri` hesaplanır ve `yon` olarak somut yön verilir (`karmaNedeni` ile).
 */
function karma(s: FisSahne, a: KelimeAraligi, b: YonBaglami): KalipSecimi {
  return somutYon(b.sira === 1 ? karmaYonleri([s])[0]! : adayYonler(s)[0]!, s, a, b, "karma");
}

function somutYon(yon: SomutYon, s: FisSahne, a: KelimeAraligi, b: YonBaglami, onEk?: string): KalipSecimi {
  const k = yon === "sohbet" ? sohbet(s, a) : yon === "terminal" ? terminal(s, a, b) : yon === "rakam-kart" ? rakamKart(s, a, b) : editoryal(s, a, b);
  const sonuc = k ?? kartaDus(s, `${yon} yönü kuralına uymadı: kart`);
  return onEk ? { ...sonuc, neden: `${onEk} → ${yon}: ${sonuc.neden}` } : sonuc;
}

/** Karma planı: sahne `i` için karma dizisindeki somut yönle eşler. */
export function karmaEsle(yon: SomutYon, s: FisSahne, a: KelimeAraligi, b: YonBaglami): KalipSecimi {
  if (bosluksuz(s.metin) === "") return kartaDus(s, `karma → ${yon} ama sahne metni boş: yalnız kart`);
  return somutYon(yon, s, a, b, "karma");
}

/** Sahne için yönün kalıbı; sahne metni boşsa ya da kalıp kuralına uymuyorsa `kart`. */
export function yonEsle(yon: GorselYon | undefined, s: FisSahne, a: KelimeAraligi, b: YonBaglami): KalipSecimi {
  if (yon === undefined) return kalipEsle(s, a);
  if (yon === "karma") return karma(s, a, b);
  if (bosluksuz(s.metin) === "") return kartaDus(s, `${yon} yönü ama sahne metni boş: yalnız kart`);
  return somutYon(yon, s, a, b);
}
