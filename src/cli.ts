const komutlar: Record<string, (argv: string[]) => Promise<void>> = {
  paylas: async (argv) => (await import("./paylas/komut.ts")).calistir(argv),
};

const [ad, ...argv] = process.argv.slice(2);
const komut = ad === undefined ? undefined : komutlar[ad];
if (!komut) {
  console.error(`HATA: komut yok; kullanılabilir: ${Object.keys(komutlar).join(", ")}`);
  process.exit(1);
}
await komut(argv);
