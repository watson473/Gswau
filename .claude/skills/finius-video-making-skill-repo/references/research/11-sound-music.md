# 11 - Sound design and music (whole film)

Agent 11 of 15. FINAiUS "Empire of Shadows" (39:28). Everything below was **measured** with ffmpeg ebur128 and numpy/scipy
on the film's audio, unless marked **[INFERRED]**. I could not listen to the audio. "Character" of music and SFX comes from
spectral features plus the matching video frames, so it is a listening proxy, not a listening test.

Scripts and intermediate data: `<scratch>/a11/` (s1.py ... s18.py).

## How I measured (read this first)

- **Use the stereo source, not work/audio.wav, for loudness.** `work/audio.wav` is a mono 22.05 kHz downmix and reads
  **-18.4 LUFS**. The real published track (Opus 48 kHz stereo inside `src/video.mp4`, decoded to 48 kHz WAV) reads
  **-15.4 LUFS**. The 3 dB gap is the downmix, not the mix. All loudness numbers below come from the stereo decode.
- **The side channel is a free music detector.** Narration is dead centre: L-R cancels it completely. In 38% of the film
  the whole mix is mono (side below -80 dB), and in the other 62% the side carries a stereo music cue at -30 to -40 dB.
  Mono/stereo switches mark cue changes to the 100 ms. Inside mono stretches I found cue changes from the sub band
  (20-60 Hz, where the voice has almost nothing) and a novelty curve (sub, bass, air bands and side level, 6 s before vs 6 s after).
- Speech timing comes from `src/video.en-orig.vtt` (4,921 words). Chapters come from `src/meta.json` (30 chapters).

## 1. Loudness

| Measure (stereo 48 kHz, ffmpeg ebur128) | Value |
|---|---|
| Integrated loudness | **-15.4 LUFS** (mono downmix: -18.4) |
| Loudness range (LRA) | **3.9 LU** (LRA low -17.9, high -14.1) |
| True peak | **+0.5 dBTP** (sample peak 0.0 dBFS on both channels, so it was limited to 0 dBFS and the Opus decode overshoots) |
| RMS | -18.1 dB L / -18.2 dB R. L/R correlation 0.95. Side energy is 17 dB below mid. |
| Narration short-term level | 100 ms blocks during speech: p75 about -13.5 LUFS, flat across the film (per-minute values -12.8 to -14.8) |

So the film sits at about -15.4 LUFS. YouTube only turns down above -14, so it plays as published. The range is very
narrow: only 4 LU from the first minute to the last.

