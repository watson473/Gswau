// The show. Episodes come from its RSS feed (Spotify for Creators), so new episodes appear on
// their own; if the feed can't be read, from podcast_episodes (Admin > Podcast). An episode's
// audio link can be an MP3, which plays in the site's own player, or a Spotify episode link,
// which plays in Spotify's player.
export const podcastName = "Clippers and Shears";
export const spotifyShowId = "65QG3LPqhf9qn4ddtSZaGE";
export const spotifyShowUrl = `https://open.spotify.com/show/${spotifyShowId}`;
export const spotifyShowEmbedUrl = `https://open.spotify.com/embed/show/${spotifyShowId}?theme=0`;
export const podcastRssUrl = "https://anchor.fm/s/104356740/podcast/rss";

export type PodcastEpisode = {
  id: string;
  title: string;
  description: string;
  publishedAt: string | null;
  durationLabel: string | null;
  audioUrl: string;
  image: string | null;
};

// "https://open.spotify.com/episode/4WgXk6Oo6Pg3vdPl4AJdZp?si=…" -> "4WgXk6Oo6Pg3vdPl4AJdZp"
export function spotifyEpisodeId(url: string): string | null {
  const m = /^https:\/\/open\.spotify\.com\/(?:intl-[a-z-]+\/)?episode\/([A-Za-z0-9]{22})/.exec(
    url.trim(),
  );
  return m ? m[1]! : null;
}

function decodeEntities(text: string) {
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, h: string) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d: string) => String.fromCodePoint(Number(d)))
    .replace(/&nbsp;/g, " ")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

// A tag's text, with CDATA unwrapped and entities decoded.
function tagText(xml: string, tag: string) {
  const m = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`).exec(xml);
  if (!m) return "";
  const raw = m[1]!.trim();
  const cdata = /^<!\[CDATA\[([\s\S]*?)\]\]>$/.exec(raw);
  return cdata ? cdata[1]! : decodeEntities(raw);
}

function tagAttr(xml: string, tag: string, attr: string) {
  const m = new RegExp(`<${tag}\\s[^>]*?${attr}="([^"]*)"`).exec(xml);
  return m ? decodeEntities(m[1]!) : null;
}

// Episode notes come as HTML; keep the words and paragraph breaks.
function htmlToText(html: string) {
  return decodeEntities(
    html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h\d)>/gi, "\n\n")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// "Podcast Episode 3 : Part 2-The Science…" -> "Episode 3, Part 2: The Science…"
export function tidyEpisodeTitle(title: string) {
  return title
    .trim()
    .replace(/^Podcast\s+Episode\s+(\d+)\s*:\s*Part\s+(\d+)\s*[-:–]\s*/i, "Episode $1, Part $2: ")
    .replace(/^Podcast\s+Episode\s+(\d+)\s*:\s*/i, "Episode $1: ")
    .replace(/\.$/, "");
}

// "00:24:14" or "1454" (seconds) -> "24 min"
function durationLabel(value: string) {
  if (!value) return null;
  const seconds = value
    .split(":")
    .map(Number)
    .reduce((total, part) => total * 60 + part, 0);
  return Number.isFinite(seconds) && seconds > 0
    ? `${Math.max(1, Math.round(seconds / 60))} min`
    : null;
}

// The show's RSS feed as the site's episodes, newest first.
export function episodesFromRss(xml: string): PodcastEpisode[] {
  const channelImage = tagAttr(xml.split("<item>")[0] ?? "", "itunes:image", "href");
  const episodes: PodcastEpisode[] = [];
  for (const [, item] of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)) {
    const audioUrl = tagAttr(item!, "enclosure", "url");
    if (!audioUrl) continue;
    const pubDate = tagText(item!, "pubDate");
    const date = pubDate ? new Date(pubDate) : null;
    episodes.push({
      id: tagText(item!, "guid") || audioUrl,
      title: tidyEpisodeTitle(tagText(item!, "title")),
      description: htmlToText(tagText(item!, "description")),
      publishedAt: date && !Number.isNaN(date.getTime()) ? date.toISOString() : null,
      durationLabel: durationLabel(tagText(item!, "itunes:duration")),
      audioUrl,
      image: tagAttr(item!, "itunes:image", "href") ?? channelImage,
    });
  }
  return episodes.sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
}

// Release dates are shown as the calendar day Spotify uses (UTC), so no time zone shifts them.
export function formatEpisodeDate(publishedAt: string | null, locale?: string) {
  if (!publishedAt) return "";
  const d = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(publishedAt) ? `${publishedAt}T12:00:00Z` : publishedAt,
  );
  return d.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
