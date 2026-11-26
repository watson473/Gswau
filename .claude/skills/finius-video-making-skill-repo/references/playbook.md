# LONG-FORM DOCUMENTARY PLAYBOOK (for Claude Code)

This is the full spec behind the finius-video-making-skill-repo skill (SKILL.md is the short version). Any agent can read it directly; in Claude Code just ask for the
"Finius Video Making Skill Repo" skill.

It is built from a frame-by-frame study of one 39:28 documentary by the FINAiUS channel ("Empire of Shadows",
9.3M views, 1080p/24 fps): 15 analysis agents (10 time slices + sound, script, text/graphics, imagery, transitions)
plus a scan of the creator's site and two interviews where he explains his process. Every number below was measured
on the video unless marked (inferred). The raw evidence (shot logs, per-shot timings, cue lists) is in
`references/research/` (01–15 + website.md); open those when you need more detail.

We copy the CRAFT (structure, timing, camera, sound, typography rules), never his story, script, images or footage.

---

## 0. The 12 rules that make this style (read these even if you read nothing else)

1. **Nothing is ever still.** Every image moves the whole time it is on screen (slow, linear push / pull / pan / rack
   focus). Only a text card on black may hold still, for up to 8 s. Measured: 4 truly static holds in 39 min.
2. **Picture first, word second.** The cut lands 0–400 ms *before* the word it illustrates (median about −260 ms).
   A new sentence's cut lands in the breath before it (−170 to −520 ms). A new subject or scene can arrive 2–5 s before it is named.
3. **About 95% hard cuts.** Other transitions exist only with a reason: dip to black (time jump, death, act end),
   whip/zoom-through (place or scale change), text card (an unshowable fact or a foreshadow). No flips, glitches,
   film burns, star wipes or decorative flashes.
4. **Pace comes from footage, not the voice.** Narration stays at 125–140 wpm all film. Energy changes through shot
   length: 6–9 s in character scenes, 10–20 s on emotional beats, 1.5–3 s in war/crisis montages. The film speeds up
   over its runtime (about 11 cuts/min in the first half, 16 in the second, 30+ at the climax), then slows for the last 2 min.
5. **Chapters end in a breath, not a title card.** Each chapter closes on a strong line (foreshadow, name reveal,
   number payoff), then 5–11 s of music with no narration. No chapter cards on screen; chapters live in the YouTube description.
6. **A story turn every 40–50 s, a big one every ~2 min**, a death/loss every 7–9 min, the rival at 45–50%,
   a late surprise at ~87%. About 4 open questions running at any moment.
7. **Text lives inside the world.** Names appear on brass plaques, door glass, book covers, letters and framed photos
   in a dark 3D-style room. Overlay text is rare (~30 elements in 40 min): name lower thirds, place/date stamps, a few
   black fact cards. No subtitles burned in, no stat cards, no charts.
8. **Numbers become pictures.** "$65 million" is gold changing hands, not a counter. (For our explainer series we
   keep our stat cards, but use this rule for drama and history.)
9. **The look is warm, dark, clean.** Mean brightness ~54/255 in room shots, warm umber (R:G:B ≈ 1.4:1.2:1), vignette
   with corners at ~0.72x centre brightness. No added film grain, no letterbox, no dust overlay. Archive B&W stays
   neutral grey (not sepia).
10. **Music is a steady bed ~14 dB under the voice, no pumping.** A new cue roughly every minute, mostly at chapter
    breaths. Swell +6 to +9 dB in breaths. Only 3 true silences per film, each before a verdict or new act.
11. **Sound effects are rare and real.** 0.3–0.4 per minute, only for something visible (cannon, coins, horses, ship).
    No whooshes on cuts, no risers, no typewriter or cash-register sounds.
12. **The ending mirrors the opening.** Same image as the cold open (now lit and close), a 2-sentence moral that
    answers the hook's tension, a 12 s logo hold for YouTube end screens. No spoken "subscribe".

---

## 1. Our tools (what Claude Code uses for each job)

