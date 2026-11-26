# FINAiUS: how the documentaries are produced (research notes)

Researched 2026-11-25. Read-only. Nothing was signed up for, bought, or logged into.

Labels used below:
- **[STATED]**: the creator said or wrote it (source linked).
- **[OBSERVED]**: I saw it on a public page, in video metadata or in storyboard frames.
- **[INFERENCE]**: my reading of the evidence, not confirmed by him.
- **[THIRD-PARTY]**: someone else's claim, not verified.

Creator: **Rocky Xu**. He grew up in China, came to the US at 18, has an econ/business degree and an MBA, and started the channel in May 2020. The name comes from a 2017 fintech startup, "Financial AI US". [STATED: Produced By interview, https://www.youtube.com/watch?v=9O1MRukoq3Y, 0:17-2:16 and 8:40]

---

## 1. The "resources" page (tools list)

- `https://fcm.finaius.com/resources` returns a **302 redirect to a Patreon post**: `https://www.patreon.com/posts/software-gear-ai-134568124`. The slug suggests a title like "Software, Gear, AI ...". [OBSERVED]
- **I could not read that post.** WebFetch got HTTP 403, and the in-app browser blocks patreon.com. A direct request to the Patreon API was also blocked on my side. **So the actual list of tools on that page is still unknown.** The user can open it in their own browser. It may be patron-only.
- The link only appears in some descriptions. For example, "Empire of Shadows" (Rothschild, https://www.youtube.com/watch?v=IbWl40xgw0A) has the line "📦 Every Tools and Resources I Use to Create This Documentary - 👉 https://fcm.finaius.com/resources". The recent 2026 uploads don't include it. [OBSERVED]
- Another Patreon post is linked from the Saudi Arabia video (https://www.youtube.com/watch?v=BW3Ld3VCqqc): `https://www.patreon.com/posts/everything-i-in-106108560` ("everything I [use?] in ..."). It was also unreadable, for the same reason. [OBSERVED]
- `fcm.finaius.com` is his redirect/short-link domain. It also carries `/old-money`, `/cm` and `/signup`. [OBSERVED]

### Tools he named himself (from interviews, since the resources page was unreadable)
Source: 1of10 Podcast, "I Make $50k/Month with YouTube Faceless", Aug 2025, https://www.youtube.com/watch?v=hOGzEJGeF1k. The "AI Tools" chapter starts at 25:18.

| Tool | Category | What he says he uses it for | Status |
|---|---|---|---|
| **DaVinci Resolve** | Editing (NLE) | "I mostly use DaVinci Resolve for editing because it has a pretty good AI component built into it" (25:22) | [STATED] |
| **"Clean AI"** in the auto-transcript, almost certainly **Kling AI** | AI video generation | "For video generations I use [Kling]" (25:30). He uses more AI video and less 3D because 3D is slow (15:26) | [STATED]; reading the name as Kling is [INFERENCE] |
| **ElevenLabs** | Voice / narration | "Sometimes I have my narration produced, not all the time". He describes ElevenLabs generating narration from his own voice (a voice clone) and says it is "pretty good for narrations" (25:33-25:50) | [STATED] |
| **Unreal Engine** (3D) | 3D scenes / B-roll | Mainly for showing photos as "photo frames" inside a 3D scene, so an image has depth rather than sitting flat on screen. Also puts news-article text on a "detective board in a very dimly lit room" (26:38-28:03). Interviewer mentions a Patreon post of his about Unreal. | [STATED] |
| **Blender** | 3D | Mentioned as learnable in "two weeks" of tutorials. Not clearly his own tool. | [STATED] as advice |
| AI writing assistant (unnamed) | Script | He writes "really rough drafts", structures everything himself, and has AI "transform the sentence to a complete one". He does **not** let AI design the story (14:55-15:19) | [STATED]; the tool isn't named |
| Self-built tool | B-roll extraction | "I'm building a tool just for myself to extract a lot of B-rolls from films" (15:37) | [STATED] |
| Deepfake / face-swap (2020) | AI visuals | Early videos used face-swap on film footage to put the subject's face into movie scenes. The Bill Ackman video that first took off did this (7:03, 11:43) | [STATED] |
| Google Trends + YouTube Community polls | Topic research | He ranks candidate topics by audience poll and by Google Trends traffic, and picks topics that place top two in both. He now relies mostly on intuition: "big topics" (1:50-3:25) | [STATED] |

**Music:** older descriptions (Jamie Dimon, Saudi Arabia) include "🎶 Music from the video -" linking a Spotify **artist page titled "Finaius"**: https://open.spotify.com/artist/5dzPVAUf41IpdTu7JKP79X. [OBSERVED] **[INFERENCE]** At least some of the score is published under his own artist name, either commissioned or self-made/AI-made. Which library or tool produces it is unknown. I found no Epidemic Sound or Artlist credit.

**Affiliate / sponsor links seen in descriptions** [OBSERVED]. These are revenue links, not production tools:
- Amazon Associates: `tag=finaius-20` in the old-money redirect, plus amzn.to links for source books.
- Brilliant (brilliant.org/finaius), Masterworks, Sintra.ai, Privacy.com, Incogni, Abacus AI (agent.abacus.ai/fis), Outskill (links.outskill.com/FINAOCT4), Trench (trench.to/FINAIUS20), MenthorQ (`?aff=10025`), and `fxo.co/IyIZ` (a dress-shirt affiliate).

---

## 2. Workflow (research → script → voice → visuals → edit → thumbnail)

All [STATED] by Rocky unless marked.

- **Topic choice.** Big, well-known names (Rothschild, Bank of America, Saudi Arabia) have "inherent traffic". He makes the best documentary on that topic, framed through its finance or economic history. Earlier he used audience polls and Google Trends. He won't pick an idea unless he can already picture the title and thumbnail. [1of10 1:50-3:25 and 29:21-30:46; Produced By 38:33-39:51 and 42:19-43:22]
- **Research and writing.** "About two weeks to write it". Writing "takes a lot of reading". Each video description lists source books (Amazon links), e.g. *The House of Morgan*, *Last Man Standing*, *The House of Dimon*, *Saudi, Inc.*, *The House of Rothschild*. The Renaissance video says it draws on "Senate testimony, court filings and insiders' own accounts". [1of10 3:34-4:10; descriptions OBSERVED]
- **Script method.** He reverse-engineered History Channel and Bloomberg documentaries by transcribing every line, then labelling each beat (narrator on childhood, event stated, then a talking head to explain it). From that he built a **checklist**. A video is good if it hits about 80% of the checklist. Items he named:
  - a turn, reveal or twist every 2-3 minutes (he also says "every minute there must be a turn");
  - focus on characters and their conflicts, not the dry finance;
  - **"never a static scene for more than four seconds"**;
  - write sentences that build suspense by showing the subject's possible failure;
  - talking heads deliver facts and reactions;
  - chain storylines into an up-and-down arc;
  - "the story should be good enough that even with static images it is worth watching".
  [1of10 4:10-5:28, 7:45, 30:46-31:20; Produced By 34:55-35:37, 52:40-53:52]
- **AI in writing.** Rough draft, then AI polishes the sentences. AI does not structure the story. [1of10 14:55]
- **Voice.** Narration is his own voice, sometimes produced through ElevenLabs from his own voice. [1of10 25:33] **[INFERENCE]** It's a single narrator throughout, in his own voice or a clone of it.
- **Visuals and editing.** An editor who is a "3D guy" (his high-school classmate). Rocky marks the script lines that need 3D scenes and does "most of the edit myself". They work in parallel for about two more weeks. In the 2024 interview: "I write, research and write a script, send it to him … then take his raw edit and do my own final revision." [1of10 3:34-3:56; Produced By 40:14-40:52]
- **B-roll sourcing.** Short clips from feature films ("a few seconds here and there") instead of stock libraries, which he distrusts because of copyright claims. BBC footage is the one source that gets him claimed. [STATED, 1of10 15:55-17:07. This is his own opinion on copyright risk, not legal guidance.]
- **Thumbnails.** He makes them himself and studies Netflix and movie posters. His rules: an expressive face, eyes that look "slightly uncanny" (he recolours the eyes), high colour contrast (bright foreground on a dark background), people rather than abstractions, and text that complements the title instead of repeating it. [Produced By 41:01-42:12]
- **Titles.** "Something extreme": biggest, most powerful, mysterious, secret, untold. He avoids "evil". [Produced By 42:39-43:31]
- **Time per video and cadence.** Early on, one video every 7-10 days. In 2024, about two months per video, aiming for every 3-4 weeks. In 2025, "about a month to make a video", one per month, up from one every two months. [Produced By 35:51-36:37; 1of10 3:56, 14:46]
- **Solo vs team.** A description says "I research, write, and produce these documentaries solo" (IbWl40xgw0A). In interviews: "doing everything alone except for that editor". He also has a sponsorship agent (since 2021). [1of10 13:42 and 18:04]
- **Length.** He makes every video about an hour long, partly out of an "irrational fear" of the average-view-duration warning. He sees length as a signal of quality for big topics. [1of10 12:28-13:26]
- **Ads.** He puts only 2-3 mid-rolls in an hour-long video. He reported an RPM of about $7-10, sponsorships of about $7-15k per video, and a best month of about $50k. [1of10 18:28-18:56]
- **Influences.** MelodySheep (3D documentaries; the reason he uses 3D), Johnny Harris, History Channel, MrBeast (for engagement). [Produced By 43:38-44:55; 1of10 31:36]

---

## 3. Courses, interviews and other material about his process

| Source | What it gives | Access |
|---|---|---|
| 1of10 Podcast, "I Make $50k/Month with YouTube Faceless" (33:00), https://www.youtube.com/watch?v=hOGzEJGeF1k | The best source: tools, workflow, checklist, Unreal method, revenue | Read via the YouTube transcript |
| Produced By with Tommen, "Mastermind Behind The Best Documentaries on YouTube \| @Finaius" (1:10:21), https://www.youtube.com/watch?v=9O1MRukoq3Y | Bio, production workflow (39:55), editor (40:35), thumbnails (41:04), script engineering (50:00+) | Read via the YouTube transcript |
| Clips from the same episode: "The SECRET Behind 5M+ YouTube Documentary" https://www.youtube.com/watch?v=rEyLQPiLewc and "Key TRICK…", "Harsh REALITY…" | Excerpts only | Not read separately |
| His playlist "Eiditing Commentary" (by Rocky Xu), https://www.youtube.com/playlist?list=PL3TDjTrbUq63w_NvTWVBKZvc2k5iCmUS5 | Videos he saved as references: James Jani editing breakdown (The Editing Podcast), MegaloMedia, Jake Tran x2, MrBeast/Jon Youshaei, plus both of his interviews | [OBSERVED]. **[INFERENCE]** These are his study material. |
| Patreon, https://www.patreon.com/c/finaius | He says it's for "people who want to know more about YouTube and how I do stories and videos": behind-the-scenes videos, including one on Unreal (1of10 21:51, 25:57, 32:38). About $1k/month. | **Blocked** (403 / browser block). Not read. |
| Skool "Financial Syndicate", https://www.skool.com/financial-syndicate/about | $29/mo trading-education community: trader modules, a pattern library, "Inside the Firms", games, exams. 21 members when checked. **Not about video production.** | Public about page read |
| Capitalized Media, "Quick Launch", https://www.capitalizedmedia.com/offer (also linked as fcm.finaius.com/cm) | His YouTube-business course: $29 (crossed-out $997), 6 days. Day 3 covers an outsourced production system, Day 4 editing for retention and story frameworks, Day 5 AI to "cut production time in half", Day 6 thumbnails and titles. A $197 "curated tool stack" bonus exists, but **the tools aren't named** on the sales page. The page says he uses "simple headshot commentary on FINAiUS" and runs other channels faceless. | Sales page only; not purchased |
| finaius.com (→ http://www.finaius.com/) | Google Sites page titled "FINAiUS Studio", "Economic History Meets Cinema": Capital (a PE co-invest arm), Podcast, "Video Production", Finders Program. **No tool or workflow details.** | Public |
| Blog post, https://theworldandaro.blogspot.com/2026/01/how-did-magnatesmedia-finaius-create.html | Claims After Effects, Premiere and Photoshop, Envato or Motion Array, a Python clip downloader, parallax, "Deus Media". **[THIRD-PARTY]**, mostly unsourced and AI-written in style. Several claims contradict his own statements (he says DaVinci Resolve). **Don't rely on it.** | Public |
| OutlierKit, https://outlierkit.com/channel/finaius | Third-party stats (see section 4) | Public |

---

## 4. Channel public facts

- Channel header: **808k subscribers, 90 videos**, tagline "Archive of financial stories." Header links include skool.com/financial-syndicate "and 3 more". [OBSERVED, https://www.youtube.com/@Finaius/videos]
- **Cadence (2026, from the RSS feed and videos tab):** Nov 22, Nov 7, Nov 1, Oct 14, Oct 6, Sep 24, Aug 30, Aug 21, Jul 28. That is about 2-3 long-form videos a month in late 2026, faster than the once a month he described in 2025. A few vertical Shorts (54-59 s) were posted in July 2026. Most uploads go out between about 06:00 and 09:00 Pacific. [OBSERVED: https://www.youtube.com/feeds/videos.xml?channel_id=UCGBoWe1mzCvbbqDNncmxm8A] **[INFERENCE]** The faster pace suggests more help or more AI in production now.
- **Length:** grew from 11-20 min (2021) to 30-35 min (2022-23), then 45-55 min (2024-26), with some over an hour (HSBC 1:00:36, Buffett 1:11:19, Pentagon 1:26:51). OutlierKit gives the recent average as about 31:46, which looks out of date. [OBSERVED]
- **Title patterns** [OBSERVED]:
  - `Subject - The $X Trillion/Billion [Noun] | Full Documentary` (HSBC, Vanguard, State Street, Visa, Amex)
  - `Family Name - Trillionaire Family That Built [Country] | 2025/2026 Documentary` (Al Maktoums, Al Nahyans, Al Thanis)
  - `The ENTIRE History of X` / `The House of X - The Complete History` / `The Secret History of…` / `The Twisted History of…`
  - A loaded label: "Criminal Empire", "Bank of Dirty Money", "Cartel of U.S. Finance", "A Global Cult", "Financial Monster", "Ghost of Wall Street"
  - A year tag such as "| 2026 Documentary" on evergreen subjects
- **Thumbnail pattern** [OBSERVED from 4 thumbnails]: one hero subject, either a building rendered like a 3D model (HSBC tower, Pentagon, Jane Street facade) or a real photo of the person (Buffett). The subject is cut out and centred. There are 1-3 huge words in a bold condensed or serif font ("DIRTY MONEY", "PENTAGON", "WARREN BUFFETT", "The King of Trading"). Backgrounds are dark or saturated red, with high contrast. A small name tag sometimes sits on the building ("Jane Street").
- **Description template** (2025-26) [OBSERVED from 14 descriptions]:
  1. Line 1: **sponsor call to action** with a tracked link and code (Abacus AI, Outskill, Trench, Privacy.com, Sintra, Brilliant, Masterworks, Incogni).
  2. A 3-5 sentence **logline**: a hook with numbers and dates, ending "This is the story of…".
  3. Community block: Skool "Financial Syndicate", Patreon, Discord (most 2025-26 videos; dropped in the newest two).
  4. Books: "📕 The Greatest Traders Book on Amazon", "📕 Get my book 𝐎𝐥𝐝 𝐌𝐨𝐧𝐞𝐲 𝐒𝐞𝐜𝐫𝐞𝐭𝐬" (fcm.finaius.com/old-money → Amazon B0GPDP2778, affiliate tag `finaius-20`), plus 📘 source books for that video on older uploads.
  5. "Podcast on Spotify 🟢" (show 033NjPC8nilxLqocEw84uD).
  6. `~CHAPTERS~` with **18-30 chapters, about one every 2-3 minutes**, each with an evocative title ("The Harbour", "The Box", "363 Tons"). This matches his turn-every-2-3-minutes rule. A **"Sponsor: X" chapter sits around 11-16 minutes** in.
  7. Older uploads also had "🎶 Music from the video" (Spotify), "Every Tools and Resources I Use…" (fcm.finaius.com/resources), and "I research, write, and produce these documentaries solo… Patreon".
- **Third-party stats** (OutlierKit, updated 9/30/2026): about 69M total views, about 30.5k views/day, top video "Empire of Shadows" (Rothschild) at 9.2M. Topic clusters: Wall Street biographies, hedge funds and quant firms, mega-banks, sovereign and royal dynasties. [THIRD-PARTY]

---

## 5. Visual style

From his own words [STATED, sources above]:
- A **3D "world"** built in Unreal Engine. Archive photos are shown as **framed photos inside a 3D scene**, and documents and news articles sit on a dimly lit detective board or desk. All of this is meant to give the image depth instead of a flat photo on screen.
- AI video generation (Kling) is used more now, and full 3D less.
- Short clips from feature films are used as B-roll.
- Face-swap/deepfake was used on film footage in 2020-21.
- No static shot longer than 4 seconds.
- "Talking heads" (interview clips) are used for exposition and reactions.

From storyboard frames of the HSBC video (https://www.youtube.com/watch?v=GUYsmM20RBI, YouTube storyboard sprites M1 and M7, about 10 s per frame) [OBSERVED]:
- A recurring **dark, moody tabletop or desk set** in 3D: a green banker's lamp, brass balance scales, banknotes, a typewriter, a paper letter in typewriter font, a desk calendar, gold bars, and miniature white **3D models of bank buildings standing in for companies**, each with a small all-caps label ("HSBC", "CENTRAL BANK", "HOUSEHOLD INTERNATIONAL"). Coloured lines and strings connect them, and a red arrow with "+X% POINTS" marks a data point.
- **Framed archive portraits** standing on the table, with name and role captions.
- **Black-and-white archival film and photos** (crowds, a bank run, a horse-drawn carriage).
- **Satellite-globe maps** in a Google Earth style, with a photo pinned on the map, route lines across Mexico, and an all-caps city label ("HSBC · LONDON").
- **Location and date lower-thirds** in small all-caps white text on dark ("CENTRAL, HONG KONG", "[place] · SEPTEMBER 1965").
- **Archival TV news clips** (two anchors at a desk) and a **newspaper or wire-story card** shown as a white panel with a blue headline.
- One frame shows a **man speaking on camera** in a home-office setting. **[INFERENCE]** This is probably Rocky's "headshot commentary" mentioned on the Capitalized Media page, or else an interview clip.
- The palette is mostly desaturated: browns, blacks and dark greys, with warm practical light from the lamp, and occasional green or red accents.

Not established (no evidence either way):
- which AI image generator, if any (no Midjourney or Flux mention found);
- film grain or LUT details;
- whether the music is from Epidemic Sound or Artlist (only the Spotify "Finaius" artist link);
- the caption style;
- Ken Burns moves. **[INFERENCE]** Given the 4-second rule and the 3D photo frames, the camera is probably always moving in a 3D space rather than doing flat 2D Ken Burns.

---

## What failed or was blocked
- `fcm.finaius.com/resources` → Patreon post 134568124: 403, and the browser blocks Patreon. **This is the main gap.**
- Patreon post 106108560 and patreon.com/c/finaius: not read.
- podwise.ai episode summary: 403.
- Watching the video itself: the YouTube player errored, so I used storyboard sprites and thumbnails instead.
- Programmatic YouTube transcript fetch returned empty, so I used YouTube's own "Show transcript" panel.
