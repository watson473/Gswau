---
name: finius-video-making-skill-repo
description: Finius Video Making Skill Repo. Plan, script, build, mix, check and package long-form (20–60 min) documentary-style YouTube videos with the craft measured from the FINAiUS channel (picture-first cuts, always-moving images, dark warm 3D-room look, chapter breaths, rare SFX, steady music bed, mirrored hook and ending). Use whenever the user asks for a long-form video, a full episode, a documentary, an in-depth explainer, "the Finius style", or the next episode of a long-form series (e.g. "How the Barber Business Actually Works"), and when reviewing or fixing such a video's script, pacing, look or sound.
---

# Finius Video Making Skill Repo

A production system for long-form, in-depth YouTube videos. It was reverse-engineered from a frame-by-frame study of
the FINAiUS documentary "Empire of Shadows" (39:28, 9.3M views): 15 analysis agents (10 four-minute slices plus
sound, script, text/graphics, imagery and transitions) and a scan of the creator's interviews. Every number here is
measured on that video unless marked "(inferred)".

We copy the **craft** (structure, timing, camera, sound, typography rules). We never copy the creator's story,
script, images, 3D sets, thumbnails or footage.

## How to use this skill

1. Read this file fully. It is enough to plan and script.
2. Before building visuals or mixing, read `references/playbook.md` (the full spec: every recipe with numbers,
   GSAP/CSS snippets, ffmpeg chains, prompts, transitions library, packaging templates).
3. When you need the raw evidence for a decision (a shot log, a measured offset, a cue list), open the matching file
   in `references/research/` (index in `references/research/README.md`).
4. Run `scripts/qa_video.py` on every render before showing the user (§8).
5. Follow the channel rules in §9 at all times. They override anything else here.

## 1. The 12 rules of the style

1. **Nothing is ever still.** Every image moves for its whole time on screen (slow, linear push / pull / pan / rack
   focus, ~2%/s zoom, ~0.8% width/s pan). Only a text card on black may hold still, ≤8 s.
2. **Picture first, word second.** Cuts land 0–400 ms before the word they illustrate (median ≈ −260 ms); a new
   scene can arrive 2–5 s before it is named; expert/quote voices start 1.5–4.6 s before their face (J-cut).
3. **~95% hard cuts.** Other transitions need a reason: dip to black (time jump, death, act end), map-whip /
   zoom-through (place or scale change), black text card (unshowable fact, foreshadow). Never flips, glitches,
   film burns, star wipes, decorative flashes or random cross-dissolves.
4. **Pace comes from footage, not the voice.** Narration stays 125–140 wpm. Shot length changes instead: 6–9 s
   character scenes, 10–20 s emotional beats, 1.5–3 s crisis montages. The film speeds up (≈11 → 16 cuts/min, 30+
   at the climax) then slows for the last 2 minutes. Average shot ≈ 4.5 s; ~4.5 visual events per 10 s.
5. **Chapters end in a breath, not a title card.** Strong closing line, then 5–11 s of music only. No chapter
   cards on screen; chapters live in the description.
6. **A turn every 40–50 s, a big turn every ~2 min,** a loss every 7–9 min, the rival/alternative at 45–50%, a late
   surprise at ~87%. Keep ~4 open questions running.
7. **Text lives inside the world.** Names on plaques, door glass, book covers, letters, framed photos. Overlay text
   is rare (~30 items in 40 min): lower thirds, place/date stamps, a few black fact cards. No burned-in subtitles.
8. **Numbers become pictures** in documentary mode (gold changing hands, not a counter). Explainer mode may keep
   stat cards, tables and charts, styled into the same dark, warm world.
9. **Warm, dark, clean look.** Room shots ~50–60/255 brightness, warm umber (R:G:B ≈ 1.4:1.2:1), vignette corners
   ≈ 0.72× centre. No added grain, letterbox or dust overlay. Archive B&W stays neutral grey.
10. **Music is a steady bed ~14 dB under the voice, no pumping.** New cue about every minute, mostly at chapter
    breaths; swell +6–9 dB in breaths; one tonal family per film; only 3 true silences per film.
11. **SFX are rare and real:** 0.3–0.4/min, only for something on screen. No whooshes on cuts, no risers.
12. **The ending mirrors the opening:** same image as the cold open (now lit and close), a 2-sentence moral that
    answers the hook's tension, a ~12 s logo hold for end screens, no spoken "subscribe".

## 2. Workflow (each step has a gate)

