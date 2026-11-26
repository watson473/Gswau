# 14 · How every image is made and moved (Empire of Shadows, 39:28)

Agent 14. Sources: all 79 contact sheets (1 frame/s), about 30 full-res check frames, 3 s bursts,
and a full-film motion pass. I decoded the film at 8 fps, 480x270. For each frame I measured
phase correlation on 18 blocks against the frame 0.5 s earlier, then fitted translation + scale +
rotation by least squares. I also measured colour and luma statistics, a radial luminance profile
and grain residuals on full-res frames. Scratch scripts: `scratchpad/a14/{motion,an,shots,grain,census}.py`.

- **[M]** = measured.
- **[I]** = inferred.
- Census counts come from my per-sheet tile classification (2,366 tiles = seconds). Accuracy is
  about ±1-2 tiles per sheet.

---

## 0. Headline findings

1. **This film is mostly NOT AI imagery.** It was uploaded 2023-11-18. The look comes from
   **Unreal 3D sets (34% of runtime)** plus **feature-film clips (18%)** and **archival film (11%)**.
   AI stills appear mainly *inside* the 3D sets as fake oil portraits in frames. Full-frame AI
   imagery is only about 1.5% of runtime. His newer videos lean more on Kling (see
   notes/website.md), so for our stack the "3D room" slot becomes "AI room plate + parallax".
2. **Every image moves, and every move is slow and linear.** [M] Of shots longer than 2 s:
   - 35% push in, 26% pull out, 20% pan only. Most of the rest are live footage.
   - Median absolute zoom in moving shots: **1.9% scale per second**.
   - Median pan: **0.8% of frame width per second**.
   - Archival stills are clean constant-speed Ken Burns. Example: 0:51-0:53 runs +0.8 %/s zoom
     with a 1.9 %W/s pan, then cuts to a second move at +2.5 %/s with no pan.
3. **"No static shot over 4 s" holds for images: no image breaks it.** [M] Only 4 near-static shots
   over 4 s were found, and none is a still image:
   - the host on camera at 10:53 (11.7 s);
   - a film clip at 16:30 (5.5 s, actors moving);
   - a black text card at 36:44 (10.9 s, a fading caption);
   - a locked-off wide interview at 37:33 (8 s).
4. **No global film grain, no letterbox, no dust or scratch overlay.** [M]
   - Grain: in flat areas, frame-to-frame noise is **0.10-0.23 of an 8-bit level** on 3D, AI and
     archival-film shots. That is effectively clean digital. Measurable noise appears only where
     the source carries it: archival stills 1.2, host camera 1.7, stock 3.6.
   - Letterbox: 0% of frames have black bars.
   - Vignette: the "film look" is a dark, warm, low-key grade with a vignette. Averaged over the
     whole film, corner luma is **0.72x centre** (radial profile 1.03 / 0.95 / 0.90 / 0.83 / 0.72).
     Archival film is almost flat (0.93), so the vignette comes mostly from the 3D renders'
     lighting and lens, not from a uniform overlay.

---

## 1. Census: source types by share of runtime [M from sheets]

| Type | Seconds | % of runtime | Notes |
|---|---|---|---|
| **3D render (Unreal)** | 815 | **34.4%** | Dark wood-panelled rooms, desks with books, chess sets, candelabra, green banker's lamps. Framed portraits on walls and desks (half or more are AI-painted "oil portraits"). Brass and engraved company signs ("J.S. Morgan & Co", "Rothschild & Sons London", "Rothschild et Fils Banquiers Paris"). Marble bank halls with chandeliers, a 3D coat of arms. MetaHuman-style characters (a boy in a top hat, a deathbed scene, silhouettes at a window, a boardroom under god rays). A burning building. Third-party interview clips and author photos shown inside 3D frames, laptops and on a blackboard. |
| Feature film / TV drama | 419 | 17.7% | Period dramas: battles, crowds, trains, a parliament, a bank run, 1940s and 1950s B&W features. Most clips run 3-8 s. |
| Archival film | 258 | 10.9% | Mostly after 28:30: WWI, Weimar Berlin, Nazi rallies, WWII. **B&W and colorised mixed**. TV news from the 1990s (CBS bug left in). |
| Archival still | 176 | 7.4% | Engravings, colourised prints, oil paintings, caricatures, photochroms, newspapers (e.g. 30:04, 37:01), a war poster, a book page. |
| Stock / drone | 141 | 6.0% | Coins on yellow, hands in a coin box, gold bars, flags, drone shots of estates, an NYC street, tilt-shift city, a Brilliant laptop. |
| Host on camera | 141 | 6.0% | Rocky as a talking head: warm beige wall, shallow depth of field. |
| Maps | 125 | 5.3% | **3D satellite globe**: clouds, gold pins, dotted route lines, miniature white bank buildings with gothic blackletter city labels, flags on poles. Also 2D political maps (third-party animated maps) and an antique paper map. |
| Third-party interview | 114 | 4.8% | Documentary talking heads with their original name supers. |
| Sponsor read | 86 | 3.6% | 18:06-19:32. |
| Text / black / logo card | 42 | 1.8% | Small centred caption on black; the end logo. |
| **AI still, full frame** | 36 | **1.5%** | AI oil portraits pushed to extreme close-up (eyes, 2:46; 16:38; 17:24); an AI Frankfurt market (2:30); an AI Paris street (23:04, with tell-tales). |
| Infographic | 13 | 0.5% | Broker/client diagram, 2:10. |

