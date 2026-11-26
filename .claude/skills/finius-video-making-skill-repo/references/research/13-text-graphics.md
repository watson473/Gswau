# 13 · On-screen text, typography, captions, maps, charts and graphic overlays

Film: FINAiUS "Empire of Shadows" (39:28, 1920x1080, 24 fps). Agent 13 of 15.

## How this was measured

- **Coverage.** I read all 79 contact sheets (1 frame/s). I then ran macOS Vision OCR on all 2,368 one-per-second frames at 1280 px, which gave 103 text segments. Every OCR hit was classified by hand as the creator's own overlay, text inside the image (signs, books, plaques), or text burned into licensed clips.
- **Full-res frames.** I pulled 70+ full-resolution frames (t = 16, 21.5, 47, 74, 75, 115.5, 132, 172, 230, 236, 239, 244, 245.5, 251, 299, 314, 386, 429, 477, 485, 486, 488, 518, 605, 622, 634, 639, 662, 671, 742, 1037, 1056, 1083, 1165, 1203, 1227, 1262, 1406, 1440, 1444, 1464, 1504, 1606, 1696, 1705, 1720, 1735, 1768, 1795, 1853, 2139, 2154, 2158, 2210, 2229, 2263, 2318, 2362, 2364 ...).
- **Animation strips.** For every animated element I built strips at 24 fps (one per frame) or 5–12 fps.
- **Numeric measurements.** Positions, glyph heights and hex colours come from numpy pixel masks on full-res frames. Fade timings come from 99.7th-percentile luminance sampled every 0.2 s.
- **Labels used.** **[M]** = measured. **[I]** = inferred or visual judgement. Font names are always [I], because nothing in the file reveals them.
- **Sizes.** Glyph heights are given as % of frame height (H = 1080 px). "Ink height" means the top of the tallest ascender or cap to the bottom of the lowest descender actually present.

---

## 0. Headline findings

