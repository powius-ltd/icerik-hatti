/** Sheets API v4 ile `TabloIstemci`: okuma ve YALNIZ hat sütunlarına hücre bazında yazma. */
import { googleCagir, type Getir } from "./erisim.ts";
import { HAT_SUTUNLARI, SUTUNLAR, type HatAlani, type HatSutun, type TabloIstemci } from "./tipler.ts";

const TEMEL = "https://sheets.googleapis.com/v4/spreadsheets";
const SON_SATIR = 2000;

export const sutunHarfi = (s: (typeof SUTUNLAR)[number]) => String.fromCharCode(65 + SUTUNLAR.indexOf(s));

export function sheetsIstemci(a: { tabloId: string; jeton: () => Promise<string>; getir?: Getir }): TabloIstemci {
  const getir = a.getir ?? fetch;
  return {
    async oku() {
      const j = (await googleCagir(a.jeton, getir, "GET", `${TEMEL}/${a.tabloId}/values/A1:I${SON_SATIR}?valueRenderOption=FORMATTED_VALUE`)) as { values?: string[][] };
      return (j.values ?? []).map((satir) => satir.map((h) => String(h ?? "")));
    },
    async yaz(satirNo, alanlar: HatAlani) {
      const girdiler = Object.entries(alanlar) as Array<[HatSutun, string]>;
      for (const [sutun] of girdiler) if (!HAT_SUTUNLARI.includes(sutun)) throw new Error(`"${String(sutun)}" hat sütunu değil; ekip hücrelerine yazılmaz.`);
      if (!Number.isInteger(satirNo) || satirNo < 2) throw new Error(`Geçersiz satır: ${satirNo} (başlık satırına yazılmaz).`);
      if (girdiler.length === 0) return;
      await googleCagir(a.jeton, getir, "POST", `${TEMEL}/${a.tabloId}/values:batchUpdate`, {
        valueInputOption: "RAW",
        data: girdiler.map(([sutun, deger]) => ({ range: `${sutunHarfi(sutun)}${satirNo}`, values: [[deger]] })),
      });
    },
  };
}
