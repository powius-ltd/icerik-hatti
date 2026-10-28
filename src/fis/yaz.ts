/** Fişi `fis.md` metnine çevirir: YAML frontmatter + "Sana düşen" + okunur senaryo. */
import { stringify } from "yaml";
import type { Dogrulanacak, Fis } from "./sema.ts";

const hucre = (s: string): string => s.replace(/\|/g, "\\|").replace(/\n/g, " ");

export function fisMd(fis: Fis, dogrulanacak: Dogrulanacak[]): string {
  const sanaDusen = [
    "- [ ] Senaryoyu oku; doğal Türkçe ve kaynakla anlamca aynı mı?",
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
