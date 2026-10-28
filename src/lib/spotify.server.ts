// Server-only: reads the show's episodes from Spotify's Web API with the app's own keys
// (client credentials; no visitor login). Needs SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET.
import {
  episodeFromSpotify,
  spotifyShowId,
  type PodcastEpisode,
  type SpotifyApiEpisode,
} from "./podcast";

let token: { value: string; expires: number } | null = null;
let cached: { at: number; episodes: PodcastEpisode[] } | null = null;
const CACHE_MS = 10 * 60 * 1000; // new episodes show up within ten minutes

async function accessToken(id: string, secret: string) {
  if (token && token.expires > Date.now() + 60_000) return token.value;
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });
  if (!res.ok) throw new Error(`Spotify token: ${res.status}`);
  const body = (await res.json()) as { access_token: string; expires_in: number };
  token = { value: body.access_token, expires: Date.now() + body.expires_in * 1000 };
  return token.value;
}

// Newest first, or null when the keys are not set.
export async function spotifyEpisodes(): Promise<PodcastEpisode[] | null> {
  const id = process.env["SPOTIFY_CLIENT_ID"];
  const secret = process.env["SPOTIFY_CLIENT_SECRET"];
  if (!id || !secret) return null;
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.episodes;
  const res = await fetch(
    `https://api.spotify.com/v1/shows/${spotifyShowId}/episodes?market=US&limit=50`,
    { headers: { Authorization: `Bearer ${await accessToken(id, secret)}` } },
  );
  if (!res.ok) throw new Error(`Spotify episodes: ${res.status}`);
  const body = (await res.json()) as { items: (SpotifyApiEpisode | null)[] };
  const episodes = body.items
    .filter((e): e is SpotifyApiEpisode => !!e && e.is_playable !== false)
    .map(episodeFromSpotify)
    .sort((a, b) => (b.publishedAt ?? "").localeCompare(a.publishedAt ?? ""));
  cached = { at: Date.now(), episodes };
  return episodes;
}
