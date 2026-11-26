# 15 · Transitions, pacing rhythm and packaging

Source: FINAiUS "Empire of Shadows" (39:28, 24 fps). Agent 15 of 15.
Method: I decoded the whole film at 192x108 gray, 24 fps (56,840 frames), using numpy to compute per-frame mean luma, mean-abs-diff (d1), gradient energy (blur), and a 96x54 frame cache.
Detectors: (a) a black/fade detector (mean luma < 10), (b) a flash detector (luma spike > +35 over its neighbours), (c) a blur-burst detector (gradient < 55 % of neighbours while d1 > 12), and (d) a soft-transition detector: a 24-frame span difference > 22 that sits more than 14 frames from any scdet cut, with a least-squares A/B blend fit to separate dissolves from moves.
I sorted all 251 soft candidates by eye from frame strips (4-6 frames apart).
Scripts and montages are in the scratchpad `a15/`.
**[M]** = measured, **[I]** = inferred.

---

## 1. Transitions census

### Headline
The film is a **hard-cut film**. About 95 % of shot changes are straight cuts. "Soft" transitions are few, and each type does a specific job. **No editorial flash frames, glitches, film burns or flip transitions occur** (in-footage effects are listed separately below). [M]

| Type | Count | Typical duration | Where it is used |
|---|---|---|---|
| Hard cut | 483 (scdet) + about 15-25 that scdet missed (similar-looking archival shots, e.g. 428.0, 431.3, 642.4, 1083.6, 1322.5, 1595.1, 1794.5 s). **About 500 in total** [M] | 0 f | Everywhere: inside scenes, between places, between eras. A cut to dark and a cut to a bright exterior are both common. |
| Fade/dip through black (A fades out, black holds, B fades in) | **About 12-15** [M] | fade-out 8-16 f (0.33-0.67 s), black hold 4-24 f (0.17-1 s), fade-in 8-24 f. The intro black lasts 2.9 s. | **Time jumps and story "breaths"**: end of the cold open (42.7-45.6 s), the death of Mayer (around 427 s), the sponsor's exit (1176-1188 s), the Maxwell chapter (2088 s), and before every black text card. Also inside WWI (1785.7 s: artillery smoke dips to near-black for about 8 f, then a landscape fades up). |
| Cut to black, then fade up | About 8 [M] | fade-in 12-37 f (0.5-1.5 s) | New place or era after a beat: Frankfurt street after the black at 149.2 s (37 f fade-up), the 660 s map fading up from dark, the 1836 s gala interior. |
| **Text card on black** (white text, a single line, centred or upper third) | **6-8** [M]: 428.8, 1055.5, 1163.5 (sponsor), 1185.2, 2138.8, 2206.5 (8.4 s), about 1523 s | 2.5-8.4 s on screen, fading in and out over 8-12 f | **Time jumps and dramatic asides**, e.g. "A year later, …", "But Mayer … won't be able to see it." (a death foreshadow), "Robert Maxwell began banking with …". The font is a clean sans or italic serif, and one card uses small caps with a red keyword. These are the only fully static holds over 4 s. |
| True cross-dissolve (A/B blend) | **≤ 5** [M]: the blend-fit test found almost no real A/B blends between different shots. Low-residual hits were fades or in-shot light sweeps. | n/a | Effectively unused. |
| **Whip pan / motion-blur move on maps** | About 8-10 [M]: 234.9-241.7 (pin-to-pin whips across a 3D globe, each about 4-8 f of blur), 1702.8 (explosion whips into a satellite globe, about 8 f), 1537, 1626.8, 1683.3, 1940.8 | 4-8 f of heavy directional blur | **Place change on the map layer**: moving from city to city, or from the battlefield to the "big picture" globe. |
| **Zoom-through / fly-through** | About 4-5 [M]: 230.0 (dive into the globe toward Europe), 257.8 (push through clouds), 485.6 (map flag "Paris" → camera dives into ground blur → grey → sea, about 1 s), 296.6 (into a dark interior) | 16-30 f | **Scale change**: globe → country → city, or "travel" between countries. |
| In-shot light sweep across a static graphic | About 6 on one diagram (132-140 s) [M] | Each sweep about 1-1.5 s | Keeps a static explainer diagram alive (no cut needed). |
| Light-leak / blur-in text | 2 [M]: the sponsor URL card (1147 s: text blurs and stretches in and out over 6-8 f, with a coloured light leak) and the end logo "FINAiUS" (2359-2363 s: vertical light bars, then letters pop on one by one) | 0.3-1.5 s | **Branding only**: the sponsor and the outro. |
| Flash | **0 editorial** [M]. The 6 bright-frame spikes (1438.7, 1784.8, 1973.7, 2090.3, 2275.3, 2277.0 s) are all **in the source footage**: gunfire, overexposed newsreel, press camera flashes. | — | — |

