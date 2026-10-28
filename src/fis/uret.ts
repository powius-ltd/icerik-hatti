/** Fiş üretimi: giriş → (claude -p + denetim, tek düzeltme turu) → Fis. Sağlayıcı enjekte edilir (testte sahte). */
import type { Analiz, Dokum } from "../ortak/tipler.ts";
import { z } from "zod";
import { fisDenetle, kaynagaSabitle } from "./denetle.ts";
import { duzeltmeIstemi, fisIstemi, metinIstemi } from "./istem.ts";
import { fisModelSema, type Dogrulanacak, type Fis, type Kaynak } from "./sema.ts";

export type ClaudeSor = (istem: string, jsonSema?: object) => Promise<{ nesne: unknown; metin: string }>;

export interface UretGirdisi {
  id: string;
  kaynak: Kaynak;
  hesap: string;
  analiz?: Analiz;
  dokum?: Dokum;
  metin?: string;
}

export interface UretSonucu {
  fis: Fis;
  dogrulanacak: Dogrulanacak[];
  duzeltmeTuru: number;
}

export async function fisUret(g: UretGirdisi, claude: ClaudeSor): Promise<UretSonucu> {
  const istem = g.analiz && g.dokum ? fisIstemi(g.analiz, g.dokum) : g.metin !== undefined ? metinIstemi(g.metin) : undefined;
  if (!istem) throw new Error("Fiş için çözümleme ya da hazır metin gerekli.");
  const jsonSema = z.toJSONSchema(fisModelSema, { io: "input", unrepresentable: "any", target: "draft-7" });

  let yanit = await claude(istem, jsonSema);
  let denetim = fisDenetle(yanit.nesne, g.analiz);
  let duzeltmeTuru = 0;
  if (!denetim.tamam) {
    duzeltmeTuru = 1;
    yanit = await claude(duzeltmeIstemi(istem, yanit.metin, denetim.sorunlar), jsonSema);
    denetim = fisDenetle(yanit.nesne, g.analiz);
    if (!denetim.tamam) throw new Error(`Fiş düzeltme turundan sonra da geçersiz:\n  - ${denetim.sorunlar.join("\n  - ")}`);
  }
  const govde = g.analiz ? kaynagaSabitle(denetim.govde, g.analiz) : denetim.govde;
  const fis: Fis = {
    fis_id: g.id,
    kaynak: g.kaynak,
    hesap: g.hesap,
    fis_onay: "hayir",
    paylasim_onay: "hayir",
    durum: "taslak",
    sahneler: govde.sahneler,
    aciklama_taslagi: govde.aciklama_taslagi,
  };
  return { fis, dogrulanacak: govde.dogrulanacak, duzeltmeTuru };
}
