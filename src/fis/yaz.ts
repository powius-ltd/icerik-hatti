/** Fişi `fis.md` metnine çevirir: YAML frontmatter + "Sana düşen" + okunur senaryo. */
import { stringify } from "yaml";
import { GORSEL_YONLER, type Dogrulanacak, type Fis } from "./sema.ts";

const hucre = (s: string): string => s.replace(/\|/g, "\\|").replace(/\n/g, " ");

/** "Sana düşen" görsel yön satırı: öneri, gerekçe, seçenekler ve nasıl değiştirileceği. */
export function yonSatiri(fis: Fis): string {
  const oneri = fis.gorsel_yon ?? "karma";
  const gerekce = fis.yon_gerekce ? ` — ${fis.yon_gerekce.replace(/\s+/g, " ").trim()}` : fis.gorsel_yon ? "" : " (varsayılan)";
  return `- [ ] Görsel yön: ${oneri}${gerekce} (seçenekler: ${GORSEL_YONLER.join(" · ")}) — değiştirmek için \`gorsel_yon:\` satırını düzelt`;
}

export function fisMd(fis: Fis, dogrulanacak: Dogrulanacak[]): string {
  const sanaDusen = [
    "- [ ] Senaryoyu oku; doğal Türkçe ve kaynakla anlamca aynı mı?",
    yonSatiri(fis),
    ...dogrulanacak.map((d) => `- [ ] Doğrula: ${d.iddia}${d.kaynakSn !== undefined ? ` _(kaynak ${d.kaynakSn.toFixed(1)} sn)_` : ""}`),
    "- [ ] Onaylıyorsan frontmatter'da `fis_onay: evet` yap.",
  ];
  const toplam = fis.sahneler.at(-1)?.sonSn ?? 0;
  const tablo = fis.sahneler.map((s) => `| ${s.no} | ${s.basSn.toFixed(1)}–${s.sonSn.toFixed(1)} | ${s.tur} | ${hucre(s.ekranYazisi)} | ${s.konum} | ${hucre(s.metin)} |`);
  return `---
${stringify(fis, { lineWidth: 0 }).trimEnd()}
---

> **Sana düşen**
${sanaDusen.map((l) => `> ${l}`).join("\n")}

# Fiş ${fis.fis_id}

${fis.sahneler.length} sahne · ${toplam.toFixed(1)} sn · kaynak: ${fis.kaynak.tur} · hesap: ${fis.hesap}

| # | Süre | Tür | Ekran yazısı | Konum | Okunacak metin |
|---|---|---|---|---|---|
${tablo.join("\n")}

## Okuma metni
${fis.sahneler.map((s) => s.metin).join("\n")}

## Açıklama taslağı
${fis.aciklama_taslagi}
`;
}
