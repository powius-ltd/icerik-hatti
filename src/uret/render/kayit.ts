// Kaynak: kreatif-studyo/src/hf-engine/scenes/registry.ts (b6aff3d); yalnız bu hattın üç kalıbı
/** Kalıp kaydı: sahnedeki `template` adı → çizen işlev. Yeni kalıp = yeni dosya + buraya bir satır. */
import type { Sahne } from "./plan.ts";
import type { Layer } from "./layer.ts";
import { bigStatTemplate } from "./big-stat.ts";
import { chatWindowTemplate } from "./chat-window.ts";
import { kartTemplate } from "./kart.ts";
import type { SceneContext, TemplateScene } from "./types.ts";

const TEMPLATES: readonly TemplateScene[] = [kartTemplate, chatWindowTemplate, bigStatTemplate];

export function templateNames(): string[] {
  return TEMPLATES.map((t) => t.name);
}

export function findTemplate(name: string): TemplateScene {
  const t = TEMPLATES.find((x) => x.name === name);
  if (!t) throw new Error(`Bilinmeyen sahne kalıbı "${name}". Kayıtlı kalıplar: ${templateNames().join(", ")}.`);
  return t;
}

export async function renderTemplate(scene: Sahne, ctx: SceneContext): Promise<Layer> {
  return findTemplate(scene.template).render(scene, ctx);
}
