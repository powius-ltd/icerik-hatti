/**
 * icerik-hatti komut yönlendirici: npm run hat -- <komut> [bayraklar]
 * Her komut kendi dizininde `calistir(argv)` dışa aktarır.
 */
const komutlar: Record<string, (argv: string[]) => Promise<void>> = {
  fis: async (argv) => (await import("./fis/komut.ts")).calistir(argv),
  paylas: async (argv) => (await import("./paylas/komut.ts")).calistir(argv),
};

const OZET: Record<string, string> = {
  fis: "Video/link/hazır metinden onaylanacak Türkçe birebir uyarlama fişi (fis.md) üretir",
  paylas: "Onaylı videoyu Zernio ile (zamanlı) gönderir; varsayılan kuru koşu",
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
