# How to make a new guide

Guides are pages on gswau.com that answer one question a barber asks, like
"How do I price my barber services?". They are made with the `/new-guide` command.

## 1. Start it

Open this project in Claude Code and type:

```
/new-guide how do I get more clients as a barber?
```

Or type `/new-guide` with nothing after it to take the next unticked topic from
`docs/guides/ideas.md`.

Claude then:

- starts a fresh copy of the site from the latest main (your other work is left alone),
- checks that no guide already answers the question (if one does, it stops and tells you),
- writes the page in the same layout as the pricing guide, following `docs/brand/voice.md`,
- links it to related guides, adds it to the sitemap, runs the checks,
- opens a pull request (a "proposed change") for you to review.

It never publishes the page by itself.

## 2. Review it

Claude gives you a pull request link and a **preview link**.

1. Open the **preview link** on your phone and on your computer. This is the real page, but not
   live yet.
2. Read the **short answer** at the top. Does it answer the question the way you would?
3. Read the **"Claims to double-check"** list in the pull request. Check each one, or tell Claude
   to remove it.
4. Read the rest of the page. Anything that sounds wrong or not like you, tell Claude in plain
   words, for example: "Change step 3 to say…" or "Remove the second FAQ." Claude updates the
   same pull request and the preview refreshes in a few minutes.
5. When you are happy, tell Claude **"merge"**. The page goes live on gswau.com a few minutes
   later.

## 3. Tell Google about it (after it is live)

1. Go to [Google Search Console](https://search.google.com/search-console) and pick the
   gswau.com property.
2. In the search bar at the top ("Inspect any URL"), paste the full page address, for example
   `https://gswau.com/guides/how-to-get-more-barber-clients`, and press Enter.
3. Wait for the check to finish. It will probably say "URL is not on Google". That is normal for
   a new page.
4. Click **Request indexing**. Wait a minute until it says the request was sent.
5. Do the same for any older guide that now links to the new one, so Google sees the new link.

Google usually picks it up within a few days to a couple of weeks. You do not need to request
it again unless you change the page a lot.

The sitemap (`https://gswau.com/sitemap.xml`) updates by itself, so there is nothing to do there.

## Changing the rules

- **How guides should sound:** edit `docs/brand/voice.md`.
- **Topics to write about:** edit `docs/guides/ideas.md`. Add a line starting with `- [ ]`.
- **How the command works:** `.claude/commands/new-guide.md`. Ask Claude to change it for you.