### Where each type sits
- **Chapter boundaries carry no special transition.** For the 29 chapter starts I checked ±3 s: most land on an ordinary hard cut or mid-shot, and the narration gap at the boundary is usually about 1.0 s (the median word gap). Only 4 chapters open with a long pause or black: 422 s (Mayer's death, a 10.8 s narration gap), 468 s (9.2 s), 1181 s (the sponsor exit, black) and 2089 s (black). The chapters are a **YouTube navigation layer**, not edit breaks. [M]
- **Time jump** → a dip to black or a text card on black.
- **Place change** → hard cut to an establishing exterior, or a map whip or zoom-through.
- **Within a scene** → hard cuts on action and moves. Continuity in the Unreal/AI room scenes comes from **camera motion** inside the shot (dolly, push-in, rack focus), not from transitions.
- **Bookend**: the cold-open shot (manor above a globe with "roots", 25.8-42.7 s) comes back as the final image (2325.6-2342 s), then a dip to the logo. [M]

---

## 2. Pacing curve

The shot count = the 483 scdet cuts plus the 45 soft and missed transitions I verified. This is a slight undercount (some missed archival cuts are not added).
**ASL 4.48 s, median 3.83 s** [M].
Shot-length histogram (s): <0.5: 36 · 0.5-1: 29 · 1-2: 58 · 2-3: 88 · 3-4: 63 · 4-5: 47 · 5-6: 74 · 6-8: 65 · 8-10: 33 · 10-15: 30 · >15: 6.

**Transitions per minute** (minute 0 → 39) [M]:
```
min : 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39
cuts: 6 12  9 11 14  9 11  8 16 10 14 13  8  9 13 11 13 10  9 12  8  9 10 10 17 18 12 11 17 19 23 28 36 15 15 14 10 24  9  5
wpm :58 138 127 151 109 144 143 93 158 132 145 108 147 123 112 123 141 149 125 132 120 149 123 112 121 132 138 137 118 111 136 129 120 107 123 115 115 114 114 29
```
(wpm comes from the YouTube auto-caption word times: 4,921 words, 125 wpm on average.)

**By chapter** (start s, length s, shots, ASL s, wpm) [M]:
| Chapter | len | shots | ASL | wpm |
|---|---|---|---|---|
| 0 Introduction | 50 | 4 | 12.5 | 49 |
| 50 Unlikely Origin | 103 | 20 | 5.2 | 132 |
| 153 Becoming a Bank | 87 | 14 | 6.2 | 143 |
| 240 Rise of Great Britain | 62 | 15 | 4.1 | 105 |
| 302 Nathan Arrives in London | 120 | 19 | 6.3 | 146 |
| 422 Death of Mayer | 46 | 6 | **7.7** | 104 |
| 468 Wars in Europe | 156 | 36 | 4.3 | 140 |
| 706 Death of Nathan | 91 | 14 | 6.5 | 139 |
| 797 James Takes Command | 35 | 4 | 8.8 | 122 |
| 1011 Lionel / (sponsor inside) | 170 | 32 | 5.3 | 137 |
| 1181 Rise of Morgan | 40 | 5 | 8.0 | 130 |
| 1420 Face Decline | 55 | 16 | 3.4 | 111 |
| 1704 Road to War | 97 | 30 | 3.2 | 115 |
| 1801 World War I | 80 | 30 | **2.7** | 134 |
| 1881 Decline of the Dynasty | 64 | 42 | **1.5** | 122 |
| 1945 WWII & Nazi Seizure | 90 | 30 | 3.0 | 112 |
| 2234 Death of Maxwell & Scandal | 60 | 23 | 2.6 | 113 |
| 2294 Legacy Today | 74 | 12 | 6.2 | 98 |

**Rhythm findings**
- **There is a clear mode rhythm, but it is driven by footage type, not by narration speed.** The correlation between cuts/min and wpm is −0.11, so effectively none. [M] The narration stays at a steady 110-150 wpm the whole way.
- **Slow (ASL 6-9 s):** introductions of a new protagonist, deaths, and "takes command" beats. These are Unreal/AI room scenes with slow dolly moves.
- **Fast (ASL 1.5-3 s):** war, crisis and scandal. These are archival newsreel montages, with peaks of **28-36 cuts/min at minutes 31-32** and **24/min at minute 37** (the Maxwell scandal). [M]
- **The film accelerates**: the first half averages 11.2 cuts/min and the second half 16.1 cuts/min. The last 10 minutes are the fastest, except the coda, which slows to an ASL of 6.2 s and a narration of 98 wpm. [M]
- **Retention heatmap (meta.json)**: the peaks are at 426 s (value 1.0, the death text card), 948 s (0.73, the French bank collapse) and 1540 s (0.70, the Panic of 1893). These match "story turn" moments. The sponsor region reads 0.06-0.07, then jumps to 0.38 at 1161-1184 s (the sponsor's end). [M] [I] Viewers scrub past the sponsor to its exit point.

**Longest shots** (after merging soft transitions) [M]:
- 0.0-20.0 s: the cold open, 8 silhouettes in front of a columned bank under a slow light change, with the logline narration.
- 435.7-455.6 s (19.9 s): Mayer's deathbed, a slow move in a dark candle-lit room. This is the emotional beat.
- 25.8-42.7 s (16.9 s): the manor above a glowing globe with roots, a music-only section of the cold open.
- 2325.6-2342 s (16.2 s): the same manor image as the closing bookend.
- 1307 s (15.4 s): the young Morgan in a chair; 1397 s (14.6 s): the slow "J.S. Morgan & Co" door sign; 1652 s (14.5 s): a top-hat exchange in silhouette.
- All of these are **slow-moving shots, not static ones**. Start-to-end frame difference is 6-24 luma, so the move is real.

**Shortest shots** [M]: 1-3-frame flickers (0.04-0.12 s) at 482.7, 614.3, 1559.7, 1766.8, 1776.5, 1901.4, 1951.6 and 2266.7 s. These are archival newsreel splices and whip frames inside war and scandal montages. They are never used in the room scenes.

---

## 3. "Something always changes" — visual events per 10 s

- **Transitions:** 2.2 per 10 s on average [M]. The range runs from 1.3 in slow chapters to 6.0 in minute 32.
- **In-shot local events** (an element appears, a light sweep, a label animating; counted as a block-change onset away from cuts, with a 1 s refractory period): **545 in total, about 2.3 per 10 s** [M, approximate].
- **Total ≈ 4.5 visual events per 10 s**, which is one every 2.2 s.
- **Moving frames:** 75.6 % of all frames have measurable motion (d1 ≥ 0.6 at 192 px). Runs with d1 < 0.6 for ≥ 4 s: I found 23 candidates. Comparing start and end frames shows that **only 4 are truly static** (427.6 s text card 4.2 s, 653.5 s 5.7 s, 1323 s 4.1 s, 2206.5 s text card 8.4 s). The other 19 are very slow push-ins or light drifts. **So the "no static shot over 4 s" rule holds, except for deliberate text cards.** [M]
- The in-shot motion vocabulary I saw: slow push-in or dolly in Unreal rooms; rack focus (15-16 s, crest); light sweeps across diagrams; map pins dropping, with dotted routes drawing between them; parallax over archive photos.

---

## 4. Packaging

### Title
**"Empire of Shadows: True Story of the Richest Family in History"** [M]
Formula: **[2-3 word evocative metaphor] : True Story of the [Superlative] [Category noun] in History**.
- The family name is **not in the title**; it goes in the thumbnail text instead. The superlative is "richest" and the scope is "in History".
- This matches the stated rule of "something extreme" while avoiding "evil".
- Tags: **none** (empty list). Category: People & Blogs. Uploaded 2023-11-18. At the time of the download: 9.33 M views, 110 k likes.

### Thumbnail (hqdefault/sddefault, letterboxed 4:3; crop analysed at 640x360) [M]
- **Subject:** 7-8 men in black top hats and frock coats around a round table in a dark, wood-panelled library, rendered in Unreal/AI style. A bald older man at the head of the table is the only lit face. The foreground figures are near-silhouettes, and papers and a wine glass catch the light.
- It reads as "a secret council". It is not an exact frame of the video: the best normalised correlation with any frame is 0.68, all to unrelated dark shots. The top-hat motif comes from the cold open (silhouettes in front of the columns) and the 1652 s exchange.
- **Colour:** very dark, with a mean luma of 51/255 and a warm cast (mean RGB 57/50/38). The highlights are amber lamp light.
- **Text:** 2 words, **"ROTHSCHILD / DOCUMENTARY"**. They are all caps in a bold, condensed, distressed/rough-edged sans with a slight italic. The colour is a **muted gold #DABB68 (218,187,104)**. Two lines are left-aligned in the lower-left third, and the second line is indented by about 17 % of the frame width (a stepped layout). The text block sits from 69 % to 92 % of the frame height. Cap height is about **9 % of frame height** per line.
- There is no outline or box. The text sits directly on a dark table area.
- **Versus his stated rules:** there is no single expressive face and no uncanny eyes. Here the "people, not abstractions" and "dark background" rules carry the image, and the text complements the title (it names the family) rather than repeating it. [I] This thumbnail may have been swapped after the video's first weeks. Old videos often get a plainer "X DOCUMENTARY" search thumbnail.

### Title + thumbnail + first 30 s
- **0:02-0:18:** a 16 s narrated logline restates the title's promise: a centuries-long dynasty, finance, wars and politics, "the most formidable banking dynasty of their age".
- **0:00-0:20:** 8 men in silhouette in front of a columned bank. This visually pays off "Shadows" and the thumbnail's group of hatted men.
- **0:20-0:42:** music only (the captions mark [MUSIC] at 0:31.9). The family crest is revealed with a rack focus, then a Europe map with 5 branch houses linked by lines (the "empire"), then the manor over a glowing globe with roots.
- **0:42.7-0:45.6:** black. **0:45.6:** "Frankfurt Germany 1769" (light-blue condensed serif title over a colourised postcard). Narration resumes at 0:49.
- Pattern: **logline → wordless world montage (crest / map / mansion) → black breath → place-and-date super → story.** The intro has only 4 cuts in 50 s.

### Description structure (in order) [M]
1. **Sponsor CTA** as line 1, in bold Unicode: "Start learning at brilliant.org/finaius".
2. **Logline**: 2 sentences ("Unravels …", "Delve into the labyrinth of power, wealth, and secrets …").
3. **Community** (Skool paid group, ⚔️ / 📈 emojis).
4. **Patreon**.
5. **Discord**.
6. **His own book** (a soft sell: "$4.75 … no pressure to buy"), then a link.
7. **Tools & resources** link (to a Patreon post).
8. **"Books mentioned in the film"**: 2 Amazon affiliate links (📘).
9. **Patreon again**, framed as "I research, write, and produce these documentaries solo".
10. A single hashtag (#jpmorgan, a secondary entity in the story).
11. **"-- CHAPTERS --"**: 30 timestamps.

### Chapters [M]
- 30 chapters. The mean is 79 s; the range is 35-170 s (most are 50-100 s).
- Naming is **Title Case event headlines** in two styles:
  - "Person — Epithet" with an em dash, used 6 times: "Mayer Amschel — The Unlikely Origin", "The Panic of 1893 — Rothschild Meets Rockefeller".
  - "Subject + Verb" headlines: "James Rothschild Takes Command", "France Falls & Morgan Rises".
- The vocabulary leans on death, rise, decline, war, collapse and scandal, with three "The Death of …" chapters.
- There is **no sponsor chapter** in this video. The sponsor hides inside "Lionel Rothschild Enters Government" (16:51-19:41).

### Sponsor (Brilliant) in the video [M]
- **18:06-19:38 (1086-1178 s), 92 s, at 46 % of the runtime.**
- **Segue:** a thematic bridge, "early success … attributed to information, intelligence, and knowledge" → "nowadays learning is easier …". It flows into the read with no hard break and no "this video is sponsored by".
- **Visuals:** stock lifestyle footage (laptop, office window) → screen recordings of the product → a URL card that blurs and stretches in with a light leak (around 1147 s) → a fade through black → the product card fades in and out → the logo → a **dip to black of about 4.6 s with a text card** that leads back into the story at 19:41 (the "Rise of Morgan" chapter).
- The sponsor gets about 20 transitions per minute of its own, with a lot of motion.
- The heatmap shows people skipping it (see section 2).

---

## 5. Recipes for our stack (HyperFrames 30 fps, AI stills/i2v, TTS "Renee", whisper timing)

### 5a. Transition library spec
All durations are at 30 fps. "Ease" means a GSAP ease. The default is a **hard cut**. Every other transition needs a stated reason (a time jump, a place change, a scale change, a breath, or branding).

| ID | Use when | Build | Duration | Ease | Audio |
|---|---|---|---|---|---|
| `cut` | Default, 90-95 % of changes | Swap sub-compositions on a frame boundary. Cut on a narration word onset (from whisper) or 0-3 f before it. | 0 f | — | Optional low whoosh only on major cuts |
| `dip-black` | Time jump of years, a death, the end of an act, or a sponsor exit | A opacity 1→0, black hold, B opacity 0→1 | out 10-16 f, hold 6-24 f (up to 60 f for heavy beats), in 12-24 f | out `power2.in`, in `power2.out` | Music duck or tail; let the reverb ring through the black |
| `fade-up` | New place or era after a cut to black; the first shot of a scene | Black, then B opacity 0→1 while the camera push has already started | 15-36 f | `sine.out` | Ambience swell |
| `text-card` | Time jump or ominous aside ("A year later, …", a foreshadow line) | Black background. One line of white text, cap height about 3-3.5 % of frame height, centred or upper third. Optional 1 red keyword. Opacity 0→1 and blur 6px→0. | in 10 f, hold 75-250 f (2.5-8 s, the only static hold allowed), out 10 f | `power1.out` / `power1.in` | Narration pause or a single low hit |
| `map-whip` | City to city on the same map or globe layer | Camera pans the map container by ≥ 60 % of the frame width, with motion blur via CSS `filter: blur()` ramped 0→24px→0 on the moving layer (or 4-6 stacked offset copies at low opacity) | 6-9 f | `expo.inOut` | Short whoosh, peaking on the middle frame |
| `zoom-through` | Scale change: globe → country → city, or "travel" to a new country | Scale the current layer 1→6 around a target point while blur ramps 0→20px; cross to the next layer coming in at scale 0.6→1; optional cloud/fog PNG layer passing through | 18-30 f | `power3.in` on the push, `power3.out` on the landing | Rising air/whoosh with a soft landing thump |
| `light-sweep` | Keeping a static diagram, document or card alive for more than 4 s | A radial-gradient soft light (40 % of the frame, opacity 0.15-0.25, `mix-blend-mode: screen`) drifts diagonally across the card | 30-45 f per sweep, 1 sweep per 3-4 s | `sine.inOut` | none |
| `rack-focus` | Reveals inside a still (crest, object, portrait) | Two layers of the same AI still (fg and bg); blur goes from fg 0→8px and bg 8→0px | 15-24 f | `power2.inOut` | none |
| `blur-stretch-text` | Branding: URL, logo, sponsor | Text scaleX 1.6→1, blur 12→0, letter-spacing collapse; light-leak PNG `screen` 0→0.6→0 | 8-12 f in / 8 f out | `expo.out` | Shimmer or riser |
| `bookend` | Cold open and ending | Re-use the cold open's key image as the last shot before the logo | — | — | Same music motif |

**Banned by default:** glitch, film burn, flip, star wipes, editorial white flashes, and generic cross-dissolves between unrelated shots. FINAiUS uses none of them. Real flashes come only from the source (gunfire, press cameras).

### 5b. Pacing spec
- **Global target:** ASL about 4.5 s (median about 3.8 s), so about 13 shots per minute, and 4-5 visual events per 10 s (2 transitions plus 2-3 in-shot events: a move change, a label, a pin, a sweep).
- **Narration:** keep it steady at about 125-140 wpm. Do **not** change narration speed to change energy; change shot length and footage type instead.

| Story mode | Target shot length | Cuts/min | Notes |
|---|---|---|---|
| Cold open, world montage | 10-20 s shots, 4 shots in 45-50 s | 5-6 | Slow push-ins; logline narration for the first 15-18 s, then music only for about 20 s, then a 2-3 s black, then a place/date super |
| Character intro, room scene | 6-9 s | 7-9 | Slow dolly or push in AI/i2v stills; rack focus; candle-light flicker |
| Emotional beat (death, loss, decision) | 10-20 s | 3-6 | One long slow move; text card or dip to black after it; let narration pause 3-10 s |
| Explainer (how a trade works, maps) | 4-6 s per state | 10-14 | Diagram plus light sweeps; map pins and routes; map-whips between places |
| Escalation, crisis, war | 1.5-3 s | 20-36 | Archival-style montage; allow 1-3 f flicker frames; fast cuts on the beat |
| Coda / legacy | 6-8 s | 8-10 | Slow again; end on the bookend image |

- **Arc:** first half about 11 cuts/min, second half about 16 cuts/min, a peak of 30+ in the climax act (around 75-85 % of the runtime), then slow down for the final 2 min.
- **Static-hold rule:** no frame static for more than 4 s (start-to-end frame difference must be > 0). The only exception is a text card on black (≤ 8 s). Check this automatically by rendering at 192x108 and flagging any 4 s window where mean |Δ| < 0.6 and the start-to-end diff < 2.
- **Story turns:** one every 2-3 min. Put a slow beat (a text card or dip) right before each turn; the heatmap peaks sat on exactly those cards.

### 5c. Packaging template
**Title formula:** `[Evocative 2-3 word metaphor]: True Story of the [Superlative] [Category] in [Scope]`.
Keep the proper name out of the title when the thumbnail carries it.
Example: "Kingdom of Clippers: True Story of the Most Powerful Barber in the Caribbean".

**Thumbnail formula:**
- A cinematic AI render of a **group or a single figure in period or role costume** in a dark interior. Mean luma about 50/255, a warm key light on one face, the rest in silhouette.
- **2 words maximum**, all caps, condensed distressed bold sans, muted gold (#DABB68) or white. Two stepped lines in the lower-left third, cap height about 9 % of frame height, no stroke.
- The text names the subject or genre (it complements the title, never repeats it).
- Per his own rules, test an A/B version with one expressive close-up face and a high-contrast eye accent.
- Make sure the same costume or motif appears in the first 20 s of the video.

**First 30 s:** logline narration (≤ 18 s) that restates the title promise → a wordless world montage of 3-4 shots (crest or brand mark, map of the domain, the "empire" building) → 2-3 s black → place + year super → story begins.

**Description template:**
```
[Bold sponsor CTA line, if any]

[2-sentence logline: "Unravels …" + "Delve into …" voice]

[Community link]
[Membership/Patreon link]
[Discord/other community]

[Own product, soft sell, 1-2 lines + link]
[Tools & resources link]

Books mentioned in the film -
📘 [Title] ([link])
📘 [Title] ([link])

[Solo-creator support line + link]

#[primary entity] #[secondary]

-- CHAPTERS --
0:00 Introduction
0:50 [Person] — [Epithet]
2:33 [Subject] [Verb phrase]
…   (one chapter per 50-100 s, 20-30 total, Title Case, use "—" for person-led chapters,
     words like Rise / Fall / Death / War / Collapse / Scandal / Legacy; last chapter "[Name] Legacy Today")
```
**Sponsor placement:** about 45-50 % into the runtime, inside a chapter, not as its own chapter. Use a thematic segue sentence, keep it to 60-90 s, exit through a dip to black plus a text card, then go straight into a new story turn (the heatmap shows viewers jump to the sponsor's exit).

---
### Measured vs inferred
- **Measured:** frame statistics, the cut and transition counts and times, the black and text-card times, flash origins (checked frames), shots per minute, wpm, chapter stats, the heatmap, the thumbnail's colours, position and size, and the description order.
- **Inferred:** that the thumbnail was swapped, that viewers skip the sponsor, and the soft-transition counts marked "about". The soft detector catches camera moves and some missed archival cuts, and I checked these by eye on about 60 of the 251 candidates.
