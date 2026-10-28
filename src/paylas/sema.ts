// Kaynak: sosyal-panel/src/lib/zernio/schema.ts (c960b96) · yalnız hesap listesi + gönderi durumu alanları
import { z } from "zod";

const text = z.string().nullish().catch(undefined);

export const zernioHesapSema = z.object({
  _id: z.string(),
  platform: z.string(),
  username: text,
  isActive: z.boolean().nullish().catch(undefined),
});
export type ZernioHesap = z.infer<typeof zernioHesapSema>;

export const zernioHesaplarYanitSema = z.object({ accounts: z.array(zernioHesapSema) });

/**
 * Gönderi durumu: `{ post }`, `{ posts: [...] }` ya da çıplak nesne; üçü de aynı ayrıştırıcıdan geçer.
 * Gönderinin `status`'ı ve `platforms[].status` birlikte okunur; Instagram girdisi öncelikli.
 */
const platformGirdisi = z.object({ platform: text, status: text, platformPostUrl: text, errorMessage: text });
const gonderiDurumuSema = z.object({
  _id: text,
  status: text,
  scheduledFor: text,
  publishedAt: text,
  platforms: z.array(platformGirdisi).nullish().catch(undefined),
});

export interface ZernioGonderiDurumu {
  postId?: string;
  /** Genel durum (`scheduled`, `publishing`, `published`, `failed`…); Zernio'nun metni aynen. */
  status?: string;
  instagram?: { status?: string; permalink?: string; errorMessage?: string };
}

export function gonderiDurumuOku(raw: unknown, postId?: string): ZernioGonderiDurumu {
  const tutucu = (raw ?? {}) as { post?: unknown; posts?: unknown };
  const liste = Array.isArray(tutucu.posts) ? (tutucu.posts as { _id?: unknown }[]) : undefined;
  const aday = liste ? (postId === undefined ? liste[0] : liste.find((p) => p?._id === postId)) : (tutucu.post ?? raw);
  const ayrik = gonderiDurumuSema.safeParse(aday);
  if (!ayrik.success) return {};
  const ig = ayrik.data.platforms?.find((p) => p.platform === "instagram");
  return {
    ...(ayrik.data._id ? { postId: ayrik.data._id } : {}),
    ...(ayrik.data.status ? { status: ayrik.data.status } : {}),
    ...(ig
      ? { instagram: { ...(ig.status ? { status: ig.status } : {}), ...(ig.platformPostUrl ? { permalink: ig.platformPostUrl } : {}), ...(ig.errorMessage ? { errorMessage: ig.errorMessage } : {}) } }
      : {}),
  };
}
