import { spotifyEpisodeId } from "@/lib/podcast";
import { track } from "@/lib/analytics";

// Spotify episode links play in Spotify's player; anything else is treated as an audio file.
export function EpisodePlayer({ url, title }: { url: string; title: string }) {
  const spotifyId = spotifyEpisodeId(url);
  if (spotifyId)
    return (
      <iframe
        title={`${title} on Spotify`}
        src={`https://open.spotify.com/embed/episode/${spotifyId}?theme=0`}
        className="mt-4 h-[152px] w-full rounded-xl border-0"
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
    );
  return (
    <audio
      controls
      preload="none"
      src={url}
      className="mt-4 w-full"
      onPlay={() => track("podcast_play", { title })}
    />
  );
}