**Short-term loudness per 30 s window.** Each entry is `start  integrated / max S(3 s) / min S(3 s)  speech %`:
```
00:00 -16.3/-14.3/-25.0 sp62%   00:30 -17.2/-14.6/-30.3 sp29%   01:00 -16.2/-14.6/-18.5 sp100%   
01:30 -15.5/-14.6/-21.0 sp89%   02:00 -15.5/-14.5/-19.8 sp96%   02:30 -15.2/-13.0/-21.8 sp83%   
03:00 -15.0/-13.7/-18.0 sp98%   03:30 -15.4/-14.1/-17.9 sp99%   04:00 -16.1/-14.6/-21.0 sp83%   
04:30 -16.7/-15.2/-29.3 sp75%   05:00 -16.0/-14.4/-25.2 sp92%   05:30 -15.7/-14.4/-17.5 sp99%   
06:00 -15.8/-13.9/-18.0 sp99%   06:30 -14.7/-13.1/-17.8 sp95%   07:00 -16.7/-14.1/-26.7 sp67%   
07:30 -15.6/-13.9/-28.5 sp70%   08:00 -14.4/-13.5/-17.5 sp99%   08:30 -14.3/-13.5/-17.4 sp99%   
09:00 -15.9/-13.1/-24.9 sp86%   09:30 -14.7/-13.5/-16.6 sp96%   10:00 -15.2/-14.0/-23.5 sp92%   
10:30 -15.1/-13.9/-16.3 sp99%   11:00 -15.4/-13.8/-17.7 sp93%   11:30 -17.2/-14.5/-23.6 sp71%   
12:00 -16.2/-14.1/-18.7 sp100%   12:30 -16.1/-14.3/-19.1 sp94%   13:00 -16.1/-14.1/-18.9 sp100%   
13:30 -15.5/-14.2/-19.4 sp95%   14:00 -15.8/-14.2/-18.6 sp98%   14:30 -17.3/-14.7/-21.0 sp63%   
15:00 -14.9/-13.6/-21.9 sp92%   15:30 -16.0/-13.9/-22.7 sp75%   16:00 -15.6/-14.4/-17.9 sp100%   
16:30 -16.1/-14.6/-27.0 sp86%   17:00 -15.8/-13.8/-18.6 sp100%   17:30 -15.0/-13.7/-28.1 sp87%   
18:00 -15.3/-14.2/-21.7 sp85%   18:30 -15.1/-13.5/-17.4 sp100%   19:00 -14.8/-13.5/-17.6 sp98%   
19:30 -14.6/-12.8/-36.1 sp90%   20:00 -14.9/-12.8/-21.8 sp92%   20:30 -15.2/-13.5/-17.8 sp97%   
21:00 -14.6/-13.0/-20.7 sp89%   21:30 -15.4/-14.2/-17.6 sp98%   22:00 -15.4/-14.1/-18.7 sp99%   
22:30 -15.2/-13.8/-31.8 sp78%   23:00 -15.1/-13.9/-18.7 sp89%   23:30 -14.8/-13.2/-27.9 sp76%   
24:00 -14.6/-13.2/-16.4 sp89%   24:30 -15.1/-14.4/-16.6 sp100%   25:00 -14.8/-13.5/-18.1 sp97%   
25:30 -16.2/-14.6/-23.8 sp81%   26:00 -15.2/-13.9/-18.9 sp99%   26:30 -15.4/-14.3/-17.8 sp99%   
27:00 -15.5/-13.9/-28.6 sp90%   27:30 -15.3/-14.2/-18.8 sp99%   28:00 -15.8/-14.1/-24.6 sp85%   
28:30 -14.8/-13.2/-19.9 sp90%   29:00 -15.2/-13.2/-23.2 sp85%   29:30 -15.3/-13.5/-28.4 sp60%   
30:00 -14.7/-13.5/-18.8 sp98%   30:30 -15.4/-14.3/-18.1 sp98%   31:00 -15.4/-14.0/-24.4 sp87%   
31:30 -15.4/-14.0/-20.5 sp96%   32:00 -15.2/-13.6/-18.5 sp82%   32:30 -15.4/-14.2/-22.1 sp91%   
33:00 -15.8/-12.9/-20.2 sp94%   33:30 -14.6/-11.6/-27.2 sp60%   34:00 -16.2/-14.5/-21.8 sp92%   
34:30 -15.6/-13.7/-19.5 sp90%   35:00 -15.3/-13.8/-18.4 sp98%   35:30 -15.1/-13.6/-27.4 sp77%   
36:00 -15.2/-13.7/-18.2 sp97%   36:30 -15.8/-13.5/-23.3 sp70%   37:00 -15.2/-13.7/-16.9 sp87%   
37:30 -15.5/-13.5/-18.6 sp99%   38:00 -15.4/-13.4/-31.3 sp79%   38:30 -15.2/-13.8/-17.7 sp98%   
39:00 -17.0/-14.7/-49.2 sp49%   ```
How to read it: integrated loudness sits between -14.3 and -17.3 in every window. Max short-term is always between
-11.6 and -15.2. Only the minimum moves: it falls to -25 ... -49 exactly in the windows that hold a music breath or a silence
(00:30, 04:30, 07:00-07:30, 19:30, 22:30, 29:30, 33:30, 38:00, 39:00). The loudest window is 33:30, where a WWII music
swell peaks at -11.6.

## 2. Voice

### 2a. Narration level vs music bed (measured)
I used two methods.

**A. Voice peaks vs the bed in the gaps between words**, using the 4 s neighbourhood of every second in speech-dense
passages (mid channel, 100 ms blocks). The 90th percentile is the voice. The 5th percentile is the bed showing through
between words. Across the film the difference is **median 14.4 dB (p25 11.7, p75 17.3)**: voice about -16.1, bed about -30.6
(mid-channel scale). Sample windows (voice p90 / bed floor / difference, dB):

| t | voice | bed | diff | t | voice | bed | diff |
|---|---|---|---|---|---|---|---|
| 01:20 | -16.7 | -28.9 | 12.2 | 21:00 | -15.2 | -29.5 | 13.7 |
| 02:20 | -15.7 | -32.6 | 16.9 | 24:00 | -14.9 | -23.8 | 11.1 (loud low cue) |
| 05:40 | -16.7 | -32.2 | 15.5 | 26:40 | -16.0 | -31.8 | 15.8 |
| 06:40 | -15.5 | -31.3 | 15.8 | 30:00 | -16.2 | -33.0 | 16.8 |
| 09:20 | -16.2 | -27.1 | 10.9 | 33:40 | -14.0 | -26.0 | 12.0 (WWII swell) |
| 13:00 | -15.9 | -29.5 | 13.6 | 36:20 | -14.9 | -30.5 | 15.6 |
| 17:00 | -16.7 | -32.3 | 15.6 | 38:20 | -16.3 | -37.7 | 21.4 (quiet outro bed) |

