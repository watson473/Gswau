import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { episodesQuery } from "@/lib/catalog.functions";
import { Eyebrow } from "@/components/SiteChrome";

export const Route = createFileRoute("/podcast")({
  head: () => ({
    meta: [
      { title: "Podcast — GSWAU" },
      {
        name: "description",
        content: "Listen free: business talk for barbers and stylists from Gs. W. Augustin.",
      },
      { property: "og:title", content: "The GSWAU Podcast" },
      { property: "og:description", content: "Free episodes for barbers and stylists." },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(episodesQuery),
  component: Podcast,
});

function Podcast() {
  const { data } = useSuspenseQuery(episodesQuery);
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <Eyebrow>Listen free</Eyebrow>
      <h1 className="mt-3 text-5xl font-semibold">Podcast</h1>
      {data.length === 0 ? (
        <p className="mt-10 text-muted-foreground">New episodes are coming soon.</p>
      ) : (
        <div className="mt-10 divide-y divide-border">
          {data.map((ep) => (
            <article key={ep.id} className="flex gap-6 py-8">
              {ep.cover_image_url && (
                <img
                  src={ep.cover_image_url}
                  alt=""
                  className="hidden h-28 w-28 shrink-0 rounded-md object-cover sm:block"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="eyebrow text-muted-foreground">
                  {ep.published_at ? new Date(ep.published_at).toLocaleDateString() : ""}
                  {ep.duration_label ? ` · ${ep.duration_label}` : ""}
                </div>
                <h2 className="mt-1 text-2xl font-semibold">{ep.title}</h2>
                {ep.description && (
                  <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">
                    {ep.description}
                  </p>
                )}
                <audio controls preload="none" src={ep.audio_url} className="mt-4 w-full" />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