**AI-animated (Kling-style) video:** I found no clear case. 23:04 (the Paris street) shows AI
tell-tales: melted sacks and deformed horses. [I] It may be AI-generated, with slight motion or a
Ken Burns move. Many "colorised" archival clips (e.g. 13:36 train, 30:36 straw hats, 34:36 Maxwell)
show AI colorisation and upscaling smear, which is a different use of AI.

### How the mix changes across the film [M]

| Segment | 3D | Feature film | Archival film | Archival still | Stock | Host | Map | Interview | AI full-frame |
|---|---|---|---|---|---|---|---|---|---|
| 0:00-15:00 (1760s-1830s) | **44%** | 15% | 4% | 8% | 4% | 8% | 7% | 6% | 1% |
| 15:00-28:20 (1830s-1900; includes sponsor 11%) | 33% | **28%** | 1% | 6% | 5% | 5% | 4% | 4% | 3% |
| 28:30-39:28 (1914-1990s) | 23% | 9% | **33%** | 8% | 10% | 4% | 4% | 4% | 0% |

The rule is simple: **where no camera existed, he builds the world** (3D + AI portraits + drama
clips). **Once film exists (1914 on), real footage takes over**, and 3D shrinks to signs, frames
and the map. The modern era adds stock and drone footage and 1990s TV.

---

## 2. Motion and effects per type

All rates are [M] medians from the motion pass unless marked.
- Scale = % size change per second.
- Pan = % of frame width per second.
- p90 = 90th percentile of the absolute value.

| Type | Zoom med (p90) | Pan med (p90) | Rotation p90 | Mean RGB | Sat | Luma /255 | Contrast (σ) |
|---|---|---|---|---|---|---|---|
| 3D render | -0.6 (6.8) %/s | 0.84 (2.9) %W/s | 2.6°/s | 62/52/44 (warm) | 0.41 | **54** | 47 |
| AI still (full frame) | **+5.0** (9.3) | 1.3 (2.7) | 2.8° | 48/43/37 | 0.27 | **44** | 45 |
| Archival still | +0.8 (2.5) | 0.0 (1.9) | 0.8° | 96/89/83 (slightly warm) | 0.29 | 90 | 45 |
| Archival film | +0.7 (6.4)* | 0.75 (2.5)* | 3.0°* | 91/91/89 (neutral) | 0.19 | 91 | 56 |
| Feature film | +0.1 (7.0)* | 0.6 (2.7)* | 2.9°* | 52/49/43 | 0.23 | 49 | 37 |
| Map (3D globe) | +1.5 (8.1) | 0.45 (2.1) | 2.3° | 46/52/31 (green) | 0.54 | 48 | 49 |
| Host | -0.2 | 0.6 | – | 73/65/52 | 0.33 | 66 | 41 |
| Whole film | – | – | – | 69/64/59 | 0.31 | 65 | 45 |

\* Rates for live footage are the original camera movement, not added moves.

### 3D render (Unreal)

**Camera.** [M+I] A slow continuous dolly or crane. Typical moves:
- push toward a framed portrait (2:16-2:21: frame on a desk, then the photo inside it);
- pull back from a portrait to reveal the room (2:36-2:40: about -3 %/s);
- slide across a wall of portraits (14:32-14:38);
- **rack focus** from a foreground prop (candelabra, chess pieces, chandelier) to the frame;
- slight Dutch tilt (signs at 23:48-24:00 rotate about 1-3° while dollying in from 20% to 60%
  of frame width).

