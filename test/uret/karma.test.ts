import { describe, expect, it } from "vitest";
import { fisOku, type Fis, type FisSahne } from "../../src/fis/sema.ts";
import { fisIstemi } from "../../src/fis/istem.ts";
import { okunusMetni, planKur } from "../../src/uret/sahne-plani.ts";
import { adayYonler, karmaYonleri } from "../../src/uret/yon/karma.ts";
import type { KonusKelime } from "../../src/uret/render/kelimeler.ts";

const s = (metin: string, o: Partial<FisSahne> = {}): FisSahne => ({ no: 1, basSn: 0, sonSn: 3, tur: "grafik", ekranYazisi: "", konum: "yok", metin, ...o });
const ilk = (metin: string, o: Partial<FisSahne> = {}) => adayYonler(s(metin, o))[0];

/** Deneme fişinin (kosular/yon-deneme/karma) sahne metinleri; kosular/ git dışı olduğu için burada sabit. */
const DENEME = [
  "Claude'un kendi WhatsApp numarası olabileceğini biliyor muydun?",
  "Şöyle: CAPSO adlı bir araç Claude'u WhatsApp'ın resmi API'sine bağlıyor ve ücretsiz plan ayda 2.000 mesaj veriyor.",
  "Birinci adım: ücretsiz bir CAPSO hesabı aç, bir numara bağla.",
  "İkinci adım: Claude Code'u aç, WhatsApp becerilerini tek komutla kur.",
  'Üçüncü adım: Claude\'a ne istediğini söylemen yeter. "Bana randevu alan bir WhatsApp ajanı yap." Hepsini o yazıyor, artık ajanının kendi numarası var.',
  "Biri cuma müsait misin diye soruyor. Boş saatleri sunup randevuyu alıyor, gece yarısı bile.",
  "Yalnız kuralları bil: önce insanların onayını al; 24 saat sessizlikten sonra sadece onaylı şablon gönderebilirsin.",
  "Yorumlara WhatsApp yaz, kurulumun tamamını sana göndereyim.",
].map((m, i) => s(m, { no: i + 1, tur: "grafik" }));

describe("karma yön kuralları", () => {
  it("sayı ya da adım ifadesi → rakam-kart", () => {
    expect(ilk("Ayda 2.000 mesaj hakkın var.")).toBe("rakam-kart");
    expect(ilk("Hesabı aç.", { ekranYazisi: "3 ay ücretsiz" })).toBe("rakam-kart");
    expect(ilk("Birinci adım: hesabını aç.")).toBe("rakam-kart");
    expect(ilk("Üç adımda hallolur.")).toBe("rakam-kart");
  });

  it("komut, kurulum ve kod fiilleri ya da tırnaklı komut → terminal", () => {
    expect(ilk("Paketi tek komutla kur.")).toBe("terminal");
    expect(ilk("Terminali aç ve çalıştır.")).toBe("terminal");
    expect(ilk('Şunu yaz: "npm install claude" ve bitti.')).toBe("terminal");
  });

  it("soru cümlesi ya da tırnaklı kullanıcı isteği → sohbet", () => {
    expect(ilk("Biliyor muydun?")).toBe("sohbet");
    expect(ilk("Biri müsait misin diye soruyor.")).toBe("sohbet");
    expect(ilk('Claude\'a şunu söyle: "Bana randevu alan bir ajan yap."')).toBe("sohbet");
  });

  it("kalan → editoryal; boş metin de editoryal adayıdır", () => {
    expect(ilk("Bu işin sırrı sadelik.")).toBe("editoryal");
    expect(adayYonler(s("Hem 5 sayı hem soru var mı?")).at(-1)).toBe("editoryal");
  });

  it("art arda 3'ten fazla aynı yön gelirse 4. sahne sonraki uygun yöne döner", () => {
    const dort = ["Bu bir fikir.", "Bu başka bir fikir.", "Bir fikir daha.", "Son bir fikir."].map((m) => s(m));
    // ilk sahne editoryal; 2-3-4 de editoryal olurdu: 4. sahne (ardışık 4. editoryal) kırılır
    const yonler = karmaYonleri(dort);
    expect(yonler.slice(0, 3)).toEqual(["editoryal", "editoryal", "editoryal"]);
    expect(yonler[3]).not.toBe("editoryal");
    const adayli = ["Bir fikir.", "İkinci fikir.", "Üçüncü fikir.", "Fiyat 20 dolar."].map((m) => s(m));
    expect(karmaYonleri(adayli)[3]).toBe("rakam-kart");
    // 4 ardışık rakam-kart: 4.sü bir sonraki adaya (editoryal) döner
    const sayili = ["Ayda 10 mesaj.", "Ayda 20 mesaj.", "Ayda 30 mesaj.", "Ayda 40 mesaj.", "Ayda 50 mesaj."].map((m) => s(m));
    const y = karmaYonleri(sayili);
    expect(y[0]).toBe("editoryal"); // kanca kuralı
    expect(y.slice(1, 4)).toEqual(["rakam-kart", "rakam-kart", "rakam-kart"]);
    expect(y[4]).toBe("editoryal");
  });

  it("ilk sahne (kanca) her zaman editoryal ya da sohbet", () => {
    expect(karmaYonleri([s("Paketi tek komutla kur.")])[0]).toBe("editoryal");
    expect(karmaYonleri([s("Ayda 2.000 mesaj var.")])[0]).toBe("editoryal");
    expect(karmaYonleri([s("Biliyor muydun?")])[0]).toBe("sohbet");
  });

  it("deneme fişi karma eşlemesinde en az 3 farklı yön üretir", () => {
    const yonler = karmaYonleri(DENEME);
    expect(new Set(yonler).size).toBeGreaterThanOrEqual(3);
    expect(yonler[0]).toBe("sohbet");
    expect(karmaYonleri(DENEME)).toEqual(yonler); // deterministik
  });

  it("plan: gorsel_yon karma olan fişte kalıplar karışık ve neden 'karma → <yön>' der", () => {
    const fis: Fis = fisOku(`---
fis_id: k
kaynak: { tur: metin }
hesap: varsayilan
gorsel_yon: karma
fis_onay: hayir
paylasim_onay: hayir
durum: taslak
sahneler:
${DENEME.map((x) => `  - { no: ${x.no}, basSn: ${x.no}, sonSn: ${x.no + 1}, tur: grafik, ekranYazisi: "", konum: yok, metin: ${JSON.stringify(x.metin)} }`).join("\n")}
aciklama_taslagi: "x"
---
`);
    const sozler: KonusKelime[] = okunusMetni(fis).split(" ").map((w, i) => ({ w, s: i * 0.4, e: i * 0.4 + 0.3 }));
    const { kalipler } = planKur(fis, sozler, sozler.length * 0.4);
    expect(new Set(kalipler.map((k) => k.template)).size).toBeGreaterThanOrEqual(3);
    expect(kalipler.every((k) => k.neden.startsWith("karma → "))).toBe(true);
  });

  it("fiş istemi varsayılan öneriyi karma yapar, gerekçe satırı kalır", () => {
    const i = fisIstemi({ dil: "en", sureSn: 10, hook: "", cta: "", iddialar: [], sahneler: [] } as never, { segmentler: [] } as never);
    expect(i).toContain("VARSAYILAN ÖNERİ");
    expect(i).toContain("yon_gerekce");
  });
});
