// Kaynak: sosyal-panel/src/lib/zernio/api-key.test.ts (c960b96), genel anahtar kuralı çıkarıldı
import { describe, expect, it } from "vitest";

import { anahtarEnvAdi, anahtarSec } from "../../src/paylas/anahtar.ts";

describe("anahtarEnvAdi", () => {
  it("slug'ı büyük harfe ve alt çizgiye çevirir", () => {
    expect(anahtarEnvAdi("patron")).toBe("ZERNIO_API_KEY_PATRON");
    expect(anahtarEnvAdi("simla-ozsezgin")).toBe("ZERNIO_API_KEY_SIMLA_OZSEZGIN");
  });
  it("slug yoksa ya da boşsa undefined", () => {
    expect(anahtarEnvAdi(undefined)).toBeUndefined();
    expect(anahtarEnvAdi("  ")).toBeUndefined();
  });
});

describe("anahtarSec", () => {
  it("hesaba özel anahtarı seçer", () => {
    expect(anahtarSec("patron", { ZERNIO_API_KEY_PATRON: "ozel" })).toEqual({ envAdi: "ZERNIO_API_KEY_PATRON", apiKey: "ozel" });
  });
  it("genel ZERNIO_API_KEY hiçbir hesaba düşmez", () => {
    expect(anahtarSec("patron", { ZERNIO_API_KEY: "genel" })).toBeUndefined();
  });
  it("boş değer yok sayılır", () => {
    expect(anahtarSec("patron", { ZERNIO_API_KEY_PATRON: "  " })).toBeUndefined();
  });
});