A shot typically lasts 4-8 s, and a scene often cuts 2-4 angles of the same set.

**Rate profile.** Most shots move at 1-3 %/s. Reveals reach 6-10 %/s. There is no ease-in or ease-out
inside the shot: the move is already running when the cut lands. [M: per-frame values are constant
within shots]

**Lighting.** Low key (mean luma 54). Warm practicals: wall sconces, candles, green banker's
lamps, chandeliers. Hard window light with slatted god-ray shadows (35:30). Volumetric haze, and
**floating dust motes** (17:39-17:59, white specks drifting). Deep blacks.

**Depth of field.** Very shallow. The foreground is blurred to bokeh about 30-50% of the time.

**Materials.** Dark walnut panelling, green damask or flock wallpaper, gilt frames, brass plaques,
marble columns. **Pictures inside frames carry a canvas or paper weave texture**, visible in
close-ups (2:46 eyes, 38:00 face), which sells "a real object".

### AI stills

These are 19th-century oil portraits:
- three-quarter view;
- dark umber background;
- chiaroscuro light from upper left;
- weathered craquelure;
- saturated skin against black clothing.

They are almost always placed in a 3D frame. When shown full frame, they get the strongest push of
any type: +5 %/s median, up to 9-12 %/s for an eye close-up. The camera ends on the eyes. Example:
2:46-2:52 starts with a -10 %/s pull-back from the eyes, then a slow push.

### Archival stills

Constant linear Ken Burns:
- zoom 0.8-2.5 %/s;
- optional lateral pan up to 1.9 %W/s;
- 4-6 s per move;
- often 2 moves per image (a new framing after a cut).

Treatments:
- **The opening/closing composite** (0:28-0:42 and 38:22-39:01) is a hard-threshold, posterised
  B&W photo with a warm-green tint (RGB about 150/155/140). Underneath it sits a glowing
  3D/AI orb with roots, plus a slight RGB-split edge.
- Engravings are shown neutral grey.
- Colour prints are shown as-is, and many are AI-colourised (13:30 children, 31:00 crowd).
- Paintings are mostly *inside a 3D frame* with a canvas texture, not flat.

### Archival film

The B&W is **left neutral**: R≈G≈B, saturation 0.19, not sepia-tinted. It is cleaned and
upscaled, and contrast is kept fairly high (σ 56, the highest of any type). Notes:
- **Colorised WWII and London footage** is mixed straight in (32:20-33:30, 33:50).
- No dust or scratch overlay is added. Any wear comes from the source.
- One sepia clip appears at 27:20 (gold panning). Timecode burn-in at 33:00 was left on screen.

### Feature film

Kept with its native grade. It is mostly dark (luma 49, the darkest live material) and desaturated
(0.23). Clips are chosen to match the 3D palette.

### Maps

A 3D satellite globe with a slow camera fly:
- push +1.5 %/s, fly-throughs up to 8 %/s;
- fast whip transitions through clouds between locations (8:13, 16:00), about 1 s of heavy motion
  blur;
- labels in a gold or ivory blackletter font;
- the most saturated material in the film (0.54, green).

### Stock

Moves at +1.6 %/s, mostly the camera's own movement (drone, slider). Brighter (luma 91) than the
3D material.

### Text cards

Small sentence-case white text (about 1.3-1.8% of frame height, centred on black). It fades in
over about 1 s and holds 4-10 s. One red-tinted keyword appears at 36:50. These are the only true
statics.

### Effects checklist

| Effect | Present? | Detail |
|---|---|---|
| Film grain overlay | No [M] | Noise below 0.25 level |
| Letterbox | No [M] | |
| Dust / scratches overlay | No [M] | |
| Vignette | Yes, mostly in-render [M] | Corners 0.72x centre film-wide; 0.68x in 3D rooms |
| Light leaks | Only in the brand and sponsor cards | Blue/red/orange blurred gradients; end logo at 38:58 |
| Fog / particles | Yes, in 3D | Volumetric haze and dust motes; a steam-fog dissolve at 29:24 |
| Glow / bloom | Yes, in 3D | Practicals and chandeliers bloom; the opening orb glows |
| Lens flare | Small, on plaques | Specular glints sweep over signs (24:51) |
| Colour grade | Teal-free warm umber | 3D R>G>B about 1.4:1.2:1 |

---

## 3. AI image prompting (to match his look with ORIGINAL subjects)

