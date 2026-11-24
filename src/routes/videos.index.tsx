import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { author } from "@/lib/catalog";
import { isNewlyPublished } from "@/lib/new-drop";
import { pageMeta } from "@/lib/share";
import { videosQuery } from "@/lib/youtube.functions";
import {
  youtubeChannelUrl,
  youtubeThumbnailUrl,
  youtubeWatchUrl,
  type YoutubeVideo,
} from "@/lib/videos";
import { NewRibbon } from "@/components/NewRibbon";

export const Route = createFileRoute("/videos/")({
  head: () =>
    pageMeta(
      "Videos",
      `Long lessons from ${author.name} for barbers and hairstylists, on the GSWAU YouTube channel.`,
      "/videos",
    ),
  loader: ({ context }) => context.queryClient.ensureQueryData(videosQuery),
  component: Videos,
});

function Videos() {
  const { data } = useSuspenseQuery(videosQuery);
  return (
    <div className="dark min-h-[60vh] bg-navy-deep text-white">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-sans text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Latest <span className="text-gold">Videos</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/55">
              Long lessons for barbers and hairstylists, from the chair to the numbers.
            </p>
          </div>
          <a
            href={youtubeChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-gold/50 px-5 py-2.5 font-sans text-sm font-semibold text-white shadow-[0_0_24px_-6px_var(--gold)] transition hover:border-gold"
          >
            View all videos
          </a>
        </div>
        <VideoList videos={data} />
      </div>
    </div>
  );
}

function VideoList({ videos }: { videos: YoutubeVideo[] }) {
  if (videos.length === 0) {
    return (
      <p className="mt-12 text-sm text-white/55">
        Long lessons will appear here as they are published.
      </p>
    );
  }
  const only = videos[0];
  if (videos.length === 1 && only) {
    return (
      <ul className="mt-12">
        <li className="max-w-4xl">
          <BigCard video={only} featured />
        </li>
      </ul>
    );
  }
  const big = videos.slice(0, Math.min(3, videos.length));
  const small = videos.slice(big.length);
  const columns = big.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";
  return (
    <>
      <ul className={`mt-12 grid grid-cols-1 gap-x-8 gap-y-12 ${columns}`}>
        {big.map((video) => (
          <li key={video.id}>
            <BigCard video={video} />
          </li>
        ))}
      </ul>
      {small.length > 0 && (
        <ul className="mt-14 grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
          {small.map((video) => (
            <li key={video.id}>
              <SmallCard video={video} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function BigCard({ video, featured = false }: { video: YoutubeVideo; featured?: boolean }) {
  return (
    <a
      href={youtubeWatchUrl(video.id)}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <img
        src={youtubeThumbnailUrl(video.id)}
        alt=""
        width={1280}
        height={720}
        loading="lazy"
        decoding="async"
        className="aspect-video w-full object-cover"
      />
      <h2
        className={`mt-4 font-sans font-bold leading-snug text-white group-hover:text-gold ${
          featured ? "text-2xl sm:text-3xl" : "text-xl sm:text-2xl"
        }`}
      >
        <Title video={video} />
      </h2>
    </a>
  );
}

function SmallCard({ video }: { video: YoutubeVideo }) {
  return (
    <a
      href={youtubeWatchUrl(video.id)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
    >
      <img
        src={youtubeThumbnailUrl(video.id)}
        alt=""
        width={320}
        height={180}
        loading="lazy"
        decoding="async"
        className="aspect-video w-full object-cover sm:w-40 sm:shrink-0"
      />
      <h2 className="min-w-0 font-sans text-base font-bold leading-snug text-white group-hover:text-gold sm:text-lg">
        <Title video={video} />
      </h2>
    </a>
  );
}

function Title({ video }: { video: YoutubeVideo }) {
  return (
    <span className="flex flex-col items-start gap-2">
      {isNewlyPublished(video.publishedAt) && <NewRibbon />}
      <span className="line-clamp-3">{video.title}</span>
    </span>
  );
}
