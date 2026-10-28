// Kaynak: viral-uyarla/src/cozumle/analiz.ts (335b436)
/**
 * agy ile tek videoyu çözümler: şemayı klasöre yaz → istemi kur → agy → yanıtı çöz (zarf + çit + JSON) → zod + anlamsal kontrol.
 * Doğrulama hatasında TEK düzeltme turu: hatalar modele geri verilir; yine geçersizse açık hata (dosya yazılmaz).
 * `adayId` modelden istenmez; sonuca biz ekleriz. Süre ölçülmüşse (`ffprobe`) modelin tahmini yerine ölçülen yazılır.
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import { analizSema, type Analiz, type Dokum } from "../ortak/tipler.ts";
import { agyCalistir, type AgyBagimlilik, type AgyIstatistik } from "./agy.ts";
import { zarfOku, type AgyKullanim } from "./agy-zarf.ts";
import { dokumMetni } from "./dokum.ts";
import { duzeltmeIstemi, analizIstemi } from "./istem.ts";
import { jsonAyikla } from "./json-ayikla.ts";
import { modelAnalizSema, modelJsonSemasiMetni } from "./sema.ts";

export const SEMA_DOSYASI = "response-schema.json";
const AZAMI_SORUN = 8;
/** Sahne sınırı karşılaştırmalarında saniye toleransı (model yuvarlar). */
const TOLERANS_SN = 0.5;

export interface AnalizGirdisi {
  adayId: string;
  /** Video dosyasını içeren izole klasör (agy cwd + `--add-dir`). */
  dizin: string;
  videoAdi: string;
  dokum: Dokum;
  aciklama?: string;
  /** ffprobe ile ölçülen süre (varsa). */
  sureSn?: number;
}

export interface AnalizSonucu {
  analiz: Analiz;
  istatistik: AgyIstatistik;
  kullanim: AgyKullanim;
}

type Cozum = { ok: true; analiz: Analiz } | { ok: false; sorunlar: string; yanit: string };

function zodSorunlari(hata: z.ZodError): string {
  const satirlar = hata.issues.slice(0, AZAMI_SORUN).map((s) => `${s.path.length > 0 ? s.path.join(".") : "(kök)"}: ${s.message}`);
  const fazla = hata.issues.length - satirlar.length;
  return fazla > 0 ? `${satirlar.join("\n")}\n(+${fazla} hata daha)` : satirlar.join("\n");
}

/** Şemaya uyan ama zamanlaması tutarsız yanıtları yakalar. Numaralandırma otomatik düzeltilir (hata sayılmaz). */
export function anlamsalSorunlar(a: Analiz): string[] {
  const sorunlar: string[] = [];
  a.sahneler.forEach((s, i) => {
    if (s.sonSn <= s.basSn) sorunlar.push(`sahneler.${i}: sonSn (${s.sonSn}) basSn (${s.basSn}) değerinden büyük olmalı`);
    const onceki = a.sahneler[i - 1];
    if (onceki && s.basSn < onceki.sonSn - TOLERANS_SN) sorunlar.push(`sahneler.${i}: önceki sahneyle çakışıyor (basSn ${s.basSn} < önceki sonSn ${onceki.sonSn})`);
  });
  const son = a.sahneler.at(-1);
  if (son && son.sonSn > a.sureSn + 1) sorunlar.push(`sahneler: son sahne (${son.sonSn} sn) video süresini (${a.sureSn} sn) aşıyor`);
  return sorunlar.slice(0, AZAMI_SORUN);
}

/** agy stdout'unu çözer: zarf → yük → JSON → zod → anlamsal kontrol. Başarısızlıkta düzeltme turuna girecek bilgiyi döndürür. */
export function yanitiCoz(stdout: string, adayId: string, sureSn?: number): { cozum: Cozum; kullanim: AgyKullanim } {
  const { yuk, kullanim } = zarfOku(stdout);
  let nesne: unknown = yuk;
  if (typeof yuk === "string") {
    const ayiklanan = jsonAyikla(yuk);
    if (!ayiklanan.ok) return { cozum: { ok: false, sorunlar: ayiklanan.sebep, yanit: yuk }, kullanim };
    nesne = ayiklanan.deger;
  }
  const model = modelAnalizSema.safeParse(nesne);
  if (!model.success) return { cozum: { ok: false, sorunlar: zodSorunlari(model.error), yanit: JSON.stringify(nesne ?? null) }, kullanim };

  const tam = analizSema.parse({
    adayId,
    ...model.data,
    ...(sureSn !== undefined ? { sureSn } : {}),
    sahneler: model.data.sahneler.map((s, i) => ({ ...s, no: i + 1 })),
  });
  const sorunlar = anlamsalSorunlar(tam);
  if (sorunlar.length > 0) return { cozum: { ok: false, sorunlar: sorunlar.join("\n"), yanit: JSON.stringify(nesne) }, kullanim };
  return { cozum: { ok: true, analiz: tam }, kullanim };
}

function topla(a: AgyKullanim, b: AgyKullanim): AgyKullanim {
  // Bir alan YALNIZ iki turda da bildirildiyse toplanır (kısmi toplam tam sayı gibi yazılmaz: bilinmeyen ≠ 0).
  const ekle = (x?: number, y?: number): number | undefined => (x !== undefined && y !== undefined ? x + y : undefined);
  return { girisToken: ekle(a.girisToken, b.girisToken), cikisToken: ekle(a.cikisToken, b.cikisToken), toplamToken: ekle(a.toplamToken, b.toplamToken) };
}

export async function analizEt(g: AnalizGirdisi, bag: AgyBagimlilik): Promise<AnalizSonucu> {
  const semaYolu = path.join(g.dizin, SEMA_DOSYASI);
  await writeFile(semaYolu, modelJsonSemasiMetni(), "utf8");
  const istatistik: AgyIstatistik = { cagri: 0, kotaYenidenDeneme: 0, duzeltmeTuru: 0 };

  const istem = analizIstemi({ videoAdi: g.videoAdi, dokum: dokumMetni(g.dokum), dokumDili: g.dokum.dil, aciklama: g.aciklama, sureSn: g.sureSn });
  const ilk = yanitiCoz(await agyCalistir({ dizin: g.dizin, semaYolu, istem }, bag, istatistik), g.adayId, g.sureSn);
  if (ilk.cozum.ok) return { analiz: ilk.cozum.analiz, istatistik, kullanim: ilk.kullanim };

  istatistik.duzeltmeTuru += 1;
  const duzeltme = duzeltmeIstemi(istem, ilk.cozum.yanit, ilk.cozum.sorunlar);
  const ikinci = yanitiCoz(await agyCalistir({ dizin: g.dizin, semaYolu, istem: duzeltme }, bag, istatistik), g.adayId, g.sureSn);
  if (ikinci.cozum.ok) return { analiz: ikinci.cozum.analiz, istatistik, kullanim: topla(ilk.kullanim, ikinci.kullanim) };
  throw new Error(`Model yanıtı düzeltme turundan sonra da geçersiz: ${ikinci.cozum.sorunlar.replace(/\s+/g, " ").slice(0, 300)}`);
}