**B. Music heard alone in breaths of 2 s or more** (37 gaps with no words). Stereo 100 ms median during the gap, compared
with the narration p75 over the 10 s before. Music alone has a **median of -23.4 LUFS vs narration -13.6, i.e. 10 dB
lower** (range -1.3 to -19 dB). The music is not pushed up in the breaths. It just becomes audible. Swells close to
narration level (-1 to -4 dB) happen only on big beats: 14:45 profits soar, 24:18 American titans, 28:58, 32:05 WWII
erupts, 34:46 Maxwell chapter, 37:02 Maxwell's death.

**Ducking (measured on the side channel, which holds music only):** music level while he speaks vs in non-speech blocks
of the same cue: intro -7.0 dB, 04:56 cue -3.1, 37:06 cue +6.8, every other cue within ±3 dB, **median about 0 dB**.
**He does not sidechain-duck.** The bed is mixed statically about 14 dB under the voice. It feels as if it "breathes" only
because the voice stops. The exception is the cold open, where the music is ducked about 7 dB under the opening lines.

### 2b. Pace
- **Overall 126 wpm** (4,921 words / 2,351 s of span). **139 wpm** once detected pauses are removed. The median interval
  between word starts is **0.32 s**.
- Per minute: 58 (intro) and then 93-158. Typical minutes are 110-150.
- Per chapter (words / seconds / wpm):

| Chapter | wpm | Chapter | wpm |
|---|---|---|---|
| 00:00 Introduction (music-led) | 49 | 19:41 Rise of Morgan | 130 |
| 00:50 Unlikely Origin | 132 | 20:21 Franco-Prussian War | 131 |
| 02:33 Becoming a Bank | 143 | 23:00 France Falls | 114 |
| 04:00 Rise of Great Britain | 105 | 23:40 Rothschilds Face Decline | 111 |
| 05:02 Nathan Arrives in London | 146 | 24:35 Industrial Titans | 131 |
| 07:02 Death of Mayer | 104 | 26:01 Panic of 1893 | 137 |
| 07:48 Wars in Europe | 140 | 27:16 Bailing Out the Fed | 130 |
| 10:24 Banking Network | 119 | 28:24 Road to War | 115 |
| 11:46 Death of Nathan | 139 | 30:01 World War I | 134 |
| 13:17 James Takes Command | 122 | 31:21 Decline | 122 |
| 13:52 Railroads | 113 | 32:25 WWII & Nazi Seizure | 112 |
| 15:01 Income Disparity | 115 | 33:55 Rebuilding in London | 121 |
| 15:53 French Bank Collapses | 140 | 34:49 Financing Maxwell | 118 |
| 16:51 Lionel Enters Govt (incl. sponsor) | 137 | 35:52 Power Struggle | 115 |
| | | 37:14 Death of Maxwell | 113 |
| | | 38:14 Legacy Today | 98 |

  Pattern: rise, war and money chapters run at 130-146. Death, decline and legacy chapters run at 98-115. The film slows down over its
  second half (the first 12 min average about 133, the last 12 min about 115).

### 2c. Pauses (measured)
- **Inside a sentence (line breaks):** longest low-energy run is median **0.19 s** (p75 0.42, p90 0.67).
- **Between sentences:** median **0.33 s** (p25 0.12, p75 0.64, p90 1.02).
- **Across chapter boundaries** (start of last word before → first word after): **bimodal**.
  About 10 of 29 chapters run straight on (1.0-1.3 s start to start, so about 0.4-0.6 s of silence: the chapter card sits on
  continuous narration). The rest have a 1.6-9.2 s music breath. The long ones (5.2, 5.3, 8.8, 9.2, 8.0 s) all fall in the
  first 12 minutes; later ones are 2-5 s. Overall median is about 2.1 s.

### 2d. Voice: human or AI, and the treatment
- **[STATED]** (notes/website.md) he sometimes renders the narration through an ElevenLabs clone of his own voice.
- **[MEASURED]** The narration is extremely uniform. Over 400 ms windows, speech loudness spreads only **2.9-3.2 dB
  (p10-p90)**, where a natural uncompressed read is typically 6-8 dB. Per-minute narration level stays within ±1 dB for
  39 minutes. Timbre (4-8 kHz/1-2 kHz ratio) is stable at -3 to +3 dB across the film. **[INFERRED]** This fits either an
  ElevenLabs render or a heavily compressed human read. The audio alone can't tell them apart. There's nothing that shows
  separate recording sessions, like changes in room or mic.
