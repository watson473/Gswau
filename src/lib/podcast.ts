// The show on Spotify. Episodes are rows in podcast_episodes (Admin > Podcast); an episode's
// audio link can be an MP3 or its Spotify episode link, which plays in Spotify's own player.
export const podcastName = "Clippers and Shears";
export const spotifyShowUrl = "https://open.spotify.com/show/65QG3LPqhf9qn4ddtSZaGE";
export const spotifyShowEmbedUrl =
  "https://open.spotify.com/embed/show/65QG3LPqhf9qn4ddtSZaGE?theme=0";

// "https://open.spotify.com/episode/4WgXk6Oo6Pg3vdPl4AJdZp?si=…" -> "4WgXk6Oo6Pg3vdPl4AJdZp"
export function spotifyEpisodeId(url: string): string | null {
  const m = /^https:\/\/open\.spotify\.com\/(?:intl-[a-z-]+\/)?episode\/([A-Za-z0-9]{22})/.exec(
    url.trim(),
  );
  return m ? m[1]! : null;
}