### Inferred style recipe for his AI portraits and scenes

| Element | What to ask for |
|---|---|
| Medium | "19th-century oil painting on canvas" or "1860s albumen photograph"; visible brushwork and craquelure |
| Lighting | Single warm key from high left, Rembrandt chiaroscuro, umber/black background, practical candle or lamp glow |
| Lens | 85 mm portrait, shallow depth of field. For scenes: 35 mm, eye level, slight haze |
| Palette | Burnt umber, walnut brown, oxblood, brass gold, bottle green; skin the only bright value; no blue sky (overcast or dusk) |
| Mood words | Solemn, secretive, candlelit, austere, "old money", "a shadow of power" |
| Framing | Subject's eyes on the upper third, generous dark negative space for later push-ins; 16:9 at 2-4x final resolution (render 3840x2160 or upscale, because pushes go to 150-250%) |
| Consistency | One reference portrait per recurring character, reused as an image reference for every later shot. Keep the same costume words, the same face descriptors and a fixed seed or character reference. He reuses one portrait per person across many shots (wall, desk, close-up). |

### 10 original prompts

1. *A 19th-century oil portrait of an elderly counting-house clerk in a black frock coat and white
   cravat. Three-quarter view, eyes to camera. Rembrandt lighting from a single candle at upper
   left, deep umber background, visible brushwork and fine craquelure, museum varnish sheen.
   Austere, secretive. 16:9, subject right of centre, wide dark space on the left.*
2. *Interior of a cramped 1820s counting house at dusk. High wooden desks, ledgers, brass oil
   lamps, quills, stacked coin sacks, dust in the lamp light, windows of grey overcast light.
   35 mm, eye level, shallow depth of field, oil-painting realism, palette of walnut brown, brass
   and bottle green, no people in the foreground. 16:9.*
3. *A busy barbershop in 1950. Chrome and red-leather barber chairs, white-coated barbers, men in
   fedoras waiting, mirrors doubling the room, neon sign glow through the window at evening, warm
   tungsten practicals. Kodachrome film-photo look, soft halation, 35 mm, 16:9. Calm and
   nostalgic, slightly dark.*
4. *A modern bank lobby at night, empty. Polished black marble, a brass teller grille, a single
   security light pooling on the floor, rain-streaked glass doors, city lights bokeh outside.
   Cinematic, low key, 24 mm, volumetric haze, umber and steel palette. 16:9.*
5. *An oil painting of a harbour in 1790. Merchant sailing ships unloading barrels, dock workers,
   an overcast sky with a pale sun, smoke from a warehouse chimney. Muted ochre and grey palette,
   visible canvas texture, academic realism. 16:9.*
6. *Close-up of a wax-sealed letter and a stack of gold sovereigns on a dark walnut desk beside a
   green banker's lamp. Candle smoke drifting, macro 100 mm, very shallow depth of field, warm
   key light, black background. 16:9.*
7. *An 1860s albumen photograph of a stern woman in a high-collared black dress, seated beside a
   ledger. Sepia tones, soft vignette, slight silver mirroring at the edges, studio backdrop.
   Formal, unsmiling. 16:9 with the subject centred.*
8. *A torch-lit street riot in an 1840s European city at night. Crowds with raised fists, a bank
   facade with shuttered windows, smoke and embers in the air, orange fire against blue-black
   shadows, painterly cinematic realism, 35 mm. 16:9.*
9. *A rain-soaked trading floor in 1987, seen from the gallery. Men in braces shouting at green
   CRT screens, cigarette haze, fluorescent overheads, film-photo grain, a desaturated palette
   with one red accent. 16:9.*
10. *An empty Victorian boardroom. A long mahogany table set with papers and inkwells, high-backed
    leather chairs, oil portraits on dark green walls, slatted window light cutting volumetric
    beams through dust. Unreal-engine realism, 24 mm, low key. 16:9. (Use as a 3D-room plate.)*

### Image-to-video (Kling-like) motion prompts

Keep motion small, because his moving material never morphs the subject.

> *"Slow cinematic dolly in, 5 seconds, camera only. Subject still and breathing subtly. Candle
> flame flickers, dust motes drift through the light beam, smoke curls slowly. No new objects, no
> face change, no zoom burst."*

Variants:
- "slow lateral truck left with parallax";
- "gentle crane down revealing desk";
- "flags ripple in wind, clouds drift".

Use 5 s clips and trim to 3-4 s, discarding the last second where drift accumulates.

