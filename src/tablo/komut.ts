/**
 * tablo kur | tablo yokla [--kuru]
 * kur: Drive klasörü + tablo (yoksa), id `.hat/tablo.json`'a. yokla: bir tur (cron/systemd timer'dan çağrılır; üst üste binen tur kilitle engellenir).
 * --kuru: tabloyu okur, ne yapılacağını yazdırır; hiçbir yazma, alt komut, yükleme yok.
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { argumanlar, kosuYollari } from "../ortak/kosu.ts";
import { calistir as surec, temelEnv } from "../ortak/surec.ts";
import { gercekAltKomutlar } from "./alt-komutlar.ts";
import { driveIstemci } from "./drive.ts";
import { jetonSaglayici, type Kosucu } from "./erisim.ts";
import { tabloKur } from "./kur.ts";
import { sheetsIstemci } from "./sheets.ts";
import { yokla } from "./yokla.ts";
import { zernioGonderiIptal, zernioYayinSorgu } from "./yayin.ts";

const AYAR = resolve(".hat/tablo.json");
const KILIT = resolve(".hat/tablo.kilit");
const KULLANIM = "Kullanım: npm run hat -- tablo kur | tablo yokla [--kuru]";

const rclone: Kosucu = (komut, args) => surec(komut, args, { env: temelEnv(), timeoutMs: 15 * 60_000 });

/** Tek tur kilidi: canlı bir süreç tutuyorsa false. Ölü sürecin kilidi devralınır. */
export function kilitAl(yol: string, canliMi: (pid: number) => boolean = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } }): boolean {
  mkdirSync(dirname(yol), { recursive: true });
  try {
    writeFileSync(yol, String(process.pid), { flag: "wx" });
    return true;
  } catch {
    const pid = Number(readFileSync(yol, "utf8"));
    if (pid && canliMi(pid)) return false;
    writeFileSync(yol, String(process.pid));
    return true;
  }
}

export async function calistir(argv: string[]): Promise<void> {
  const { konum, bayrak } = argumanlar(argv);
  const alt = konum[0];
  const jeton = jetonSaglayici(rclone);
  if (alt === "kur") {
    const { tabloId } = await tabloKur({ kosucu: rclone, jeton, yaz: console.log });
    mkdirSync(dirname(AYAR), { recursive: true });
    writeFileSync(AYAR, `${JSON.stringify({ tabloId, link: `https://docs.google.com/spreadsheets/d/${tabloId}` }, null, 2)}\n`);
    console.log(`kaydedildi: ${AYAR}`);
    return;
  }
  if (alt !== "yokla") throw new Error(KULLANIM);
  let tabloId: string;
  try {
    tabloId = (JSON.parse(readFileSync(AYAR, "utf8")) as { tabloId: string }).tabloId;
  } catch {
    throw new Error("Tablo kurulu değil: önce `npm run hat -- tablo kur`.");
  }
  const kuru = bayrak.kuru === true;
  if (!kuru && !kilitAl(KILIT)) return console.log("Başka bir tablo turu çalışıyor; bu tur atlandı.");
  try {
    const o = await yokla({
      tablo: sheetsIstemci({ tabloId, jeton }),
      drive: driveIstemci(rclone),
      alt: gercekAltKomutlar,
      yayin: zernioYayinSorgu(process.env),
      iptal: zernioGonderiIptal(process.env),
      kosuDizini: kosuYollari("tablo").kok,
      kosuAdi: "tablo",
      simdi: () => new Date(),
      yaz: console.log,
      kuru,
    });
    console.log(`${kuru ? "[kuru] " : ""}tur bitti: ${o.islenen} işlendi, ${o.atlanan} atlandı, ${o.hata} hata`);
  } finally {
    if (!kuru) rmSync(KILIT, { force: true });
  }
}
