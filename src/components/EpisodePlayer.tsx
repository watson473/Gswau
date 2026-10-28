import { useEffect, useRef, useState } from "react";
import { spotifyEpisodeId } from "@/lib/podcast";
import { track } from "@/lib/analytics";
import { useT } from "@/i18n";

// Spotify episode links play in Spotify's player; anything else is an audio file played in the
// site's own navy and gold player. "large" is the big player with full-size artwork.
export function EpisodePlayer({
  url,
  title,
  image,
  durationLabel,
  size = "compact",
  autoPlay = false,
}: {
  url: string;
  title: string;
  image?: string | null;
  durationLabel?: string | null;
  size?: "compact" | "large";
  autoPlay?: boolean;
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
    <AudioPlayer
      key={url}
      url={url}
      title={title}
      image={image ?? null}
      durationLabel={durationLabel ?? null}
      large={size === "large"}
      autoPlay={autoPlay}
    />
  );
}

function clock(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const s = Math.floor(seconds);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const rest = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${rest}` : `${m}:${rest}`;
}

function AudioPlayer({
  url,
  title,
  image,
  durationLabel,
  large,
  autoPlay,
}: {
  url: string;
  title: string;
  image: string | null;
  durationLabel: string | null;
  large: boolean;
  autoPlay: boolean;
}) {
  const { t } = useT();
  const audio = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const tracked = useRef(false);

  useEffect(() => {
    if (autoPlay) void audio.current?.play().catch(() => {});
  }, [autoPlay]);

  function toggle() {
    const el = audio.current;
    if (!el) return;
    if (el.paused) void el.play().catch(() => {});
    else el.pause();
  }

  function onPlay() {
    setPlaying(true);
    // One episode at a time across the page.
    for (const other of document.querySelectorAll("audio"))
      if (other !== audio.current) other.pause();
    if (!tracked.current) {
      tracked.current = true;
      track("podcast_play", { title });
    }
  }

  const controls = (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? t("player.pause") : t("player.play", { title })}
        className={`grid shrink-0 place-items-center rounded-full bg-gold-gradient text-navy-deep shadow-lg transition hover:brightness-110 ${large ? "h-16 w-16" : "h-12 w-12"}`}
      >
        {playing ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path d="M7 5h4v14H7zM13 5h4v14h-4z" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5" aria-hidden="true">
            <path d="M8 5v14l11-7z" fill="currentColor" />
          </svg>
        )}
      </button>
      <div className="min-w-0 flex-1">
        <input
          type="range"
          min={0}
          max={duration || 0}
          step={1}
          value={Math.min(time, duration || 0)}
          disabled={!duration}
          onChange={(e) => {
            if (audio.current) audio.current.currentTime = Number(e.target.value);
          }}
          aria-label={t("player.seek")}
          className="w-full accent-[var(--gold)]"
        />
        <div className="mt-1 flex justify-between text-xs text-primary-foreground/60">
          <span>{clock(time)}</span>
          <span>{duration ? clock(duration) : (durationLabel ?? "")}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`mt-4 rounded-xl bg-navy-deep p-4 text-primary-foreground ring-1 ring-gold/25 ${large ? "sm:p-5" : ""}`}
    >
      <audio
        ref={audio}
        src={url}
        preload="metadata"
        onPlay={onPlay}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
      {large ? (
        <div className="grid items-center gap-5 sm:grid-cols-[180px_1fr]">
          {image && (
            <img
              src={image}
              alt=""
              className="aspect-square w-full max-w-[220px] rounded-lg object-cover ring-1 ring-gold/30"
            />
          )}
          {controls}
        </div>
      ) : (
        controls
      )}
    </div>
  );
}
