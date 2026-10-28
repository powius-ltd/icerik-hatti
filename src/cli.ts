/**
 * icerik-hatti komut yönlendirici: npm run hat -- <komut> [bayraklar]
 * Her komut kendi dizininde `calistir(argv)` dışa aktarır.
 */
const komutlar: Record<string, (argv: string[]) => Promise<void>> = {
  fis: async (argv) => (await import("./fis/komut.ts")).calistir(argv),
  uret: async (argv) => (await import("./uret/komut.ts")).calistir(argv),
  paylas: async (argv) => (await import("./paylas/komut.ts")).calistir(argv),
  tablo: async (argv) => (await import("./tablo/komut.ts")).calistir(argv),
};

const OZET: Record<string, string> = {
  fis: "Video/link/hazır metinden onaylanacak Türkçe birebir uyarlama fişi (fis.md) üretir",
  uret: "Onaylı fişten patron sesli, altyazılı 9:16 video + kapak + açıklama üretir (--render ile videoyu da)",
  paylas: "Onaylı videoyu Zernio ile (zamanlı) gönderir; varsayılan kuru koşu",
  tablo: "Drive tablosundan satırları alır: fiş → video → Drive → zamanlı paylaşım (kur | yokla [--kuru])",
};

async function ana(): Promise<void> {
  const [komut, ...geri] = process.argv.slice(2);
  if (!komut || komut === "--yardim" || komut === "-h") {
    console.log("Kullanım: npm run hat -- <komut> [bayraklar]\n");
    for (const ad of Object.keys(komutlar)) console.log(`  ${ad.padEnd(10)} ${OZET[ad] ?? ""}`);
    return;
  }
  const calistir = komutlar[komut];
  if (!calistir) {
    console.error(`Bilinmeyen komut: ${komut}`);
    process.exitCode = 2;
    return;
  }
  await calistir(geri);
}

ana().catch((hata: unknown) => {
  console.error(hata instanceof Error ? hata.message : hata);
  process.exitCode = 1;
});
