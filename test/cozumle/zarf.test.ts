// Kaynak: viral-uyarla/test/cozumle/zarf.test.ts (335b436)
import { describe, expect, it } from "vitest";
import { zarfOku } from "../../src/cozumle/agy-zarf.ts";
import { jsonAyikla } from "../../src/cozumle/json-ayikla.ts";
import { zarf } from "./yardimci.ts";

describe("agy zarfı", () => {
  it("structured_output nesnesini öncelikli alır, kullanımı okur", () => {
    const sonuc = zarfOku(zarf({ a: 1 }, { input_tokens: 10, output_tokens: 5, total_tokens: 15 }));
    expect(sonuc.yuk).toEqual({ a: 1 });
    expect(sonuc.kullanim).toEqual({ girisToken: 10, cikisToken: 5, toplamToken: 15 });
  });

  it("structured_output yoksa response metnini verir (çitli olabilir)", () => {
    const sonuc = zarfOku(JSON.stringify({ status: "SUCCESS", response: '```json\n{"a":2}\n```' }));
    expect(sonuc.yuk).toBe('```json\n{"a":2}\n```');
    expect(sonuc.kullanim).toEqual({ girisToken: undefined, cikisToken: undefined, toplamToken: undefined });
  });

  it("zarf yoksa stdout'un kendisi yanıttır", () => {
    expect(zarfOku("düz metin yanıt").yuk).toBe("düz metin yanıt");
    expect(zarfOku('{"dil":"en"}').yuk).toBe('{"dil":"en"}');
  });

  it("eksik/negatif kullanım alanı tanımsız kalır (0 uydurulmaz)", () => {
    const sonuc = zarfOku(JSON.stringify({ response: "{}", usage: { input_tokens: -1, total_tokens: 7 } }));
    expect(sonuc.kullanim.girisToken).toBeUndefined();
    expect(sonuc.kullanim.toplamToken).toBe(7);
  });
});

describe("JSON ayıklama", () => {
  it("düz, çitli, metin içi, sondaki virgüllü", () => {
    expect(jsonAyikla('{"a":1}')).toEqual({ ok: true, deger: { a: 1 } });
    expect(jsonAyikla('Tamam:\n```json\n{"a":2}\n```\nbitti')).toEqual({ ok: true, deger: { a: 2 } });
    expect(jsonAyikla('Sonuç şu {"a":{"b":"}"}} umarım olur')).toEqual({ ok: true, deger: { a: { b: "}" } } });
    expect(jsonAyikla('{"a":[1,2,],}')).toEqual({ ok: true, deger: { a: [1, 2] } });
  });

  it("çözülemeyen ve boş yanıtı sebebiyle bildirir", () => {
    expect(jsonAyikla("")).toMatchObject({ ok: false });
    expect(jsonAyikla("hiç json yok")).toMatchObject({ ok: false, sebep: expect.stringContaining("JSON") });
  });
});