- **Tone** (LTAS of narration over low-bed stretches, dB relative to the 1 kHz octave): 125 Hz +11.6, 250 +12.3, 500 +8.2,
  1k 0, 2k -6.6, 4k -11.4, 8k -15.0, 12k -26.9, 16k -37.4. Below 300 Hz the narration sits about **+10 dB vs 1-2 kHz**:
  a warm, close-mic, chesty voice. The top end is normal to slightly bright up to 8 kHz and **rolls off steeply above
  10-12 kHz** (similar to TTS or a lowpass; the codec passes 20 kHz). No de-essing artefacts were measured.
- **Room/reverb:** **[INFERRED]** dry. The voice fully cancels in L-R, so there is no stereo reverb on it. The 20 dB fall time
  after peaks is 150-280 ms, but the bed limits that measurement. No audible room tone: in the true silences the level
  drops to -72 ... -120 LUFS, which is digital black.
- **Other voices:** interview and archive clips (03:33, 08:31, 29:48 "Look at Serbia...", 35:14, 37:24) are
  **matched to narration within ±1 dB** (-12.8 to -14.4 vs -13.3 to -14.3 LUFS p75). They are thinner (+4 to +6 dB below 300 Hz,
  where narration has +10). First-person quotes from the historical figure (05:54, 09:44) are read in the narrator's voice
  with no filter. One of them (09:44-10:11) is darker (4-8 kHz -11 dB vs 1-2k), which may be a light EQ "quote" treatment **[INFERRED]**.

## 3. Music cues

Global facts (measured):
- **About 32 cue segments in 39:28, median length about 57 s** (range 6-234 s). Mix format alternates: **stereo-wide cues
  62% of runtime, mono cues 38%**. The mono/stereo switch is itself the cue change.
- **Tonality:** every cue is tonal and sustained (spectral flatness 0.000-0.035) with slow onsets (0.65-2.2 onsets/s).
  The beat is mostly too weak to detect (autocorrelation < 0.15). **Pitch-class profile** almost always A#/C#/F#/E,
  i.e. **Bb minor / Db-C# minor family** across the whole film. One "key" is held for 39 minutes and the colour changes by
  register and texture.
- Two texture families **[INFERRED from spectrum]**:
  (a) **low drone / low strings / sub pulse** (centroid 85-200 Hz, >70% energy below 200 Hz): intro, 08:50, 11:48,
  22:39, 23:33, 34:49, 37:06, 38:46-end;
  (b) **mid-register strings / piano / pads** (centroid 300-650 Hz, 20-45% below 200 Hz): 00:54, 04:56, 16:35, 20:13,
  25:46, 29:28, 32:08.
- **72% of chapter boundaries (21 of 29) have a cue change within ±10 s**, and 26/29 within ±22 s. Cue changes also land on
  story beats inside chapters (Waterloo 08:50, German victory 22:39, Sarajevo 29:28).

### Cue list (start-end, source of boundary, character, entry/exit, beat)

