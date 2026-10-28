// Kaynak: viral-uyarla/src/uyarla/claude.ts (335b436)
/** `claude -p` çağrısı (abonelik): araçlar kapalı, oturum kaydı yok, yalnız temel ortam. Yanıttan JSON nesnesi çıkarır. */
import { calistir, temelEnv } from "../ortak/surec.ts";

export interface ClaudeYaniti {
  /** Model çıktısı (yapısal çıktı varsa o, yoksa metinden ayıklanan JSON; ayıklanamazsa undefined). */
  nesne: unknown;
  /** Ham metin (düzeltme turunda modele geri verilir). */
  metin: string;
}

/** Metindeki ilk JSON nesnesini ayıklar (kod çiti ya da önsöz olsa da). */
export function jsonCikar(metin: string): unknown {
  const cit = metin.match(/```(?:json)?\s*([\s\S]*?)```/);
  const aday = (cit?.[1] ?? metin).trim();
  try {
    return JSON.parse(aday);
  } catch {
    const a = aday.indexOf("{");
    const b = aday.lastIndexOf("}");
    if (a < 0 || b <= a) return undefined;
    try {
      return JSON.parse(aday.slice(a, b + 1));
    } catch {
      return undefined;
    }
  }
}

/** `--output-format json` çıktısını çözer. */
export function claudeCiktisiniCoz(stdout: string): ClaudeYaniti {
  let zarf: { is_error?: boolean; result?: string; structured_output?: unknown; subtype?: string };
  try {
    zarf = JSON.parse(stdout);
  } catch {
    throw new Error(`claude çıktısı JSON değil: ${stdout.slice(0, 300)}`);
  }
  if (zarf.is_error) throw new Error(`claude hata döndü (${zarf.subtype ?? "?"}): ${(zarf.result ?? "").slice(0, 300)}`);
  const metin = zarf.result ?? "";
  if (zarf.structured_output !== undefined && zarf.structured_output !== null) {
    return { nesne: zarf.structured_output, metin: metin || JSON.stringify(zarf.structured_output) };
  }
  return { nesne: jsonCikar(metin), metin };
}

export async function claudeSor(istem: string, jsonSema?: object): Promise<ClaudeYaniti> {
  const bin = process.env.CLAUDE_BIN || "claude";
  const arg = ["-p", "--output-format", "json", "--tools", "", "--no-session-persistence", "--strict-mcp-config", "--setting-sources", ""];
  if (process.env.CLAUDE_MODEL) arg.push("--model", process.env.CLAUDE_MODEL);
  if (jsonSema) arg.push("--json-schema", JSON.stringify(jsonSema));
  const zaman = Number(process.env.CLAUDE_TIMEOUT_MS ?? 600_000);
  const sonuc = await calistir(bin, arg, { env: temelEnv(), girdi: istem, timeoutMs: zaman });
  if (sonuc.kod !== 0) {
    const kuyruk = (sonuc.stderr || sonuc.stdout).trim().split("\n").slice(-10).join("\n");
    throw new Error(`claude çıkış kodu ${sonuc.kod}\n${kuyruk}`);
  }
  return claudeCiktisiniCoz(sonuc.stdout);
}
