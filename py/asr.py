# Kaynak: viral-uyarla/py/asr.py (335b436)
"""Whisper dökümü: video/ses dosyası -> Dokum JSON ({dil, segmentler:[{bas, son, metin, kelimeler:[[bas, son, kelime]]}]}).

Kullanım:  python asr.py <girdi.mp4> <cikti.json>
Ortam:     WHISPER_MODEL (varsayılan small), WHISPER_LANG (boş = dili kendisi bulur; ör. en, tr)
Gerekli:   faster-whisper (av==15.1.0 sabit). CPU, int8, 2 iş parçacığı: paylaşımlı makinede ağır iş olmasın.
Ses akışı yoksa (sessiz video) boş döküm yazar: {"dil": "und", "segmentler": []}; hata saymaz.
Orijinal dilde yazar, çevirmez. Sözleşme: src/ortak/tipler.ts `dokumSema`.
"""
import json
import os
import sys


def sessiz_mi(yol: str) -> bool:
    """Dosyada ses akışı yok mu (PyAV ile bakar; açılamazsa False: asıl hata transcribe'da görünsün)."""
    try:
        import av

        with av.open(yol) as kap:
            return len(kap.streams.audio) == 0
    except Exception:
        return False


def main() -> int:
    if len(sys.argv) != 3:
        print("Kullanım: asr.py <girdi> <cikti.json>", file=sys.stderr)
        return 2
    girdi, cikti = sys.argv[1], sys.argv[2]
    if sessiz_mi(girdi):
        sonuc = {"dil": "und", "segmentler": []}
    else:
        from faster_whisper import WhisperModel

        model = WhisperModel(os.environ.get("WHISPER_MODEL") or "small", device="cpu", compute_type="int8", cpu_threads=2)
        dil = os.environ.get("WHISPER_LANG") or None
        parcalar, bilgi = model.transcribe(girdi, language=dil, word_timestamps=True, vad_filter=False)
        segmentler = []
        for p in parcalar:
            metin = p.text.strip()
            if not metin:
                continue
            kelimeler = [[round(k.start, 2), round(k.end, 2), k.word.strip()] for k in (p.words or [])]
            segmentler.append({"bas": round(p.start, 2), "son": round(p.end, 2), "metin": metin, "kelimeler": kelimeler})
        sonuc = {"dil": bilgi.language or "und", "segmentler": segmentler}
    with open(cikti, "w", encoding="utf-8") as f:
        json.dump(sonuc, f, ensure_ascii=False, indent=2)
        f.write("\n")
    print(f"{sonuc['dil']}: {len(sonuc['segmentler'])} segment")
    return 0


if __name__ == "__main__":
    sys.exit(main())