---

## 4. The 3D-room look, and how to fake it without Unreal

### What it is [M/I]

- **Lighting:** a dark room (luma about 50/255) with 1-3 warm practicals (sconce, candle, banker's
  lamp) and one cool window or god-ray. Bloom on practicals; haze; floating dust.
- **Materials:** walnut panelling, green damask, gilt and black frames, brass plaques,
  leather-bound books, marble.
- **Composition:** the hero image (portrait, photo, document, plaque) sits in a frame on a wall or
  desk, 30-70% of frame width, often slightly angled (yaw 10-25°). The foreground prop is blurred.
- **Camera:** continuous slow dolly at 1-3 %/s, with rack focus from foreground to hero. Each scene
  is cut as 2-4 angles: wide room, then frame mid, then image close-up, so the image "lives" in
  a place.

### Layering recipe for HyperFrames (one "room shot", 5 s, 1920x1080)

| Layer (back to front) | Source | Depth z / parallax factor | Treatment |
|---|---|---|---|
| L0 room plate | AI image (prompt 10 style) of the empty wall or desk, 3840 px wide, with an **empty frame** or blank wall area | 1.00 (moves least) | `blur(1.5px)` when focus is on the hero; brightness 0.85 |
| L1 hero image in frame | Our archival photo or AI portrait, pre-composited into a gilt frame PNG (frame as a separate PNG, image behind it with `mix-blend-mode:multiply` canvas texture at 25%) | 0.85 | Slight `rotateY(-12deg)` with `perspective:1600px`; drop shadow `0 30px 60px rgba(0,0,0,.6)` |
| L2 glints | A radial-gradient specular streak PNG over the frame glass | same as L1 | Translate x by -40% to +40% over 2 s once per shot, `mix-blend-mode:screen`, opacity 0.35 |
| L3 foreground prop | Cut-out PNG (candlestick, chess piece, book edge), placed at a frame edge covering 15-25% | 0.55 (moves most) | `blur(8-14px)`, brightness 0.6 |
| L4 atmosphere | Dust-mote layer (40-80 white 2-4 px dots, blur 1px, opacity 0.2-0.6, drifting 2-6 px/s up and right) plus a haze gradient (warm `rgba(255,190,120,.08)`) | screen | Loop |
| L5 grade + vignette | Full-frame overlay div | – | See section 5 |

**Camera (GSAP on a wrapper).**
- Move the wrapper with `scale 1.00→1.08` over 5 s (1.6 %/s) and `x: 0→-2%`.
- Each layer gets an additional `x` offset proportional to `(1 - z)`. For example, L3 moves 3x
  more than L1: L0 -0.5%, L1 -1%, L3 -3% over the shot.
- **Rack focus:** animate L3 blur 0→12 px and L1 blur 6→0 px over 0.8 s at the shot start.

Cut to angle 2 (the hero image fills 80% of the frame, with canvas texture) and angle 3
(extreme close-up on the eyes, scale 2.0→2.15).

---

## 5. Recipes for our stack (HyperFrames + GSAP + ffmpeg)

### Ken Burns (archival or AI still)

- Image ≥ 2x frame size.
- Duration = shot length (3-6 s).
- `ease:"none"`: his moves are linear inside the cut. Add a 0.3 s `power1.out` start only if the
  shot follows a dissolve.
- Default settings:

  | Image type | Zoom | Pan |
  |---|---|---|
  | Archival still | `scale 1.06→1.16` over 5 s (2 %/s) | `xPercent 0→-4` over 5 s (0.8 %W/s) |
  | AI portrait | `scale 1.10→1.35` over 5 s (5 %/s) | `transformOrigin` on the eyes |
  | "Reveal" variant | `scale 1.6→1.25` (pull back about -6 %/s) | – |

- Alternate in → out → pan across consecutive shots. Mix: 35% in, 25% out, 20% lateral; never two
  identical moves in a row [M distribution].
- Never hold a still more than 4 s without motion. Minimum speed 0.8 %/s.

```js
tl.fromTo(img,{scale:1.06,xPercent:0},{scale:1.16,xPercent:-4,duration:5,ease:"none"},0);
```

### Parallax 2.5D (cut-out photo)

- 3 layers: background plate (z 1.0), subject cut-out (z 0.8), optional foreground (z 0.55).
- Over 5 s:
  - Background `scale 1.04→1.08`, `x 0→-1%`.
  - Subject `scale 1.00→1.10`, `x 0→-2.5%`.
  - Foreground `x 0→-5%`, `blur(10px)`.
