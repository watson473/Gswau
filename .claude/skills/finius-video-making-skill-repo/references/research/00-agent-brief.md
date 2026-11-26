# Shared brief for the 15 analysis agents

Goal: reverse-engineer the PRODUCTION CRAFT of one long-form YouTube documentary (FINAiUS, "Empire of Shadows", 39:28)
so we can write a playbook that lets Claude Code make ORIGINAL long-form videos with the same level of craft.
We never copy his story, script, images or footage; we want editing grammar, timing rules, visual and sound technique.

Read first: work/README.md (material and how to read the contact sheets), notes/website.md (the creator's own stated
workflow: DaVinci Resolve, Kling AI video, ElevenLabs on his own voice, Unreal Engine 3D rooms with framed archive
photos and a detective board, a few seconds of feature-film footage, "no static shot over 4 s", a story turn every 2-3 min).

Tools you can use: ffmpeg/ffprobe (drawtext is NOT available), Python with numpy at
python3 (with numpy).
Extract frames: ffmpeg -ss T -i src/video.mp4 -frames:v 1 X.png  (several frames 0.25 s apart reveal motion; scale=960:-1 to save tokens).
Put scratch files in <scratch>/aNN/ .
Audio: ffmpeg -ss A -t D -i work/audio.wav -af ebur128 / astats / silencedetect, or numpy energy and spectral-flux curves to find SFX hits,
music entries, drops and risers. Word timing: src/video.en-orig.vtt (YouTube auto captions with per-word <timestamps>).

Our production stack (write every recipe for THIS stack): HyperFrames (HTML + GSAP, rendered frame-by-frame to MP4,
1920x1080, 30 fps; scenes as sub-compositions; we already build cards, statements, tables, charts, maps, lower thirds),
AI-generated stills (any image model), image-to-video (Kling-like) when budget allows, TTS narration (OmniVoice, voice
"Renee"), local whisper word timing, an SFX library (whoosh, pop, paper, impact, riser...) and licensed music beds, ffmpeg mixing.

Rules: quotes of his narration under 15 words each; describe, don't transcribe. Give NUMBERS (seconds, ms offsets,
scales, opacities, dB, ease names, font sizes as % of frame height). Say what you measured vs inferred.
Write your notes to notes/NN-<topic>.md (path given in your task) and reply with a 200-word summary of top findings.
All paths are relative to  .
