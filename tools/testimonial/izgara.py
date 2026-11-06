#!/usr/bin/env python3
"""Izgara kanca prototipi: 2x2 izgara -> konusan kutu buyur -> gazete (krem) gecisi -> govde.
Kullanim: izgara.py <spec.json> [--ciktidir DIR]
"renk.zemin_son" varsa gecis o renge biter (govdenin ilk sahne zemini; vars. zemin_gazete).
"govde" alani yoksa video krem zemine gecisle biter (EXIT1 sn); govde reels.sh ile eklenir.
Altyazi ve dokum mantigi build.py'den import edilir (words_for, chunks, ass_time, measure).
Renkler config/hesaplar/varsayilan.json belirteclerinden; spec yalniz belirtec adi verir.
Kutular tek en-boy oraninda (1000x1280 master); olcek/konum ffmpeg ifadesiyle (kolay yumusatma).
"""
import sys, json, os, subprocess
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build
from build import W, H, K, words_for, chunks, ass_time, measure

KOK = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
MW, MH = 1000, 1280                 # master kutu
BIG = (40, 150, 1.0)                # konusan
GRID = [(28, 300, .5), (552, 300, .5), (28, 964, .5), (552, 964, .5)]
SLOT_Y, SLOT_S = 1530, .28
GROW, GAP, LEAD = 0.25, 0.05, 0.08  # buyume sn, konusmalar arasi bosluk, ses gecikmesi
EXIT0, EXIT1 = 5.0, 5.7
BG0, BG1 = 5.0, 5.5

def tok(name):
    t = json.load(open(f"{KOK}/config/hesaplar/varsayilan.json"))["tokens"][name]
    return t.lstrip("#")

def ass_renk(hexs):
    return f"&H00{hexs[4:6]}{hexs[2:4]}{hexs[0:2]}".upper().replace("&H00", "&H00")

def ease(ta, tb):
    u = f"clip((t-{ta:.3f})/{tb-ta:.3f},0,1)"
    return f"({u}*{u}*(3-2*{u}))"

def track(v0, trans):
    e, prev = f"{v0}", v0
    for ta, tb, v in trans:
        if v != prev:
            e += f"+({v-prev})*{ease(ta, tb)}"
        prev = v
    return e

def slot(p, k):
    others = [q for q in range(4) if q != k]
    return (80 + 320 * others.index(p), SLOT_Y, SLOT_S)

def plan(n_konusan, starts):
    """Her kisi icin (x,y,s) gecisleri: izgara -> (konusma fazlari) -> cikis."""
    out = []
    for p in range(4):
        tr = []
        for k in range(n_konusan):
            st = BIG if p == k else slot(p, k)
            tr.append((starts[k], starts[k] + GROW, st))
        last = tr[-1][2]
        ex = (-1100, last[1], last[2]) if last == BIG else (last[0], 2000, last[2])
        tr.append((EXIT0, EXIT1, ex))
        out.append(tr)
    return out

def make_ass(spec, clips, offs, path):
    ink, kagit = ass_renk(tok(spec["renk"]["murekkep"])), ass_renk(tok(spec["renk"]["zemin_gazete"]))
    hdr = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 2

[V4+ Styles]
Format: Name,Fontname,Fontsize,PrimaryColour,SecondaryColour,OutlineColour,BackColour,Bold,Italic,Underline,StrikeOut,ScaleX,ScaleY,Spacing,Angle,BorderStyle,Outline,Shadow,Alignment,MarginL,MarginR,MarginV,Encoding
Style: Alt,DejaVu Sans,60,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,-1,0,0,0,100,100,0,0,1,7,0,2,60,60,{H-1500},1
Style: Hook,DejaVu Sans,90,{kagit},{kagit},{ink},{ink},-1,0,0,0,100,100,0,0,3,26,0,5,40,40,0,1

