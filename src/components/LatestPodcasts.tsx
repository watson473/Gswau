import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { EpisodePlayer } from "@/components/EpisodePlayer";
import {
  formatEpisodeDate,
  podcastName,
  spotifyShowEmbedUrl,
  type PodcastEpisode,
} from "@/lib/podcast";
import { useT } from "@/i18n";

// Homepage "Latest Podcasts": a big player (the newest episode to start with) and the other
// episodes beside it. Choosing one starts it playing in the big player.
export function LatestPodcasts({ episodes }: { episodes: PodcastEpisode[] }) {
  const { t, locale } = useT();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const current = episodes.find((e) => e.id === selectedId) ?? episodes[0];
  const others = episodes.filter((e) => e !== current).slice(0, 5);
  const meta = (e: PodcastEpisode) =>
    [formatEpisodeDate(e.publishedAt, locale), e.durationLabel].filter(Boolean).join(" · ");

  return (
    <section className="bg-navy-gradient py-16 text-primary-foreground sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-gold" />
          <span className="eyebrow text-gold">{podcastName}</span>
        </div>
        <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">{t("home.podcast.title")}</h2>

        <div className="mt-10 grid gap-8 lg:grid-cols-[3fr_2fr]">
          <div className="rounded-lg bg-white/5 p-5 ring-1 ring-gold/25 sm:p-6">
            {current ? (
              <>
                <div className="eyebrow text-gold">
                  {current === episodes[0] ? t("home.podcast.newest") : t("home.podcast.playing")}
                </div>
                <h3 className="mt-2 text-2xl font-semibold leading-snug sm:text-3xl">
                  {current.title}
                </h3>
                <p className="mt-1 text-sm text-primary-foreground/60">{meta(current)}</p>
                <EpisodePlayer
                  url={current.audioUrl}
                  title={current.title}
                  image={current.image}
                  durationLabel={current.durationLabel}
                  size="large"
                  autoPlay={selectedId !== null}
                />
              </>
            ) : (
              <iframe
                title={`${podcastName} on Spotify`}
                src={spotifyShowEmbedUrl}
                className="h-[352px] w-full rounded-xl border-0"
                loading="lazy"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              />
            )}
          </div>

          {others.length > 0 && (
            <div>
              <div className="eyebrow text-primary-foreground/60">{t("home.podcast.more")}</div>
              <ul className="mt-4 divide-y divide-gold/15 border-y border-gold/15">
                {others.map((e) => (
                  <li key={e.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(e.id)}
                      className="group flex w-full items-center gap-4 py-4 text-left"
                    >
                      {e.image ? (
                        <img
                          src={e.image}
                          alt=""
                          loading="lazy"
                          className="h-16 w-16 shrink-0 rounded-md object-cover ring-1 ring-gold/20"
                        />
                      ) : (
                        <span className="h-16 w-16 shrink-0 rounded-md bg-white/5 ring-1 ring-gold/20" />
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 font-semibold leading-snug group-hover:text-gold">
                          {e.title}
                        </span>
                        <span className="mt-1 block text-xs text-primary-foreground/60">
                          {meta(e)}
                        </span>
                      </span>
                      <span
                        aria-label={t("home.podcast.play", { title: e.title })}
                        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gold-gradient text-navy-deep transition group-hover:brightness-110"
                      >
                        <svg viewBox="0 0 24 24" className="ml-0.5 h-4 w-4" aria-hidden="true">
                          <path d="M8 5v14l11-7z" fill="currentColor" />
                        </svg>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="mt-12 text-center">
          <Link to="/podcast" className="btn-gold">
            {t("home.podcast.listenAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
