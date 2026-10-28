// Kaynak: kreatif-studyo/src/production/voice/providers/elevenlabs.test.ts (b6aff3d)
import { describe, expect, it } from "vitest";
import { wordsFromCharacters, type CharAlignment } from "../../src/uret/ses/karakter-kelime.ts";
import { createElevenLabsProvider } from "../../src/uret/ses/elevenlabs.ts";

/** Metnin her karakterine 0,1 sn veren sahte damga (boşluk dahil). */
function alignmentOf(text: string): CharAlignment {
  const characters = [...text];
  return {
    characters,
    character_start_times_seconds: characters.map((_, index) => index / 10),
    character_end_times_seconds: characters.map((_, index) => (index + 1) / 10),
  };
}

function fakeFetch(status: number, body: unknown) {
  const calls: { url: string; init: RequestInit }[] = [];
  const fetchImpl = (async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} });
    return new Response(typeof body === "string" ? body : JSON.stringify(body), { status, statusText: status === 200 ? "OK" : "Bad Request" });
  }) as typeof fetch;
  return { calls, fetchImpl };
}

const TEXT = "On üç kural yazdı. Naismith'in 1891'de";
const AUDIO = Buffer.from("sahte-mp3").toString("base64");

describe("wordsFromCharacters", () => {
  it("boşluktan böler; noktalama, kesme işaretli ek ve Türkçe harf kelimenin üstünde kalır", () => {
    const words = wordsFromCharacters(alignmentOf("Güneş  doğdu, Türkiye'nin\nışığı."));
    expect(words.map((word) => word.text)).toEqual(["Güneş", "doğdu,", "Türkiye'nin", "ışığı."]);
    expect(words[0]).toEqual({ text: "Güneş", start: 0, end: 0.5 });
    expect(words[1]).toEqual({ text: "doğdu,", start: 0.7, end: 1.3 });
  });

  it("boyu tutmayan diziyi ve zamanı eksik karakteri uydurmadan reddeder", () => {
    const short = { ...alignmentOf("ilk oyun"), character_end_times_seconds: [0.1] };
    expect(() => wordsFromCharacters(short)).toThrow(/Karakter damgası tutarsız: 8 karakter, 8 başlangıç, 1 bitiş/);
    const hole = alignmentOf("ilk oyun");
    hole.character_start_times_seconds[5] = Number.NaN;
    expect(() => wordsFromCharacters(hole)).toThrow(/zaman eksik ya da bozuk: 6\. karakter "y"/);
    expect(() => wordsFromCharacters({ characters: [], character_start_times_seconds: [], character_end_times_seconds: [] })).toThrow(/Karakter damgası boş/);
  });
});

describe("createElevenLabsProvider", () => {
  it("anahtar yoksa açık hata verir", () => {
    expect(() => createElevenLabsProvider({ apiKey: " " })).toThrow(/ELEVENLABS_API_KEY tanımlı değil/);
  });

  it("damgalı uca tek çağrı yapar; karakter damgasından kelime zamanı ve gerçek karakter sayısından tutar çıkar", async () => {
    const { calls, fetchImpl } = fakeFetch(200, { audio_base64: AUDIO, alignment: alignmentOf(TEXT) });
    const provider = createElevenLabsProvider({ apiKey: "gizli", fetchImpl, modelId: "model-x", voiceSettings: { stability: 0.4, similarityBoost: 0.8, speed: 1.05 } });
    const sonuc = await provider.konus({ metin: TEXT, sesId: "ses/1" });

    expect(calls).toHaveLength(1);
    expect(calls[0]!.url).toBe("https://api.elevenlabs.io/v1/text-to-speech/ses%2F1/with-timestamps?output_format=mp3_44100_128");
    expect(calls[0]!.init).toMatchObject({ method: "POST", headers: { "xi-api-key": "gizli", "Content-Type": "application/json" } });
    expect(JSON.parse(String(calls[0]!.init.body))).toEqual({ text: TEXT, model_id: "model-x", voice_settings: { stability: 0.4, similarity_boost: 0.8, speed: 1.05 } });

    expect(Buffer.from(sonuc.ses).toString()).toBe("sahte-mp3");
    expect(sonuc.damgalar.map((d) => d.text)).toEqual(["On", "üç", "kural", "yazdı.", "Naismith'in", "1891'de"]);
    expect(sonuc.damgalar[3]).toEqual({ text: "yazdı.", start: 1.2, end: 1.8 });
    expect(sonuc).toMatchObject({ model: "model-x", karakter: TEXT.length });
    expect(sonuc.usd).toBeCloseTo((TEXT.length / 1000) * 0.08, 6);
  });

  it("ses ayarı verilmediyse gövdeye yazmaz", async () => {
    const { calls, fetchImpl } = fakeFetch(200, { audio_base64: AUDIO, alignment: alignmentOf(TEXT) });
    await createElevenLabsProvider({ apiKey: "k", fetchImpl }).konus({ metin: TEXT, sesId: "v" });
    expect(JSON.parse(String(calls[0]!.init.body))).toEqual({ text: TEXT, model_id: "eleven_multilingual_v2" });
  });

  it("hatanın nedenini gövdeden okur", async () => {
    const detail = { detail: { status: "invalid_api_key", message: "Invalid API key" } };
    await expect(createElevenLabsProvider({ apiKey: "k", fetchImpl: fakeFetch(400, detail).fetchImpl }).konus({ metin: TEXT, sesId: "v" })).rejects.toThrow(/elevenlabs: 400 Bad Request: Invalid API key/);
    await expect(createElevenLabsProvider({ apiKey: "k", fetchImpl: fakeFetch(400, "düz metin").fetchImpl }).konus({ metin: TEXT, sesId: "v" })).rejects.toThrow(/400 Bad Request: düz metin/);
  });

  it("damgasız ya da metni tutmayan yanıtı yutmaz", async () => {
    const konus = (body: unknown) => createElevenLabsProvider({ apiKey: "k", fetchImpl: fakeFetch(200, body).fetchImpl }).konus({ metin: TEXT, sesId: "v" });
    await expect(konus({ audio_base64: AUDIO, alignment: null })).rejects.toThrow(/karakter zaman damgası \(alignment\) yok/);
    await expect(konus({ alignment: alignmentOf(TEXT) })).rejects.toThrow(/elevenlabs: yanıt beklenen biçimde değil/);
    await expect(konus({ audio_base64: AUDIO, alignment: alignmentOf("On üç kural") })).rejects.toThrow(/6 kelime bekleniyordu, 3 damga geldi/);
  });
});