[Events]
Format: Layer,Start,End,Style,Name,MarginL,MarginR,MarginV,Effect,Text
"""
    ev = []
    for c, off in zip(clips, offs):
        cs = chunks(words_for(c, off, c.get("fix", {})))
        for k, ch in enumerate(cs):
            end_ch = min(ch[-1][1] + 0.12, cs[k + 1][0][0]) if k + 1 < len(cs) else ch[-1][1] + 0.12
            for i, w in enumerate(ch):
                s = w[0]; e = ch[i + 1][0] if i + 1 < len(ch) else end_ch
                txt = " ".join((r"{\c&H00FFFF&}" + x[2] + r"{\c&HFFFFFF&}") if j == i else x[2] for j, x in enumerate(ch))
                ev.append(f"Dialogue: 0,{ass_time(s)},{ass_time(e)},Alt,,0,0,0,,{txt}")
    ev.append(f"Dialogue: 1,{ass_time(0)},{ass_time(spec['hook_sn'])},Hook,,0,0,0,,{{\\fad(0,250)}}{spec['hook'].replace(chr(10), chr(92)+'N')}")
    open(path, "w", encoding="utf-8").write(hdr + "\n".join(ev) + "\n")

def main():
    spec = json.load(open(sys.argv[1]))
    od = sys.argv[sys.argv.index("--ciktidir") + 1]
    os.makedirs(od, exist_ok=True)
    out, ass = f"{od}/{spec['out']}.mp4", f"{od}/{spec['out']}.ass"
    kisi, g = spec["kisiler"], spec.get("govde")
    konusan = [c for c in kisi if "t0" in c]
    starts, offs, t = [], [], 0.6
    for c in konusan:
        starts.append(t); a = t + LEAD; offs.append(a); t = a + (c["t1"] - c["t0"]) + GAP
    pl = plan(len(konusan), starts)
    make_ass(spec, konusan, offs, ass)
    ink, bg0, bg1, cer = tok(spec["renk"]["murekkep"]), tok(spec["renk"]["zemin_kanca"]), tok(spec["renk"].get("zemin_son", spec["renk"]["zemin_gazete"])), tok(spec["renk"]["cerceve"])
    B = g["basla"] if g else EXIT1
    cmd = ["ffmpeg", "-v", "error", "-y"]; fc = []
    for i, c in enumerate(kisi):
        ss = c["t0"] - offs[i] if "t0" in c else c["sessiz_bas"]
        cmd += ["-ss", f"{ss:.3f}", "-t", f"{B+0.2}", "-i", f"{K}/kaynak/{c['src']}"]
        x, y, w, h = c["crop"]
        S = lambda k, i=i: track(GRID[i][k], [(a, b, st[k]) for a, b, st in pl[i]])
        sx, sy, ss_ = S(0), S(1), S(2)
        c["_ifade"] = (sx, sy)
        fc.append(f"[{i}:v]fps=30,crop={w}:{h}:{x}:{y},scale={MW}:{MH}:force_original_aspect_ratio=increase,crop={MW}:{MH},setsar=1,"
                  f"drawbox=x=0:y=0:w={MW}:h={MH}:color=0x{cer}:t=14,format=yuv420p,"
                  f"scale=w='trunc({MW}*({ss_})/2)*2':h='trunc({MH}*({ss_})/2)*2':eval=frame[p{i}]")
    n = len(kisi)
    if g:
        cmd += ["-ss", str(g["t0"]), "-t", str(g["sn"]), "-i", g["src"]]
    fc.append(f"color=c=0x{bg0}:s={W}x{H}:r=30:d={B}[z0];color=c=0x{bg1}:s={W}x{H}:r=30:d={B},format=yuva420p,"
              f"fade=t=in:st={BG0}:d={BG1-BG0}:alpha=1[z1];[z0][z1]overlay[bg]")
    prev = "bg"; sira = [3, 0, 1, 2] if len(kisi) == 4 else list(range(len(kisi)))
    for j, i in enumerate(sira):
        sx, sy = kisi[i]["_ifade"]
        fc.append(f"[{prev}][p{i}]overlay=x='{sx}':y='{sy}':eval=frame:eof_action=pass[o{j}]"); prev = f"o{j}"
    fc.append(f"[{prev}]drawbox=x=60:y=120:w=960:h=8:color=0x{ink}:t=fill:enable='gte(t,5.3)',"
              f"drawbox=x=60:y=140:w=960:h=3:color=0x{ink}:t=fill:enable='gte(t,5.4)',"
              f"drawbox=x=60:y=1790:w=960:h=3:color=0x{ink}:t=fill:enable='gte(t,5.4)',"
              f"drawbox=x=60:y=1805:w=960:h=8:color=0x{ink}:t=fill:enable='gte(t,5.3)',fps=30,setsar=1[vb]")
    if g:
        fc.append(f"[{n}:v]fps=30,scale={W}:{H},setsar=1,format=yuv420p[vg]")
        fc.append(f"[vb][vg]concat=n=2:v=1:a=0[vc];[vc]ass='{ass}'[vo]")
    else:
        fc.append(f"[vb]ass='{ass}'[vo]")
    labels = ""
    for k, c in enumerate(konusan):
        d = c["t1"] - c["t0"]; a = offs[k]
        fc.append(f"[{k}:a]atrim=start={a:.3f}:duration={d:.3f},asetpts=PTS-STARTPTS,aresample=48000,afade=in:d=0.03,afade=out:st={d-0.03:.3f}:d=0.03,adelay={int(a*1000)}:all=1[a{k}]")
        labels += f"[a{k}]"
    if g:
        fc.append(f"[{n}:a]aresample=48000,afade=in:d=0.03,adelay={int(B*1000)}:all=1[ag]")
        fc.append(f"{labels}[ag]amix=inputs={len(konusan)+1}:normalize=0:duration=longest[ao]")
    else:
        fc.append(f"{labels}amix=inputs={len(konusan)}:normalize=0:duration=longest,apad=whole_dur={B}[ao]")
    open(f"{od}/filtre.txt", "w").write(";\n".join(fc))
    cmd += ["-filter_complex_script", f"{od}/filtre.txt", "-map", "[vo]", "-map", "[ao]", "-c:v", "libx264", "-preset", "medium", "-crf", "20",
            "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", out]
    subprocess.run(cmd, check=True)
    l = measure(out)
    if l is not None and abs(l + 14) > 0.8:
        tmp = out + ".tmp.mp4"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", out, "-c:v", "copy", "-af", f"volume={-14 - l:.2f}dB,alimiter=limit=0.89", "-c:a", "aac", "-b:a", "192k", tmp], check=True)
        os.replace(tmp, out)
    d = float(subprocess.check_output(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out]))
    print(f"{out} sure={d:.2f}s LUFS={measure(out)} konusma_baslari={[round(s,2) for s in starts]}")

if __name__ == "__main__":
    main()
