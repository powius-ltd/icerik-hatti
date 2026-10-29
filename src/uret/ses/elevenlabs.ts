// Kaynak: kreatif-studyo/src/production/voice/providers/elevenlabs.ts (b6aff3d); sağlayıcı arayüzü ve kelime eşleme sadeleştirildi
/**
 * ElevenLabs: ücretli, karakter zaman damgalı (kelimeye burada çevrilir). Anahtarı çağıran ortamdan verir; `.env*` okunmaz. Sahibi: V.
 * Uç: `POST /v1/text-to-speech/{voice_id}/with-timestamps` → `{ audio_base64, alignment { characters, character_*_times_seconds } }`.
 */
import { z } from "zod";
import type { SesSaglayici } from "./saglayici.ts";
import { wordsFromCharacters } from "./karakter-kelime.ts";

/** API'nin `voice_settings` alanları; verilmeyen, sesin kayıtlı ayarında kalır. */
export interface ElevenLabsVoiceSettings {
  stability?: number;
  similarityBoost?: number;
  style?: number;
  useSpeakerBoost?: boolean;
  speed?: number;
}

export interface ElevenLabsOptions {
  /** `ELEVENLABS_API_KEY` ortam değişkeninin değeri. */
  apiKey: string;
  fetchImpl?: typeof fetch;
  /** Varsayılan `eleven_multilingual_v2`. */
  modelId?: string;
  voiceSettings?: ElevenLabsVoiceSettings;
  /** Modelin birim fiyatı (USD / 1.000 karakter); model değişince bu da verilir. */
  usdPer1kChars?: number;
  timeoutMs?: number;
}

const ENDPOINT = "https://api.elevenlabs.io/v1/text-to-speech";
const DEFAULT_MODEL = "eleven_multilingual_v2";
/** Multilingual v2: 0,08 USD / 1.000 karakter (`docs/DAGITIM-ARASTIRMASI.md` §3.1). */
const DEFAULT_USD_PER_1K_CHARS = 0.08;
const DEFAULT_TIMEOUT_MS = 120_000;
/** `ses.mp3` için; API'nin varsayılanı da budur. */
const OUTPUT_FORMAT = "mp3_44100_128";
const DETAIL_MAX_CHARS = 500;

const SpeechResponse = z.object({
  audio_base64: z.string().min(1),
  alignment: z
    .object({
      characters: z.array(z.string()),
      character_start_times_seconds: z.array(z.number()),
      character_end_times_seconds: z.array(z.number()),
    })
    .nullish(),
});

/** Hatanın nedeni gövdededir (`detail`); durum kodu tek başına yanıltır (geçersiz anahtar 400 dönebiliyor). */
async function failureDetail(response: Response): Promise<string> {
  const body = await response.text().catch(() => "");
  try {
    const detail = (JSON.parse(body) as { detail?: unknown }).detail;
    if (typeof detail === "string") return detail;
    if (typeof detail === "object" && detail !== null && "message" in detail) return String(detail.message);
  } catch {
    // JSON değilse ham metin döner.
  }
  return body.slice(0, DETAIL_MAX_CHARS);
}

function settingsBody(settings: ElevenLabsVoiceSettings | undefined): Record<string, number | boolean> | undefined {
  if (settings === undefined) return undefined;
  const body = { stability: settings.stability, similarity_boost: settings.similarityBoost, style: settings.style, use_speaker_boost: settings.useSpeakerBoost, speed: settings.speed };
  return Object.fromEntries(Object.entries(body).filter((entry): entry is [string, number | boolean] => entry[1] !== undefined));
}

/** `chars` karakterin bedeli (USD); birim fiyat verilmezse varsayılan modelinki. */
export function elevenLabsUsd(chars: number, usdPer1kChars: number = DEFAULT_USD_PER_1K_CHARS): number {
  return Math.round((chars / 1000) * usdPer1kChars * 1e6) / 1e6;
}

/** Metnin boşlukla ayrılan kelimeleri; damgalar bununla 1:1 olmalıdır (sahne sınırı kelime sayısından çıkar). */
export function metinKelimeleri(metin: string): string[] {
  return metin.split(/\s+/).filter((k) => k !== "");
}

export function createElevenLabsProvider(options: ElevenLabsOptions): SesSaglayici {
  if (options.apiKey.trim() === "") throw new Error("ELEVENLABS_API_KEY tanımlı değil: ElevenLabs seslendirmesi için anahtar çalışma zamanı ortam değişkeninden verilir (.env okunmaz).");
  const fetchImpl = options.fetchImpl ?? fetch;
  const model = options.modelId ?? DEFAULT_MODEL;
  return {
    id: "elevenlabs",
    imza: JSON.stringify({ model, ayar: settingsBody(options.voiceSettings) ?? null, usd: options.usdPer1kChars ?? null }),
    async konus(istek) {
      const response = await fetchImpl(`${ENDPOINT}/${encodeURIComponent(istek.sesId)}/with-timestamps?output_format=${OUTPUT_FORMAT}`, {
        method: "POST",
        headers: { "xi-api-key": options.apiKey, "Content-Type": "application/json" },
        body: JSON.stringify({ text: istek.metin, model_id: model, voice_settings: settingsBody(options.voiceSettings) }),
        signal: AbortSignal.timeout(options.timeoutMs ?? DEFAULT_TIMEOUT_MS),
      });
      if (!response.ok) throw new Error(`elevenlabs: ${response.status} ${response.statusText}: ${await failureDetail(response)}`);
      const parsed = SpeechResponse.safeParse(await response.json());
      if (!parsed.success) throw new Error(`elevenlabs: yanıt beklenen biçimde değil.\n${z.prettifyError(parsed.error)}`);
      const { audio_base64, alignment } = parsed.data;
      if (alignment == null) throw new Error("elevenlabs: yanıtta karakter zaman damgası (alignment) yok; kelime zamanı çıkarılamaz.");
      const damgalar = wordsFromCharacters(alignment);
      const beklenen = metinKelimeleri(istek.metin).length;
      if (damgalar.length !== beklenen) throw new Error(`elevenlabs: kelime zamanları metni tutmuyor; ${beklenen} kelime bekleniyordu, ${damgalar.length} damga geldi.`);
      // Fatura işlenen karakter sayısındandır: yanıttaki damga dizisinin boyu.
      return { ses: new Uint8Array(Buffer.from(audio_base64, "base64")), damgalar, model, karakter: alignment.characters.length, usd: elevenLabsUsd(alignment.characters.length, options.usdPer1kChars) };
    },
  };
}