| Job | Tool in this project | Notes |
|---|---|---|
| Script | Claude Code writes from research; facts checked against ≥2 sources | Format in §3.5 |
| Narration | OmniVoice TTS, voice **Renee** (demo0001, seed 42), via `tools/tts.py` | He uses ElevenLabs on his own voice. Known voices only |
| Word timing | local whisper (`hyperframes transcribe` small.en) per line | Section-level timing drifted up to 1 s; time each line on its own |
| Visual scenes | **HyperFrames** (HTML + GSAP → MP4, 1920×1080, 30 fps), our beat library `tools/hfbeats*.py`, `tools/illus*.py` | Convert oklch colours to hex before rendering (GSAP flashes otherwise) |
| AI stills | Any image model (Canva generate-image, Higgsfield, etc.) | **Credit-using: ask the user first** |
| Image-to-video | Kling-style i2v when budget allows | **Credit-using: ask first.** Keep motion tiny; use 3–4 s of a 5 s clip |
| Footage | Public-domain archive (Library of Congress, Wikimedia, Prelinger), licensed stock | **Never feature-film clips** (he uses them; we can't) |
| 3D rooms | Faked in HyperFrames: AI room plate + parallax layers (§5.3) | He uses Unreal Engine |
| Music | Licensed beds (one tonal family per film) | §6.3 |
| SFX | `shared/sfx-lib` | §6.4: use very little |
| Mix / master | ffmpeg (`tools/ep_audio.py`, `mix.py`) | §6 |
| Captions | SRT from word timing (`tools/captions.py`), uploaded as a file, never burned in | |
| Posting | Zernio (YouTube/TikTok) + MAWGOC Media Manager (FB/IG/Threads) | Nothing posts without the user's OK |

Standing rules for this channel: preview before full build; known voices only; nothing uploaded, posted or
scheduled without an explicit OK; ask before any paid/credit generation; the creator's name, when needed, is
spelled exactly **Gs. W. Augustin** (leave it out when not needed).

---

## 2. The workflow, step by step

He spends ~2 weeks on research + script, ~2 weeks on edit (with a 3D editor in parallel), ~1 month per video. Ours:

| Step | Output | Gate |
|---|---|---|
| 1. Topic + promise | One-line logline with a built-in tension (value A vs value B), title + thumbnail idea | User picks |
| 2. Research | `research.md`: timeline, characters, numbers (before → after), quotes, sources | ≥2 sources per fact |
| 3. Loop + turn plan | Spine loops, act map with timestamps, turn list (§3.2, §3.3) | Passes §3.6 numbers |
| 4. Script | Tagged script (§3.5): every line has 1–2 visual tags + sound tags | Pre-flight table §3.6 |
| 5. Voice | Renee TTS per line; whisper word times per line | Listen-through of hook + 1 chapter |
| 6. Preview | 60–90 s preview (hook + one full chapter) rendered with real VO, music, look | **User OK before full build** |
| 7. Asset generation | AI stills / i2v / maps / room plates per script tags | Ask before credits |
| 8. Build | HyperFrames scenes per chapter, cuts placed from word timings (§4.2) | `hyperframes check` clean |
| 9. Mix | Voice chain, music map, SFX, silences, master (§6) | −15 LUFS ±0.5, TP ≤ −1 dBTP |
| 10. QA | Automated checks §8 + full frame scan | All pass |
| 11. Packaging | Title, thumbnail A/B, description, chapters, SRT (§7) | User OK |
| 12. Publish | Schedule per the series calendar | User OK |

---

## 3. Script

### 3.1 Size

| Runtime | Narrated words (125–135 wpm avg) | Chapters | Avg chapter | Big turns | All turns | Offer slot |
|---|---|---|---|---|---|---|
| 25 min | 3,100–3,300 | 16–18 | 85 s | 13 | 33 | 11:00–12:30 |
| 35 min | 4,300–4,600 | 22–24 | 85 s | 18 | 47 | 15:30–17:00 |
| 45 min | 5,500–5,900 | 28–30 | 90 s | 23 | 60 | 20:00–22:00 |

- Write chapters at 135–145 wpm and leave a 6–10 s music breath at every seam; that lands the 125–135 average.
- Chapters 35–170 s; 80% between 50 and 120 s; one long centrepiece chapter (150–170 s) per act.
- Word budget: `words = (runtime_s − 8 × chapters − hook_breath_s − offer_s) × 2.3`.

### 3.2 Act map (% of runtime)

| Act | % | Must contain |
|---|---|---|
| Hook | 0–2% | Logline with a duality + a specific tease; then 20–30 s wordless world montage; black; place/year stamp |
| I Rise / setup | 2–30% | Underdog origin (irony), the first "edge" explained, inciting decision ~10%, first peak ~28% |
| First reversal | ~30% | A death, loss or betrayal that removes Act I's engine |
| IIa New leader / arena | 30–45% | New protagonist under pressure; a crisis survived through the core value |
| Midpoint | 45% | Foreshadow cliffhanger ("a rival was coming"), then the offer slot (§3.4) |
| IIb Rival | 50–70% | Rival introduced cold; contrarian bet; peak 2 ~70% |
| III Crisis | 70–85% | Escalation over 2–3 chapters to the low point ~82% |
| IV Aftermath | 85–97% | Rebuild + one late surprise (scandal, reveal) so the end isn't a wind-down |
| Resolution | 97–100% | "Today" status; a list that bookends the opening; 2-sentence moral ending on a ≤8-word contrast that answers the hook |

For an explainer topic (e.g. the barber series), map "characters" to composite people (Jordan, Dani), "wars" to
crises (slow weeks, tax bills), "rival" to the competing option (rent vs commission). The skeleton is the same.

### 3.3 Formulas

**Hook (40–70 words, ≤25 s spoken, then a 20–30 s visual breath):**
1. Scope + claim + duality: "Across [span], [subject] [did X], driven by [value A] and [value B]."
2. Arc + stakes, rule of three: "From [humble start], they [rise] to shape [arena 1], [arena 2] and [arena 3]."
3. (Our addition) a concrete tease of two later turns, each with a number or image.
Then music only (world montage: brand mark → map → the "empire" image), 2–3 s black, place + year stamp, story.

**Chapter opens** (rotate, never the same one 3 times running): date + state "By [year], …" (~40%); cross-cut
"While [X], [Y]…"; character + pressure "For [name], the pressure is…"; place context then zoom to character;
quoted source first. Never a question.

**Chapter closes** (every chapter, then the breath): foreshadow "But what [name] doesn't realize is…" / "…it's just
the beginning" (~25%); name reveal held to the last words "His name is ___."; number payoff "[before] became [after]";
thesis plant; handoff to a new person.

**Turns:** something changes every 40–50 s; a big turn (death, rival, betrayal, reversal, crisis, number shock)
every 1.5–2.5 min. Turn lines ≤12 words, starting with "But", "Then", "On [date]".

**Open loops:** 3 spine loops (the hook's duality, a legacy promise, a stated rule/value), each paid mid-film and
again in the last minute; an act loop every 3–5 min; a micro-loop every 60–90 s (withheld name, "here's what he
did", "when?" answered by a date). Keep ~4 open. One loop straddles the offer: open it ≤20 s before, pay it ≤30 s after.
At most one loop left unresolved, and only if the answer is truly unknown.

**Explaining a mechanism:** plain name → modern analogy → 2–3 short steps → number payoff. No formulas on screen
in documentary mode (in explainer mode a ≤3-term formula card is fine).

### 3.4 Offer slot (newsletter / book / sponsor)
- One slot at 45–50% of runtime, 60–90 s, inside a chapter (no chapter of its own).
- Enter with a thematic bridge sentence (the story's theme leads into the offer). No "a word from our sponsor".
- Body: 1 first-person proof line, a rule-of-three feature list, 1 offer, 1 thanks.
- Its own look and bed (brighter, ~120 BPM), then exit through ~2.8 s of silence + black into a new chapter that
  opens cold on a turn. (His viewers skipped it: the replay graph flattens during the read and spikes at its exit.)
- End of film: at most one soft line in the last 15 s; links go in the description.

### 3.5 Script line format (the edit is built from this)
One line = one narration unit ≤20 words (~8 s). Every line carries 1–2 visual tags.

```
## CH07 | 7:48–10:24 | target 150 s / 340 w | ACT I | open:C close:$
[TURN ESC] [LOOP open L10 "once-in-a-lifetime"]
L071 | As the sons open houses in five cities, Europe enters a century of war.
     | V map:europe,pins=5,links | MUSIC: cue in hard on cut
L072 | To start a war, you need money.             | V room:desk,ledger,push
L073 | And whoever loses pays the winner.          | V still:IMG-07-03 push-eyes
[BREATH 8s] V: room:portrait-wall slow pull | MUSIC: swell +7 dB
```

Visual tags: `room:` (faked 3D room, §5.3), `plaque:` (diegetic name), `still:` (AI/archive still + move),
`i2v:` (image-to-video), `archive:` (real footage), `map:` (§5.5), `card:place|date` (§5.6), `black:` (fact card),
`lt:name,role` (lower third), `quote:source,year`, `diagram:`, `stat:` / `chart:` / `table:` (explainer mode only),
`host:` (on-camera / avatar), `bookend`. Sound tags: `MUSIC: in|out|swell|drop|cue-change`, `SFX: [diegetic thing]`,
`SILENCE n s`. Structure tags: `[TURN type]`, `[LOOP open|close id]`, `[BREATH n s]`.

### 3.6 Writing rules + pre-flight check

Rules: historical present for the spine (past tense only for background and quoted evidence); mean sentence 13–16
words, ≥18% of sentences ≤8 words (the punch lines), none over 28 in our voice; 1.5–2.5 numbers/min, money always as
before → after; ≥1 date/min in history; one protagonist per chapter (+≤1 foil), introduced as role + relation +
pressure; ≤1 rhetorical question per 10 min, answered immediately; "you" only for general rules and the offer;
max 1 superlative per chapter; no stock phrase more than twice; a second voice (quoted source card or second TTS
voice, 5–20 s) every 3–4 min, attributed on screen; never "let's dive in", "smash that like", "see you tomorrow".

| Check | Target |
|---|---|
| Hook words / spoken time | 40–70 w / ≤25 s, then 20–30 s breath |
| Chapters | runtime_min × 0.65 (±2) |
| Big turns / all turns | ≥ runtime_min ÷ 2 / ≥ runtime_min × 1.3 |
| Numbers / dates per min | 1.5–2.5 / ≥0.8 (history) |
| Mean sentence / share ≤8 words | 13–16 / ≥18% |
| Second-voice inserts | ≥ runtime_min ÷ 4 |
| Loops open on average | 3–5; offer straddled; ≤1 unresolved |
| Offer | 1 slot, 45–50%, 60–90 s |
| Ending | moral ≤2 sentences, last ≤8 words with a contrast; ≤1 CTA line |

---

## 4. Editing grammar

### 4.1 Shot length by story mode

| Mode | Shot length | Cuts/min |
|---|---|---|
| Cold open montage | 10–20 s (4 shots in ~50 s) | 5–6 |
| Character / room scene | 6–9 s, cutting 2–4 angles of the same room | 7–9 |
| Emotional beat (death, decision) | 10–20 s, one slow move | 3–6 |
| Explainer (mechanism, map) | 4–6 s per state | 10–14 |
| Escalation / war / crisis | 1.5–3 s | 20–36 |
| Coda / legacy | 6–8 s | 8–10 |

Whole-film targets: average shot ~4.5 s (median ~3.8), ~4.5 visual events per 10 s (about 2 cuts + 2–3 in-shot
events: a move change, a label, a pin drop, a light sweep, a focus pull). Any shot ≥8 s must have a move.

### 4.2 Where cuts land (place them from whisper word times)

| Situation | Offset |
|---|---|
| Cut on a new clause or sentence | 0–400 ms before its first word (median ~−260 ms) |
| Cut onto a named thing (person, object) | 0 to −150 ms before the noun; a rack focus finishes on the surname |
| Cut after a pause / new scene | 0.4–1.0 s before narration resumes (picture lands in the pause) |
| Before a dramatic line | ~0.9 s early so the image sits in the silence |
| New subject or scene | picture 2–5 s before it's named |
| Expert / quote voice | J-cut: voice starts 1.5–4.6 s before the face |
| Withheld villain or reveal | hold the image back ~0.9 s past the line |

### 4.3 Transitions library (HyperFrames)

| ID | Use | Build | Duration (30 fps) | Ease |
|---|---|---|---|---|
| `cut` | Default (~95%) | swap on a frame boundary per §4.2 | 0 f | — |
| `dip-black` | Time jump, death, act end, offer exit | A 1→0, black hold, B 0→1 | out 10–16 f, hold 6–24 f (to 60 f for heavy beats), in 12–24 f | power2.in / power2.out |
| `fade-up` | First shot of a new era after black | camera move already running as it fades in | 15–36 f | sine.out |
| `text-card` | Foreshadow, time jump, unshowable fact | §5.6 | hold 2.5–8 s | — |
| `map-whip` | City to city | pan map ≥60% width, blur 0→24→0 px | 6–9 f | expo.inOut |
| `zoom-through` | Globe → country → city | scale 1→6 + blur 0→20 px, land next layer 0.6→1 | 18–30 f | power3.in / power3.out |
| `cloud-wipe` / `steam-whiteout` | Change of place outdoors; end of an industrial scene | full-frame cloud/steam PNG scale 0.8→3, opacity 0→1→0 | ~0.6–1.1 s | sine.inOut |
| `rack-focus` | Reveal inside a still or room | fg blur 0→8–12 px, hero 6→0 px | 15–24 f (hold blur 0.8–2.2 s first for name reveals) | power2.inOut |
| `light-sweep` | Keep a card/diagram alive >4 s | soft radial light drifts across, screen blend, 0.15–0.25 | 30–45 f, every 3–4 s | sine.inOut |
| `bookend` | Last shot | the cold open's key image, now lit and closer | — | — |

Banned: glitch, film burn, flip, star wipe, decorative white flash, generic cross-dissolve between unrelated shots.

### 4.4 Set-piece recipes (from the shot logs)

**Cold open (0:00–0:50)**
1. 0–20 s: one slow 3D-style crane/push over the "empire" image (silhouettes before a columned building). Logline narration over it, music ducked ~7 dB.
2. One line drops the music to silence; the next line returns with a low boom.
3. 20–42 s: music only, 3 shots: the crest/brand mark revealed by rack focus → a map of the whole domain with linked locations → a striking metaphor image. One light-flash transition at most.
4. 2–3 s black with the boom decaying.
5. Place + year stamp ("City Country Year") for ~3 s; narration resumes. No logo, no title card.

**Introducing a person** (no name captions for historical figures): room wide shot with their portrait on the wall
(4–6 s) → the framed portrait mid (4 s) → push to the eyes (3–4 s, the strongest push in the film, ~5%/s). Reuse the
same portrait in 3–5 later rooms. Institutions are introduced by their nameplate (brass on black for one side, cold
black glass with silver for the other: colour-code rival "houses"). People with real photos get a name lower third.

**A death:** footage of the funeral or aftermath *before* the death is said → narration stops 8–14 s → music drops to
about −25 LUFS → freeze frame fades to black in ~0.4 s → empty chair → the darkest, stillest shot of the section held
~6 s → amber portrait with name + age → voice returns.

**War / crisis montage:** a 2–3 s music-only pause and a 2-frame black flash → burst of 5–7 cuts in ~6 s (1–1.5 s
each) → a darker, bassier cue entering hard on the first battle line → shots shrink toward the climax (6.7 s → 0.7 s)
around one modest diegetic sound (a single gunshot) → 1–2 s dead silence → slow pull-out on the aftermath.

**A big fact the picture can't show:** silent black card, white text (one red word at most), music swells ~4 dB,
3.4–5 s readable, then a low boom as the picture returns.

**Act break:** low sub-boom → 1–1.5 s silence → cut to a dark, still-moving 3D set.

**Citing a source:** a dark desk with the book cover and a framed author photo, slow push to the cover, plus an
"Author / Name" lower third; used every time the script leans on that book.

**Era shift:** before cameras existed, build the world (rooms, AI portraits, i2v). From the first real footage on,
switch to real archive (B&W kept neutral, colourised clips mixed straight in). Colour marks "lived" history,
B&W "official" history.

**Ending:** slow down (median shot ~7 s); zoom out from people to the institution, to today's world, to a callback
map of where it began; the moral on camera (or by the narrator over the bookend image); last line over the bookend
image; music swells ~+5 dB for 2 s after the last word; 12 s logo hold while audio fades over ~8.5 s (end-screen canvas).

---

## 5. Pictures

### 5.1 What fills the screen (his census → our equivalent)

| His source | Share | Our replacement |
|---|---|---|
| Unreal 3D rooms (desks, framed portraits, plaques, maps, miniature buildings) | 34% | AI room plates + HyperFrames parallax (§5.3) |
| Feature-film clips | 18% | i2v from our own AI stills, or 2–3 AI stills cut fast with strong pushes |
| Archive film | 11% (33% after 1914) | Public-domain archive |
| Archive stills | 7% | Public-domain stills with Ken Burns, or inside a room frame |
| Stock / drone | 6% | Licensed stock |
| Host on camera | 6% | Optional avatar/host, or skip |
| Maps | 5% | HyperFrames map scenes (§5.5) |
| Interviews | 5% | Quote cards with a second voice |
| AI stills full frame | 1.5% | More of these, since we have no Unreal or film clips |
| Text cards | 2% | §5.6 |

In explainer mode (barber series) add our own HyperFrames beats (statements, tables, charts, checklists), but give
them this film's dark, warm world when used in documentary mode.

### 5.2 Camera moves (all linear, `ease: "none"` inside the shot)

| Image | Move | Rate |
|---|---|---|
| Archive still | `scale 1.06→1.16` + `xPercent 0→−4` over 5 s | ~2%/s zoom, 0.8% width/s pan |
| AI portrait | `scale 1.10→1.35` over 5 s, transform-origin on the eyes | ~5%/s |
| Reveal | `scale 1.6→1.25` (pull back) | ~−6%/s |
| Room plate | wrapper `scale 1.00→1.08`, `x 0→−2%` over 5 s | 1.6%/s |
| Map | push 1.5%/s; fly-through up to 8%/s | |

Mix across consecutive shots: ~35% push in, 25% pull out, 20% pan; never two identical moves in a row; minimum
speed 0.8%/s; the move is already running when the cut lands. Source images ≥2× frame size (render 3840 px wide).

```js
tl.fromTo(img, {scale:1.06, xPercent:0}, {scale:1.16, xPercent:-4, duration:5, ease:"none"}, 0);
```

### 5.3 Faking the 3D room (one 5 s "room shot")

| Layer (back→front) | Source | Parallax (x over shot) | Treatment |
|---|---|---|---|
| L0 room plate | AI image of a dark wood-panelled room/desk with an empty frame area, 3840 px | −0.5% | `blur(1.5px)` when focus is on the hero; brightness 0.85 |
| L1 hero | our portrait/photo/document in a gilt frame PNG, canvas texture multiply 25% | −1% | `perspective(1600px) rotateY(-12deg)`, shadow `0 30px 60px rgba(0,0,0,.6)` |
| L2 glint | specular streak PNG | with L1 | sweep x −40%→+40% over 2 s, screen, 0.35 |
| L3 foreground prop | cut-out candlestick / book edge / chess piece covering 15–25% of an edge | −3% | `blur(8–14px)`, brightness 0.6 |
| L4 atmosphere | 40–80 dust motes (2–4 px, opacity 0.2–0.6, drift 2–6 px/s up-right) + warm haze `rgba(255,190,120,.08)` | — | screen |
| L5 grade + vignette | overlay | — | §5.7 |

Rack focus at shot start: L3 blur 0→12 px and L1 blur 6→0 px over 0.8 s. Cut the same room as 2–4 angles (wide →
frame → eyes, scale 2.0→2.15). Revisit the same room through the film; each return shows the story's new state.

Diegetic text (nameplates, door glass, plaques): bake it into the AI plate when the model renders text cleanly,
otherwise build it in CSS 3D. Never animate the letters; reveal with camera, focus and light only.

```css
.plate { transform: perspective(1200px) rotateY(-24deg) rotateX(6deg); background: linear-gradient(#F4EFE3,#D9D2C2);
         box-shadow: 0 20px 50px rgba(0,0,0,.7); padding: 22px 46px; }
.plate span { font: 600 54px 'Playfair Display'; color: #1A1714; }
.brass span { font: 400 60px 'Pinyon Script'; background: linear-gradient(180deg,#F3D58A,#A57A2C);
              -webkit-background-clip: text; color: transparent; }
.glass span { font: 600 72px 'Cinzel'; color: #E9E2CF; text-shadow: 0 0 6px rgba(255,240,200,.4); }
```

### 5.4 AI image prompts (house style)

Ask for: medium ("19th-century oil painting on canvas, craquelure" or "1860s albumen photograph", or a period
film-photo look for modern eras); a single warm key from high left, Rembrandt chiaroscuro, umber/black background;
85 mm for portraits, 35 mm eye level for scenes; palette burnt umber, walnut, oxblood, brass gold, bottle green;
skin the only bright value; no blue sky; mood words solemn, secretive, candlelit, austere; eyes on the upper third
with dark space for push-ins; 16:9 at 2–4× final size. One reference portrait per recurring character, reused for
every later shot.

Examples (original subjects):
- *An empty Victorian boardroom, long mahogany table with papers and inkwells, high-backed leather chairs, oil portraits on dark green walls, slatted window light cutting beams through dust, low key, 24 mm, 16:9.* (room plate)
- *A busy barbershop in 1950: chrome and red-leather chairs, white-coated barbers, men in fedoras waiting, mirrors doubling the room, neon glow through the window at evening, warm tungsten, Kodachrome look, 35 mm, 16:9, slightly dark.*
- *Close-up of a wax-sealed letter and a stack of coins on a dark walnut desk beside a green banker's lamp, candle smoke, macro 100 mm, very shallow depth of field, black background, 16:9.*
- *A modern bank lobby at night, empty, polished black marble, brass teller grille, one security light pooling on the floor, rain on the glass doors, volumetric haze, 24 mm, 16:9.*

Image-to-video prompt: *"Slow cinematic dolly in, 5 seconds, camera only. Subject still, breathing subtly. Candle
flame flickers, dust drifts through the light beam. No new objects, no face change."* Trim to 3–4 s.

### 5.5 Maps
- Signature map: a tilted satellite plane (`perspective:1400px`, `rotateX(48deg)`), upright building/flag sprites
  (counter-rotated), blackletter city labels (UnifrakturMaguntia 64 px, #E0DCD2, soft glow), cream link lines
  (#F2EDE0, 3.5 px, glow) already drawn or drawn with `strokeDashoffset` over 1.2 s, slow push `scale 1.0→1.12`.
  Reuse the same map at the start, middle and end, each time showing the new state.
- Globe → region: scale 1→7 + blur 0→14 px in 0.7 s (expo.in), swap at peak blur, land blur 14→0 / scale 1.25→1 in 0.5 s.
- Pins drop `y −90→0, scale .6→1` in 0.35 s (back.out(2)), landing 0–0.7 s before the city is named. Dotted trail
  `stroke-dasharray: 0.1 18`, round caps; a glowing ship or dot can ride the path while the camera follows, then pull back to show the route.
- Highlighted territory: flat map, land #FDFDFD, highlight #D31930.

### 5.6 Overlay text (rare, consistent)

Fonts (Google): Open Sans (UI), UnifrakturMaguntia (pre-1900 places), Oswald 600 (year slam), Playfair Display /
Cinzel (plaques), Pinyon Script (brass), Caveat (handwriting). Pick ONE place-stamp style per film.

| Element | Spec | Timing |
|---|---|---|
| Lower third | Open Sans; label 300 42 px #F6F8FF, name 700 64 px #FDFCFD, soft shadow, no box; left 192 px, name baseline y 972 | in 1.5–2.0 s after cut, 0.5 s slide from left with blur (expo.out); hold 3.5 s; out 0.25 s, ≥1.5 s before the next cut |
| Place/date stamp | blackletter ~240 px (~20% height) #FBD8BF with dark shadow, centred | 0.6–0.8 s after cut, 0.12 s wipe; hold 2.4–3.3 s; off on the next cut |
| Year slam | Oswald 600 ~500 px #FAF6F7 | on at cut+0.6 s, hold 3 s, off on the cut, no tween |
| Black fact card | Open Sans 400 56 px #F7F7F7 centred on black; one red word max (#9A1018) | 0.7 s of black first, 0.6 s fade in, hold ~2–2.6 s, 0.5 s fade out; two-line dramatic version: line 1 fades 1.2 s, line 2 at +2.6 s, out over 1.7 s (~8.4 s) |
| Brand/URL card | navy #010D21, drifting red/orange/blue light leaks, Open Sans 60 px, tracking .18em, cyan glow | blur-stretch in 0.5 s, hold 5 s |

Frequency per 40 min: ~8 lower thirds, 4–5 place stamps, ~4 black cards, 10–14 map beats, 20+ diegetic-text
shots, 0 chapter cards, 0 burned-in subtitles.

### 5.7 Look (grade, vignette)
- Room / AI shots: mean brightness 50–60/255, saturation 0.3–0.4. CSS on room layers:
  `filter: brightness(.78) contrast(1.12) saturate(.85) sepia(.18);`
  ffmpeg per clip: `eq=brightness=-0.06:contrast=1.12:saturation=0.85,colorbalance=rs=.05:gs=.02:bs=-.05:rm=.04:bm=-.04`
- Stock/footage to match: `eq=brightness=-0.04:saturation=0.8:contrast=1.05` + vignette.
- Archive B&W: neutral, `hue=s=0,eq=contrast=1.15:brightness=-0.02`.
- Vignette (corners ~0.72× centre):
  `background: radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,.35) 85%, rgba(0,0,0,.55) 100%);`
- No grain on room/AI/map shots, no letterbox, no dust overlay (use in-room dust motes instead).

---

## 6. Sound

### 6.1 Master
Integrated **−15 LUFS ±0.5**, LRA 3–5 LU, true peak **≤ −1.0 dBTP** (he peaks at +0.5; don't copy that). Two-pass
`loudnorm=I=-15:TP=-1.0:LRA=5:...:linear=true`. (Series rule for the barber episodes is −16 LUFS; keep the series
setting unless the user says otherwise.)

### 6.2 Voice
Chain: `highpass=f=70`, `equalizer=f=140:t=q:w=0.8:g=2`, `equalizer=f=350:t=q:w=1.2:g=-2`,
`equalizer=f=4500:t=q:w=1:g=1.5`, `lowpass=f=13000`, `acompressor=threshold=-24dB:ratio=3:attack=8:release=120:makeup=4`,
`alimiter=limit=-3dB`. Dry, mono, centre. Target short-term spread ~3 dB.
Pace 125–135 wpm gross; rise/war/money chapters 135–145, death/decline/ending 100–115.
Pauses: inside a sentence 0.15–0.25 s; between sentences 0.30–0.40 s (0.6–1.0 s before a key line); chapter seam
either 0.4–0.6 s (about a third of seams) or a 2–11 s music breath.

### 6.3 Music
- Static bed **14 dB under the voice** (12–17), no pumping. Optional safety duck 2–3 dB
  (`sidechaincompress=threshold=0.03:ratio=2.5:attack=80:release=700`). Cold open ducks 7 dB, then swells.
- Swell +6 to +9 dB over 0.4–0.8 s in 11–15 chosen breaths per 40 min; pull back over 0.6–1.0 s before the next line.
- New cue about every 60 s (20–240 s), ≥70% of changes within ±10 s of a chapter seam. Alternate wide stereo beds
  with narrow/mono darker ones (~60/40).
- One tonal family per film (one minor key and its relatives). Low drones for death/war/doom; mid strings or piano
  for rise and scheming; a brighter major-leaning cue for ambition and triumph.
- Entries: war/escalation cues start hard on the cut (full level within ~130 ms); everything else fades in over ~1 s
  inside a breath. Exits fade over 1.5–2 s (3.5–5.5 s after the title, the offer and the biggest act). No stings.
- Cues to license (~12–15 tracks cut into ~30 segments): dark orchestral cold open (sub hit + swell); sparse piano/
  pizzicato for origins; minor strings ~100 BPM for rise; low percussive 100–105 BPM for war; sustained drone for
  death; dense low ~80 BPM pulse for decline; bright strings for triumph; neutral ~120 BPM for the offer; quiet
  resolving bed for the ending.

### 6.4 SFX
0.3–0.4 per minute, only for things on screen (cannon, gunshot, coins, horses, ship, crowd). Sync to the action in
the shot; when the action starts on a cut, place the hit 0–60 ms before the cut. Short hits 1–3 dB under narration
peaks; long events at narration level, in a music breath, never under a sentence. No whooshes on cuts, no risers,
no typewriter or paper. If HyperFrames motion needs a sound, keep it ≤ −20 dB under the voice.
(Our barber episodes currently use "light SFX" on slides. In documentary mode follow this section; for the barber
series, ask the user before cutting SFX back.)

### 6.5 Silence plan (per 40 min)
3 full silences (music cut, below −60 dB): ~1.7 s after the title sequence; ~2.8 s between the offer and the next
chapter; ~1 s inside a 5 s music dip right before an act's verdict line (which lands dry as the darkest cue starts).
Plus 3 dips to −40/−50 LUFS for 1–2 s before late turns. End with 2.5 s of silence.

---

## 7. Packaging

**Title:** `[2–3 word metaphor]: True Story of the [Superlative] [Category] in [Scope]`. Keep the proper name out of
the title when the thumbnail carries it.

**Thumbnail:** a dark (mean ~50/255), warm cinematic render of a group or one figure in role costume; one face lit,
the rest near silhouette; 2 words max, all caps, condensed distressed bold sans, muted gold #DABB68 or white, two
stepped lines in the lower-left third, cap height ~9% of the frame, no stroke or box; the words name the subject
or genre (complement the title, never repeat it); the same costume/motif must appear in the first 20 s. A/B test
a version with one expressive face. (For the barber series keep our navy-and-gold brand and logo top-left.)

**First 30 s** must pay off title + thumbnail: logline (≤18 s) → wordless montage (brand mark, map, "empire") →
black → place/year stamp.

**Description order:** offer/sponsor line → 2-sentence logline → community links → own product (soft sell) →
resources → "Books/sources mentioned" → support line → 1–2 hashtags → `-- CHAPTERS --` (20–30, one per 50–100 s,
Title Case, "Person — Epithet" or "Subject + Verb", last one "… Today"). For this channel the only CTA is the Kit
newsletter; previous episode linked; sources listed.

**Captions:** upload the SRT; never burn subtitles into the long-form master.

---

## 8. QA gates (Claude Code runs these before showing the user)

1. **Static-hold check:** render at 192×108; flag any 4 s window where mean frame difference < 0.6 and start-to-end
   difference < 2, except text cards (≤8 s).
2. **Pacing check:** shots per minute per minute of runtime; must follow the arc in §4.1 (no minute under 4 cuts
   except cold open, emotional beats and the ending).
3. **Cut sync:** for every cut, offset to the nearest word onset; ≥80% within −500…0 ms.
4. **Script pre-flight:** the §3.6 table.
5. **Loudness:** −15 (or series −16) LUFS ±0.5, TP ≤ −1 dBTP, music 12–17 dB under voice in 10 sampled windows.
6. **Frame scan:** no green/black/white glitch frames (we've had GSAP oklch flashes: hexify colours), no text
   outside the 90% safe area, no overlapping text.
7. **Facts:** every number and date traced to a source in `research.md`; composites labelled as examples.
8. **Look:** sample 20 frames; room shots mean brightness 45–65/255, corners ~0.7× centre.
9. **Preview first:** user approves the 60–90 s preview before the full build, and the full render before any upload.

---

## 9. What we do NOT copy

- His story, script lines, images, 3D sets, thumbnails, or any footage he used.
- Feature-film clips (copyrighted); use i2v, AI stills, public-domain archive or licensed stock.
- His +0.5 dBTP peaks and inconsistent place-stamp fonts.
- Using third-party TV interviews as authority; use a quote card with the source on screen instead.

## 10. Unknowns
- His exact tools list sits behind a Patreon post (fcm.finaius.com/resources → patreon.com/posts/software-gear-ai-134568124);
  it could not be read. Tools above come from his own interviews (1of10 Podcast 2025, Produced By 2024).
- His image generator and music library are not stated publicly.
- This study covers one 2023 video. His newer videos (2025–26) use more Kling AI video and run 45–87 min.