| # | Time | Len | Mix | Character [INFERRED from spectrum] | Tempo | Entry / exit (measured) | Chapter / beat |
|---|---|---|---|---|---|---|---|
| 1 | 00:00-00:06 | 6 s | stereo | sub-heavy low drone hit (centroid 160 Hz), under first lines | - | starts at frame 0 | cold open |
| 2 | 00:06-00:14 | 8 s | stereo | thinned (sub drops 23 dB), lighter | - | dip under voice | intro lines |
| 3 | 00:14-00:43 | 29 s | stereo | **full swell**: sub +34 dB, air +5 dB, wide; the title-music bed | - | builds over 00:14, music alone 00:20-00:49 at -19.4 LUFS | title sequence |
| 4 | 00:43-00:54 | 11 s | stereo | tail, decays; **digital silence 00:44.7-00:46.4 (1.7 s)** | - | 3.6 s fade-out to 00:54.1 | chapter 1 line "unlikely origin" lands after silence |
| 5 | 00:54-04:03 | 189 s | mono | mid-register, light, ~20% low energy (piano/pizzicato-type) | ~80? (weak) | starts after the silence under the first story line | Frankfurt ghetto origin |
| 6 | 04:03-04:56 | 53 s | mono (side -53) | similar, quieter | - | change at ch 04:00 (+3 s) | Rise of Britain |
| 7 | 04:56-08:50 | 234 s | **stereo** | mid strings/pads, centroid 420 Hz | ~100 (weak) | **2.8 s fade-in** starting 04:53.5 in an 8 s music breath | Nathan in London (ch 05:02, -6 s) |
| 8 | 08:50-11:48 | 178 s | stereo | **low/dark**: sub +19 dB, 71% below 200 Hz | 51 (conf 0.17) | change on cut (+80 ms) | Waterloo / "Wellington wins" |
| 9 | 11:48-14:53 | 185 s | mono | low drone, 75% below 200 Hz | - | stereo exits with 0.9 s fade at 11:48.3; 7 s breath before | Death of Nathan (ch +2 s) |
| 10 | 14:53-15:45 | 52 s | mono | mid-register | - | 10 s music-led breath 14:45-14:55 (-4 dB swell) | profits soar / hostility |
| 11 | 15:45-16:35 | 50 s | mono-ish | lighter, high air | - | 7.7 s breath | French bank collapses |
| 12 | 16:35-17:41 | 66 s | stereo | mid strings, A-C#-E pitch profile (A major / F# minor colour; brighter than the Bb-minor cues) | - | **0.73 s fade-in** | Lionel enters government (ch -16 s) |
| 13 | 17:41-18:04 | 23 s | mono | low | - | 1.1 s fade-out | transition into ad |
| 14 | 18:04-19:40 | 96 s | stereo | **sponsor bed: rhythmic, sub-heavy, most percussive (2.15 onsets/s)** | **~122 (conf 0.19)** | 1.2 s dip (-47) before; 1.95 s fade-in | sponsor read |
| - | 19:38.8-19:41.6 | 2.8 s | - | **digital silence (-72)** | | 3.9 s fade-out into it | then ch "Rise of Morgan" |
| 15 | 19:40-20:12 | 32 s | mono | sub-heavy | - | | Morgan intro |
| 16 | 20:13-22:39 | 146 s | stereo | mid strings | ~107 (weak) | **hard start on a cut (-20 ms), 60 ms rise** | Franco-Prussian War (ch -8 s) |
| - | 22:34.6-22:39.5 | 4.9 s | - | **near-silence (-40...-50 LUFS)** | | | then "decisive German victory" |
| 17 | 22:39-23:33 | 54 s | stereo | **lowest, darkest: centroid 89 Hz, 95% below 200 Hz**, strongest beat | **103 (conf 0.27)** | hard entry after the silence | German victory → France falls |
| 18 | 23:33-25:46 | 133 s | stereo, widest (side -29) | low, dense | ~92 | **hard start, 0 ms** at 23:30 (1.4 s before cut) | Rothschilds face decline / American titans |
| 19 | 25:46-27:14 | 88 s | stereo | mid strings | - | **hard start (30 ms)** | Panic of 1893 (-15 s) |
| 20 | 27:14-29:04 | 110 s | mono | low-mid | - | stereo exits with 0.9 s fade at 27:17 | Bailing out the Fed (-2 s) |
| 21 | 29:04-29:28 | 24 s | mono | mid | - | | Road to war |
| 22 | 29:28-31:14 | 106 s | stereo | mid strings/pads | - | 0.4 s fade-in at 29:28; **13.5 s music-led gap 29:25-29:39 with gunshot at 29:35.9** | Sarajevo assassination, WWI |
| 23 | 31:14-32:08 | 54 s | mono | low-mid, the most regular pulse | 158/≈79 (conf 0.32) | 2.1 s fade-out of previous | Decline of the dynasty (-7 s) |
| 24 | 32:08-33:51 | 104 s | stereo | mid, building; **loudest swell of the film 33:30 (S max -11.6)** | - | **hard start on cut (+10 ms), 130 ms rise** on "biggest war in human history" | WWII |
| 25 | 33:51-34:48 | 57 s | mono | mid | 75 (conf 0.17) | 5.4 s fade-out of previous | Rebuilding in London (-3 s) |
| 26 | 34:48-35:48 | 59 s | stereo | low, 73% below 200 Hz | - | 1.1 s fade-in | Financing Maxwell (-0.3 s) |
| - | 35:42-35:47 | ~2 s | - | **dip to -45/-49** | | | then "trouble is brewing" |
| 27 | 35:48-37:06 | 78 s | mono | low | - | | Power struggle (-4 s) |
| 28 | 37:06-38:12 | 66 s | stereo | low | - | 0.9 s fade-in | Death of Maxwell (-8 s) |
| - | 38:09.6-38:11.6 | 2.0 s | - | **dip to -41.6** | | | then the Legacy chapter |
| 29 | 38:12-38:46 | 34 s | stereo | mid | - | | Legacy today |
| 30 | 38:46-39:04 | 18 s | stereo | low, strongest single pitch (C#, 0.50) | ~75 (conf 0.28) | | closing statement |
| 31 | 39:04-39:28 | 24 s | stereo | low | - | ends in 2.5 s silence 39:25.8 | outro |

Entry and exit rules taken from the measurements:
- **Entries:** 4 of 10 stereo entries are **hard starts (0-130 ms rise), and 3 of those sit on a cut (-20 ms, +10 ms) or
  on a hard-hitting line**. All 4 are escalation or war beats: Franco-Prussian War, decline, Panic of 1893, WWII. The other
  6 fade in over **0.4-2.8 s (median about 1 s)**, usually inside a music breath.
- **Exits:** 0.9-5.4 s fades (median about 1.8 s). The longest (3.6, 3.9, 5.4 s) close out the title sequence, the sponsor
  and WWII. Mono→stereo swaps are often a crossfade, with the old cue fading under the new one.
- **No stingers measured.** There are no isolated short music hits at reveals. Emphasis comes from **swells in breaths**
  (music alone at -1 to -4 dB vs narration) and from **silence**.

## 4. SFX

Method: spectral-flux peaks (STFT 2048/512 at 22.05 kHz) in the top 0.7% after removing slow trends: 701 candidates.
Removing peaks within 120 ms of a word start leaves 266. Keeping only strong broadband events (total level +5 dB or sub
band +14 dB vs the previous 0.9 s) leaves **38 candidates = 0.96/min (upper bound)**. I checked the frames for 20 of them.

Confirmed classes (frame-checked; all are **"hear what you see" diegetic sounds**, none are design sounds):

| t | Duration | Event | vs narration peak | Offset to nearest cut |
|---|---|---|---|---|
| 02:00.3, 02:13.8 | ~90 ms | coin/metal clicks (gold-coin story, diagram) | -1 dB | +1.8 s, +5.8 s |
| 05:19.7 | **1.25 s** | **coins spilling on a table** (sub +15, air +51 dB) | 0 dB | +966 ms |
| 07:52.7 | **4.0 s** | **cannon fire** (sub +33 dB), in a music breath, chapter "Wars in Europe" | ≈ narration | **-38 ms** |
| 11:14.6 / 11:19.4 | 140-370 ms | horses and pigeon wings (film shots) | -1 dB | +1.2 s / -1.4 s |
| 13:06.7 | 1.0 s | crowd/film audio | 0 dB | +781 ms |
| 17:34.1 | 90 ms | hit on a bible close-up (thud) | -1 dB | +5.0 s |
| 20:40.4 | **4.6 s** | **battle/cannon ambience** under a war painting | -1 dB | +114 ms |
| 24:53.9 | 1.1 s | steamship (horn/engine) | 0 dB | +898 ms |
| 29:35.9-29:36.4 | 0.4 + 0.8 s | **gunshot (Sarajevo film clip)** in a 13.5 s music-led gap | -2 dB | +159 / -63 ms |
| 28:46.4 | 190 ms | archive film sound (WWI generals) | -0.5 dB | +862 ms |
| 32:29.2 | 255 ms | aircraft/paratroopers | -0.4 dB | -926 ms |
| 35:55.6 | short | gold-bar clink (3D room) | 0 dB | -1.1 s |

- **Level:** SFX peak at **0 to -4 dB vs the narration peaks** (100 ms momentary -14.4 to -21.3 vs narration p90 -15.3 to -17.5).
  The big ones (cannon, battle, gunshot, coins) sit at narration level and **almost always fall in a music breath**, not under speech.
- **Not cut-locked (measured):** of the 266 non-speech transients, **15 fall within 150 ms of a cut, against 16.3 expected
  by chance**. Cut-locked band jumps match random times: air band median +6.2 dB on cuts vs +9.5 random; sub band +3.3 vs
  +3.3. With 483 cuts, **there are no whooshes, swishes or impacts on transitions**. SFX sync to the **action inside the
  shot** (a cannon firing, a gun firing, coins landing), and only line up with a cut when the action starts on the cut
  (cannon -38 ms, gunshot -63 ms).
- **Not found:** risers before reveals (pre-event slopes stay between -9 and +7 dB/s, none sustained), typewriter, paper
  or page sounds on documents, cash-register sounds. War chapters get one long diegetic battle bed (4-5 s), not a
  continuous ambience.
- **Rate:** about 12-15 clearly identifiable SFX in 39.5 min = **0.3-0.4 per minute**, clustered in war and money scenes.

## 5. Silences and music drop-outs

| t | Length | Depth | Then |
|---|---|---|---|
| 00:44.7 | **1.7 s** | -75 LUFS (digital black) | first story line of chapter 1 (cold open → story) |
| 18:04.7 | 1.2 s | -47 | sponsor bridge line begins |
| 19:38.8 | **2.8 s** | -72 (black) | "Rise of Morgan" chapter: a new protagonist arrives |
| 22:34.6-22:39.5 | **~4.9 s** (core 1.0 s at -50) | -40...-50 | verdict line "the war resulted in a decisive German victory" + darkest cue starts |
| 35:42-35:47 | ~2 s | -45/-49 | "but trouble is brewing inside N.M. Rothschild" (chapter turn) |
| 38:09.6 | 2.0 s | -41.6 | final chapter "Legacy Today" |
| 39:25.8 | 2.5 s | black | end |

Music-led breaths of 7 s or more where narration stops and the music carries: 00:20-00:49 (28.6 s, title), 04:54 (8.1 s),
07:05 (10.1 s), 07:47 (8.5 s, cannon), 11:38 (7.3 s), 14:45 (10.2 s), 15:41 (7.7 s), 23:28 (7.4 s), 29:25 (13.5 s,
gunshot), 33:39 (11.2 s, WWII swell), 36:45 (8.7 s). That is **11 long breaths, about one every 3.5 min**, in line with his
"turn every 2-3 min" rule. Each one comes just before a turn.

Rule: **only 3 true black silences in 39 min (1.7, 2.8, about 1 s core), plus 3 deep dips.** Each comes right before a
chapter opening or a verdict line, and the line after it is spoken almost dry with the new cue.

## 6. Recipes for our stack (HyperFrames + OmniVoice "Renee" + SFX library + licensed beds + ffmpeg)

### 6a. Master targets
- **Integrated -15.0 LUFS ±0.5 (stereo), LRA 3-5 LU, true peak ≤ -1.0 dBTP.** His +0.5 dBTP is a flaw; don't copy it.
- Narration short-term while speaking: **-13.5 ±1 LUFS** (stereo, 100 ms p75), flat for the whole film.
- Two-pass ffmpeg loudnorm on the final mix: `loudnorm=I=-15:TP=-1.0:LRA=5:measured_I=...:linear=true`.

### 6b. Voice chain (Renee TTS stem; the stem alone should land around -16 LUFS integrated)
1. `highpass=f=70:poles=2`
2. EQ for a warm, close voice like his (+10 dB below 300 Hz vs 1-2 kHz): `equalizer=f=140:t=q:w=0.8:g=2`,
   `equalizer=f=350:t=q:w=1.2:g=-2` (remove mud), `equalizer=f=4500:t=q:w=1:g=1.5` (presence), then `lowpass=f=13000`.
3. Compression to his 3 dB density: `acompressor=threshold=-24dB:ratio=3:attack=8:release=120:makeup=4`, then
   `alimiter=limit=-3dB:attack=3:release=50`. Check: 400 ms momentary p10-p90 over speech should be **3 ±0.5 dB**.
4. **Dry.** No reverb, no stereo width. Pan the voice dead centre in mono.
5. Archive or interview inserts: match them to narration within ±1 dB of short-term loudness, keep their thinner EQ, no extra treatment.
6. Pace: aim for **125-135 wpm gross (about 140 net)**. Set TTS speed per chapter: rise, war and money chapters 135-145; deaths,
   decline and endings 100-115. Let the film slow down by about 15% over its second half.
7. Pauses when assembling TTS lines: inside a sentence **0.15-0.25 s**, between sentences **0.30-0.40 s** (now and then 0.6-1.0 s
   before a key line), across chapters **either 0.4-0.6 s (seamless, about a third of chapters) or a 2-5 s music breath**
   (8-9 s allowed in the first 12 min).

### 6c. Music bed
- **Static level 14 dB under the voice** (accept 12-17). In stereo LUFS terms the bed is about **-28 to -30 LUFS short-term**
  under narration. With no voice, the bed reads about **-23 LUFS**, which is 10 dB under narration.
- **No pumping sidechain.** If you want safety ducking, keep it to a gentle 2-3 dB:
  `[music][voice]sidechaincompress=threshold=0.03:ratio=2.5:attack=80:release=700:makeup=1`. Exception: the cold open,
  where the bed should duck **7 dB** under the first sentences and then swell when the title appears.
- Swell in breaths: on 11-15 chosen breaths of 7 s or more per 40 min, automate the music **+6 to +9 dB over 400-800 ms** so it
  plays at **-1 to -4 dB vs narration** (the title sequence, the war-starts beat, the loudest peak around 85% through the film,
  S max -11.6). Pull it back down over 600-1000 ms just before the next line.
- **Change cues about every 60 s** (median 57 s, range 20-240 s). Put **at least 70% of changes within ±10 s of a chapter
  card**, and the rest on in-chapter turns. Alternate textures: **wide stereo bed ↔ narrow/mono, darker bed** (about 60/40 of
  runtime). For mono cues in our mix, use `pan=stereo|c0=0.5*c0+0.5*c1|c1=0.5*c0+0.5*c1`, or simply narrow them to 30% width.
- **One tonal family for the whole film** (pick one minor key, e.g. Bb minor or C# minor, and license cues in it or in its
  relative keys). Vary register: low drone/sub cues for doom, war and death; mid strings/piano for rise and scheming;
  a brighter A-C#-E cue family for moments of ambition and triumph (his 16:35, 20:13, 25:46).
- **Entries:** escalation and war beats get a **hard start on the cut (within ±20 ms), full level within 130 ms**, and
  the line follows within 0.5 s. Every other entry fades in over **1.0 s (0.4-2.8 s)** and starts in a breath.
- **Exits:** fade out over **1.5-2 s** by default. Fade out over **3.5-5.5 s** after the title sequence, after the sponsor
  and at the end of the biggest act. Hard-cut to silence only for the 3 planned silences (see 6e).
- **No stings** at all. Emphasis comes from swells and silence.
- Sponsor segment: its own **upbeat bed of about 120 BPM**, at the same 14 dB under the voice. Come in after a 1.2 s dip
  and go out into a **2.8 s full silence**, then a new chapter.

### 6d. SFX
- **0.3-0.4 per minute, diegetic only.** Use one only when the image shows a sound source: a cannon, a gun, coins, horses,
  a ship, a crowd, an aircraft. Sync it to the **action inside the shot**, not to the cut. When the action starts on a
  cut, place the hit **0-60 ms before the cut** (his values were -38 and -63 ms).
- Levels: short hits (coins, clinks, thuds, 90-400 ms) at **-1 to -3 dB under narration peaks**. Long events (cannon,
  battle bed, coin spill, gunshot; 1-4.6 s) at **narration level (0 dB)**, placed **in a music breath of 7 s or more**,
  never under a spoken sentence.
- **Never** put whooshes on cuts, risers before reveals, typewriter, paper or cash sounds. He uses none (measured over 483 cuts).
  If our HyperFrames cards need motion sound, keep it under -20 dB vs narration so it stays below what can be measured
  as a hit.

### 6e. Silence plan per 40 min
- **3 full silences** (below -60 dB, music cut and fade tails removed): **1.7 s** after the title sequence before the first
  story line, **2.8 s** between the sponsor and the next chapter, and **about 1 s core inside a 5 s music dip** right before the
  act's verdict line, which then lands dry and the darkest cue starts with it.
- **3 dips** to -40...-50 LUFS for 1-2 s, before late chapter turns (the last one before the final chapter).
- End: 2.5 s of black audio.

### 6f. Music cue types to license (story phase → mood)
| Phase (his film's time) | Cue type | Notes |
|---|---|---|
| Cold open / title (0-0:54) | low sub hit plus a dark orchestral swell, wide | 50-60 s, must be able to sit 7 dB under voice and then swell to -19 LUFS |
| Humble origins (1-4 min) | light mid-register piano/pizzicato, mono-friendly, sparse | 3-min loopable |
| Rise and scheming (5-8, 20-22, 25-27 min) | mid strings/pads, minor, steady, slow pulse ~100 BPM | wide stereo; 2-4 min each |
| War / Waterloo / escalation (8:50, 22:39, 32:08) | low, dark, percussive undercurrent, 100-105 BPM, very little above 200 Hz | needs a clean hard downbeat for a start on a cut |
| Death / loss (7, 11:48, 37 min) | low drone, sustained, almost no transients | 1-3 min |
| Decline / tension (23:33-25:46, 31:14) | dense low bed, slow regular pulse (~80 BPM) | |
| Ambition / triumph (16:35, 20:13, 25:46) | brighter A-major / F#-minor strings cue | 1-2.5 min |
| Sponsor | neutral upbeat modern bed, ~120 BPM | 90-100 s |
| Legacy / closing (38:12-end) | quiet low bed that resolves on one sustained pitch, then a 2.5 s fade | 1-1.5 min |

Budget: **about 30 cue segments per 40 min**, which can come from **12-15 licensed tracks** reused in segments. He visibly reuses
textures: the Bb/C# pitch profile repeats, and the 16:35, 20:13 and 25:46 cues share the same A-C#-E profile.

## Measured vs inferred
- **Measured:** all loudness, LRA, TP, per-30 s table, voice/bed dB differences, ducking (side channel), wpm, pause lengths,
  cue boundaries (side channel and novelty), fade lengths, cut offsets, pitch-class profiles, onset rates, SFX counts,
  levels and cut statistics, silences.
- **Inferred:** instrument names (drone/strings/piano) from spectra; whether the voice is human or AI; reverb (judged dry);
  the class of each SFX from the matching frame, not from listening. Tempo is reported only where autocorrelation confidence
  is ≥ 0.15; everywhere else the beat was too weak to measure.
