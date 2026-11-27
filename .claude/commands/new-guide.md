---
description: Make a new GSWAU guide page that answers one business question barbers ask, and open a pull request for review.
argument-hint: <the question a barber asks>  (leave empty to take the next topic in docs/guides/ideas.md)
---

# /new-guide

You are making one new public guide page on gswau.com that answers this question:

**$ARGUMENTS**

If that line is empty, use the first unticked (`- [ ]`) question in `docs/guides/ideas.md`.

The owner is not a developer. Explain what you are doing in plain English, one step at a time,
with no jargon. Keep them posted in short lines as you go.

The reference guide is `/guides/how-to-price-barber-services`. It is made of:

- `src/lib/guides/how-to-price-barber-services.ts` — the text, example numbers, mistakes and FAQ
- `src/routes/guides.how-to-price-barber-services.tsx` — the page layout, title, meta and structured data
- `src/test/pricing-guide.test.ts` — the tests
- an entry in `publicPaths` in `src/lib/sitemap.ts`, and a sitemap check in `src/test/site-fixes.test.ts`

Read all of them before writing. Copy their structure, class names and components exactly.

## Hard rules (never break these)

- Follow `docs/brand/voice.md` for every word on the page. Read it first.
- Only add the new guide's files, its sitemap entry and tests, the "Related guides" links, and
  the tick in `docs/guides/ideas.md`. Do not change any other page, design, product, price,
  payment or Gumroad setting.
- Never hard-code a Gumroad link. Build buy links with `gumroadLink()` from
  `src/lib/gumroad-store.ts` and the codes in `courseOffers` in `src/lib/catalog.ts`, the same
  way the pricing guide does.
- The byline uses `author.name` from `src/lib/catalog.ts`, which is "Gs. W. Augustin".
- Never commit `.env`, `.env.*`, keys, tokens or any secret. Check before every commit.
- Never merge the pull request. The owner reviews it and says "merge" themselves.

## Step 1 — Start clean from the latest main

1. `git fetch origin`.
2. Work out the slug: short, lowercase, words joined by `-`, written the way a barber would
   search it (for example `how-to-get-more-barber-clients`). Keep it under about 60 characters.
3. Make a separate clean copy from `origin/main` so the owner's own checkout and any open
   branches are left alone:
   `git worktree add -b guide/<slug> ../Gswau-worktrees/guide-<slug> origin/main`
   then `git branch --unset-upstream` inside it. Do all the work in that folder.
   Never start from another branch or open pull request.
4. If `node_modules` is missing there, run `npm install` (do not change `package.json` or the
   lock files; if install changes a lock file, restore it with `git checkout` before committing).

## Step 2 — Check it is not a duplicate

Look at:

- every `src/routes/guides.*.tsx` and `src/lib/guides/*.ts`
- every blog post in `src/content/blog/*.md`
- the ticked lines in `docs/guides/ideas.md`

If an existing guide already answers the same question, **stop**. Tell the owner which page
covers it and its address, and make no changes. (Remove the clean copy you made.)

If a blog post covers part of it, you may go ahead, but say so in the pull request and link to
the post from the guide where it helps the reader.

## Step 3 — Write the content file

Create `src/lib/guides/<slug>.ts`, shaped like the pricing guide's content file:

