/** Gerçek alt komutlar: aynı CLI'yi ayrı süreçte çalıştırır (fis/uret/paylas); hata iletisi son anlamlı stderr satırı. */
import { fileURLToPath } from "node:url";
import { calistir } from "../ortak/surec.ts";
import type { AltKomutlar } from "./tipler.ts";

const KOK = fileURLToPath(new URL("../..", import.meta.url));
const DK = 60_000;

async function hat(args: string[], timeoutMs: number): Promise<void> {
  const s = await calistir(`${KOK}node_modules/.bin/tsx`, ["--env-file-if-exists=.env", "src/cli.ts", ...args], { cwd: KOK, env: process.env, timeoutMs });
  if (s.kod === 0 && !/^HATA:/m.test(s.stderr)) return;
  const satirlar = `${s.stderr}\n${s.stdout}`.split("\n").map((l) => l.trim()).filter(Boolean);
  const hata = [...satirlar].reverse().find((l) => /^HATA:/.test(l)) ?? satirlar.pop() ?? `çıkış kodu ${s.kod}`;
  throw new Error(`${args[0]}: ${hata.replace(/^HATA:\s*/, "")}`);
}

export const gercekAltKomutlar: AltKomutlar = {
  fis: ({ url, kosu, id }) => hat(["fis", "--url", url, "--kosu", kosu, "--id", id], 20 * DK),
  uret: (fisYolu) => hat(["uret", "--fis", fisYolu, "--render"], 90 * DK),
  paylas: ({ fisYolu, saat, onay }) => hat(["paylas", "--fis", fisYolu, "--saat", saat, "--onay", onay], 10 * DK),
};
