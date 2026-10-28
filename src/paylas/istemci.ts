// Kaynak: sosyal-panel/src/lib/zernio/client.ts + publish-client.ts (c960b96)
/**
 * Zernio istemcisi: hesap listesi (GET), video yükleme (`POST /media/presign` → imzalı adrese `PUT`), gönderi (`POST /posts`), durum (`GET /posts/<id>`).
 *
 * Kurallar: gönderim idempotent değildir; 429/5xx için yeniden deneme YOK (ikinci `POST` yapılmaz). 409 hata değildir:
 * "aynı içerik son 24 saatte bu hesaba gönderilmiş" demektir, mevcut gönderi kimliğiyle `duplicate` döner.
 * Hata iletisi yalnız durum kodu + kısa `error` metni taşır: anahtar ve yanıt gövdesi iletiye girmez.
 */
import { z } from "zod";

import { gonderiDurumuOku, zernioHesaplarYanitSema, type ZernioGonderiDurumu, type ZernioHesap } from "./sema.ts";

export type { ZernioGonderiDurumu, ZernioHesap };

export const ZERNIO_TEMEL_URL = "https://zernio.com/api/v1";
export const ZERNIO_SAAT_DILIMI = "Europe/Istanbul";

export class ZernioHata extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ZernioHata";
  }
}

export interface ZernioSecenekleri {
  apiKey: string;
  temelUrl?: string;
  fetchImpl?: typeof fetch;
}

export interface ReelGonderiGirdisi {
  caption: string;
  /** `presign` sonrası herkese açık video adresi. */
  mediaUrl: string;
  accountId: string;
  /** Kapak karesi, videonun başından milisaniye. */
  thumbOffsetMs: number;
  /** Ofsetsiz yerel zaman `YYYY-AA-GGTSS:DD:00` (İstanbul); yoksa hemen yayın. */
  scheduledFor?: string;
  shareToFeed?: boolean;
}

/** `POST /posts` gövdesi (Instagram Reels). `scheduledFor` verilmezse `publishNow`. */
export function reelGovdesiKur(girdi: ReelGonderiGirdisi) {
  return {
    content: girdi.caption,
    mediaItems: [{ type: "video", url: girdi.mediaUrl }],
    platforms: [{ platform: "instagram", accountId: girdi.accountId, platformSpecificData: { shareToFeed: girdi.shareToFeed ?? true, thumbOffset: girdi.thumbOffsetMs } }],
    ...(girdi.scheduledFor ? { scheduledFor: girdi.scheduledFor, timezone: ZERNIO_SAAT_DILIMI } : { publishNow: true }),
  };
}
export type ReelGovdesi = ReturnType<typeof reelGovdesiKur>;

const presignSema = z.object({ uploadUrl: z.string().min(1), publicUrl: z.string().min(1) });

export type GonderiSonucu =
  | { kind: "created"; httpStatus: number; state: ZernioGonderiDurumu }
  | { kind: "duplicate"; existingPostId?: string };

export interface ZernioIstemci {
  hesaplar(): Promise<ZernioHesap[]>;
  presign(dosya: { filename: string; size: number; contentType: string }): Promise<{ uploadUrl: string; publicUrl: string }>;
  yukle(uploadUrl: string, govde: Uint8Array, contentType: string): Promise<void>;
  gonderiOlustur(govde: ReelGovdesi): Promise<GonderiSonucu>;
  gonderiDurumu(postId: string): Promise<ZernioGonderiDurumu>;
}

export function zernioIstemciKur(secenekler: ZernioSecenekleri): ZernioIstemci {
  const temelUrl = secenekler.temelUrl ?? ZERNIO_TEMEL_URL;
  const getir = secenekler.fetchImpl ?? fetch;
  const yetki = { Authorization: `Bearer ${secenekler.apiKey}` };

  async function cagir(method: "GET" | "POST", yol: string, govde?: unknown): Promise<{ status: number; json: unknown }> {
    const res = await getir(`${temelUrl}${yol}`, {
      method,
      headers: { ...yetki, ...(govde === undefined ? {} : { "Content-Type": "application/json" }) },
      ...(govde === undefined ? {} : { body: JSON.stringify(govde) }),
    });
    return { status: res.status, json: await res.json().catch(() => ({})) };
  }
  const ayrinti = (json: unknown): string => {
    const error = (json as { error?: unknown } | null)?.error;
    return typeof error === "string" ? `: ${error.slice(0, 120)}` : "";
  };

  return {
    async hesaplar() {
      const { status, json } = await cagir("GET", "/accounts");
      const ayrik = zernioHesaplarYanitSema.safeParse(json);
      if (status !== 200 || !ayrik.success) throw new ZernioHata(`Zernio hesap listesi okunamadı (${status})${ayrinti(json)}`, status);
      return ayrik.data.accounts;
    },
    async presign(dosya) {
      const { status, json } = await cagir("POST", "/media/presign", dosya);
      const ayrik = presignSema.safeParse(json);
      if (status !== 200 || !ayrik.success) throw new ZernioHata(`Zernio yükleme adresi alınamadı (${status})${ayrinti(json)}`, status);
      return ayrik.data;
    },
    async yukle(uploadUrl, govde, contentType) {
      const res = await getir(uploadUrl, { method: "PUT", headers: { "Content-Type": contentType }, body: govde as unknown as BodyInit });
      if (!res.ok) throw new ZernioHata(`Zernio video yüklemesi başarısız (${res.status})`, res.status);
    },
    async gonderiOlustur(govde) {
      const { status, json } = await cagir("POST", "/posts", govde);
      if (status === 409) {
        const mevcut = (json as { details?: { existingPostId?: unknown } } | null)?.details?.existingPostId;
        return { kind: "duplicate", ...(typeof mevcut === "string" ? { existingPostId: mevcut } : {}) };
      }
      const state = gonderiDurumuOku(json);
      if ((status !== 201 && status !== 207) || state.postId === undefined) throw new ZernioHata(`Zernio gönderisi oluşturulamadı (${status})${ayrinti(json)}`, status);
      return { kind: "created", httpStatus: status, state };
    },
    async gonderiDurumu(postId) {
      const { status, json } = await cagir("GET", `/posts/${encodeURIComponent(postId)}`);
      if (status !== 200) throw new ZernioHata(`Zernio gönderi durumu okunamadı (${status})${ayrinti(json)}`, status);
      return { ...gonderiDurumuOku(json, postId), postId };
    },
  };
}
