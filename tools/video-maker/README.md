# Chapter video maker

Rebuilds the four "Future News" chapter videos (1920x1080, American English male narration - voice set by VOICE in build.py - Mazi branding).

Edit the scripts in `chapters.py`, then:

    pip install edge-tts playwright numpy
    cp ../../img/mazi-logo.svg ../../img/mazi-20-years.svg .
    python build.py all          # or one chapter, e.g. python build.py ai-boom

Needs ffmpeg and Chromium (Playwright). Output: <chapter-id>.mp4 in this folder - copy into ../../videos/.
