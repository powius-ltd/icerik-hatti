#!/home/dev/.venvs/whisper/bin/python
"""Kullanim: asr.py <video> <cikti.json>  -> kelime zamanli Turkce dokum (faster-whisper large-v3-turbo)."""
import sys, json, subprocess, tempfile, os
from faster_whisper import WhisperModel
src, out = sys.argv[1], sys.argv[2]
wav = tempfile.mktemp(suffix=".wav")
subprocess.run(["ffmpeg","-v","error","-y","-i",src,"-vn","-ac","1","-ar","16000",wav],check=True)
m = WhisperModel("large-v3-turbo", device="cpu", compute_type="int8", cpu_threads=3)
segs, info = m.transcribe(wav, language="tr", word_timestamps=True, vad_filter=True)
res = {"kaynak": os.path.basename(src), "sure": info.duration, "segments": []}
for s in segs:
    res["segments"].append({"start": s.start, "end": s.end, "text": s.text.strip(),
        "words": [{"w": w.word.strip(), "s": w.start, "e": w.end} for w in (s.words or [])]})
json.dump(res, open(out, "w"), ensure_ascii=False)
os.remove(wav)
print(out, len(res["segments"]), "segment")
