// Kaynak: viral-uyarla/src/ortak/surec.ts (335b436)
import { spawn } from "node:child_process";

export interface SurecSonucu {
  kod: number;
  stdout: string;
  stderr: string;
}

export interface SurecSecenek {
  cwd?: string;
  /** Alt sürece giden ortam. Verilmezse yalnız PATH, HOME, LANG geçer (sırlar sızmasın). */
  env?: NodeJS.ProcessEnv;
  timeoutMs?: number;
  /** stdin'e yazılacak metin. */
  girdi?: string;
}

/** Güvenli varsayılan ortam: yalnız çalışmak için gerekenler. Ek değişkeni çağıran açıkça ekler. */
export function temelEnv(ek: Record<string, string | undefined> = {}): NodeJS.ProcessEnv {
  const { PATH, HOME, LANG, TMPDIR } = process.env;
  return { PATH, HOME, LANG, TMPDIR, ...ek };
}

/** Komutu kabuk olmadan çalıştırır; süre dolarsa öldürür. Sıfır dışı çıkış hata değildir, `kod` döner. */
export function calistir(komut: string, argumanlar: string[], secenek: SurecSecenek = {}): Promise<SurecSonucu> {
  return new Promise((coz, reddet) => {
    const surec = spawn(komut, argumanlar, { cwd: secenek.cwd, env: secenek.env ?? temelEnv(), stdio: "pipe" });
    let stdout = "";
    let stderr = "";
    surec.stdout.on("data", (p: Buffer) => (stdout += p.toString()));
    surec.stderr.on("data", (p: Buffer) => (stderr += p.toString()));
    const zamanlayici = secenek.timeoutMs
      ? setTimeout(() => {
          surec.kill("SIGKILL");
          reddet(new Error(`${komut} ${secenek.timeoutMs} ms içinde bitmedi`));
        }, secenek.timeoutMs)
      : undefined;
    surec.on("error", (h) => {
      clearTimeout(zamanlayici);
      reddet(h);
    });
    surec.on("close", (kod) => {
      clearTimeout(zamanlayici);
      coz({ kod: kod ?? -1, stdout, stderr });
    });
    if (secenek.girdi !== undefined) surec.stdin.end(secenek.girdi);
    else surec.stdin.end();
  });
}

/** `calistir` + sıfır dışı çıkışta hata (stderr'in son 20 satırıyla). */
export async function calistirBasarili(komut: string, argumanlar: string[], secenek: SurecSecenek = {}): Promise<SurecSonucu> {
  const sonuc = await calistir(komut, argumanlar, secenek);
  if (sonuc.kod !== 0) {
    const kuyruk = sonuc.stderr.trim().split("\n").slice(-20).join("\n");
    throw new Error(`${komut} çıkış kodu ${sonuc.kod}\n${kuyruk}`);
  }
  return sonuc;
}
