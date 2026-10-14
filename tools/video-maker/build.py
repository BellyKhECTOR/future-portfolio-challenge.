import asyncio, json, subprocess, sys, os, wave
import numpy as np
from playwright.async_api import async_playwright
sys.path.insert(0, os.path.dirname(__file__))
from chapters import CHAPTERS

D = os.path.dirname(os.path.abspath(__file__))
SR = 44100
FPS = 30
VOICE = "en-ZA-LeahNeural"
QUESTIONS = {
    "ai-boom": "How will you invest R10 million for the next 5 years?",
    "green-shift": "How will you invest your wealth for the next 15 years?",
    "global-shock": "How will you protect and grow your wealth for the next 4 years?",
    "sa-rising": "Your last move. The richest portfolio in 2055 wins.",
}
CHORDS = {  # frequencies (Hz) per mood, 4 chords looping
    "bright": [[261.6, 329.6, 392.0], [220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [196.0, 246.9, 293.7]],
    "warm":   [[196.0, 246.9, 293.7], [164.8, 196.0, 246.9], [130.8, 164.8, 196.0], [146.8, 185.0, 220.0]],
    "dark":   [[220.0, 261.6, 329.6], [174.6, 220.0, 261.6], [164.8, 207.7, 246.9], [220.0, 261.6, 329.6]],
}

def sh(cmd): return subprocess.run(cmd, check=True, capture_output=True, text=True).stdout

def tts(text, path):
    if not os.path.exists(path) or os.path.getsize(path) == 0:
        sh(["edge-tts", "--voice", VOICE, "--rate=-4%", "--text", text, "--write-media", path])

def load_audio(path):
    raw = subprocess.run(["ffmpeg", "-v", "quiet", "-i", path, "-f", "s16le", "-ac", "1", "-ar", str(SR), "-"], check=True, capture_output=True).stdout
    return np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768

def music(total, mood):
    n = int(total * SR); t = np.arange(n) / SR; y = np.zeros(n, np.float32)
    seg = 4.0
    for k, ch in enumerate([CHORDS[mood][i % 4] for i in range(int(total / seg) + 2)]):
        s0 = int(k * seg * SR); s1 = min(n, int((k + 1) * seg * SR + SR))
        if s0 >= n: break
        tt = t[s0:s1] - k * seg
        env = np.clip(tt / 1.2, 0, 1) * np.clip((seg + 1 - tt) / 1.2, 0, 1)
        for f in ch + [ch[0] / 2]:
            for det in (-0.6, 0.6):
                y[s0:s1] += (np.sin(2 * np.pi * (f + det) * tt) * 0.6 + np.sin(4 * np.pi * (f + det) * tt) * 0.12) * env
    # gentle pulse
    y *= 0.85 + 0.15 * np.sin(2 * np.pi * 0.5 * t)
    y /= np.max(np.abs(y)) + 1e-9
    fade = np.clip(t / 2, 0, 1) * np.clip((total - t) / 2.5, 0, 1)
    return y * fade

def whoosh(dur=4.2):
    n = int(dur * SR); rng = np.random.default_rng(3); x = rng.standard_normal(n).astype(np.float32)
    t = np.arange(n) / SR; out = np.zeros(n, np.float32); y = 0.0
    a = 0.02 + 0.25 * np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 2  # sweeping one-pole lowpass
    for i in range(n): y += a[i] * (x[i] - y); out[i] = y
    env = np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 1.5
    out = out * env; return out / (np.max(np.abs(out)) + 1e-9)

def write_wav(path, y):
    y = np.clip(y, -1, 1); data = (y * 32767).astype(np.int16)
    with wave.open(path, "wb") as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())

async def render(ch, cfg, total, out_path, wav_path, preview=None):
    async with async_playwright() as pw:
        br = await pw.chromium.launch(executable_path="/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
        p = await br.new_page(viewport={"width": 1920, "height": 1080})
        await p.goto("file://" + os.path.join(D, "render.html")); await p.evaluate("document.fonts.ready"); await p.wait_for_timeout(1500)
        await p.evaluate("cfg => setup(cfg)", cfg)
        if preview is not None:
            for tt in preview:
                await p.evaluate(f"frame({tt})"); await p.screenshot(path=os.path.join(D, f"prev_{ch['id']}_{tt}.png"))
            await br.close(); return
        nframes = int(total * FPS)
        ff = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "image2pipe", "-framerate", str(FPS), "-i", "-", "-i", wav_path,
                               "-c:v", "libx264", "-preset", "medium", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k",
                               "-movflags", "+faststart", "-shortest", out_path], stdin=subprocess.PIPE)
        for f in range(nframes):
            await p.evaluate(f"frame({f / FPS})")
            ff.stdin.write(await p.screenshot(type="jpeg", quality=88))
        ff.stdin.close(); ff.wait(); await br.close()

def plan(ch):
    os.makedirs(os.path.join(D, "tts"), exist_ok=True)
    t = 0.0; scenes = []; voice = []
    for i, s in enumerate(ch["scenes"]):
        path = os.path.join(D, "tts", f"{ch['id']}_{i}.mp3"); tts(s["say"], path)
        a = load_audio(path); ad = len(a) / SR
        lead = 0.5
        dur = max(ad + lead + 0.7, 5.2) if s["type"] == "travel" else ad + lead + (3.5 if s["type"] == "close" else 0.8)
        scenes.append({**s, "start": round(t, 3), "dur": round(dur, 3)}); voice.append((t + lead, a)); t += dur
    return scenes, voice, t

def build(ch, preview=None):
    scenes, voice, total = plan(ch)
    heads = [s["head"] for s in scenes if s["type"] == "news"]
    cfg = {"n": ch["n"], "from": ch["from"], "year": ch["year"], "title": ch["title"], "mood": ch["mood"],
           "question": QUESTIONS[ch["id"]], "ticker": ("     •     ".join(heads) + "     •     ") * 4, "scenes": scenes}
    wav_path = os.path.join(D, f"{ch['id']}.wav"); out = os.path.join(D, f"{ch['id']}.mp4")
    if preview is None:
        n = int(total * SR) + SR; mix = np.zeros(n, np.float32)
        mix[: int(total * SR)] += music(total, ch["mood"]) * 0.10
        w = whoosh(); s0 = int(0.3 * SR); mix[s0:s0 + len(w)] += w * 0.18
        for st, a in voice: s0 = int(st * SR); mix[s0:s0 + len(a)] += a * 0.95
        write_wav(wav_path, mix[: int(total * SR)])
    asyncio.run(render(ch, cfg, total, out, wav_path, preview))
    return total

if __name__ == "__main__":
    which = sys.argv[1] if len(sys.argv) > 1 else "all"
    prev = [float(x) for x in sys.argv[2].split(",")] if len(sys.argv) > 2 else None
    for ch in CHAPTERS:
        if which in ("all", ch["id"]):
            print(ch["id"], round(build(ch, prev), 1), "s", flush=True)
