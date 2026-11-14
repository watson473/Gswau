import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { postsQuery } from "@/lib/catalog.functions";
import { Eyebrow } from "@/components/SiteChrome";
import { blogIndexNode, breadcrumbList, jsonLdGraph, shareMeta } from "@/lib/share";

export const Route = createFileRoute("/blog/")({
  head: () => {
    const description = "Articles from Gs. W. Augustin on growing a barber or beauty business.";
    return shareMeta({
      title: "Blog — GSWAU",
      description,
      path: "/blog",
      jsonLd: jsonLdGraph(
        breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
        ]),
        blogIndexNode(),
      ),
    });
  },
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  component: Blog,
});

function Blog() {
  const { data } = useSuspenseQuery(postsQuery);
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <Eyebrow>Journal</Eyebrow>
      <h1 className="mt-3 text-5xl font-semibold">Blog</h1>
      {data.length === 0 ? (
        <p className="mt-10 text-muted-foreground">New articles are coming soon.</p>
      ) : (
        <div className="mt-10 divide-y divide-border">
          {data.map((p) => (
            <Link
              key={p.id}
              to="/blog/$slug"
              params={{ slug: p.slug }}
              className="group flex gap-6 py-8"
            >
              {p.cover_image_url && (
                <img
                  src={p.cover_image_url}
                  alt=""
                  className="h-28 w-40 shrink-0 rounded-md object-cover"
                />
              )}
              <div>
                <div className="eyebrow text-muted-foreground">
                  {p.published_at ? new Date(p.published_at).toLocaleDateString() : ""}
                </div>
                <h2 className="mt-1 text-2xl font-semibold group-hover:text-primary">{p.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