| # | Step | Output | Gate |
|---|---|---|---|
| 1 | Topic + promise | Logline with a tension (value A vs value B), title + thumbnail idea | User picks |
| 2 | Research | `research.md`: timeline, people, numbers (before → after), quotes, sources | ≥2 sources per fact |
| 3 | Structure | Act map, turn list, open-loop plan (§3) | Pre-flight numbers (§3.4) |
| 4 | Script | Tagged script, every line with 1–2 visual tags + sound tags (§3.3) | Pre-flight table |
| 5 | Voice | TTS per line, word timing per line | Listen-through of hook + one chapter |
| 6 | Preview | 60–90 s (hook + one full chapter) with real voice, music and look | **User OK before full build** |
| 7 | Assets | Stills, image-to-video, maps, room plates per tags | **Ask before any credit-using generation** |
| 8 | Build | Scenes per chapter; cuts placed from word times (§4) | Render checks clean |
| 9 | Mix | Voice chain, music map, SFX, silences, master (§6) | Loudness target met |
| 10 | QA | `scripts/qa_video.py` + frame scan + fact check (§8) | All pass |
| 11 | Package | Title, thumbnail A/B, description, chapters, SRT (§7) | User OK |
| 12 | Publish | Schedule per the series calendar | **User OK** |

## 3. Script

### 3.1 Size
25 min ≈ 3,100–3,300 words, 16–18 chapters. 35 min ≈ 4,300–4,600 words, 22–24 chapters. 45 min ≈ 5,500–5,900
words, 28–30 chapters. Chapters 35–170 s (80% within 50–120 s). Write chapters at 135–145 wpm and leave a 6–10 s
breath at each seam. Word budget: `(runtime_s − 8 × chapters − hook_breath_s − offer_s) × 2.3`.

### 3.2 Act map (% of runtime)
Hook 0–2% (logline + duality + concrete tease, then a 20–30 s wordless world montage, black, place/year stamp) →
Act I rise 2–30% (underdog origin, the first "edge" explained, inciting decision ~10%, peak ~28%) → first reversal
~30% (a loss removes Act I's engine) → IIa new leader/arena 30–45% → **midpoint 45%** (foreshadow cliffhanger,
then the offer slot) → IIb rival/alternative 50–70% → III crisis 70–85% (low point ~82%) → IV aftermath with one late
surprise 85–97% → resolution 97–100% (today's status, a list bookending the opening, a 2-sentence moral ending on a
≤8-word contrast that answers the hook).

Explainer topics use the same skeleton: composite people as characters, crises (slow weeks, tax bills) as
conflicts, the competing option as the rival.

### 3.3 Formulas and line format
- **Hook (40–70 words, ≤25 s):** scope + claim + duality; arc + stakes in a rule of three; a concrete tease of two
  later turns. Then music-only montage → black → place/year stamp.
- **Chapter opens** (rotate; never a question): "By [year], …" (~40%); "While [X], [Y]…"; "For [name], the pressure
  is…"; place context then zoom to a person; a quoted source.
- **Chapter closes** (always, then the breath): foreshadow ("But what [name] doesn't realize…"), name held to the last
  words ("His name is ___."), number payoff ("[before] became [after]"), thesis plant, handoff.
- **Explaining a mechanism:** plain name → modern analogy → 2–3 short steps → number payoff.
- **Open loops:** 3 spine loops paid mid-film and in the last minute; an act loop every 3–5 min; a micro-loop every
  60–90 s; ~4 open at once; one loop straddles the offer; ≤1 left unresolved.
- **Offer slot** (newsletter / product / sponsor): one, at 45–50%, 60–90 s, inside a chapter, entered by a thematic
  bridge sentence, own brighter look, exit through ~2.8 s silence + black into a chapter that opens cold on a turn.
- **Line format:** one line = ≤20 words (~8 s) with 1–2 visual tags:

```
## CH07 | 7:48–10:24 | target 150 s / 340 w | ACT I | open:C close:$
[TURN ESC] [LOOP open L10]
L071 | As the sons open houses in five cities, Europe enters a century of war.
     | V map:europe,pins=5,links | MUSIC: cue in hard on cut
L072 | To start a war, you need money.          | V room:desk,ledger,push
[BREATH 8s] V: room:portrait-wall slow pull | MUSIC: swell +7 dB
```

Tags: `room:` `plaque:` `still:` `i2v:` `archive:` `map:` `card:place|date` `black:` `lt:name,role`
`quote:source,year` `diagram:` `stat:` `chart:` `table:` (explainer only) `host:` `bookend`;
`MUSIC: in|out|swell|drop|cue-change` `SFX: [on-screen thing]` `SILENCE n s`; `[TURN type]` `[LOOP open|close id]` `[BREATH n s]`.

