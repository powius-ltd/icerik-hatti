import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { damgalariGeriEsle, okunusKur, type SozlukGirdisi } from "../../src/uret/ses/ayar.ts";
import { createElevenLabsProvider } from "../../src/uret/ses/elevenlabs.ts";
import type { SesSaglayici } from "../../src/uret/ses/saglayici.ts";
import { saglayiciKur, sesUret } from "../../src/uret/ses/sentez.ts";
import { temaYukle } from "../../src/uret/render/tema.ts";

const SOZLUK: SozlukGirdisi[] = [
  { display: "Claude", spoken: "Klod" },
  { display: "OpenMontage", spoken: "Opın Montaj" },
];

describe("telaffuz sözlüğü", () => {
  it("eki ve büyük/küçük harfi korur, kelime içine dokunmaz", () => {
    const o = okunusKur("Claude'u, claude ve CLAUDE; ClaudeCode kalır.", SOZLUK);
    expect(o.metin).toBe("Klod'u, klod ve KLOD; ClaudeCode kalır.");
  });

  it("çok kelimeli okunuş kelime sayısını artırır, geri eşleme damgaları gösterim kelimesinde birleştirir", () => {
    const gosterim = "OpenMontage ile Claude'u dene";
    const o = okunusKur(gosterim, SOZLUK);
    expect(o.metin).toBe("Opın Montaj ile Klod'u dene");
    expect(o.sayilar).toEqual([2, 1, 1, 1]);
    const damgalar = o.metin.split(" ").map((text, i) => ({ text, start: i, end: i + 0.5 }));
    expect(damgalariGeriEsle(gosterim, o, damgalar)).toEqual([
      { text: "OpenMontage", start: 0, end: 1.5 },
      { text: "ile", start: 2, end: 2.5 },
      { text: "Claude'u", start: 3, end: 3.5 },
      { text: "dene", start: 4, end: 4.5 },
    ]);
  });

  it("damga sayısı tutmazsa fırlatır", () => {
    const o = okunusKur("Claude var", SOZLUK);
    expect(() => damgalariGeriEsle("Claude var", o, [{ text: "x", start: 0, end: 1 }])).toThrow(/eşlenemedi/);
  });

  it("varsayılan hesap konfigünde ses ayarı AISCALE Batu değerleridir", async () => {
    const tema = await temaYukle("varsayilan");
    expect(tema.ses).toMatchObject({ modelId: "eleven_v4", usdPer1kChars: 0.3, settings: { stability: 0.5, similarityBoost: 0.9, style: 0, useSpeakerBoost: true, speed: 1.2 } });
    expect(tema.ses!.lexicon.map((l) => l.display)).toEqual(["OpenMontage", "Claude", "Code", "GitHub", "HyperFrames"]);
  });
});

function sahteFetch() {
  const govdeler: Array<Record<string, unknown>> = [];
  const fetchImpl = (async (_u: unknown, init?: RequestInit) => {
    const g = JSON.parse(String(init!.body)) as { text: string };
    govdeler.push(g as Record<string, unknown>);
    const characters = [...g.text];
    return new Response(JSON.stringify({ audio_base64: Buffer.from("mp3").toString("base64"), alignment: { characters, character_start_times_seconds: characters.map((_, i) => i / 10), character_end_times_seconds: characters.map((_, i) => (i + 1) / 10) } }), { status: 200 });
  }) as typeof fetch;
  return { govdeler, fetchImpl };
}

const kosucu = (async () => ({ kod: 0, stdout: "30", stderr: "" })) as never;

describe("ses ayarı akışı", () => {
  it("ayar ve sözlük istek gövdesine girer; ses.json kelimeleri gösterim yazımında kalır", async () => {
    const { govdeler, fetchImpl } = sahteFetch();
    const tema = await temaYukle("varsayilan");
    const { kur, sesId } = saglayiciKur("elevenlabs", { ELEVENLABS_API_KEY: "k", ELEVENLABS_VOICE_ID: "v1" }, fetchImpl);
    const klasor = await mkdtemp(path.join(tmpdir(), "ses-"));
    const s = await sesUret({ metin: "Claude ile OpenMontage", klasor, saglayici: kur(tema.ses), sozluk: tema.ses!.lexicon, sesId, kosucu });
    expect(govdeler[0]).toMatchObject({ text: "Klad ile Opın Montaj", model_id: "eleven_v4", voice_settings: { stability: 0.5, similarity_boost: 0.9, style: 0, use_speaker_boost: true, speed: 1.2 } });
    expect(s.kelimeler.map((k) => k.w)).toEqual(["Claude", "ile", "OpenMontage"]);
    expect(s.usd).toBeCloseTo((20 / 1000) * 0.3, 6);
    expect(JSON.parse(await readFile(path.join(klasor, "ses.json"), "utf8")).kelimeler).toHaveLength(3);
  });

  it("ELEVENLABS_MODEL ortam değişkeni hesap modelini ezer", async () => {
    const { govdeler, fetchImpl } = sahteFetch();
    const tema = await temaYukle("varsayilan");
    const { kur } = saglayiciKur("elevenlabs", { ELEVENLABS_API_KEY: "k", ELEVENLABS_VOICE_ID: "v1", ELEVENLABS_MODEL: "model-y" }, fetchImpl);
    await kur(tema.ses).konus({ metin: "merhaba", sesId: "v1" });
    expect(govdeler[0]).toMatchObject({ model_id: "model-y" });
  });

  it("önbellek imzası ayar, model ve sözlük değişince değişir; aynıysa API çağrılmaz", async () => {
    const { fetchImpl } = sahteFetch();
    const klasor = await mkdtemp(path.join(tmpdir(), "ses-"));
    const kur = (settings: { stability: number }, modelId = "m1"): SesSaglayici => createElevenLabsProvider({ apiKey: "k", fetchImpl, modelId, voiceSettings: settings });
    const g = (saglayici: SesSaglayici, sozluk: SozlukGirdisi[] = []) => ({ metin: "Claude geldi", klasor, saglayici, sozluk, sesId: "v", kosucu });
    expect((await sesUret(g(kur({ stability: 0.5 })))).cagriYapildi).toBe(true);
    expect((await sesUret(g(kur({ stability: 0.5 })))).cagriYapildi).toBe(false);
    expect((await sesUret(g(kur({ stability: 0.6 })))).cagriYapildi).toBe(true);
    expect((await sesUret(g(kur({ stability: 0.6 }, "m2")))).cagriYapildi).toBe(true);
    expect((await sesUret(g(kur({ stability: 0.6 }, "m2"), SOZLUK))).cagriYapildi).toBe(true);
    expect((await sesUret(g(kur({ stability: 0.6 }, "m2"), SOZLUK))).cagriYapildi).toBe(false);
  });
});
