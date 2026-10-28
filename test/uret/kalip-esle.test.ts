import { describe, expect, it } from "vitest";
import type { FisSahne } from "../../src/fis/sema.ts";
import { kalipEsle } from "../../src/uret/kalip-esle.ts";

const s = (o: Partial<FisSahne>): FisSahne => ({ no: 1, basSn: 0, sonSn: 3, tur: "grafik", ekranYazisi: "", konum: "ust", metin: "Bir iki üç dört beş altı.", ...o });
const A = { ilk: 10, adet: 6 };

describe("kalipEsle", () => {
  it("tek sayılı ekran yazısı big-stat olur; sayaç sayının söylendiği kelimede iner", () => {
    const k = kalipEsle(s({ ekranYazisi: "Her ay 2.000 ücretsiz mesaj", metin: "Şöyle oluyor: ayda 2.000 mesaj hakkın var." }), A);
    expect(k.template).toBe("big-stat");
    expect(k.params).toMatchObject({ value: 2000, label: "Her ay ücretsiz mesaj", startWord: 10, landWord: 13 });
  });

  it("küçük sayı ve yıl big-stat olmaz; adım sayısı kartta rozet olur", () => {
    expect(kalipEsle(s({ ekranYazisi: "1 Numara al" }), A)).toMatchObject({ template: "kart", params: { text: "Numara al", rozet: "1", konum: "ust" } });
    expect(kalipEsle(s({ ekranYazisi: "2024 yılında" }), A).template).toBe("kart");
    expect(kalipEsle(s({ ekranYazisi: "3 ve 40 şey" }), A).template).toBe("kart");
  });

  it("ekran türü + tırnaklı istem + yanıt yazısı chat-window olur, kelime sırası genel sıradadır", () => {
    const k = kalipEsle(s({ tur: "ekran-kaydi", ekranYazisi: "Ajan hazır", metin: 'Şunu yaz: "Bana randevu alan bir ajan yap." Hepsi bu kadar.' }), { ilk: 4, adet: 12 });
    expect(k.template).toBe("chat-window");
    expect(k.params).toMatchObject({ prompt: "Bana randevu alan bir ajan yap.", typeWord: 6, sendWord: 12, replyWord: 13 });
  });

  it("kalıba giden metin boşsa o kalıp seçilmez, kart'a düşer (boş kutu yok)", () => {
    // istem yok
    expect(kalipEsle(s({ tur: "ekran-kaydi", ekranYazisi: "Ajan hazır", metin: "Hiç tırnak yok burada." }), A).template).toBe("kart");
    // yanıt yazısı boş
    expect(kalipEsle(s({ tur: "ekran-kaydi", ekranYazisi: "", metin: 'Yaz: "Merhaba dünya nasılsın" tamam.' }), A).template).toBe("kart");
    // yanıt yazısı sığmayacak kadar uzun
    expect(kalipEsle(s({ tur: "ekran-goruntusu", ekranYazisi: "x".repeat(60), metin: 'Yaz: "Merhaba dünya" tamam.' }), A).template).toBe("kart");
    // grafik türünde tırnak sohbeti açmaz
    expect(kalipEsle(s({ tur: "grafik", ekranYazisi: "Hazır", metin: 'Yaz: "Merhaba dünya" tamam.' }), A).template).toBe("kart");
    // etiketsiz sayı
    expect(kalipEsle(s({ ekranYazisi: "2.000" }), A).template).toBe("kart");
    // tek kelimelik sahnede sayaç kurulamaz
    expect(kalipEsle(s({ ekranYazisi: "50 kişi" }), { ilk: 0, adet: 1 }).template).toBe("kart");
    // ekran yazısı hiç yok
    const bos = kalipEsle(s({ tur: "yuz", ekranYazisi: "" }), A);
    expect(bos).toMatchObject({ template: "kart", params: { text: "" } });
  });

  it("konum yok ise orta; aynı girdi her zaman aynı kalıbı verir", () => {
    const girdi = s({ ekranYazisi: "Kurallar", konum: "yok" });
    expect(kalipEsle(girdi, A)).toEqual(kalipEsle(girdi, A));
    expect(kalipEsle(girdi, A).params).toMatchObject({ konum: "orta" });
  });
});

describe("kart çizgisi", () => {
  it("çizgi yazının satır sayısına göre konur", async () => {
    const { cizgiTop, yaziBoyu } = await import("../../src/uret/render/kart.ts");
    expect(yaziBoyu(8)).toBe(120);
    expect(cizgiTop(300, "Kurallar", false)).toBeLessThan(cizgiTop(300, "Sonuç · WhatsApp'ta canlı ve uzun yazı", false));
    expect(cizgiTop(300, "Numara al", true)).toBeGreaterThanOrEqual(300 + 150 + 34);
  });
});