- Fill the hole behind the subject with AI inpainting of the background plate.
- Keep the layer separation of a 2.5-4% width difference over the shot. More reads as cardboard.

### Film grain

His film has none, so this is **optional and subtle** if we want it:
- 512 px tiled noise PNG, `mix-blend-mode:overlay`, opacity **0.06-0.08**;
- background-position jittered every frame by a random 0-200 px;
- or ffmpeg: `noise=alls=4:allf=t`, which gives about the 1-1.5 levels seen in his archival stills.

Do **not** grain the 3D, AI-room or map shots (measured noise below 0.25).

### Vignette

Target corners at 0.70-0.75x centre luma:

```css
.vignette{position:absolute;inset:0;pointer-events:none;
 background:radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 55%, rgba(0,0,0,.35) 85%, rgba(0,0,0,.55) 100%);}
```

### Grade (the "Empire" look)

- 3D and AI-room shots: warm umber, low key. Target mean luma about 50-60/255, saturation about
  0.3-0.4, R:G:B about 1.4:1.2:1.
  - CSS on room layers: `filter: brightness(.78) contrast(1.12) saturate(.85) sepia(.18);`
  - ffmpeg per clip:
    `eq=brightness=-0.06:contrast=1.12:saturation=0.85,colorbalance=rs=.05:gs=.02:bs=-.05:rm=.04:bm=-.04,curves=master='0/0 0.15/0.10 0.5/0.45 0.85/0.85 1/0.95'`
- Feature or stock clips to match: `eq=brightness=-0.04:saturation=0.8:contrast=1.05`, plus the
  vignette.
- Archival B&W: keep **neutral grey** (no sepia), contrast up:
  `hue=s=0,eq=contrast=1.15:brightness=-0.02`.
  - Optional for the opening or closing title composite only (his threshold look):
    `hue=s=0,eq=contrast=2.2,colorbalance=gm=.04:bm=-.03`.

### Letterbox

**Not used.** Do not add bars. Keep a 16:9 full frame.

### Dust / scratches

**Not used as an overlay.** Instead, use in-scene dust motes in the room shots (see L4 above):
- 60 particles;
- opacity 0.2-0.6;
- drift 3 px/s;
- slight random `y` sinus of 2 px over 3 s.

### Map recipe

- A 3D globe stand-in: satellite texture plane in HyperFrames with `perspective:1200px`,
  `rotateX(35deg)`.
- Push 1.5 %/s; gold pin pops; dotted route drawn with `stroke-dashoffset` over 1.5-2 s.
- Blackletter or serif-gold labels.
- Whip between places: 0.6-1 s with `blur(20px)` and scale 1→1.6.

### Which source for which story need

| Story need | Use | Why (his practice) |
|---|---|---|
| Introducing a person who predates photography | **AI oil portrait in a room-plate frame**: wide room (4-6 s), then frame (4 s), then eyes close-up (3-4 s) | His main device, 34% of runtime |
| A person with real photos | Archival photo inside the room frame, with a name super; then the photo full-frame with Ken Burns | Keeps "the object in a place" |
| An event before 1900 (battle, riot, bank run) | **Image-to-video** clip (4 s), or 2-3 AI stills cut fast (2-3 s each) with strong pushes | He used drama clips; we cannot, so i2v replaces them |
| An event after 1900 | Real archival film or public-domain stills, neutral B&W, colorised if available | 33% archival film in the modern third |
| Where or when | 3D-style map with pins and route; a place/date super | Reorients every chapter |
| A company or institution | A plaque or sign on a door in the room plate (AI-generated brass plaque with our text added as an HTML overlay), slow dolly plus glint | Recurring "J.S. Morgan & Co" device |
| A quote, document or ledger | A paper or letter plate on the desk, with type laid in HTML and a slow push | 10:00 letter |
| A number, mechanism or explanation | A HyperFrames card or diagram (ours) | He has almost none; we can do better |
| A big turn or reveal | A black text card, small type, 4-6 s, one red keyword | The only allowed near-static (3 uses) |
| Modern era | Stock or drone footage of cities and buildings, real news photos | Stock rises to 10% in the last third |

**Pacing defaults** [M]:
- Shot length: median 4.0 s, mean 4.9 s, p90 10 s (scdet cuts; dissolves undercounted).
- In room sequences, cut angles every 4-6 s while the camera keeps moving.