1. **Text is rare and serves the story.** Across 39.5 min the creator adds only about **30 text overlays of his own**: 5 time/place captions, 8 lower thirds plus 1 presenter tag, 4 black "fact cards", 2 sponsor URL cards and 1 end logo. That is about one every 80 s. Everything else that reads as "text" is **diegetic**, meaning it sits inside the picture: brass nameplates, door glass, book covers, signboards, newspapers and a handwritten letter in the 3D rooms. Diegetic text is his main way of putting words on screen.
2. **No chapter title cards, no burned-in subtitles, no persistent watermark or channel bug, no data charts, no stat or number cards** (the "1991" year slam is the only big number). YouTube chapters live only in the metadata. [M: OCR found no bottom-centre caption track anywhere.]
3. **The one fixed system is the lower third.** It uses Open Sans-style type, white, flush left at x = 10 %, baseline at y = 90 %. The name slides in from a mask with motion blur and leaves with a blur-out. Every other caption style changes from use to use: the five date/place captions use **five different font and colour combinations**. Copy the lower thirds and the black cards. Don't copy the inconsistent captions.
4. **Maps are 3D and photoreal, not flat infographics.** A satellite-textured Earth carries tilted 3D bank buildings, blackletter city labels with glow, cream "network" curves, 3D map pins, dotted voyage trails and waving 3D flags on terrain. The camera does fast motion-blurred zooms from globe to region. He used a flat vector map only once (British Empire in red) and a stock-style political map four times.
5. **Brand look: dark navy, film light leaks, Open Sans.** Sponsor and logo graphics use near-black navy (#010D21), drifting red/orange/magenta light leaks, dust and scratches, and white Open Sans with very wide tracking (~0.18 em) and a soft glow.

---

## 1. Inventory of text and graphic elements

Counts are distinct appearances. Times are mm:ss (seconds).

### 1.1 Time/place captions over footage. Own: 5. [M]

| # | Time | Text | Style [I] | Box, colour, size [M] | Animation [M] |
|---|---|---|---|---|---|
| A | 0:46–0:49 (46.17–49.40) | "Frankfurt Germany / 1769", 2 centred lines | Ultra-condensed **light Didone serif** (Onyx / Bodoni Poster Compressed look) | Spans x 10.8–87.6 %, y 25.7–78.5 % (each line ~24 % H tall). Flat **#7CBEFA** sky blue. No shadow, no box. Sits over a busy colour postcard. | Hard on at **+0.58 s** after the shot cut (45.58). Hold **3.23 s**. Hard off 0.85 s before the next cut. |
| B | 4:04–4:06 (244.21–246.62) | "1800" | **Blackletter** numerals (Old English / Fraktur) | x 35.3–64.7 %, y 35.5–54.0 % (ink 18.5 % H). **#FAE3D3** warm off-white, soft dark drop shadow. | On over **3 frames (0.125 s)** with a glyph-wise wipe (the middle frame shows "1 00"). On at **+0.83 s** after the cut. Hold 2.4 s. Off **with** the cut. |
| C | 4:58–5:01 (~298.0–301.2) | "Manchester" | Same blackletter | x 17.6–82.4 %, y 33.0–54.6 % (ink 21.7 % H). **#FBD8BF** peach-cream with a dark soft shadow. | Hard on (between two 0.2 s samples). Hold ~3.2 s. Off with the cut (301.21). |
| D | 29:27–29:33 (1766.8–1773.5) | "JUNE 28, 1914" | **Open Sans Light with true small caps** (J and the numerals are full caps) | x 29.9–70.7 %, y 45.5–55.5 % (cap height ~8 % H ≈ 86 px). **#E2EA7A** lime-yellow, top pixels #E2E89C. No shadow. | On **with** the cut at 1766.79 (the first frame of the archival shot). Hold the whole shot, **6.7 s**. Off with the cut. |
| E | 37:42–37:45 (2262.2–2265.25) | "1991" | **Condensed bold grotesk** (Helvetica Condensed Bold, Oswald or Roboto Condensed look) | x 34.9–64.6 %, y 30.9–64.0 % → **cap height 33 % H (357 px)**. **#FAF6F7**. No shadow. Over a New York skyline. | Hard on at **+0.6 s** after the cut. Hold **3.0 s**. Hard off on the cut. |

Pattern [M/I]:
- The caption arrives **0.6–0.8 s after the picture**, so the shot registers first.
- It holds **2.4–3.3 s**, or the whole shot if that is short.
- It leaves **on the cut**. There is never a fade-out.
- Size is **large**: 18–33 % of frame height, the single focus of the frame, centred or nearly centred.
- Typeface follows the era: blackletter for 1800s Britain, Didone for 1769 Frankfurt, a modern grotesk for 1991, a clean light sans for 1914 archival film.

### 1.2 Lower thirds. Own: 8 appearances (5 people). Presenter tag: 1.

| Time | Variant | Text |
|---|---|---|
| 1:12–1:16, 12:20–12:23, 17:16–17:19 | Label + name, mixed case | "Author / Frederic Morton" (×3) |
| 5:13–5:17, 8:37–8:40 | Name only, mixed case | "Niall Ferguson" (×2) |
| 11:10–11:13 | Caps label + caps name | "ENTREPRENEUR, INVESTOR / ANDRE LOEWE" |
| 20:00–20:06 | Label + caps name | "Author / RON CHERNOW" |
| 29:53–29:56 | Caps label + caps name | "HISTORIAN / LIBBY. H. O'CONNELL, PHD" |

Measured layout (Frederic Morton, t = 74) [M]:
- **Label** "Author": x from 10.0 %, ink y 79.7–82.8 % (33 px; "A" cap and "h" ascender). Colour #F4F7FF to #FBFCFF. Light weight [I].
- **Name** "Frederic Morton": x 10.3–42.9 % (626 px), ink y 85.0–90.0 % (54 px; ascenders only, so the **baseline sits at y ≈ 90 %**). Colour **#FDFCFD**, bold [I].
- **Safe margins:** left **10 % (≈192 px)** and bottom **10 % (108 px)**. These are identical in every own lower third [M: ANDRE, LIBBY and RON all start at x = 10.0–10.4 %, label 79.5–82.8 %, name 85.3–90 %].
- No box, no bar, no rule. The text sits straight on the footage. It stays legible because the frames behind are dark or blurred (most are shallow-DOF 3D framed photos).
- **Caps variant:** label caps ~3.2 % H ink; name caps 4.7–5.6 % H ink.
- **Font [I]:** **Open Sans** (Bold name, Light label). The geometry matches closely: double-storey "g", straight "t" terminal, wide "M".
- **Tracking [I]:** name about +0.03 em; caps label about +0.08 em.

Animation, measured at 24 fps on Frederic Morton and Niall Ferguson [M]:
- **In, 0.45–0.50 s.** The name slides right from behind a vertical mask edge at x ≈ 8.2 % (158 px), with **horizontal motion blur**. Right edge grows 24 % → 42 % of the width in 0.45 s. Left edge settles from 8.2 % to 10.4 % (a final ~40 px of travel). The movement decelerates hard, roughly expo.out / quart.out. The label fades in **~0.1 s after** the name starts, about 0.2 s long, with no movement.
- **Hold.** 3.5–3.6 s at full opacity (Morton 73.28–76.41; Niall 313.88–317.00).
- **Out, 0.25 s.** Gaussian blur rises to ~6–8 px. The name drifts left ~20–30 px and fades. The label fades first, about 0.08 s ahead.
- **Timing within the shot.** On 1.4–2.1 s after the cut. Off 1.6–2.3 s before the next cut. Total screen life about 4 s. It always rides **one** shot, usually a slow push on a 3D framed photo of the person.

Presenter tag "ROCKY XU" (1:53–1:57, 113.1–117.6) [M]:
- **Box:** rounded rectangle at x 9.3–27.6 % (352 px), y 84.4–91.4 % (76 px). Fill **#F8FCF8**. Corner radius ~6 px [I].
- **Text:** dark (#2A2A2A [I]) Open Sans Regular caps, about 0.2 em tracking.
- **In, ~0.8 s.** The box appears as frosted, translucent grey for 2 frames, then goes solid. Letters pop in one by one, stagger **2 frames (83 ms)**. Each letter scales from ~30 % to an **overshoot of ~180–200 %**, then settles to 100 %, like a playful "kinetic" type-on.
- **Out.** Hard, on the cut.
- This is the only boxed label in the film.

Inherited lower thirds: 6, all burned into licensed documentary clips. Not his design. They show what he tolerates:
- Donny Deutsch 3:32
- Tristan Gaston-Breton 14:34
- Jim Cramer 15:08
- Maria von Bismarck 21:00 (orange small caps)
- Steve Case 25:02
- Roy Greenslade 35:13

Most are white serif name over a small-caps title at x ≈ 10 %, y ≈ 78–87 %. They match his own grid by coincidence or by design. Also inherited: a "HUMANITAS" lecture banner, a CBS bug, and an archival timecode burn ("9056 CTL 0:01:04:15") at 33:28. **He leaves these in.** He does not crop or blur source bugs.

### 1.3 Black fact cards (text on pure black). Own: 4. [M]

| Time | Text (≤15 words) | Style [I] | Size and position [M] | Timing [M] |
|---|---|---|---|---|
| 7:08–7:11 (428.3–431.3) | "But Mayer Amchel Rothschild won't be able to see it." | **Open Sans Condensed Bold** (Open Sans wdth 75 / 700) | One line, left-aligned at x = 10.4 %, ink y 44.4–51.2 % (74 px incl. descenders), width 79.7 %. **#F0D9C8** peach. | Black from the cut (427.58). Text fades in 428.3→429.0 (**0.7 s**). Hold ~1.7 s. Fades out 430.8→431.3 (**0.5 s**). Next cut 431.33. |
| 17:35–17:38 (1055.1–1058.7) | "A year later, the House of Commons removed the requirement." | Open Sans Regular | Centred one line, x 6.2–93.5 %, ink y 48.0–53.3 % (58 px). **#F7F7F7**. | Fade in **0.5 s**, hold ~2.6 s, fade out **0.5 s**. |
| 35:38–35:41 (2138.2–2141.2) | "Robert Maxwell began banking with Rothschilds in the late 70s" | Open Sans **Italic** | Centred, ink y 48.1–53.2 % (56 px). **#F3F3F3**. | Fade in **0.6 s** (2138.2→2138.9), hold ~2.2 s, fade out ~0.3 s into the cut. |
| 36:46–36:55 (2206.4–2214.8) | Two lines: line 1 "Lord Victor Rothschild steps in to mediate between Jacob and Evelyn," then line 2 "...being **forced out**." | Open Sans **Light, small caps**, tracking ~0.12 em | Line 1 ink y 42.6–46.3 % (caps 40 px); line 2 y 54.9–58.6 %, **line pitch 133 px (12.3 % H)**. Text #E2E2E2 to #FCFCFC. The phrase "forced out" is **dark blood red, #8E1016–#9A1018** (median with antialiasing #68050E). | Line 1 slow fade-in **1.2 s** (2206.5→2207.7). Line 2 enters **2.6 s later** (~2209.2) in ≤0.2 s. Hold to 2212.8. Slow fade-out **1.7 s** (2213.0→2214.7). |

Use: a card stands in for a scene he cannot show. Death, a law change, a boardroom manoeuvre. It works as a "breath" beat between two 3D sequences. A red keyword is the film's only **highlighted word**. There is no underlining and no highlighter boxes.

### 1.4 Explainer diagram. Own (template look): 1. [M]
- **Time:** 2:08–2:21 (127.96–141.42). Labels from OCR: "Broker / Client / Gets an order / To buy one million shares... / Places order for same stock for his own account / Then places client's order / Due to Bulk order broker makes huge profit".
- **Style.** Flat vector 4-step flow, a stock-template look [I]:
  - teal-cyan illustrated people **#65CBDB**
  - hot-pink arrows **#F552A9**
  - green numbered disc badges **#44B38C**
  - white Open Sans-like labels at ~3.6–4.9 % H ink
  - a shop icon
  - background near-black **#16131A**, with a slow drifting colour wash that cycles teal → red/orange → magenta → blue over ~13 s
- **Animation.** It appears fully built. The only motion is the background wash plus a slight drift. It is on screen for 13.5 s, the longest static graphic in the film. He gets away with it because the background never stops moving.

### 1.5 Family-tree / network diagram: 1, shown as a framed picture in a 3D room. [M]
- 28:53–28:58 (1733.0–1739.3). An engraved sepia map collage: the father's portrait at bottom centre, **five black arrows** radiating up to five sons' cameo portraits, each with a small white italic serif name label ("Nathan", "James", "Amschel", "Carl", "Salomon"; ink ~3 % H) and a caption under the father.
- The whole diagram is a **picture inside an ornate frame on a wallpapered wall**, with a fern in the foreground. The camera slow-pushes. Nothing animates inside the picture.

### 1.6 Maps: about 14 sequences. See §2.

### 1.7 Newspapers and documents
- **Archival newspaper front page** (30:04–30:07). Real scan, slow pan across the headline columns and oval portraits.
- **Tabloid spin-in** (37:07–37:10). "The man who saved the Mirror / Maxwell dies at sea". The front page spins in from the screen centre on a blue studio backdrop with **echo/trail frames**: about 2 rotations, scale ×6, 1.2 s. It is lifted from 1990s TV footage [I], not built by him.
- **Newspaper stack** (37:52). "The fight for the News", a live-action shot.
- **"YOU buy a Liberty Bond" poster** (30:49). Slow push.
- **Handwritten letter** (9:57–10:13, 16 s across several shots). A 3D crumpled cream paper sheet on a dark desk with **handwriting in black ink** (a casual handwriting font [I]). The camera glides slowly along the lines. His spoken quote is visualised as a written document. Ink ~3 % H per line.
- **Book covers as "source" callouts:** Morton (1:11–1:18, 12:20, 17:16), Ferguson (6:19–6:36, 27:25), Chernow (20:00), Preston (37:39). Real covers stand in 3D on a desk next to a framed photo of the author, often while the lower third runs. No callout lines, boxes or zoom circles.

### 1.8 Diegetic signage in the 3D sets: about 25 shots. See §3.

### 1.9 Sponsor segment (18:11–19:42, Brilliant)
- Screen recordings of the sponsor's app.
- Two **URL cards** (19:22–19:27 and 19:29–19:37). White text, wide tracking, on the brand-style navy with light leaks. See §4.
- A white sponsor end-card panel.
- A sponsor logo on navy that fades to black.

### 1.10 End logo (39:16–39:28)
- A vertical light-streak "barcode" transition (blue and red streaks) resolves into a lone cyan "i" bar. Then "FINAiUS" builds left to right.
- Letters are steel blue **#2E577E–#346B95** with a cyan "i". Wide bold sans, letter-spacing ~0.12 em [I]. Spans x 7.8–89 %, y 33–64 % [M].
- Behind it: drifting red/orange/magenta light leaks over navy (#291A30 median) [M].
- On screen ~10 s. No subscribe animation and no end-screen layout inside the video.

### 1.11 Not present
- Chapter title cards
- Quote cards with attribution
- Bar, line or pie charts
- Stat or number counters
- Highlighter or underline animations
- Burned-in subtitles
- Persistent logo or watermark
- Social handles
- Arrows or circles drawn over footage (except inside maps)

---

## 2. Maps

| # | Time | Base | What happens [M from strips] |
|---|---|---|---|
| M1 | 0:20–0:23 (cold open); repeats 10:37–10:41, 28:24–28:27 (as a frame), 31:18–31:20, 38:34–38:45 (outro, 11 s) | **3D satellite Earth** (true-colour texture, dark ocean, white cloud patches), seen at an **oblique tilt of ~35–50°** | Five **3D white neo-classical bank buildings** stand on London, Paris, Frankfurt, Vienna and Naples. **Blackletter city labels** in cream (#E0DCD2) with a soft outer glow sit at their feet, tilted with the ground plane (ink 6–10 % H in close shots). Thin **cream curved lines** (~3–4 px, slight glow) link Frankfurt to every city and run off-frame south. The camera does a slow orbit/push across ~4–11 s. In the 1880s version (31:18) the lines are **orange** with a bright moving glow. Reused as the "empire network" motif from the cold open to the outro. |
| M2 | 3:49–4:02 (229–242) | **Photoreal globe on black space** | (1) A whole-globe hold for ~2 s. (2) A fast **push-in with heavy zoom blur** in about 0.6–0.8 s to central Europe. (3) A **gold 3D map pin (#E8A61F)** stands on Frankfurt and the camera circles it for 2–3 s. (4) A **whip zoom/blur transition** in about 0.5 s. (5) **Red 3D pins (#A92C20)** appear on other cities while a **dotted white trail** (round dots ~8–10 px, gap ≈ 1 dot, #F7F5F1) draws from pin to pin at roughly 25–35 % of screen width per second. (6) Pull back to show 5 pins linked by dotted curves. No text labels. |
| M3 | 4:10–4:13 (250–253) | **Flat vector world map** | White (#FDFDFD) countries with fine grey borders. British Empire filled **#D31930** red. Ocean is a dark teal-navy gradient **#0D2939** with a **magenta/red light leak** drifting across over 3 s. Slow push (~6 % scale) and pan left. Tiny grey labels with percentages are present, illegible and decorative. |
| M4 | 7:56–8:09 (476–489) | **3D terrain flyover**: low clouds, relief mountains, pale-blue water | A cloud-dive transition (whiteout ~0.5 s). Then a **waving 3D flag on a pole** plants at the city. A blackletter label ("Naples", mint-white with glow, measured #A6BCE1 under the haze; "Paris" pink; "London" white) stands at its base, ink ~10 % H. The camera glides at an angle for 2–3 s, then a fast forward fly through clouds into the next city. Three cities chained in about 13 s. |
| M5 | 9:45–9:55 (585–595) | Photoreal globe close-up, dark ocean | A **tiny glowing 3D ship** sails from West Africa toward Britain. A **dotted white trail** (dots ~12 px) grows behind it. The camera tracks the ship. It ends on a pull-back to the whole globe showing a dotted route around Africa. |
| M6 | 10:21–10:24 | Stock colourful **political map, Europe 1815** (flat pastel country fills, bold caps labels like "BRITAIN", "PRUSSIA", "AUSTRIAN EMPIRE") | Static with a slight push. Borrowed asset [I]. |
| M7 | 10:59–11:04 | Stock **historical political map** (orange/yellow/blue fills, small serif labels) | Slow zoom toward central Europe. One region flashes or highlights [I]. |
| M8 | 20:22–20:30 | **Dark stylised political map** (dark grey land, coloured highlight polygons: Netherlands orange, Belgium lime, France blue, North German Confederation dark violet) | **Tilted 3D perspective**. Labels in wide-tracked caps serif, white, ink ~10–25 % H, laid flat on the land and rotated with it. Slow push, about 8 s. |
| M9 | 23:57–24:06 (1437–1446) | 3D satellite (as M1, desert/India) | **3D flags** plant on Egypt and India. Script-style labels ("Egypt", "India") in cream, ink ~4–5 % H, **fading in after the flag**. Whip-blur moves between them. |
| M10 | 24:22–24:26 (1463–1466) | **Old parchment US map** (sepia, aged texture, real 19th-century map) | **Glowing lines (railroads) draw in**: thin cream/white strokes appear and spread across the map over ~2–3 s. Light vignette. |
| M11 | 28:15–28:22 (1695–1702) | 3D satellite (as M1) over North America | Slow drift, no labels. Then a motion-blur cut to the Europe network (M1). |
| M12 | 28:38–28:43 (1718–1723) | **Stylised WWI map** (soft painted colours, semi-3D) | Unit/army icons (small dark flags/blocks) cluster on the borders. Caps labels. Slow pan Black Sea → Western Europe. |

Map rules (inferred from the set):
- **The map is a place you fly through, never a diagram.** Every 3D map has camera motion: orbit, push, or whip zoom with heavy blur. The whip zoom doubles as the transition.
- **Highlight cities with 3D objects** (buildings, pins, flags), not with circles or glows. Countries are highlighted by **solid flat fill** only on the flat maps (M3, M8).
- **Labels:** blackletter for 18th–19th-century European cities, script for colonial places, caps serif on political maps. Cream or white with a soft glow. Placed on the ground plane at the object's foot.
- **Lines are "network" curves:** thin cream solid lines for permanent links (M1), dotted white trails for journeys (M2, M5), glowing strokes drawing in for infrastructure (M10). Draw speed is about 0.3 screen-width/s.
- **Hold:** 2–4 s per city beat. A map sequence lasts **4–14 s**.

---

## 3. 3D rooms, desks and the detective board (Unreal style): how text lives in them

Text is part of the set:
- **Hanging shop signboard** (2:50–2:55 and 7:12–7:14). A carved dark-wood cartouche with gold Fraktur lettering ("Rothschild und Söhne / Bankiers / Frankfurt"), ink 12–17 % H per line, with snow particles. Slow push.
- **Gilded oval brass plaque in an ornate gold frame** ("Rothschild et Fils / Banquiers / Paris"). Arched caps serif on an oval, gold on cream, under a chandelier. 6 appearances (12:41, 13:02, 14:07, 15:45, 21:25, ...). Each time the camera orbits a few degrees and passes the chandelier in the foreground.
- **Bank door glass** ("ROTHSCHILD & SONS / Bankers / LONDON"). Gilt and white serif caps on black glass, with **lens-flare glints sweeping across the letters**. About 8 appearances (10:33 through 31:25), dark and moody. In one (24:41) the text **resolves from blur** as the camera racks focus.
- **Door nameplate** "J.S. Morgan & Co". A white plaque with a black Times-like serif on a black door, low angle. The camera rises and pushes until the plate fills the frame (18:00, 23:23–23:30, 6.5 s).
- **Small brass desk plaques** under framed portraits. One has blank plates (24:47, a portrait wall of tycoons). Others carry script names ("Jacob Rothschild", "Lord Victor Rothschild" with "1931–2022"), ink ~4–12 % H, picked out with **rack focus** (35:51–36:01).
- **Chalk/handwritten caption on a framed portrait** ("J.P. Morgan in London 20 years ago", 26:44–26:49). Hand-lettered caps along the top of a blackboard-like print.
- **3D company logo** on a wood panel ("N M Rothschild & Sons Limited" arrows emblem). Metallic, shallow DOF, about 6 shots.
- **Book covers and framed author photos** on the desk (§1.7). They work as callouts that cite sources.
- **Handwritten letter** on the desk (§1.7).

How they are shot:
- Dark rooms with warm practical lights (lamps, chandeliers, candles) and heavy vignette.
- The camera always moves: dolly-in 3–6 s, slow orbit, or crane up.
- Shallow depth of field, so the text sharpens as the camera arrives (rack focus about 0.5–1.0 s).
- Floating dust or snow particles in about half the shots.
- The text is never animated, only revealed by the camera, focus and light.

---

## 4. Graphic colour palette

All hex values sampled [M] unless noted.

| Role | Hex |
|---|---|
| Card background | #000000 |
| Brand navy (URL card bg) | #010D21 |
| Logo bg (navy-violet mix under leaks) | #291A30 |
| Map ocean / flat-map bg | #0D2939 |
| Diagram bg | #16131A |
| Primary text white | #FDFCFD (lower thirds), #F7F7F7 (cards), #F3FDFF (URL, slightly cool) |
| Warm text peach | #F0D9C8 (condensed card), #FBD8BF / #FAE3D3 (blackletter captions) |
| Accent red (emphasis word) | #8E1016 to #9A1018 |
| Map highlight red | #D31930 |
| 3D pin red | #A92C20 |
| Pin gold | #E8A61F |
| Map/network label cream | #E0DCD2 |
| Dotted trail | #F7F5F1 |
| One-off caption colours | sky blue #7CBEFA (Frankfurt 1769), lime #E2EA7A (June 28, 1914) |
| Logo | steel blue #2E577E / #346B95, cyan "i" (~#1FA8C8 [I]) |
| Light leaks [I] | red #C8302A, orange #E0782A, amber #F2B23A, magenta #7A1B4F, blue #1E5BA8 |
| Diagram template | cyan #65CBDB, pink #F552A9, green #44B38C |

Consistency rules he follows:
1. **Type is light-on-dark, almost always without a box.** It is white or a warm off-white. Legibility comes from dark or blurred backgrounds, not plates.
2. **One sans family (Open Sans) for everything informational:** lower thirds, tag, cards, URL, logo. Period display faces (blackletter, Didone) are used only for **place and time**.
3. **Accent colour is red, and rare.** One word in one card, the empire fill, the pins.
4. **Metal and gold live inside the 3D world,** never in flat overlays.

Where he is inconsistent, and we should not copy it: the five time/place captions use five different fonts, sizes and colours (sky-blue Didone, peach blackletter ×2, lime small caps, white grotesk).

**Brand look in one paragraph.** A dark, candle-lit "museum of money". Warm practical light falls on gilt frames, brass plaques and dark wood. The camera drifts and pushes through shallow focus and dust. Information arrives as objects in that world: nameplates, books, letters, 3D maps with buildings and flags. The few flat overlays are quiet: clean white Open Sans, flush left at a 10 % margin, sliding in with motion blur and leaving with a blur-out. Period place-names are in blackletter, and a single blood-red word does the emphasis. Brand moments (sponsor, logo) switch to deep navy with drifting red-orange-blue film light leaks, dust and scratches, and wide-tracked glowing white type.

---

## 5. Recipes for our stack (HyperFrames + GSAP, 1920x1080, 30 fps)

Fonts (Google Fonts, free):

| Use | Font | Notes |
|---|---|---|
| Info / UI | **Open Sans** variable (wght 300–800, wdth 75–100) | Covers lower thirds, cards, URL and condensed cards (wdth 75). Near-exact match [I]. |
| Period place/date | **UnifrakturMaguntia** (closest to the "Manchester"/"1800" Old English) | Alternatives: **UnifrakturCook** (heavier), **Pirata One** (more legible). |
| Era caption, 18th century | **Bodoni Moda** 400 with `transform: scaleX(.5)` | Or **Playfair Display** 400 squeezed. No free ultra-condensed Didone matches Onyx exactly. |
| Big year slam | **Oswald** 600 or **Roboto Condensed** 700 | |
| Archival date | **Open Sans** 300 with `font-variant-caps: small-caps` | Or **Raleway** 300 small caps. |
| Engraved plaques | **Cinzel** / **Cinzel Decorative** (caps), **Playfair Display** (Times-like) | |
| Script nameplates | **Great Vibes** or **Pinyon Script** | |
| Handwritten letter | **Caveat** or **Homemade Apple** | |

Global helpers:
- 30 fps, so 1 frame = 0.0333 s.
- Our caption track: **don't** burn subtitles into the master (none in the reference).
- Use `will-change: transform, filter, opacity`.
- Fake motion blur on fast slides with `filter: blur()` keyed to speed, or with a 3-copy echo at 0.33/0.2 opacity.

### R1 · Lower third (person ID)

```html
<div class="l3" style="position:absolute;left:192px;bottom:108px;">
  <div class="l3-mask" style="position:absolute;left:-34px;top:0;width:1400px;height:140px;overflow:hidden;">
    <div class="l3-label">Author</div>
    <div class="l3-name">Frederic Morton</div>
  </div>
</div>
```

```css
.l3-mask{ padding-left:34px; }               /* mask edge sits 34px left of text start (158px abs) */
.l3-label{ font:300 42px/1 'Open Sans'; letter-spacing:.04em; color:#F6F8FF;
           text-shadow:0 1px 8px rgba(0,0,0,.35); margin-bottom:14px; }
.l3-name { font:700 64px/1 'Open Sans'; letter-spacing:.03em; color:#FDFCFD;
           text-shadow:0 2px 12px rgba(0,0,0,.45); }
/* caps variant: label 600 30px uppercase ls .08em; name 700 58px uppercase ls .05em */
```

Measured targets: label ink top at y = 861 px; name baseline at y = 972 px; left edge 192–198 px.

```js
const tl = gsap.timeline();
tl.fromTo('.l3-name', {x:-640, filter:'blur(10px)'},
          {x:0, filter:'blur(0px)', duration:0.5, ease:'expo.out'}, T)          // T = cut + 1.5–2.0 s
  .fromTo('.l3-label', {opacity:0}, {opacity:1, duration:0.2, ease:'none'}, T+0.1)
  // hold 3.5 s
  .to('.l3-label', {opacity:0, duration:0.2, ease:'power1.in'}, T+4.0)
  .to('.l3-name',  {x:-28, opacity:0, filter:'blur(7px)', duration:0.25, ease:'power2.in'}, T+4.08);
// rule: whole life ≈ 4.3 s, inside ONE shot, out ≥1.5 s before the next cut
```

### R2 · Presenter / speaker tag (boxed, kinetic letters)

```css
.tag{ position:absolute; left:178px; top:911px; height:76px; padding:0 28px; border-radius:6px;
      background:#F8FCF8; display:flex; align-items:center; }
.tag span{ display:inline-block; font:400 44px 'Open Sans'; letter-spacing:.2em; color:#2A2A2A;
           transform-origin:50% 80%; }
```

```js
tl.fromTo('.tag', {opacity:0, backgroundColor:'rgba(200,205,210,.55)', backdropFilter:'blur(8px)'},
                  {opacity:1, backgroundColor:'#F8FCF8', duration:0.1, ease:'none'}, T)
  .fromTo('.tag span', {scale:0.3, opacity:0},
          {keyframes:[{scale:1.9, opacity:1, duration:0.12, ease:'power2.out'},
                      {scale:1.0, duration:0.18, ease:'back.out(2.5)'}],
           stagger:0.0833}, T+0.05);          // 2 frames per letter at 24fps → use 0.0833 s
// out: hard cut (gsap.set opacity 0 at cut) — hold ~3.6 s
```

### R3 · Time/place caption (period display)

Pick ONE style per film. Recommended: blackletter for pre-1900 places, light small caps for 20th-century dates.

```css
.place{ position:absolute; inset:0; display:grid; place-items:center; }
.place b{ font:400 240px/1 'UnifrakturMaguntia'; color:#FBD8BF;
          text-shadow:0 4px 18px rgba(0,0,0,.55), 0 0 2px rgba(0,0,0,.6); }   /* ink ≈ 20 % H */
.date  { font:300 120px/1 'Open Sans'; font-variant-caps:small-caps; letter-spacing:.02em; color:#E2EA7A; }
.year  { font:600 500px/1 'Oswald'; color:#FAF6F7; }                            /* cap ≈ 33 % H */
```

```js
// arrive 0.6–0.8 s after the shot cut, 3-frame glyph wipe, leave ON the cut
tl.fromTo('.place b', {clipPath:'inset(0 100% 0 0)', opacity:0.6},
          {clipPath:'inset(0 0% 0 0)', opacity:1, duration:0.12, ease:'none'}, cut+0.7)
  .set('.place b', {opacity:0}, nextCut);       // hold 2.4–3.3 s (or whole shot)
// "1991"-style year slam: gsap.set(on) at cut+0.6, gsap.set(off) at nextCut (hold 3.0 s), no tween
```

### R4 · Black fact card (replaces an unshowable scene)

```css
.card{ position:absolute; inset:0; background:#000; }
.card p{ position:absolute; left:0; right:0; top:50%; transform:translateY(-50%); text-align:center;
         font:400 56px/1.25 'Open Sans'; color:#F7F7F7; padding:0 120px; }
.card .cond{ text-align:left; left:200px; font:700 74px 'Open Sans'; font-stretch:75%; color:#F0D9C8; }
.card .sc  { font:300 56px/1 'Open Sans'; font-variant-caps:small-caps; letter-spacing:.12em; color:#E8E8E8; }
.card .hot { color:#9A1018; }                   /* one emphasis phrase max */
/* two-line small-caps card: line pitch 133 px, lines at y 44.5 % and 56.7 % */
```

```js
// single line (≤12 words): black from cut, text in at +0.7 s
tl.fromTo('.card p', {opacity:0}, {opacity:1, duration:0.6, ease:'sine.inOut'}, cut+0.7)
  .to('.card p', {opacity:0, duration:0.5, ease:'sine.in'}, cut+0.7+0.6+2.2);   // card ≈ 3.7–4 s
// two-line dramatic: line1 fade 1.2 s; line2 fades 0.2 s at +2.6 s; hold to ~6.3 s; fade out 1.7 s (card ≈ 8.4 s)
```

Pair it with a low drone or a silence dip (see 11-sound-music.md). No movement on the card.

### R5 · Brand / sponsor URL card

```css
.brandbg{ background:#010D21; }
.leak{ position:absolute; width:1400px; height:1000px; border-radius:50%; filter:blur(160px);
       mix-blend-mode:screen; opacity:.55; }        /* #C8302A, #E0782A, #1E5BA8 blobs */
.grain{ background:url(dust_scratches.png); mix-blend-mode:screen; opacity:.25; }
.url{ font:400 60px 'Open Sans'; letter-spacing:.18em; color:#F3FDFF;
      text-shadow:0 0 10px rgba(180,230,255,.55), 0 0 28px rgba(120,180,255,.25); }
```

```js
gsap.to('.leak', {x:'+=300', y:'-=120', duration:6, ease:'sine.inOut', yoyo:true, repeat:1, stagger:1.3});
tl.fromTo('.url', {opacity:0, skewX:-18, scaleX:1.15, filter:'blur(6px)'},
          {opacity:1, skewX:0, scaleX:1, filter:'blur(0px)', duration:0.5, ease:'power3.out'}, T)
  .to('.url', {opacity:0, filter:'blur(8px)', duration:0.4, ease:'power2.in'}, T+5.0);
```

### R6 · End logo build

```js
// 0–2 s: vertical light streaks (12 divs, width 20–90 px, blue/red gradients, blur 6px) slide on x and collapse
// to one cyan bar → that bar becomes the dot-less "i" stem (scaleY 3→1, 0.4 s, expo.out)
// letters F,I,N,A,U,S fade+blur in from the "i" outward, stagger 0.06 s, duration 0.5, ease 'power2.out'
// logo: font 800 260px 'Open Sans', letter-spacing .12em, color #2E577E, "i" #1FA8C8, inner glow
// background leaks keep drifting; hold 8 s; fade to black 1 s
```

### R7 · 3D network map (M1): the film's signature map

- **Layers.** (1) A satellite Europe still, 2× oversize. (2) An SVG overlay in the **same** 3D transform. (3) Building PNG cutouts (AI-generated white neo-classical bank, transparent background) as separate sprites that **stay upright** (counter-rotate X).

```css
.stage{ perspective:1400px; }
.ground{ transform:rotateX(48deg) rotateZ(-8deg) scale(1.0); transform-origin:50% 60%; }
.city{ position:absolute; transform:rotateX(-48deg); transform-origin:50% 100%; }   /* billboard */
.city em{ font:400 64px 'UnifrakturMaguntia'; color:#E0DCD2;
          text-shadow:0 0 12px rgba(255,245,220,.65), 0 2px 4px rgba(0,0,0,.6); }
path.link{ stroke:#F2EDE0; stroke-width:3.5; fill:none; filter:drop-shadow(0 0 4px rgba(255,240,210,.7)); }
```

```js
tl.fromTo('.ground', {scale:1.0, rotateZ:-8}, {scale:1.12, rotateZ:-3, duration:6, ease:'sine.inOut'}, 0)
  .from('.city', {y:-60, opacity:0, duration:0.45, ease:'back.out(1.6)', stagger:0.25}, 0.3)
  .from('path.link', {strokeDashoffset:(i,el)=>el.getTotalLength(), duration:1.2,
                      ease:'power2.inOut', stagger:0.3}, 0.9);   // set strokeDasharray = length first
// cut away at 4–6 s; reuse the same stage later (orange #E8862A links + moving glow dot for "railways")
```

### R8 · Globe zoom → pins → dotted trail (M2/M5)

```js
// globe still (black space) → zoom: scale 1→7, filter blur 0→14px, 0.7 s, ease 'expo.in'; swap to region still at peak blur
// region: blur 14→0, scale 1.25→1.0, 0.5 s 'expo.out'
// pin: SVG/PNG 3D pin (#E8A61F gold or #A92C20 red), from {y:-90, scale:.6, opacity:0} to {y:0, scale:1, opacity:1}, 0.35 s 'back.out(2)'
// soft ground shadow ellipse scales 0.3→1 in sync
// dotted trail: <path stroke="#F7F5F1" stroke-width="9" stroke-linecap="round" stroke-dasharray="0.1 18">
//   reveal with a mask path: strokeDashoffset len→0, duration = len/(0.3*1920) s, ease 'none'
// camera: whole layer x/y tween following the trail head, 'sine.inOut'
// ship variant: small glowing boat sprite (#FFF2D0, glow 8px) rides the path via MotionPathPlugin, trail draws behind
```

### R9 · Flat "empire" map (M3)

```css
/* SVG world map: land #FDFDFD, borders #C9CDD2 .5px, highlighted countries #D31930 */
.mapbg{ background:radial-gradient(120% 90% at 40% 40%, #133A4D 0%, #0D2939 55%, #081B26 100%); }
.leak{ background:radial-gradient(closest-side, rgba(122,27,79,.6), transparent); mix-blend-mode:screen; }
```

```js
gsap.fromTo('.map', {scale:1.0, xPercent:0}, {scale:1.06, xPercent:-2, duration:3.5, ease:'sine.inOut'});
gsap.fromTo('.leak', {xPercent:-40, opacity:0}, {xPercent:40, opacity:.8, duration:3, ease:'sine.inOut'});
// optional build: highlighted countries fill from white to red with stagger 0.04 s, 0.3 s each
```

### R10 · Terrain flyover with flag and label (M4)

- Needs Kling-style image-to-video, or a 2.5D parallax of an AI terrain still: three layers (clouds, terrain, sea) at speeds 1.6 / 1.0 / 0.8.
- Flag: a short Kling clip on green/alpha, or a looping waving-flag sprite sheet.
- Label: blackletter 72px, white with glow tinted by the place (mint #CFF5E6, pink #F7D6DE), fading in 0.4 s **after** the flag plants. Hold 2–3 s.
- Between cities: a white cloud wipe (a full-frame white-cloud PNG scaling 0.8→3, opacity 0→1→0 over 0.6 s).

### R11 · Diegetic text in a 3D set (nameplates, door glass, plaques)

- **Best:** generate the still with an image model with the text baked in, then use our camera moves. **Alternative:** build the plaque in CSS 3D.

```css
.plate{ transform:perspective(1200px) rotateY(-24deg) rotateX(6deg); background:linear-gradient(#F4EFE3,#D9D2C2);
        box-shadow:0 20px 50px rgba(0,0,0,.7); padding:22px 46px; }
.plate span{ font:600 54px 'Playfair Display'; color:#1A1714; letter-spacing:.02em; }
.brass span{ font:400 60px 'Pinyon Script'; background:linear-gradient(180deg,#F3D58A,#A57A2C);
             -webkit-background-clip:text; color:transparent; }
.glass span{ font:600 72px 'Cinzel'; color:#E9E2CF; text-shadow:0 0 6px rgba(255,240,200,.4); }
```

```js
// camera: dolly-in scale 1→1.22 + x -4 %, 4–6 s 'sine.inOut'; rack focus: .bg blur 0→8px & .plate blur 6→0px over 0.8 s
// glint: a 200px-wide white linear-gradient bar (opacity .5, mix-blend screen) sweeps across the text, 0.9 s 'power1.inOut'
// add floating dust particles (40 small blurred dots drifting up 20–40 px/s)
// rule: never animate the letters themselves inside the world; reveal with camera, focus and light only
```

### R12 · Framed-diagram (family tree / network as a picture on the wall)

- Build the diagram flat (portrait cameos with italic serif names, Playfair Display Italic 28px #F4F0E6; black arrows), then apply a sepia/engraving filter (`filter: sepia(.6) contrast(1.1)`) plus a canvas texture overlay.
- Put it in an ornate frame PNG on a wallpaper background.
- Camera slow push 1→1.1 over 5 s, a foreground plant/lamp layer moving 1.5× faster for parallax.

### R13 · Source-book callout

- A real book cover (or our own document) standing on a dark desk at 15–25° yaw, with a framed author photo beside it.
- Run R1 over the same shot. A camera push lands on the cover in 3–5 s.
- No arrows or boxes.

### Timing summary (cheat sheet)

| Element | Enter after cut | In-anim | Hold | Out |
|---|---|---|---|---|
| Lower third | 1.5–2.0 s | 0.5 s slide + blur, expo.out | 3.5 s | 0.25 s blur-fade, ≥1.5 s before cut |
| Speaker tag | ~1.0 s | 0.8 s letter pop, 2-frame stagger | 3.6 s | hard on cut |
| Place / date caption | 0.6–0.8 s (or on the cut) | 0–0.12 s | 2.4–3.3 s (or whole shot) | hard, on the cut |
| Year slam | 0.6 s | none | 3.0 s | hard, on the cut |
| Black card (1 line) | 0.7 s of black first | 0.5–0.7 s fade | 1.7–2.6 s | 0.5 s fade |
| Black card (2 lines) | 0.1 s | 1.2 s fade, line 2 at +2.6 s | ~3.5 s | 1.7 s fade |
| 3D map beat | n/a | whip zoom 0.5–0.8 s | 2–4 s per city | whip zoom / cloud wipe |
| Explainer diagram | on cut | built at once | up to 13 s (only with a moving bg) | cut |

Frequency target for a 40-min film:
- about 8 lower thirds
- 4–5 place/date captions
- about 4 black cards
- 10–14 map beats
- 20+ diegetic-text shots
- 0 charts, 0 subtitles, 0 chapter cards (the reference uses none)

If our own topics need charts, give them the dark-navy light-leak look of R5/R9 so they sit in the same world.