### 3.4 Writing rules + pre-flight
Historical present for the spine; mean sentence 13–16 words with ≥18% at ≤8 words; nothing over 28 words in our own
voice; 1.5–2.5 numbers/min, money always as before → after; one protagonist per chapter; ≤1 rhetorical question per
10 min, answered at once; max 1 superlative per chapter; a second voice (quote card or second TTS voice, 5–20 s)
every 3–4 min; no "let's dive in", "smash that like", "see you tomorrow". Check: chapters ≈ runtime_min × 0.65;
big turns ≥ runtime_min ÷ 2; all turns ≥ runtime_min × 1.3; offer at 45–50%; moral's last sentence ≤8 words with a
contrast.

## 4. Edit

**Shot length by mode:** cold open 10–20 s (4 shots in ~50 s); room/character 6–9 s (2–4 angles per room);
emotional beat 10–20 s; explainer 4–6 s per state; crisis montage 1.5–3 s; coda 6–8 s.

**Cut placement from word times:** new clause 0–400 ms early; named thing 0 to −150 ms (a rack focus finishes on
the surname); after a pause 0.4–1.0 s early; before a dramatic line ~0.9 s early; new subject 2–5 s early;
withheld villain or reveal ~0.9 s late.

**Set pieces** (full recipes in `references/playbook.md` §4.4): cold open; introducing a person (room wide → framed
portrait → push to the eyes; reuse the portrait; institutions by nameplate, colour-coded per side); a death (aftermath
first, narration stops 8–14 s, freeze → black, empty chair, darkest still shot ~6 s, portrait with name + age);
crisis montage (music pause + 2-frame black → 5–7 cuts in ~6 s → shrinking shots → one diegetic hit → 1–2 s silence);
act break (sub-boom → 1–1.5 s silence → dark moving set); citing a source (desk + book + framed author photo +
"Author / Name" lower third); era shift (build the world before cameras existed, real archive after); ending.

## 5. Pictures

- **Camera:** linear moves (`ease:"none"`), already running at the cut. Archive still `scale 1.06→1.16` +
  `xPercent 0→−4` over 5 s; AI portrait `1.10→1.35` to the eyes; reveal pull-back `1.6→1.25`. Mix ~35% push, 25%
  pull, 20% pan; never two identical moves in a row; source images ≥2× frame size.
- **Faked 3D room** (we have no Unreal): AI room plate (L0) + framed hero image (L1, slight rotateY) + glint (L2) +
  blurred foreground prop (L3, moves 3× faster) + dust motes and warm haze (L4) + grade/vignette (L5); rack focus
  L3 0→12 px / L1 6→0 px in 0.8 s. Same room revisited through the film, each return showing the new state.
- **Image prompts:** oil-painting or period-photo medium; single warm key high-left; umber/black background; palette
  umber, walnut, oxblood, brass, bottle green; eyes on the upper third with dark space for push-ins; 16:9 at 2–4×;
  one reference portrait per recurring character. Image-to-video: camera-only slow moves, tiny subject motion,
  trim to 3–4 s.
- **Maps:** tilted satellite plane, upright buildings/flags, glowing city labels, cream link lines, pins landing
  0–0.7 s before the place is named, globe → region zoom-through, reused at start/middle/end.
- **Overlay text** (pick ONE place-stamp style per film): lower third Open Sans 300/700, 42/64 px, left 192 px,
  in 1.5–2 s after the cut, 0.5 s slide + blur, hold 3.5 s; place stamp ~20% frame height, 0.6–0.8 s after the cut,
  hold 2.4–3.3 s; black fact card white 56 px on black, one red word max, ~3.7–8.4 s.
- **Look:** room/AI layers `filter: brightness(.78) contrast(1.12) saturate(.85) sepia(.18)`; radial vignette to
  ~0.72× corners; archive B&W neutral with contrast up; no grain/letterbox/dust overlays.
- **Sources:** never feature-film clips. Use image-to-video, AI stills, public-domain archive, licensed stock,
  our own motion-graphic scenes.

## 6. Sound

- **Master:** integrated −15 LUFS ±0.5 (house default for series that already set −16 LUFS: keep the series
  setting), LRA 3–5 LU, true peak ≤ −1.0 dBTP, two-pass loudnorm.
