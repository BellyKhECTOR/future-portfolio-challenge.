import asyncio, base64, io, os, sys
import numpy as np, qrcode
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build as B
from competition import COMP, ENTRY_URL

def qr_data_url(url):
    q = qrcode.QRCode(error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=16, border=2)
    q.add_data(url); q.make(fit=True)
    img = q.make_image(fill_color="#1d2633", back_color="white"); buf = io.BytesIO(); img.save(buf, format="PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()

def main(preview=None):
    ch = COMP
    scenes, voice, total = B.plan(ch)
    # hold the final QR a little longer
    scenes[-1]["dur"] = round(scenes[-1]["dur"] + 6, 3); total += 6
    heads = [s["head"] for s in scenes if s["type"] in ("news", "learn", "grid")]
    cfg = {"n": 1, "from": ch["from"], "year": ch["year"], "title": ch["title"], "mood": ch["mood"], "question": ch["question"],
           "closeKick": None, "ticker": ("     •     ".join(heads) + "     •     ") * 4, "scenes": scenes,
           "qr": qr_data_url(ENTRY_URL), "url": ENTRY_URL.replace("https://", "")}
    wav = os.path.join(B.D, "competition.wav"); out = os.path.join(B.D, "competition.mp4")
    if preview is None:
        n = int(total * B.SR) + B.SR; mix = np.zeros(n, np.float32)
        mus = B.music(total, "bright") * 0.10
        mix[: int(total * B.SR)] += mus
        w = B.whoosh()
        for s in scenes:
            if s["type"] == "travel":
                s0 = int((s["start"] + 0.3) * B.SR); mix[s0:s0 + len(w)] += w * 0.18
        for st, a in voice: s0 = int(st * B.SR); mix[s0:s0 + len(a)] += a * 0.95
        B.write_wav(wav, mix[: int(total * B.SR)])
    asyncio.run(B.render(ch, cfg, total, out, wav, preview))
    return total

if __name__ == "__main__":
    prev = [float(x) for x in sys.argv[1].split(",")] if len(sys.argv) > 1 else None
    print("competition", round(main(prev), 1), "s", flush=True)
