// Kaynak: viral-uyarla/src/cozumle/agy-zarf.ts (335b436)
/**
 * agy `--output-format json` zarfı (agy 1.4.0'da ölçüldü):
 *   { conversation_id, status: "SUCCESS", response: "<JSON metni>", duration_seconds, num_turns,
 *     structured_output: { …şemaya uyan nesne… }, json_schema, usage: { input_tokens, output_tokens, thinking_tokens, total_tokens } }
 * `--json-schema` verilince `structured_output` doğrudan nesnedir (öncelikli); yoksa `response` metni (çitli olabilir). Zarf hiç yoksa
 * stdout'un kendisi yanıt sayılır. Burası yalnız kabuğu açar; içeriği sonradan zod doğrular.
 */
import { jsonAyikla } from "./json-ayikla.ts";

export interface AgyKullanim {
  girisToken?: number;
  cikisToken?: number;
  toplamToken?: number;
}

export interface AgyZarf {
  /** Şemaya uyması beklenen yük: nesne (`structured_output`) ya da metin (`response` / ham stdout). */
  yuk: unknown;
  kullanim: AgyKullanim;
}

function kayit(deger: unknown): deger is Record<string, unknown> {
  return typeof deger === "object" && deger !== null && !Array.isArray(deger);
}

const sayac = (deger: unknown): number | undefined => (typeof deger === "number" && Number.isFinite(deger) && deger >= 0 ? deger : undefined);

export function zarfOku(stdout: string): AgyZarf {
  const ayiklanan = jsonAyikla(stdout);
  if (ayiklanan.ok && kayit(ayiklanan.deger) && ("structured_output" in ayiklanan.deger || "response" in ayiklanan.deger)) {
    const zarf = ayiklanan.deger;
    const kullanim = kayit(zarf.usage) ? zarf.usage : {};
    return {
      yuk: kayit(zarf.structured_output) ? zarf.structured_output : zarf.response,
      kullanim: { girisToken: sayac(kullanim.input_tokens), cikisToken: sayac(kullanim.output_tokens), toplamToken: sayac(kullanim.total_tokens) },
    };
  }
  return { yuk: stdout, kullanim: {} };
}
