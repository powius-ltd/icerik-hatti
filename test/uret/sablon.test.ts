import { describe, expect, it } from "vitest";
import type { Sahne } from "../../src/uret/render/plan.ts";
import { baslikHtml, render, sablonAcikZemin, SablonSahne } from "../../src/uret/render/sablon.ts";
import type { SceneContext } from "../../src/uret/render/types.ts";

describe("sabit şablon", () => {
  const sahne = (start: number) => ({ id: "s", start, end: start + 3, params: { kalip: "rakam", baslik: "x", satirlar: [], ilk: 0 } }) as unknown as Sahne;
  it("ilk sahnenin başlığı ilk karede görünür, sonrakiler kayarak girer", async () => {
    const ctx = {} as SceneContext;
    const ilk = await render(sahne(0), ctx);
    const sonraki = await render(sahne(5), ctx);
    expect(ilk.js.join("\n")).not.toContain("-h");
    expect(sonraki.js.join("\n")).toContain("-h");
  });
  it("başlıkta yıldızlı kelime italik olur, kalan metin kaçırılır", () => {
    expect(baslikHtml("Üç <boy> *ortadaki*")).toBe("Üç &lt;boy&gt; <i>ortadaki</i>");
  });
  it("mavi zemin dışındaki kalıplarda marka koyu yazılır", () => {
    expect(sablonAcikZemin("gazete")).toBe(true);
    expect(sablonAcikZemin("rakam")).toBe(false);
  });
  it("bilinmeyen kalıp fişte reddedilir", () => {
    expect(SablonSahne.safeParse({ kalip: "yok", baslik: "x" }).success).toBe(false);
  });
});
