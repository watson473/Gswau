import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postQuery } from "@/lib/catalog.functions";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    const post = await context.queryClient.ensureQueryData(postQuery(params.slug));
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Not found — GSWAU" }, { name: "robots", content: "noindex" }] };
    const meta = [
      { title: `${loaderData.title} — GSWAU Blog` },
      { name: "description", content: loaderData.excerpt },
      { property: "og:title", content: loaderData.title },
      { property: "og:description", content: loaderData.excerpt },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    if (loaderData.cover_image_url?.startsWith("https://"))
      meta.push(
        { property: "og:image", content: loaderData.cover_image_url },
        { name: "twitter:image", content: loaderData.cover_image_url },
      );
    return { meta };
  },
  component: Post,
});

function Post() {
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(postQuery(slug));
  if (!p) return null;
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <div className="eyebrow text-crimson">
        {p.published_at ? new Date(p.published_at).toLocaleDateString() : ""}
      </div>
      <h1 className="mt-3 text-5xl font-semibold leading-tight">{p.title}</h1>
      {p.cover_image_url && (
        <img src={p.cover_image_url} alt="" className="mt-8 w-full rounded-md object-cover" />
      )}
      <PostBody body={p.body} />
    </article>
  );
}

// Plain text with blank lines between paragraphs; a paragraph starting "## " is a subheading,
// and one whose lines all start "- " is a bullet list.
function PostBody({ body }: { body: string }) {
  const blocks = body
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  return (
    <div className="mt-8 space-y-5 text-lg leading-relaxed">
      {blocks.map((b, i) => {
        if (b.startsWith("## "))
          return (
            <h2 key={i} className="pt-4 text-3xl font-semibold">
              {b.slice(3)}
            </h2>
          );
        const lines = b.split("\n");
        if (lines.every((l) => l.startsWith("- ")))
          return (
            <ul key={i} className="list-disc space-y-2 pl-6">
              {lines.map((l, j) => (
                <li key={j}>{l.slice(2)}</li>
              ))}
            </ul>
          );
        return (
          <p key={i} className="whitespace-pre-line">
            {b}
          </p>
        );
      })}
    </div>
  );
}
