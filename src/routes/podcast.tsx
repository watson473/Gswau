import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { episodesQuery } from "@/lib/catalog.functions";
import {
  formatEpisodeDate,
  podcastName,
  spotifyEpisodeId,
  spotifyShowEmbedUrl,
  spotifyShowUrl,
} from "@/lib/podcast";
import { useT } from "@/i18n";
import { Eyebrow } from "@/components/SiteChrome";
import { EpisodePlayer } from "@/components/EpisodePlayer";

export const Route = createFileRoute("/podcast")({
  head: () => ({
    meta: [
      { title: `${podcastName} Podcast — GSWAU` },
      {
        name: "description",
        content: `Listen free: ${podcastName}, the podcast for barbers and hairstylists from Gs. W. Augustin.`,
      },
      { property: "og:title", content: `${podcastName} Podcast` },
      { property: "og:description", content: "Free episodes for barbers and hairstylists." },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(episodesQuery),
  component: Podcast,
});

function Podcast() {
  const { data } = useSuspenseQuery(episodesQuery);
  const { locale } = useT();
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <Eyebrow>Listen free</Eyebrow>
      <h1 className="mt-3 text-5xl font-semibold">{podcastName}</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        The podcast for barbers and hairstylists from Gs. W. Augustin: building wealth behind the
        chair, the craft itself, and the science of hair.
      </p>
      <a href={spotifyShowUrl} target="_blank" rel="noopener" className="btn-gold mt-6 inline-flex">
        Open the show on Spotify
      </a>
      {data.length === 0 ? (
        // No episodes yet (no Spotify keys, nothing in Admin > Podcast): Spotify's show player.
        <iframe
          title={`${podcastName} on Spotify`}
          src={spotifyShowEmbedUrl}
          className="mt-12 h-[352px] w-full rounded-xl border-0"
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        />
      ) : (
        <div className="mt-12 divide-y divide-border">
          {data.map((ep) => (
            <article key={ep.id} className="flex gap-6 py-8">
              {ep.image && !spotifyEpisodeId(ep.audioUrl) && (
                <img
                  src={ep.image}
                  alt=""
                  className="hidden h-28 w-28 shrink-0 rounded-md object-cover sm:block"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="eyebrow text-muted-foreground">
                  {[formatEpisodeDate(ep.publishedAt, locale), ep.durationLabel]
                    .filter(Boolean)
                    .join(" · ")}
                </div>
                <h2 className="mt-1 text-2xl font-semibold">{ep.title}</h2>
                {ep.description && (
                  <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                    {ep.description}
                  </p>
                )}
                <EpisodePlayer url={ep.audioUrl} title={ep.title} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
