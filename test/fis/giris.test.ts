import { describe, expect, it } from "vitest";
import { girisCoz, urlKimlik } from "../../src/fis/giris.ts";

describe("fis girişi", () => {
  it("tam olarak bir giriş bayrağı ister", () => {
    expect(girisCoz({ video: "a.mp4" })).toEqual({ tur: "video", deger: "a.mp4" });
    expect(girisCoz({ metin: "m.md" })).toEqual({ tur: "metin", deger: "m.md" });
    expect(() => girisCoz({})).toThrow(/Tam olarak biri/);
    expect(() => girisCoz({ video: "a", url: "b" })).toThrow(/Tam olarak biri/);
    expect(() => girisCoz({ video: true })).toThrow(/değer ister/);
  });

  it("url'den kimlik çıkarır; yabancı alan adı ve http reddedilir", () => {
    expect(urlKimlik("https://www.instagram.com/reel/DeZTLK4CeiQ/?igsh=x")).toBe("instagram-DeZTLK4CeiQ");
    expect(urlKimlik("https://www.instagram.com/p/AbC_12-/")).toBe("instagram-AbC_12-");
    expect(urlKimlik("https://www.tiktok.com/@kisi/video/7312345678901234567")).toBe("tiktok-7312345678901234567");
    expect(() => urlKimlik("https://evil.com/reel/abc")).toThrow(/yalnız Instagram/);
    expect(() => urlKimlik("http://instagram.com/reel/abc")).toThrow(/yalnız Instagram/);
    expect(() => urlKimlik("https://www.instagram.com/someuser/")).toThrow(/kimliği çıkarılamadı/);
  });
});
