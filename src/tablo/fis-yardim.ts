/** Fiş dosyasından tablo adımının ihtiyacı olan alanlar (gevşek okuma: paylas/fis.ts) + zernio_post_id. */
import { readFileSync } from "node:fs";
import { fisOku as gevsekOku, type FisAlanlari } from "../paylas/fis.ts";

export interface TabloFis extends FisAlanlari {
  zernioPostId?: string;
}

export function tabloFisOku(yol: string): TabloFis {
  const metin = readFileSync(yol, "utf8");
  const alan = gevsekOku(metin);
  const id = /^zernio_post_id:\s*"?([^"\r\n]+?)"?\s*$/m.exec(metin)?.[1];
  return id ? { ...alan, zernioPostId: id } : alan;
}
