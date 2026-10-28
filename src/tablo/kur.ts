/** `tablo kur`: Drive klasörünü ve tabloyu yoksa oluşturur (başlık, onay açılır listeleri); varsa dokunmaz. Tablo id'sini döndürür. */
import { googleCagir, REMOTE, type Getir, type Kosucu } from "./erisim.ts";
import { KLASOR, SUTUNLAR, TABLO_ADI, VIDEO_KLASORU } from "./tipler.ts";

const SHEETS = "https://sheets.googleapis.com/v4/spreadsheets";
const DRIVE = "https://www.googleapis.com/drive/v3/files";
const SON = 2000;

async function rc(kosucu: Kosucu, args: string[], hata: string): Promise<string> {
  const s = await kosucu("rclone", args);
  if (s.kod !== 0) throw new Error(`${hata}: ${s.stderr.trim().split("\n").pop() ?? "rclone hatası"}`);
  return s.stdout;
}

export async function tabloKur(a: { kosucu: Kosucu; jeton: () => Promise<string>; getir?: Getir; yaz: (s: string) => void }): Promise<{ tabloId: string; yeni: boolean }> {
  const getir = a.getir ?? fetch;
  await rc(a.kosucu, ["mkdir", `${REMOTE}:${VIDEO_KLASORU}`], "Drive klasörü oluşturulamadı");
  const liste = JSON.parse(await rc(a.kosucu, ["lsjson", `${REMOTE}:${KLASOR}`, "--files-only"], "Drive klasörü listelenemedi")) as Array<{ ID: string; Name: string; MimeType?: string }>;
  const var_ = liste.find((f) => f.MimeType === "application/vnd.google-apps.spreadsheet" && f.Name.startsWith(TABLO_ADI));
  if (var_) {
    a.yaz(`Tablo zaten var: ${var_.ID}`);
    return { tabloId: var_.ID, yeni: false };
  }
  const klasorId = (await rc(a.kosucu, ["backend", "getid", `${REMOTE}:${KLASOR}`], "Klasör kimliği alınamadı")).trim();
  const dosya = (await googleCagir(a.jeton, getir, "POST", DRIVE, { name: TABLO_ADI, mimeType: "application/vnd.google-apps.spreadsheet", parents: [klasorId] })) as { id?: string };
  if (!dosya.id) throw new Error("Google tablo oluşturdu ama kimlik dönmedi.");
  const id = dosya.id;
  await googleCagir(a.jeton, getir, "POST", `${SHEETS}/${id}/values:batchUpdate`, { valueInputOption: "RAW", data: [{ range: "A1:I1", values: [[...SUTUNLAR]] }] });
  const aralik = (bas: number, son: number) => ({ sheetId: 0, startRowIndex: 1, endRowIndex: SON, startColumnIndex: bas, endColumnIndex: son });
  await googleCagir(a.jeton, getir, "POST", `${SHEETS}/${id}:batchUpdate`, {
    requests: [
      { updateSheetProperties: { properties: { sheetId: 0, gridProperties: { frozenRowCount: 1 } }, fields: "gridProperties.frozenRowCount" } },
      { repeatCell: { range: aralik(1, 2), cell: { userEnteredFormat: { numberFormat: { type: "TEXT" } } }, fields: "userEnteredFormat.numberFormat" } },
      { setDataValidation: { range: aralik(3, 5), rule: { condition: { type: "ONE_OF_LIST", values: [{ userEnteredValue: "evet" }, { userEnteredValue: "hayır" }] }, strict: true, showCustomUi: true } } },
    ],
  });
  a.yaz(`Tablo oluşturuldu: https://docs.google.com/spreadsheets/d/${id}`);
  return { tabloId: id, yeni: true };
}
