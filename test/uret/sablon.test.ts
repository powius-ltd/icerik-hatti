import { describe, expect, it } from "vitest";
import { baslikHtml, sablonAcikZemin, SablonSahne } from "../../src/uret/render/sablon.ts";

describe("sabit şablon", () => {
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