- **Voice:** highpass 70 Hz, +2 dB at 140 Hz, −2 dB at 350 Hz, +1.5 dB at 4.5 kHz, lowpass 13 kHz, 3:1 compression,
  limiter; dry, mono, centre. Pauses 0.15–0.25 s inside sentences, 0.30–0.40 s between, chapter seams 0.4–0.6 s or a
  2–11 s breath. Death/decline/ending chapters slower (100–115 wpm).
- **Music:** bed 14 dB under the voice (12–17), no pumping; cold open ducked 7 dB then swells; swell +6–9 dB in
  11–15 breaths per 40 min; new cue ~every 60 s, ≥70% at chapter seams; war cues start hard on the cut, others fade
  in ~1 s; exits fade 1.5–2 s; no stings; ~12–15 licensed tracks cut into ~30 segments.
- **SFX:** 0.3–0.4/min, on-screen sources only, synced to the action; no whooshes, risers, typewriter or paper.
  (A series that already uses "light SFX" keeps it until the user says otherwise.)
- **Silence plan:** 3 full silences (≈1.7 s after the title sequence, ≈2.8 s after the offer, ≈1 s inside a dip
  before an act verdict); 3 dips to −40/−50 LUFS before late turns; 2.5 s of silence at the end.

## 7. Packaging

- **Title:** `[2–3 word metaphor]: True Story of the [Superlative] [Category] in [Scope]` (keep the proper name in the
  thumbnail, not the title). Series titles may follow their own pack.
- **Thumbnail:** dark (~50/255), warm, one lit face or figure group in role costume; ≤2 words, condensed bold caps,
  muted gold #DABB68 or white, stepped lower-left, ~9% cap height; complements the title; the same motif appears in
  the first 20 s; A/B one expressive-face version. Series brand rules (logo, palette) win.
- **First 30 s:** logline ≤18 s → wordless montage (brand mark, map, "empire") → black → place/year stamp.
- **Description:** offer line → 2-sentence logline → community/offer links → resources → sources → 1–2 hashtags →
  `-- CHAPTERS --` (one per 50–100 s, Title Case, "Person — Epithet" or "Subject + Verb", last one "… Today").
- **Captions:** upload an SRT; never burn subtitles into the long-form master.

## 8. QA gates (run before showing the user)

```bash
python3 scripts/qa_video.py path/to/render.mp4 [--words words.json] [--lufs -16]
```
Needs ffmpeg and numpy (`pip install numpy`; in this project use the production venv's python, which has it).
Exit code 0 = all checks pass.
It reports cuts per minute, static holds over 4 s, shot-length stats, loudness and true peak, and (with word timings)
how many cuts land within −500…0 ms of a word. Also: frame scan for glitch frames and text outside the 90% safe area;
every fact traced to a source; composites labelled as examples; 20 sampled room frames at 45–65/255 brightness.

## 9. Channel rules (always apply; they override this skill)

- Preview first; **nothing is uploaded, posted or scheduled without the user's explicit OK.**
- **Ask before any paid or credit-using generation** (AI images, image-to-video, voice cloning).
- Known voices only (house narrator: OmniVoice "Renee", demo0001, seed 42). Never introduce a new voice unasked.
- The creator's name, when needed, is spelled exactly **Gs. W. Augustin**; leave it out when it isn't needed.
- Newsletter (Kit) is the only CTA unless the user says otherwise.
- Never push to the site's main branch or rewrite pushed git history without asking (the repo syncs to Lovable).

## 10. Tool mapping

| Job | In this project (local, not in the repo) | Portable fallback |
|---|---|---|
| Narration | OmniVoice TTS via `series-production/tools/tts.py` | Any TTS with a consistent voice |
| Word timing | `hyperframes transcribe` (whisper small.en) per line | Any whisper with word timestamps |
| Scenes | HyperFrames (HTML + GSAP → MP4, 1920×1080, 30 fps), beat library `tools/hfbeats*.py` | Any HTML/GSAP or NLE timeline |
| Mix | ffmpeg (`tools/ep_audio.py`, `tools/mix.py`) | Any DAW / ffmpeg |
| Captions | `tools/captions.py` → SRT | whisper → SRT |
| Posting | Zernio (YouTube/TikTok) + MAWGOC Media Manager (FB/IG/Threads) | Platform uploaders |

HyperFrames note: convert any oklch colour to hex before GSAP tweens (oklch tweens flash green).

## 11. Limits of the research
- The creator's own tools list sits behind a Patreon post and could not be read; tools come from his interviews
  (DaVinci Resolve, Kling AI video, ElevenLabs on his own voice, Unreal Engine, short feature-film clips).
- One 2023 video was studied; his 2025–26 videos run 45–87 min and use more Kling AI video.
