import { spotifyEpisodeId } from "@/lib/podcast";
import { track } from "@/lib/analytics";

// Spotify episode links play in Spotify's player; anything else is treated as an audio file.
// "large" is the big player with full-size artwork.
export function EpisodePlayer({
  url,
  title,
  image,
  size = "compact",
}: {
  url: string;
  title: string;
  image?: string | null;
  size?: "compact" | "large";
}) {
  const spotifyId = spotifyEpisodeId(url);
  if (spotifyId)
    return (
      <iframe
        key={spotifyId}
        title={`${title} on Spotify`}
        src={`https://open.spotify.com/embed/episode/${spotifyId}?theme=0`}
        className={`mt-4 w-full rounded-xl border-0 ${size === "large" ? "h-[352px]" : "h-[152px]"}`}
        loading="lazy"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      />
    );
  return (
    <div className="mt-4">
      {size === "large" && image && (
        <img
          src={image}
          alt=""
          className="mb-4 aspect-square w-full max-w-sm rounded-xl object-cover"
        />
      )}
      <audio
        key={url}
        controls
        preload="none"
        src={url}
        className="w-full"
        onPlay={() => track("podcast_play", { title })}
      />
    </div>
  );
}
