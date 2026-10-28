#!/usr/bin/env python3
"""Testimonial kesim motoru.
Kullanim: build.py <spec.json> [--ciktidir DIR]
spec: {"out": "ad", "hook": "ust yazi", "hook_sn": 3.0, "clips": [{"src": "dosya.mp4", "dokum": "TST-02", "t0": 1.0, "t1": 5.0, "crop": [x,y,w,h], "fgy": 480}]}
- crop: kaynaktan konusmaci paneli (yuz merkezli); on plan 1080 genislige olceklenir, bulanik arka plan ustunde fgy konumuna konur.
- Altyazi: ASS, kelime vurgulu (aktif kelime sari), beyaz + siyah kontur, y<=~1480 (alt %20'nin ustu).
- Ses: -14 LUFS (olcup duzeltir). Cikti 1080x1920 H.264/AAC.
"""
import sys, json, subprocess, os, re
K = "/home/dev/cikti/aiscale-testimonial"
W, H = 1080, 1920

def tr_upper(s):
    return s.replace("i", "İ").replace("ı", "I").upper()

def ass_time(t):
    t = max(t, 0); h = int(t // 3600); m = int(t % 3600 // 60); s = t % 60
    return f"{h}:{m:02d}:{s:05.2f}"

def words_for(clip, off, fix=None):
    fix = fix or {}
    d = json.load(open(f"{K}/dokum/{clip['dokum']}.json"))
    out = []
    for seg in d["segments"]:
        for w in seg["words"]:
            if w["s"] >= clip["t0"] - 0.02 and w["e"] <= clip["t1"] + 0.05:
                txt = re.sub(r"[^\w'’]", "", w["w"], flags=re.U)
                if txt:
                    u = tr_upper(txt); u = fix.get(u, u)
                    if u: out.append((w["s"] - clip["t0"] + off, min(w["e"], clip["t1"]) - clip["t0"] + off, u))
    return out

def chunks(ws):
    res, cur = [], []
    for w in ws:
        if cur and (len(cur) >= 3 or sum(len(x[2]) for x in cur) + len(w[2]) > 18 or w[0] - cur[-1][1] > 0.6):
            res.append(cur); cur = []
        cur.append(w)
    if cur: res.append(cur)
    return res

def make_ass(spec, path):
    hdr = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 2

[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: Alt,DejaVu Sans,60,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,7,0,2,60,60,{H-1470},1
Style: Hook,DejaVu Sans,62,&H00FFFFFF,&H00FFFFFF,&H00A03CC8,&H00A03CC8,-1,0,0,0,100,100,0,0,3,18,0,8,60,60,230,1

[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
"""
    ev, off = [], 0.0
    for c in spec["clips"]:
        ws = words_for(c, off, {**spec.get('fix', {}), **c.get('fix', {})})
        for ch in chunks(ws):
            end_ch = ch[-1][1] + 0.12
            for i, w in enumerate(ch):
                s = w[0]; e = ch[i + 1][0] if i + 1 < len(ch) else end_ch
                txt = " ".join((r"{\c&H00FFFF&}" + x[2] + r"{\c&HFFFFFF&}") if j == i else x[2] for j, x in enumerate(ch))
                ev.append(f"Dialogue: 0,{ass_time(s)},{ass_time(e)},Alt,,0,0,0,,{txt}")
        off += c["t1"] - c["t0"]
    if spec.get("hook"):
        hs = spec.get("hook_sn", 3.0)
        ev.append(f"Dialogue: 1,{ass_time(0)},{ass_time(hs)},Hook,,0,0,0,,{{\\fad(150,200)}}{spec['hook'].replace(chr(10), chr(92)+'N')}")
    open(path, "w", encoding="utf-8").write(hdr + "\n".join(ev) + "\n")
    return off

def measure(path):
    r = subprocess.run(["ffmpeg", "-nostats", "-i", path, "-af", "ebur128=peak=true", "-f", "null", "-"], capture_output=True, text=True)
    m = re.findall(r"I:\s+(-?[\d.]+) LUFS", r.stderr)
    return float(m[-1]) if m else None

def main():
    spec = json.load(open(sys.argv[1]))
    od = sys.argv[sys.argv.index("--ciktidir") + 1] if "--ciktidir" in sys.argv else f"{K}/cikti"
    os.makedirs(od, exist_ok=True)
    out = f"{od}/{spec['out']}.mp4"; ass = f"{od}/{spec['out']}.ass"
    for c in spec['clips']: c['t0'] = max(0.0, c['t0'])
    total = make_ass(spec, ass)
    cmd = ["ffmpeg", "-v", "error", "-y"]
    fc, labels = [], ""
    for i, c in enumerate(spec["clips"]):
        cmd += ["-ss", str(c["t0"]), "-to", str(c["t1"]), "-i", f"{K}/kaynak/{c['src']}"]
        x, y, w, h = c["crop"]; d = c["t1"] - c["t0"]
        fgh = round(W * h / w / 2) * 2
        fgy = c.get("fgy", (H - fgh) // 2 - 150)
        fc.append(f"[{i}:v]crop={w}:{h}:{x}:{y},split[a{i}][b{i}];"
                  f"[a{i}]scale={W}:{H}:force_original_aspect_ratio=increase,crop={W}:{H},gblur=sigma=40,eq=brightness=-0.15[bg{i}];"
                  f"[b{i}]scale={W}:{fgh}[fg{i}];[bg{i}][fg{i}]overlay=0:{fgy},fps=30,setsar=1[v{i}];"
                  f"[{i}:a]aresample=48000,afade=in:d=0.03,afade=out:st={d-0.03:.3f}:d=0.03[a{i}]")
        labels += f"[v{i}][a{i}]"
    n = len(spec["clips"])
    fc.append(f"{labels}concat=n={n}:v=1:a=1[vc][ac];[vc]ass='{ass}'[vo];[ac]loudnorm=I=-14:TP=-1.5:LRA=11[ao]")
    cmd += ["-filter_complex", ";".join(fc), "-map", "[vo]", "-map", "[ao]", "-c:v", "libx264", "-preset", "medium", "-crf", "20",
            "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", out]
    subprocess.run(cmd, check=True)
    l = measure(out)
    if l is not None and abs(l + 14) > 0.8:
        tmp = out + ".tmp.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", out, "-c:v", "copy", "-af", f"volume={-14 - l:.2f}dB,alimiter=limit=0.89", "-c:a", "aac", "-b:a", "192k", tmp], check=True)
        os.replace(tmp, out); l = measure(out)
    d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out]))
    print(f"{out} sure={d:.1f}s LUFS={l}")

if __name__ == "__main__":
    main()
