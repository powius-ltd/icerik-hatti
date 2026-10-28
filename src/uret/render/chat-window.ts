// Kaynak: kreatif-studyo/src/hf-engine/scenes/screen-chat-window.ts (b6aff3d)
/**
 * "chat-window" ekran kalıbı: sohbet penceresi. İstem kutusuna harf harf yazı → gönder düğmesine basış → istem balona kayar → yanıt kartı
 * (metin satırları ya da "hazır" kartı). Bütün metin params'tan; anlar kelime SIRASIYLA (saniye yazılmaz).
 */
import { z } from "zod";
import type { ScreenScene } from "./plan.ts";
import { type Layer } from "./layer.ts";
import { icon } from "./icons.ts";
import { fade, pop, press, slide, typer } from "./motion-kit.ts";
import { atWord, esc, Heading, WindowTop, scenePrefix, shell, SHELL_CSS } from "./shell.ts";
import type { SceneContext, TemplateScene } from "./types.ts";

const Index = z.number().int().nonnegative();
const Reply = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("lines"), lines: z.array(z.string().min(1).max(46)).min(1).max(5) }),
  z.object({ kind: z.literal("ready"), label: z.string().min(1).max(24), detail: z.string().min(1).max(60).optional() }),
]);

export const ChatWindowParams = z.object({
  heading: Heading.optional(),
  windowTop: WindowTop,
  title: z.string().min(1).max(24).default("Sohbet"),
  prompt: z.string().min(1).max(110),
  /** İstemin yazılmaya başladığı kelime. */
  typeWord: Index,
  /** Gönderildiği kelime (yazı bu ana dek biter). */
  sendWord: Index,
  /** Yanıtın göründüğü kelime. */
  replyWord: Index,
  reply: Reply,
});
export type ChatWindowParams = z.infer<typeof ChatWindowParams>;

export const CHAT_WINDOW_SAMPLE: ChatWindowParams = {
  heading: { kick: "Çözüm", name: "Tek istem" },
  title: "Claude",
  prompt: "Bu 200 satırı şehre göre topla",
  typeWord: 1,
  sendWord: 4,
  replyWord: 5,
  reply: { kind: "lines", lines: ["200 satır okundu", "12 şehir bulundu", "Toplamlar hazır"] },
};

const CSS = `
.sc .chat-body{position:absolute;left:0;right:0;top:72px;bottom:176px;padding:36px 40px;display:flex;flex-direction:column;gap:26px}
.sc .ub{align-self:flex-end;max-width:760px;padding:22px 30px;border-radius:30px 30px 8px 30px;background:var(--accent-soft);border:1px solid var(--accent);font-size:40px;font-weight:600;line-height:1.25}
.sc .rp{align-self:flex-start;width:100%;padding:26px 32px;border-radius:30px 30px 30px 8px;background:var(--surface-row);border:1px solid var(--line-dark)}
.sc .rp .who{display:flex;align-items:center;gap:14px;font-size:28px;font-weight:700;color:var(--text-muted-on-dark);letter-spacing:1px}
.sc .rp .who i{width:14px;height:14px;border-radius:50%;background:var(--accent);display:block}
.sc .rl{margin-top:16px;font-size:40px;font-weight:600;line-height:1.2}
.sc .rdy{display:flex;align-items:center;gap:26px;margin-top:20px}
.sc .rdy .ic{color:var(--success)}
.sc .rdy .lb{font-size:56px;font-weight:800;letter-spacing:-1px;line-height:1}
.sc .rdy .dt{margin-top:10px;font-size:32px;color:var(--text-muted-on-dark)}
.sc .inp{position:absolute;left:36px;right:36px;bottom:28px;min-height:104px;padding:20px 24px 20px 32px;border-radius:var(--radius-pill);background:var(--surface-window-bar);border:1px solid var(--line-dark);display:flex;align-items:center;gap:20px}
.sc .inp .it{flex:1;font-size:38px;font-weight:500;line-height:1.2}
.sc .inp .cur{width:4px;height:44px;background:var(--accent);flex:none}
.sc .inp .sd{flex:none;width:68px;height:68px;border-radius:50%;background:var(--accent);color:var(--bg-dark);display:flex;align-items:center;justify-content:center}
`;

function replyHtml(p: string, reply: z.infer<typeof Reply>): string {
  const who = `<div class="who"><i></i>${"YANIT"}</div>`;
  if (reply.kind === "ready") {
    const detail = reply.detail ? `<div class="dt">${esc(reply.detail)}</div>` : "";
    return `${who}<div class="rdy" id="${p}-rdy"><span class="ic">${icon("check", 84)}</span><div><div class="lb">${esc(reply.label)}</div>${detail}</div></div>`;
  }
  return who + reply.lines.map((l, i) => `<div class="rl" id="${p}-l${i}">${esc(l)}</div>`).join("");
}

function render(scene: ScreenScene, ctx: SceneContext): Layer {
  const params = ChatWindowParams.parse(scene.params);
  const p = scenePrefix(scene);
  const typeT = atWord(ctx, scene, params.typeWord, "typeWord");
  const sendT = atWord(ctx, scene, params.sendWord, "sendWord");
  const replyT = atWord(ctx, scene, params.replyWord, "replyWord");
  if (!(typeT < sendT && sendT <= replyT)) throw new Error(`Sahne "${scene.id}": typeWord < sendWord ≤ replyWord sırası bozuk (${typeT.toFixed(2)}, ${sendT.toFixed(2)}, ${replyT.toFixed(2)} sn).`);
  const chars = [...params.prompt].length;
  const cps = Math.min(40, Math.max(8, chars / Math.max(0.4, sendT - 0.3 - typeT)));
  const inner =
    `<div class="win" id="${p}-win"><div class="bar"><i></i><i></i><i></i><span>${esc(params.title)}</span></div>` +
    `<div class="chat-body"><div class="ub" id="${p}-ub" style="opacity:0">${esc(params.prompt)}</div><div class="rp" id="${p}-rp" style="opacity:0">${replyHtml(p, params.reply)}</div></div>` +
    `<div class="inp"><span class="it" id="${p}-it"></span><span class="cur"></span><span class="sd" id="${p}-sd">${icon("send", 36)}</span></div></div>`;
  const js = [
    typer(`#${p}-it`, params.prompt, typeT, cps),
    press(`#${p}-sd`, sendT),
    fade(`#${p}-it`, sendT + 0.1, { to: 0, dur: 0.12 }),
    slide(`#${p}-ub`, sendT + 0.1, { dx: 0, dy: 60, dur: 0.4 }),
    slide(`#${p}-rp`, replyT, { dy: 30, dur: 0.4 }),
  ];
  if (params.reply.kind === "lines") params.reply.lines.forEach((_, i) => js.push(slide(`#${p}-l${i}`, replyT + 0.15 + 0.2 * i, { dy: 14, dur: 0.35 })));
  else js.push(pop(`#${p}-rdy`, replyT + 0.15, { dur: 0.5 }));
  return shell({ scene, heading: params.heading, windowTop: params.windowTop, inner, winId: `${p}-win`, js });
}

export const chatWindowTemplate: TemplateScene<ScreenScene> = { name: "chat-window", singleton: false, css: [SHELL_CSS, CSS], render };
