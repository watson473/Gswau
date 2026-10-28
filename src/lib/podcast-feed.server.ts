// Server-only: reads the show's episodes from its public RSS feed, so new episodes appear on the
// site on their own. Kept for ten minutes between reads.
import { episodesFromRss, podcastRssUrl, type PodcastEpisode } from "./podcast";

let cached: { at: number; episodes: PodcastEpisode[] } | null = null;
const CACHE_MS = 10 * 60 * 1000;

export async function feedEpisodes(): Promise<PodcastEpisode[]> {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.episodes;
  const res = await fetch(podcastRssUrl, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`Podcast feed: ${res.status}`);
  const episodes = episodesFromRss(await res.text());
  cached = { at: Date.now(), episodes };
  return episodes;
}