- A guide object with `path` (`/guides/<slug>`), `title` (a clear, plain title in title case),
  `description` (one sentence, **160 characters or fewer**, saying what the reader will learn),
  `published` (today's date, `YYYY-MM-DD`) and `shortAnswer`.
- `shortAnswer`: **2–4 sentences** that answer the question directly. Someone who reads only
  this should know what to do.
- The numbered steps (5–7), each with a short bold title and one or two sentences.
- Common mistakes (4–7), each with a title and body.
- A worked example with **simple round numbers**. If it involves arithmetic, put the numbers in
  an object and work the results out in a function (like `exampleNumbers()`), so a test can
  check them. If the topic has no natural numbers, use a short worked story with round numbers
  (for example "a barber with 40 regular clients a month…").
- FAQ: **4–5 real questions barbers ask** about this topic, each answered in 2–4 sentences that
  make sense on their own (search engines and AI tools quote them on their own).

Write it so any section can be quoted alone. Add a comment at the top saying every number is a
labelled example, not a statistic.

## Step 4 — Write the page

Create `src/routes/guides.<slug>.tsx` by copying the pricing guide page and changing only what
the topic needs. Keep, in this order:

1. `<Eyebrow>Guide</Eyebrow>`, the `<h1>` title, and `By {author.name}`.
2. "The short answer" box (same classes: gold left border, card background).
3. The button under the short answer:
   - **If the topic is about pricing or money** (prices, raising prices, income, saving, taxes,
     deposits, booth rent costs): the gold `Try the free pricing calculator` button to
     `/calculator`, exactly as on the pricing guide.
   - **Otherwise:** one gold button to the most relevant GSWAU page instead. Choose from what
     exists in `src/routes/` (for example `/courses`, `/library`, `/coaching`, `/programs`,
     `/podcast`, `/videos`, `/membership`, `/blog/<slug>`). Use a `Link` and a fitting
     lucide icon. Say in the pull request which page you chose and why.
4. "…, step by step" with a numbered list (`<ol>`).
5. Common mistakes.
6. The worked example box, labelled **"Example only"**, with the line "These numbers are made
   up to show the method. Use your own."
7. Any extra section the topic truly needs (keep it short; the pricing guide's "when to raise
   your prices" is the model).
8. FAQ with `id="faq"`.
9. **Related guides**: a short `<h2>Related guides</h2>` list of 1–2 links to related existing
   guides (see Step 6).
10. The closing cards, like the pricing guide's:
    - The Price Shift card (only if the topic is about pricing or money), with its buy link built
      from `courseOffers["the-price-shift-course"]` and `gumroadLink()`, and a "See membership"
      link to `/pricing`.
    - Otherwise a GSWAU membership card linking to `/pricing`, plus a card for the most relevant
      page from point 3. Do not write a price in the text unless the pricing guide already
      shows that exact price.

`head` must use `shareMeta` exactly like the pricing guide:

- `title`: `"<Title> — GSWAU"` (with the long dash —)
- `description`, `path`, `type: "article"`, `article:published_time`
- `jsonLd`: `breadcrumbList`, an `Article` node with `author: { "@type": "Person", name: author.name }`
  and `publisher` GSWAU, and `faqPage(...)` built from the FAQ list. The canonical URL comes from
  `canonicalUrl(path)`.

## Step 5 — Sitemap and tests

1. Add `/guides/<slug>` to `publicPaths` in `src/lib/sitemap.ts`, right after the other guides.
2. Add a matching `expect(xml).toContain("<loc>https://gswau.com/guides/<slug></loc>")` line in
   the sitemap test in `src/test/site-fixes.test.ts`.
3. Create `src/test/<slug>-guide.test.ts`, like `src/test/pricing-guide.test.ts`:
   - the example arithmetic gives the round numbers shown (if there is arithmetic)
   - the title is `"<Title> — GSWAU"`, the description is 160 characters or fewer, there are at
     least 4 FAQs, and the structured data contains `FAQPage`, `Gs. W. Augustin` and every FAQ
     question
   - the short answer is 2–4 sentences

## Step 6 — Link the guides together

1. Pick 1–2 existing guides that are most related. (If only one guide exists, use that one.)
2. In the new guide's "Related guides" section, link to them.
3. In each of those guides, add a link back to the new guide in its own "Related guides"
   section, placed just before the closing cards. If that guide has no such section yet, add one
   with the same `<h2>` style inside its `Prose` block. This is the only change allowed to
   existing guides.

## Step 7 — Check everything

Run, and fix anything that fails:

1. `npx vite build` (this also updates `src/routeTree.gen.ts`; commit that file's change)
2. `npx tsc --noEmit`
3. `npx vitest run`
4. `npx eslint src` (no new errors)

Then look at the page yourself: start the dev server with the `gswau-dev` launch configuration
(or `npm run dev`, port 8080), open `/guides/<slug>` in the built-in browser at phone width
(375 px) and at desktop width. Check: nothing runs off the side, the short answer box and
example box look like the pricing guide's, every link and button goes somewhere real, and the
Related guides links work both ways. Stop the server when done.

Finally re-read the page text against the checklist at the bottom of `docs/brand/voice.md`.

## Step 8 — Tick the topic

In `docs/guides/ideas.md`, change the topic's `- [ ]` to `- [x]` and add ` — /guides/<slug>` at
the end. If the question was not on the list, add it as a ticked line.

## Step 9 — Commit and open the pull request

1. `git status` and `git diff --cached --name-only`. Make sure **no** `.env` file, key, token or
   secret is staged, and that only the allowed files changed. Stage files by name, never with
   `git add -A` or `git add .`.
2. Commit with a plain-English message: `Add the guide: <Title>`.
3. `git push -u origin guide/<slug>`.
4. Open the pull request with `gh pr create --base main`, title `Add the guide: <Title>`, and
   this body:

   ```
   ## Preview
   <Vercel preview link to /guides/<slug> — added once Vercel posts it>

   ## Summary
   - <line 1: what question the page answers>
   - <line 2: what the reader gets: steps, mistakes, example, FAQ>
   - <line 3: what it links to: button, related guides, closing cards>

   ## The short answer
   > <the short answer text, exactly as on the page>

   ## Claims to double-check
   - <every statement that depends on a fact you were not given: laws, tax rules, platform
     rules, typical amounts, anything you are not certain of. If there are none, say "None —
     the only numbers are the labelled example.">

   ## Checks
   <build, type check, tests, lint, phone and desktop width>

   ## Not changed
   No other page, design, product, price or payment setting. No `.env` or secrets.
   ```

5. Wait for Vercel's preview comment on the pull request (it usually appears within a few
   minutes). Take its Preview link, add `/guides/<slug>` to the end, and put it in the
   "Preview" section with `gh pr edit`. If it has not appeared after about 10 minutes, say so
   in the pull request and tell the owner.
6. **Do not merge.** Tell the owner, in plain English: the pull request link, the preview link,
   the short answer, and the claims to double-check. Then remind them that once they say
   "merge" and it is live, they can request indexing as described in `docs/guides/HOW-TO-USE.md`.
