/** Video yükleme ve paylaşım linki: rclone (`copyto` + `link`). Bağlantı, "bağlantıya sahip herkes görüntüler" izniyle gelir. */
import { REMOTE, type Kosucu } from "./erisim.ts";
import { VIDEO_KLASORU, type DriveIstemci } from "./tipler.ts";

export function driveIstemci(kosucu: Kosucu): DriveIstemci {
  return {
    async yukle(yerelYol, ad) {
      if (!/^[A-Za-z0-9._-]+$/.test(ad)) throw new Error(`Geçersiz Drive dosya adı: ${ad}`);
      const hedef = `${REMOTE}:${VIDEO_KLASORU}/${ad}`;
      const kopya = await kosucu("rclone", ["copyto", yerelYol, hedef]);
      if (kopya.kod !== 0) throw new Error(`Drive yüklemesi başarısız: ${kopya.stderr.trim().split("\n").pop() ?? "rclone hatası"}`);
      const link = await kosucu("rclone", ["link", hedef]);
      const url = link.stdout.trim().split("\n").pop() ?? "";
      if (link.kod !== 0 || !/^https:\/\//.test(url)) throw new Error(`Drive paylaşım linki alınamadı: ${link.stderr.trim().split("\n").pop() ?? "rclone hatası"}`);
      return url;
    },
  };
}
