#!/usr/bin/env python3
"""QA a long-form render against the Finius Video Making Skill Repo targets.

usage: python3 qa_video.py VIDEO.mp4 [--words WORDS.json] [--lufs -15] [--json OUT.json]

Reports:
  - shot cuts (ffmpeg scdet) -> shots per minute for every minute, mean/median shot length
  - static holds: any window >= 4 s where the picture barely changes (rule: nothing still > 4 s, text cards <= 8 s)
  - loudness: integrated LUFS, LRA, true peak (ffmpeg ebur128)
  - with --words: share of cuts landing 0-500 ms before a word onset (target >= 80 %)
WORDS.json may be a list of {"start": s} / {"s": s}, or {"words": [...]} with the same keys (absolute seconds).
Needs ffmpeg/ffprobe and numpy.
"""
import argparse, json, re, subprocess, sys

import numpy as np

W, H = 192, 108


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def fps_of(path):
    r = run(["ffprobe", "-v", "error", "-select_streams", "v:0", "-show_entries", "stream=r_frame_rate",
             "-of", "csv=p=0", path]).stdout.strip()
    a, b = r.split("/") if "/" in r else (r, 1)
    return float(a) / float(b)


def cuts(path, thr=10):
    err = run(["ffmpeg", "-hide_banner", "-i", path, "-an", "-vf", f"scale=480:-2,scdet=threshold={thr}",
               "-f", "null", "-"]).stderr
    return [float(x) for x in re.findall(r"lavfi\.scd\.time: ([0-9.]+)", err)]


def frames_gray(path, fps):
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-i", path, "-an", "-vf", f"fps={fps},scale={W}:{H},format=gray",
                          "-f", "rawvideo", "-"], stdout=subprocess.PIPE)
    data = p.stdout.read()
    p.wait()
    return np.frombuffer(data, np.uint8).reshape(-1, H, W)


def static_holds(fr, fps, min_s=4.0):
    dif = lambda a, b: float(np.abs(fr[a].astype(np.int16) - fr[b]).mean())
    d1 = np.array([dif(k + 1, k) for k in range(len(fr) - 1)])   # frame-to-frame change
    n = int(min_s * fps)
    holds, i = [], 0
    while i + n < len(fr):
        if d1[i:i + n].mean() < 0.6 and dif(i + n, i) < 2.0:
            j = i + n
            while j + 1 < len(fr) and d1[j] < 0.6 and dif(j + 1, i) < 2.0:
                j += 1
            luma = float(fr[i:j].mean())
            holds.append({"start": round(i / fps, 2), "dur": round((j - i) / fps, 2),
                          "mean_luma": round(luma, 1), "black": luma < 8})
            i = j + 1
        else:
            i += max(1, int(fps / 2))
    return holds


def loudness(path):
    err = run(["ffmpeg", "-hide_banner", "-nostats", "-i", path, "-vn", "-af", "ebur128=peak=true", "-f", "null", "-"]).stderr
    tail = err[err.rfind("Summary:"):]
    g = lambda k: (re.search(k + r":\s+(-?[0-9.]+)", tail) or [None, None])[1]
    return {"integrated_lufs": float(g("I") or "nan"), "lra": float(g("LRA") or "nan"), "true_peak_dbtp": float(g("Peak") or "nan")}


def load_words(path):
    j = json.load(open(path))
    ws = j.get("words", j) if isinstance(j, dict) else j
    return sorted(float(w.get("start", w.get("s"))) for w in ws)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("--words")
    ap.add_argument("--lufs", type=float, default=-15.0)
    ap.add_argument("--json")
    a = ap.parse_args()

    dur = float(run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", a.video]).stdout)
    c = cuts(a.video)
    edges = [0.0] + c + [dur]
    shots = np.diff(edges)
    per_min = [sum(1 for t in c if m * 60 <= t < (m + 1) * 60) for m in range(int(dur // 60) + 1)]
    fps = min(fps_of(a.video), 6.0)
    fr = frames_gray(a.video, fps)
    holds = static_holds(fr, fps)
    bad_holds = [h for h in holds if not (h["black"] and h["dur"] <= 8.0)]   # text cards on black may hold <= 8 s
    loud = loudness(a.video)

    rep = {"duration_s": round(dur, 2), "cuts": len(c), "mean_shot_s": round(float(shots.mean()), 2),
           "median_shot_s": round(float(np.median(shots)), 2), "cuts_per_minute": per_min,
           "static_holds_over_4s": holds, "loudness": loud}
    if a.words:
        ws = np.array(load_words(a.words))
        offs = []
        for t in c:
            nxt = ws[ws >= t - 0.05]
            if len(nxt):
                offs.append(t - nxt[0])
        offs = np.array(offs)
        rep["cut_offsets_ms_median"] = round(float(np.median(offs) * 1000), 0) if len(offs) else None
        rep["cuts_0_to_500ms_before_word_pct"] = round(float(((offs <= 0.05) & (offs >= -0.5)).mean() * 100), 1) if len(offs) else None

    # verdicts
    checks = []
    checks.append(("mean shot 3.5-6 s", 3.5 <= rep["mean_shot_s"] <= 6.0))
    slow = [i for i, n in enumerate(per_min[1:-1], 1) if n < 4]
    checks.append((f"no middle minute under 4 cuts (slow minutes: {slow[:10]})", not slow))
    checks.append((f"no static hold > 4 s except black cards <= 8 s ({len(bad_holds)} found)", not bad_holds))
    checks.append((f"integrated {loud['integrated_lufs']} LUFS within ±0.5 of {a.lufs}", abs(loud["integrated_lufs"] - a.lufs) <= 0.5))
    checks.append((f"true peak {loud['true_peak_dbtp']} dBTP <= -1.0", loud["true_peak_dbtp"] <= -1.0))
    if a.words and rep.get("cuts_0_to_500ms_before_word_pct") is not None:
        checks.append((f"{rep['cuts_0_to_500ms_before_word_pct']} % of cuts land 0-500 ms before a word (target >= 80)",
                       rep["cuts_0_to_500ms_before_word_pct"] >= 80))
    rep["checks"] = [{"check": k, "pass": bool(v)} for k, v in checks]

    print(f"{a.video}: {dur / 60:.1f} min, {len(c)} cuts, mean shot {rep['mean_shot_s']} s, median {rep['median_shot_s']} s")
    print("cuts/min:", " ".join(str(n) for n in per_min))
    for h in holds:
        print(f"  hold {h['start']:8.2f}s  {h['dur']:5.2f}s  luma {h['mean_luma']}{'  (black)' if h['black'] else ''}")
    print(f"loudness: I {loud['integrated_lufs']} LUFS, LRA {loud['lra']}, TP {loud['true_peak_dbtp']} dBTP")
    for ch in rep["checks"]:
        print(("PASS " if ch["pass"] else "FAIL ") + ch["check"])
    if a.json:
        json.dump(rep, open(a.json, "w"), indent=1)
    sys.exit(0 if all(ch["pass"] for ch in rep["checks"]) else 1)


if __name__ == "__main__":
    main()
