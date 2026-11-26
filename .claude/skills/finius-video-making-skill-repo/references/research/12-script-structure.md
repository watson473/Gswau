# 12. Script, narration and story structure (FINAiUS "Empire of Shadows", 39:28)

Sources: work/transcript.txt (the creator's manual captions, timed), src/meta.json (30 chapters plus the description), notes/website.md (his stated rules), and a few contact sheets (sheet_000, 001, 036, 078) used to check what is on screen in the hook, sponsor and ending.
**MEASURED** means computed from the transcript or metadata with a script (scratchpad/a12.py). **INFERRED** means my reading of the text.
Quotes are kept under 15 words. Everything else is paraphrase.

Headline numbers (MEASURED):
- 4,927 caption words. This includes about 600 words of third-party clips and book quotes.
- 342 sentences. Mean 14.4 words, median 14.
- Average 125 wpm over the whole runtime. Per chapter it ranges from 97 to 152 wpm, with a median of about 123.
- 30 chapters. Mean 79 s, median 75 s, minimum 35 s, maximum 170 s.
- 29 narration-free gaps of 6 s or more. They range from 6 to 17 s and sit almost all on chapter boundaries (see 1c).
- 72 numeric tokens, which is 1.9 per narrated minute. 43 of them are years or decades (1.1 per minute).
- Only 1 question mark in the whole script.
- 8 uses of "you". Most are a generic "you", and the rest are in the sponsor read.

---

## 1. Macro structure

### 1a. All 30 chapters (from meta.json; durations and wpm MEASURED)

| # | Start | Dur (s) | Words | wpm | Chapter (paraphrased role) | Act |
|---|---|---|---|---|---|---|
| 1 | 0:00 | 50 | 41 | 49* | Introduction: hook, then 29 s of music | Hook |
| 2 | 0:50 | 103 | 228 | 133 | Unlikely origin: ghetto, textile trader, front running | I Rise |
| 3 | 2:33 | 87 | 220 | 152 | Becoming a bank: richest in Frankfurt, sons sent out | I |
| 4 | 4:00 | 62 | 109 | 105 | World context: Britain as superpower | I |
| 5 | 5:02 | 120 | 300 | 150 | Nathan in London: £20k to £60k, smuggling | I |
| 6 | 7:02 | 46 | 76 | 99 | Death of the founder, rule of family unity | I |
| 7 | 7:48 | 156 | 364 | 140 | Wars as opportunity: Wellington's gold | I |
| 8 | 10:24 | 82 | 164 | 120 | Network edge: forex, pigeons, richest man in the world | I (peak 1) |
| 9 | 11:46 | 91 | 209 | 138 | Nathan dies suddenly | IIa Succession |
| 10 | 13:17 | 35 | 72 | 123 | James takes command | IIa |
| 11 | 13:52 | 69 | 130 | 113 | Railroads | IIa |
| 12 | 15:01 | 52 | 101 | 117 | Inequality and hostility | IIa |
| 13 | 15:53 | 58 | 136 | 141 | French bank collapses, London bails it out | IIa |
| 14 | 16:51 | 170 | 385 | 136 | Lionel enters Parliament, rival foreshadowed, **sponsor 18:06–19:38** | IIa / midpoint |
| 15 | 19:41 | 40 | 88 | 132 | Rival introduced: Junius Morgan | IIb Rival |
| 16 | 20:21 | 159 | 346 | 131 | Franco-Prussian War: Morgan bets the other way | IIb |
| 17 | 23:00 | 40 | 78 | 117 | France repays, Morgan rises | IIb |
| 18 | 23:40 | 55 | 102 | 111 | Rothschild decline, fragmentation | IIb |
| 19 | 24:35 | 86 | 190 | 133 | America's titans | IIb |
| 20 | 26:01 | 75 | 168 | 134 | Panic of 1893: rival needs their gold | IIb |
| 21 | 27:16 | 68 | 145 | 128 | Gold deal, bonds sell out in 30 min | IIb (peak 2) |
| 22 | 28:24 | 97 | 184 | 114 | Road to WWI | III Wars |
| 23 | 30:01 | 80 | 175 | 131 | WWI: family on opposite sides, Morgan overtakes | III |
| 24 | 31:21 | 64 | 127 | 119 | Decline, antisemitism, an unnamed leader | III |
| 25 | 32:25 | 90 | 170 | 113 | WWII: seizure and flight (**climax / low point**) | III |
| 26 | 33:55 | 54 | 107 | 119 | Rebuilding in London as a "private club" | IV Aftermath |
| 27 | 34:49 | 63 | 122 | 116 | New client, Maxwell | IV |
| 28 | 35:52 | 82 | 159 | 116 | Family power struggle | IV |
| 29 | 37:14 | 60 | 111 | 111 | Maxwell's death and the scandal (late sting) | IV |
| 30 | 38:14 | 74 | 120 | 97 | Legacy today and the closing moral | Resolution |

\*The hook's 41 words take 18 s of speech (0:02–0:20), which is about 137 wpm. The other 29 s are music and visuals.

Chapter titles in the description are factual and spell out the turn ("The Death of…", "…Bails Them Out", "…Meets Rockefeller"). The spoken narration never announces the chapter name. On screen, each new era opens with a place-and-year card, e.g. "Frankfurt Germany 1769" at 0:47 (sheet_001).

### 1b. Acts and beats (INFERRED)

The film is a **four-act dynasty arc** shaped like two up-and-down waves. His stated rule is to "chain storylines into an up-and-down arc".

| Beat | Timestamp | % of runtime | What happens |
|---|---|---|---|
| Hook | 0:00–0:50 | 0–2% | Scope claim: a family's dominance across centuries |
| Setup | 0:50–3:49 | 2–10% | Outsider origin; the first edge (front running) |
| **Inciting incident** | 3:49 | 10% | Founder sends four of five sons to Europe's capitals (the dynasty plan) |
| Rising action | 5:02–11:30 | 13–29% | Nathan multiplies the stake; the Wellington gold deal; the information network |
| Peak 1 | 11:25 | 29% | Nathan becomes "the richest man in the world" |
| First reversal | 11:34–11:58 | 29–30% | "Ultimate enemy", then sudden death at 58 |
| **Midpoint** | 17:50 | 45% | Foreshadow: a new banking empire will challenge them. The sponsor read follows at 18:06 |
| Rival act | 19:41–23:24 | 50–59% | Morgan wins the bet the Rothschilds refused |
| Decline | 23:36 | 60% | Founder's generation is gone; the family fragments |
| Peak 2 (alliance) | 27:02–28:05 | 69–71% | The rival needs their gold; bonds sell out in 30 min |
| Escalation | 28:24–31:20 | 72–79% | WWI; family members on opposing sides; Morgan overtakes |
| **Climax / low point** | 32:05–33:37 | 81–85% | WWII: "certain demise", flight, seizure; then the surrender broadcast |
| Late sting | 34:38–38:02 | 87–96% | Maxwell; a family feud; death and pension scandal; privacy vindicated |
| Resolution | 38:14–39:10 | 97–99% | Diversified legacy; a two-sentence moral with a contrast ending |
| Outro | 39:10–39:28 | – | Crest, then the FINAiUS logo sting (sheet_078). No spoken CTA |

Act lengths: Hook 0.8 min, I = 11 min, IIa = 8 min (including the 1.5 min sponsor), IIb = 8.7 min, III = 5.5 min, IV plus resolution = 5.5 min.
Act III is short and dense. War chapters move fastest through events, while the speaking rate drops (113–131 wpm) to leave room for the archive.

### 1c. Chapter seams are music breaths (MEASURED)

Of the 29 narration-free gaps of 6 s or more, 24 fall within ±10 s of a chapter start. Examples: 4:00 (8 s), 4:53–5:03 (10 s), 7:02–7:18 (16 s), 11:37–11:47 (10 s), 29:26–29:41 (15 s), 33:37–33:50 (13 s).
Rule: **closing line, then 6–17 s of music and visuals only (median about 8 s), then the opening line of the next chapter.** This happens about every 80 s. It is how a 125 wpm average co-exists with 135–150 wpm inside the busier chapters.

### 1d. Every turn (INFERRED from transcript; timestamps MEASURED)

Types: REV = reversal, RIV = new rival, DTH = death, BET = betrayal/split, CRI = crisis, REVL = reveal, NUM = number shock, ESC = escalation, FORE = foreshadow cliffhanger.

| t | Type | Turn (paraphrase) |
|---|---|---|
| 0:50 | REVL | Origin is "unlikely": a Frankfurt ghetto |
| 1:41 | REVL | He discovers the front-running scheme |
| 2:21 | NUM | Profits twice: 8% commission plus the spread |
| 2:43 | FORE | Fortune made, but "it's just the beginning" |
| 3:14 | ESC | Richest man in Frankfurt, and still not enough |
| 3:49 | ESC | Four of five sons sent to four capitals (inciting incident) |
| 5:19 | NUM | £20,000 stake to multiply "by any means necessary" |
| 6:15 | NUM | £20k becomes £60k |
| 6:26 | REV | Respectable trader revealed as a smuggler |
| 6:49 | NUM | Sales of £800,000 |
| 7:02 | DTH | Founder's health fails; deathbed rule of unity |
| 7:48 | ESC | A century of wars begins |
| 8:58 | CRI | Wellington needs French coin |
| 9:44 | REVL/NUM | Nathan buys £800k of gold outright |
| 10:58 | REVL | The real edge: information and speed (pigeons) |
| 11:25 | NUM | Richest man in the world (peak 1) |
| 11:46 | DTH | Sudden death at 58, despite a long-lived family |
| 12:44 | CRI | Leaderless, so who takes over? |
| 13:01 | CRI | Competition erodes margins |
| 13:35 | ESC | New frontier: railroads |
| 14:56 | REV | Contrast: the family soars while the public struggles |
| 15:50 | CRI | Paris bank near breaking point within days |
| 16:20 | REV | Nephew bails out uncle at personal risk |
| 16:49 | ESC | New arena: politics |
| 17:21 | CRI | Elected, but blocked by the oath |
| 17:50 | FORE/RIV | A new empire is coming to challenge them (midpoint) |
| 19:41 | RIV | Junius Morgan introduced |
| 20:40 | CRI | War declared, July 19, 1870 |
| 21:27 | REV | Rothschilds refuse France; Morgan takes the bet |
| 22:40 | CRI | France loses decisively |
| 23:00 | REV | The loser repays early |
| 23:14 | NUM | £1.5m profit for Morgan |
| 23:44 | DTH | James dies (1868); the family fragments |
| 23:57 | NUM | 37% of the portfolio in Egypt |
| 24:10 | FORE | A new empire "bigger … than any" |
| 25:15 | REV | Dismissed America as madmen, now chasing it |
| 25:33 | CRI | May 9, 1893: the panic |
| 26:49 | CRI | Government days from running out of gold |
| 27:02 | REVL | The rival needs the Rothschilds |
| 27:30 | NUM | $65m and 3.5m ounces |
| 28:05 | NUM | Sold out in 30 minutes (peak 2) |
| 28:37 | ESC | Europe at a boiling point |
| 29:17 | FORE | A war "more brutal … than any" |
| 29:26 | CRI | Assassination triggers WWI |
| 30:10 | NUM | 10m soldiers and 7m civilians dead |
| 30:23 | BET | For the first time, family members on opposing sides |
| 30:28 | RIV | Morgan overtakes them |
| 31:05 | BET | Most gifted heir turns his back on the business |
| 31:30 | CRI | Rising antisemitism |
| 31:51 | FORE/REVL | An unnamed "new kind of leader" (named at 32:20) |
| 32:05 | ESC | 1939: the biggest war in history |
| 32:47 | CRI | "Certain demise" if Europe falls (climax) |
| 33:05 | REV | Flight, seizure, confiscation |
| 33:26 | REV | Surrender broadcast (relief) |
| 34:38 | RIV | A future mogul arrives as client: Maxwell |
| 35:43 | BET | "Trouble is brewing" inside: a cousin feud |
| 36:55 | CRI | A massive scandal erupts |
| 37:06 | DTH | Maxwell found dead (news-clip voice) |
| 37:18 | REVL/NUM | Hundreds of millions taken from pensions |
| 38:02 | REV | Scandal vindicates the privacy doctrine |

Cadence (MEASURED from the table):
- About 56 turns in 38.4 narrated minutes: **one turn every 41 s**.
- Counting only "big" turns (DTH, RIV, BET, REV, CRI at act level, peak NUM), there are about 20: **one every 1.9 min**. This matches his stated rule of a turn every 2–3 minutes (and his looser line that "every minute there must be a turn").
- Mix: CRI 15, REV 11, NUM 11, ESC 7, FORE 6, DTH 5, RIV 4, BET 3, REVL 6. Several turns carry two labels.
- Deaths are spaced evenly at about 7–9 min (7:02, 11:46, 23:44, 37:06). Rivals arrive at 19:41 (main rival) and 34:38 (late rival).

---

## 2. The hook (0:00–0:50)

MEASURED: **41 words**, 2 sentences, spoken 0:02.1–0:20.0, which is **about 137 wpm**. 0:20–0:49 is music only.
Visuals during the silence (sheet_000/001): a map of the European network, then a chateau with roots, 3 s of black, and the title card "Frankfurt Germany 1769" at 0:47.

Sentence by sentence (paraphrase):
1. **Scope + claim + contrast.** It opens "Across centuries" (scope) and calls the family's dominance unprecedented (claim). It names two opposing engines, family loyalty and ruthless profit (contrast). This duality is the film's thesis. It is paid off in the closing moral 39 minutes later.
2. **Arc promise + stakes + superlative.** It promises a rise from modest roots (rags-to-power arc). It lists three arenas, finance, wars and politics (stakes, rule of three). It ends on a superlative, the most formidable banking dynasty of their age.

What the hook does **not** do:
- No question, no specific scene, no number, no named person.
- No tease of later events (the deaths, the Nazi seizure, Maxwell).
- The "mystery" lives in the title ("Empire of Shadows") and in dark visuals (silhouettes at 0:00–0:13).

Chapter 1's first line answers the hook's "modest roots" right away with the word "unlikely" plus a place. The hook works as a **logline read aloud, then a 30 s cinematic breath**.
For our channel, keep the logline but add a 1–2 line specific tease (see template). The 29 s silent stretch only works with strong visuals.

---

## 3. Chapter openings and closings

### Opening patterns (counted over 29 chapters, INFERRED)

- **Time stamp first**, i.e. "By 1782", "In 1867", "From the 1850s to the 1870s", "By 2023": 12 chapters (41%).
- **"While X, Y" cross-cut contrast**: 4.
- **Character under pressure**: 3.
- **Place/world-state context**: 4.
- **Bare character intro** ("X is a British banker…"): 2.
- **Third-party quote first**: 2.
- **Question**: 0.

10 examples:
1. 0:50, place plus irony: origin was "an 18th century ghetto in Frankfurt".
2. 2:33, date plus number: "By 1782", he has a colossal fortune.
3. 4:00, era plus world state: in the early 1800s Britain is the superpower.
4. 5:02, character plus pressure: "For Nathan…, the pressure is immense."
5. 7:02, date plus decline: by 1812 the founder's health fails.
6. 11:46, exact date plus surprise: "On July 28th, 1836, the unexpected happens."
7. 15:01, contrast: profits soar while ordinary people struggle.
8. 19:41, cold character intro, straight out of the sponsor: Morgan is a British banker.
9. 23:40, cross-cut: while Morgan builds, the Rothschilds face "mounting challenges".
10. 32:25, date plus gap plus superlative: 1939, 21 years after WWI, the biggest war erupts.

### Closing patterns

- **Foreshadow cliffhanger** ("what X doesn't realize", "just the beginning", "ultimate enemy"): 7.
- **Name reveal held to the last words** ("His name is …"): 3.
- **Payoff/number line**: 6.
- **Thesis line** ("reasons they're still successful today"): 3.
- **Handoff to a new protagonist**: 3.
- All of them are followed by a 6–17 s music breath (1c).

10 examples:
1. 2:28, payoff: he profited twice, from commission and from front running.
2. 3:57, list that points ahead: the sons go to Vienna, Naples, Paris, and "the Jewel of the empire, London."
3. 4:52, name reveal: "His name is Nathan Roths.child." (Same device at 34:42 for Maxwell.)
4. 7:01, ambition: he will make his bank bigger than his father's.
5. 7:45, thesis plant: family bond is why they're "still successful today".
6. 10:11, quote payoff: "the best business I ever did."
7. 11:34, cliffhanger: even the most powerful man can't defeat "the ultimate enemy".
8. 18:00, midpoint foreshadow: a new empire is "poised to challenge their dominance", then straight into the sponsor.
9. 24:10, foreshadow: a new empire bigger than any the world has ever seen.
10. 29:17, foreshadow: "What the Roths.childs don't realize…" the war will be more brutal than any before.

Signature constructions to adopt as patterns (not text):
- "But for X, it's just the beginning."
- "But what X doesn't realize is…"
- "His name is ___."
- "And nothing presents better opportunities than ___."

---

## 4. Sentence craft

Sentence length (MEASURED, from his own caption punctuation):
- Mean 14.4 words, median 14.
- 17.8% are 8 words or fewer; 6.7% are 5 words or fewer.
- 7% are 25 words or more. Most long ones are quoted book passages.
- The punch lines are the short ones: "He became, in a word, a smuggler." / "Lionel was elected." / "There is a problem." / "Lots of money."
- Pattern: two 15–20 word sentences, then one 3–7 word sentence.

Numbers and dates (MEASURED):
- 1.9 numeric tokens per minute; 1.1 years or decades per minute.
- Money is almost always given as a concrete before-and-after (£20k to £60k; £800k; £1.5m; $65m; 3.5m oz; 30 minutes).
- Percentages are rare (8% twice, 37% once).

Named characters (INFERRED):
- About 30 people are named in total.
- **Each chapter centres on 1 protagonist (sometimes 2) plus at most 1 antagonist or foil.**
- New protagonists are introduced with family relation plus pressure ("youngest brother… the pressure is immense").
- Big villains can be withheld: Hitler is first "a new kind of leader" (31:51) and is named 29 s later.

Tense (INFERRED):
- The spine is in the **historical present** ("he follows", "becomes", "Nathan sees").
- He slips into the past tense for background and for quoted book passages.
- The present tense keeps events feeling as if they are happening now. Book quotes are in the past tense, which marks them as evidence.

"You" (8 uses):
- Used only for generic axioms ("To start a war, you will need money") and the sponsor read.
- No direct "you" in the story.
- "We" appears 6 times, in modern-context comparisons and expert clips.

Rhetorical devices (counted, INFERRED):
- **Rule of three** (about 12): finance/wars/politics; farming/handicrafts/nobler goods; three profits; railroads/steel/oil; metallurgy/mining/railways.
- **Contrast/antithesis** (about 15): rich vs poor; win the war vs repay the loan; "respected and scary".
- **Foreshadowing** (about 8, listed in 1d).
- **Irony** (about 5): death while famous for longevity; the loser repays early; dismissed America, then chased it.
- **Rhetorical question**: only 1 ("Why? Because governments…", 27:47), plus 1 pseudo-question ("What Roths.child did was this.").
- **Modern analogy** (about 4): "much like today's stockbrokers", "known today as front running", forex traders, Britain vs today's US.
- **Superlatives**: frequent (unprecedented, richest, biggest, most brutal). This is a risk of repetition.

Vocabulary (INFERRED):
- Upper-intermediate, roughly grade 10–12.
- Finance terms always come with a gloss on first use: front running, syndicate, gold standard, derivatives.
- Some stock phrases repeat: "the pressure is immense" ×2, "opportunity of a lifetime" ×2, "formidable" ×3.

Attribution (INFERRED):
- About 10 book passages are read in quotation marks, with light attribution ("According to his own account", "an editorial said", "In 1935, the Jewish Chronicle…"). Mostly no source is named on audio; the books are listed in the description.
- About 13 inserts in **other voices**: expert/interview clips, a news anchor, a wartime radio broadcast, and a modern executive talking head at 3:32. Each runs 5–25 s and arrives roughly every 3 min (e.g. 3:32, 8:07, 8:31, 15:08, 20:56, 24:57, 29:48, 33:26, 35:11, 37:06, 37:29).
- **Function:** a second voice validates a claim or adds character colour, and resets attention.
- **Our version:** a quoted primary source on a typed card, in a second TTS voice or as on-screen text. Never pass off our narrator's opinion as a source.

---

## 5. Information density and how finance is explained

Density (estimated):
- 342 sentences over about 38.4 narrated minutes is 8.9 sentences per minute.
- About 60% introduce a new checkable fact (who/when/how much), so **about 5 facts per minute**.
- Of those, 1.9 per minute are numbers and 1.1 per minute are dates.
- The busiest chapters run near 150 wpm and 6–7 facts per minute (ch. 3, 5). Breathing chapters sit near 100 wpm (ch. 4, 6, 30).

His explanation method:
1. **Plain name**
2. **Modern analogy**
3. **Step-by-step mechanism in 2–3 short sentences**
4. **Number payoff**

He never uses formulas.

5 examples:
1. **Front running (1:49–2:28):**
   - Analogy: a court agent was "much like today's stockbrokers".
   - Set-up: "What Roths.child did was this."
   - Steps: buy first with borrowed money, then sell to the prince, acting as both buyer and seller.
   - Label: "known as front running in modern terms".
   - Payoff: he profits twice (8% commission plus the spread).
   - Visual need: a two-party flow diagram.
2. **Vertical integration (5:47–6:15):**
   - Never named. Told through his own quote as a list of three (raw material, dyeing, manufacturing), giving "three profits instead of one".
   - Ends on the number, £20k to £60k.
3. **War finance and forex (10:24–11:25):**
   - Explained with two axioms: wars need money, and losers pay the winners.
   - Then a slogan: information is everything and speed is king.
   - Then a concrete image: horses and pigeons.
   - Then the result: currency speculation becomes the top business.
4. **Credit risk vs outcome (21:55–22:21):**
   - Reframed as a contrast: it doesn't matter whether France wins; what matters is whether France can repay.
   - Backed by an expert line: a diversified economy and efficient tax collection.
   - Payoff at 23:00: prepaid early, £1.5m profit.
5. **Gold standard / sovereign bonds (26:10–27:54):**
   - Defined by contrast: the dollar was not the main currency; the pound was.
   - Then the stakes: the reserves run out within days.
   - Then a Q&A: "Why? Because governments usually pay back their debts…"
   - Then the result: sold out in 30 minutes.

Others:
- Syndicate / "other people's money" (14:15) is a one-line gloss.
- Derivatives and options (36:08) get one sentence plus an effect clause.

---

## 6. Open loops (INFERRED; timestamps MEASURED)

| # | Opened | Loop (question or promise) | Paid off | Gap |
|---|---|---|---|---|
| L1 | 0:02 | How did they reach dominance across centuries? | Spine, through 39:10 | 39 min |
| L2 | 0:13 | "From modest roots" (how modest?) | 0:50 ghetto | 37 s |
| L3 | 1:44 | A "brilliant strategy" called front running | 2:06–2:28 | 24–44 s |
| L4 | 2:43 | "Just the beginning" | 3:09 bank, 3:14 richest in Frankfurt | 31 s |
| L5 | 3:18 | A legacy to outlast nations | 7:34, then 38:14 legacy today | 35 min |
| L6 | 3:57 | Who goes to London? | 4:52 "His name is Nathan" | 55 s |
| L7 | 5:19 | Can he multiply the £20k by any means? | 6:15 £60k, 6:26 smuggler | 56–67 s |
| L8 | 7:01 | Will he out-build his father? | 11:25 richest man in the world | 4.4 min |
| L9 | 7:28 | Rule: family unity above all | 16:26 bailout, 36:37 control, 39:02 moral | 9–32 min |
| L10 | 9:30 | Once-in-a-lifetime opportunity | 10:11 "best business I ever did" | 41 s |
| L11 | 11:34 | The "ultimate enemy" | 11:46 death | 12 s |
| L12 | 12:44 | They need a new leader | 12:48 James | 4 s |
| L13 | 13:11 | James seeks a new edge | 13:35 railroads | 24 s |
| L14 | 17:50 | A new empire will challenge them | 19:41 Morgan (across the sponsor) | 111 s |
| L15 | 20:38 | Bismarck waits to strike | 20:40 war declared | 2 s |
| L16 | 21:58 | Will France repay? | 23:03 prepaid | 65 s |
| L17 | 24:10 | A new empire bigger than any | 24:22 America | 12 s |
| L18 | 25:33 | "Blood on the street", when? | 25:37 May 9, 1893 | 4 s |
| L19 | 27:02 | One family has the gold, which? | 27:06 Rothschild | 4 s |
| L20 | 29:17 | The coming war will be more brutal | 30:10 casualties | 53 s |
| L21 | 31:51 | Who is the new leader? | 32:20 Hitler | 29 s |
| L22 | 32:47 | Will they face certain demise? | 33:26 surrender | 39 s |
| L23 | 34:38 | Who is the future mogul? | 34:42 Maxwell | 4 s |
| L24 | 35:29 | He needs "lots of money"; what happens? | 37:06–37:24 scandal | 1.6 min |
| L25 | 35:43 | Trouble brewing inside | 35:52 feud | 9 s |
| L26 | 36:55 | Scandal threatens their reputation | 37:06–38:02 | 11–67 s |
| L27 | 37:53 | Rothschilds' role in Maxwell's demise | **Never resolved** (left "unclear") | – |

Shape:
- **3 spine loops** span acts: L1, L5 and L9 (thesis, legacy, family unity).
- **1–2 act loops** run for 1–5 min (L8, L14, L16, L24).
- **About 1 micro-loop** at a time runs for 2–60 s (name withheld to the end of the sentence, a "what he did was this" set-up).
- Average open at any moment is **about 4**: 3 spine loops plus about 1 local loop. Local loops reopen about every 85 s.
- The sponsor is bridged by L14 (opened 16 s before it starts).
- One loop is left open at the end (L27) to give the "shadows" feel.

---

## 7. Ending and CTAs

**Sponsor (Brilliant):**
- Runs 18:06–19:38, which is **92 s, 3.9% of runtime, starting at 45.8%**, right after the midpoint cliffhanger (17:50–18:00).
- Segue: a story theme bridges into the product. Early success came from information; today learning is easy.
- First-person proof: he says he has been taking a crypto course.
- Feature list in threes (interactive puzzles, riddles, games). Offer: 30-day trial plus 20% off for the first 200.
- Closes with "Thank you, Brilliant", with the creator **on camera** (sheet_036 tiles 27–29). Then a hard cut to the next chapter's cold character intro, with no recap.
- Visuals: stock B-roll of a laptop and the sponsor's landing page (sheet_036).

**Ending (38:14–39:28):**
- "By 2023" diversification list, then the five original cities named again as bookends.
- Then a **2-sentence moral (38:56–39:10), delivered by the creator on camera** (sheet_078). The family wasn't shy about money, but gave up opportunities to protect the legacy. It ends on a 5-word contrast: "both respected and scary".
- That contrast answers the hook's "familial solidarity vs relentless profit". The hook and ending mirror each other.
- 39:10–39:28: crest, then logo sting. **No spoken CTA** (no subscribe, Patreon, book, Discord). Those live only in the description:
  - Brilliant link first
  - the Skool community
  - Patreon twice
  - Discord
  - the $4.75 book with a "no pressure" line
  - the tools/resources link
  - source books
  - chapters
- Patreon and the book appear nowhere in the narration.

---

## 8. SCRIPT TEMPLATE for our stack (25–45 min documentary explainer)

### 8a. Sizing (derived from the measurements above)

| Runtime | Narrated words at 125–135 wpm average | Chapters | Avg chapter | Big turns (every ~1.9 min) | All turns (every ~45 s) | Sponsor/own-offer slot |
|---|---|---|---|---|---|---|
| 25 min | 3,100–3,300 | 16–18 | 85 s | 13 | 33 | 11:00–12:30 |
| 35 min | 4,300–4,600 | 22–24 | 85 s | 18 | 47 | 15:30–17:00 |
| 45 min | 5,500–5,900 | 28–30 | 90 s | 23 | 60 | 20:00–22:00 |

Notes on sizing:
- Write the narration at **135–145 wpm inside chapters** and leave a **6–10 s music breath** at every chapter seam. That gives the 125–135 wpm average.
- Chapter length: 35–170 s. Keep 80% of chapters between 50 and 120 s. Make one longer chapter (150–170 s) per act for its centrepiece event.
- Script length check:
  `words = (runtime_s − 8 s × chapters − hook_breath_s − sponsor_s) × 2.3`
  For example, 35 min = 2100 s − 184 − 25 − 75 = 1816 s × 2.3 = 4,177 words.

### 8b. Act map (percent of runtime)

| Act | % | Must contain |
|---|---|---|
| Hook | 0–2% (40–55 s) | Logline plus a specific tease; 20–30 s visual breath with a place/year card |
| I Rise / Setup | 2–30% | Outsider origin (irony), the first "edge" explained, inciting decision at about 10%, peak 1 at about 28% |
| First reversal | about 30% | A death, loss or betrayal that removes the engine of Act I |
| IIa New leader / new arena | 30–45% | Pressure on a new protagonist, a crisis survived via the core value (pay off the spine loop once) |
| Midpoint | 45% | Foreshadow cliffhanger ("a rival was coming"), then **sponsor/own-offer slot** |
| IIb Rival | 50–70% | Rival introduced cold; contrarian bet; rival wins; we decline; alliance or peak 2 at about 70% |
| III Crisis / climax | 70–85% | Escalation over 2–3 chapters to the low point at about 82% ("certain demise") |
| IV Aftermath / late sting | 85–97% | Rebuild, then one late surprise (scandal, death, reveal) so the last 10% isn't a wind-down |
| Resolution | 97–100% | "Today" status, list bookending the opening, a 2-sentence moral ending in a contrast that answers the hook; ≤1 soft CTA line; logo sting |

### 8c. Formulas

**Hook (45–55 s, 2–4 sentences, 40–70 words, then 20–30 s visual breath):**
1. Scope + claim + duality: "Across [span], [subject] [superlative verb], driven by [value A] and [value B]."
2. Arc + stakes in a rule of three: "From [humble start], they [rise] to shape [arena 1], [arena 2] and [arena 3]."
3. **Our addition**, a specific tease of two later turns, each with a number or image: "[Death/rival] would [stake]. And [number shock] would [consequence]."
4. Optional: one-line promise: "This is the story of …" (his description logline uses this phrase).

Then the music breath, then the first place/year card.

**Chapter open (pick one, rotate, never more than 2 in a row of the same):**
- T: date stamp + state ("By [year], [character] has [number/status].") Use in about 40% of chapters.
- W: cross-cut "While [rival/world] [does X], [protagonist] [faces Y]."
- P: character + pressure ("For [name], the pressure is …"), used once per new protagonist.
- C: world/place context in 2–3 sentences, then zoom to the character.
- Q: a quoted source line first (≤20 words, attributed on screen).

**Chapter close (every chapter ends on one, then 6–10 s music breath):**
- F: foreshadow: "But what [name] doesn't realize is that …" or "But for [name], it's just the beginning." Use in about 25% of chapters.
- N: name reveal: "His/Her name is [Name]." (once per major new character)
- $: number payoff: "[Before] became [after]."
- Θ: thesis plant, tying the chapter to the spine value.
- H: handoff: "[New person] becomes the [role]."

**Turns:**
- Something changes every 40–50 s.
- A big turn (DTH/RIV/BET/REV/CRI/peak NUM) every 1.5–2.5 min.
- About one death or loss every 7–9 min.
- Main rival introduced at 45–50%. A late rival or scandal at about 87%.
- Each turn line is ≤12 words and starts with "But", "Then", "On [date]", or a bare clause.

**Open-loop plan (write it before the script):**
- 3 spine loops: the thesis (the hook's duality), the legacy promise, and a stated rule or value. Each is paid at least once mid-film and again in the last 60 s.
- An act loop every 3–5 min, lasting 1–5 min. One must straddle the sponsor (open it within 20 s before the read; pay it within 30 s after).
- A micro-loop every 60–90 s: a withheld name, "here's what he did", or a "when?" answered by a date.
- Keep about 4 open at once. At most one loop may stay unresolved at the end, and it must be flagged as genuinely unknown.

**Sponsor / own offer (Gumroad book, newsletter, Patreon):**
- One mid-roll at 45–50%, 60–90 s, entered by a **thematic segue sentence** that uses the story's theme.
- Includes 1 first-person proof sentence, 1 rule-of-three feature list, 1 offer, and 1 thanks line. Resume with a cold chapter open and no recap.
- End: at most 1 soft line in the last 15 s; everything else goes in the description.

### 8d. Writing rules checklist (for Claude Code)

1. Historical present for the spine; past tense only for background and quoted evidence.
2. Mean sentence 13–16 words. At least 1 in 5 sentences ≤8 words, and every turn line is short. No sentence over 28 words in our own voice.
3. 1.5–2.5 numbers per minute; each money figure as before-and-after or with a scale comparison; ≥1 date per minute in historical sections.
4. One protagonist per chapter (plus ≤1 foil). Introduce people with role + relation + pressure. Withhold a villain's name once per film, for ≤30 s.
5. Every finance term: plain name → modern analogy → 2–3 step mechanism → number payoff. No formula on screen unless it has 3 terms or fewer.
6. Rule-of-three lists about once per chapter; one contrast/antithesis per chapter; foreshadow lines at most 1 per 4 min. Use ≤1 rhetorical question per 10 min, and answer it in the next sentence.
7. "You" only for generic axioms and the offer read; never "guys", "smash", "let's dive in", or a "see you tomorrow"-type sign-off.
8. Superlatives: max 1 per chapter. Don't repeat any stock phrase more than twice per film (he repeats "pressure is immense" and "opportunity of a lifetime").
9. A second voice every 3–4 min (a quoted primary source card or a second TTS voice reading a cited quote, 5–20 s), attributed on screen with source and year.
10. Every chapter ends on F/N/$/Θ/H, then a 6–10 s music breath with no narration.
11. Original story, original wording. Facts are checked against ≥2 sources, and the sources are listed in the description, as he does.
12. Hook and final moral must mirror each other: same two values, final sentence ≤8 words and built on a contrast.

### 8e. Script line format (so the edit can be built from the script)

He has his editor mark the script lines that need 3D scenes; we mark **every line**. One line equals one narration unit of ≤20 words (about 8 s at 2.3 w/s). Because the visual rule is "no static shot over 4 s", every line carries **1–2 visual tags**.

```
## CH07 | 7:48–10:24 | target 150 s / 340 w | ACT I | open:C close:Q-payoff
[TURN ESC] [LOOP open L10 "once-in-a-lifetime"]
L071 | As the sons open houses in five cities, Europe enters a century of war.
     | V1 map: europe, 5 pins pop (pop SFX x5, 120 ms apart) | V2 card: date "1800–1900" slide-in
L072 | To start a war, you need money.                    | V statement: white serif 7% FH, center, 2.5 s
L073 | If you lose, you pay the other side.                | V statement: same style, swap
...
[BREATH 8s] V: slow push on still IMG-CH07-04 | MUSIC: bed swell +3 dB | SFX: riser 4 s into next card
```

Tag vocabulary. These map to HyperFrames sub-compositions we already build:
- `V card:date|place` → title card (place + year)
- `V statement` → kinetic text, ≤7 words
- `V stat:"£20k→£60k"` → number counter/compare
- `V map:region,pins,route` → map scene
- `V diagram:flow` → explainer flow (front-running-type mechanism)
- `V chart:line|bar` → data chart
- `V table` → comparison table
- `V lt:name,role` → lower third, first appearance of each person
- `V quote:source,year` → quote card (paper texture) + optional `VO2`
- `V still:IMG-id prompt…` → AI still with move `push|pan|parallax`, 3–4 s
- `V i2v:IMG-id` → image-to-video when budget allows
- `V board:link A→B` → the detective-board motif for relationships

Audio and structure tags:
- `SFX:` whoosh / pop / paper / impact / riser, with ms offset from the line start.
- `MUSIC:` bed in / out / swell / drop at turn lines. A drop is −6 to −10 dB for 1–2 s on DTH and CRI lines.
- `[TURN type]` and `[LOOP open|close id]` are metadata only. A linter can check spacing: a turn every ≤50 s, a big turn every ≤150 s, about 4 loops open, the sponsor straddled.
- `[BREATH n s]` marks chapter seams.

Render step: whisper word timing gives each `Lnnn` a start and end. Tags without an offset start at the line start; multi-tag lines split at the first comma or "and" boundary, or at 50% of the line. Any line longer than 4 s with a single static tag gets a forced move (push 100→106% over the line) or a second tag.

### 8f. Pre-flight numbers to check on every script

| Check | Target |
|---|---|
| Hook words / spoken time | 40–70 w / ≤25 s, then 20–30 s breath |
| Chapters | runtime_min × 0.65 (±2) |
| Big turns / all turns | ≥ runtime_min ÷ 2 / ≥ runtime_min × 1.3 |
| Numbers per min / dates per min | 1.5–2.5 / ≥0.8 |
| Mean sentence / share ≤8 words | 13–16 / ≥18% |
| Second-voice inserts | ≥ runtime_min ÷ 4 |
| Loops open on average | 3–5; sponsor straddled; ≤1 left unresolved |
| Sponsor/offer | 1 slot, at 45–50%, 60–90 s |
| Ending | moral ≤2 sentences, last ≤8 words with contrast; ≤1 CTA line |
