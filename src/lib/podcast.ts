// The show on Spotify. Episodes come straight from Spotify when SPOTIFY_CLIENT_ID and
// SPOTIFY_CLIENT_SECRET are set on the host (new episodes appear on their own); otherwise from
// podcast_episodes (Admin > Podcast). An episode's audio link can be an MP3 or its Spotify
// episode link, which plays in Spotify's own player.
export const podcastName = "Clippers and Shears";
export const spotifyShowId = "65QG3LPqhf9qn4ddtSZaGE";
export const spotifyShowUrl = `https://open.spotify.com/show/${spotifyShowId}`;
export const spotifyShowEmbedUrl = `https://open.spotify.com/embed/show/${spotifyShowId}?theme=0`;

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

export type SpotifyApiEpisode = {
  id: string;
  name: string;
  description?: string;
  release_date?: string;
  duration_ms?: number;
  images?: { url: string; width?: number | null }[];
  is_playable?: boolean;
};

// One episode from Spotify's Web API (GET /v1/shows/{id}/episodes) in the site's shape.
export function episodeFromSpotify(e: SpotifyApiEpisode): PodcastEpisode {
  const images = [...(e.images ?? [])].sort((a, b) => (b.width ?? 0) - (a.width ?? 0));
  return {
    id: e.id,
    title: e.name,
    description: e.description ?? "",
    publishedAt: e.release_date ?? null,
    durationLabel: e.duration_ms ? `${Math.max(1, Math.round(e.duration_ms / 60000))} min` : null,
    audioUrl: `https://open.spotify.com/episode/${e.id}`,
    image: images[0]?.url ?? null,
  };
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
