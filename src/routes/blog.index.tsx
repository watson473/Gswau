import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { mergePublishedPosts } from "@/lib/blog-posts";
import { author } from "@/lib/catalog";
import { postsQuery } from "@/lib/catalog.functions";
import { formatPostDate, imageSrc } from "@/lib/display";
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
  const posts = mergePublishedPosts(data);
  const [lead, ...rest] = posts;
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <Eyebrow>Journal</Eyebrow>
      <h1 className="mt-3 text-5xl font-semibold">Blog</h1>
      {posts.length === 0 ? (
        <p className="mt-10 text-muted-foreground">New articles are coming soon.</p>
      ) : (
        <div className="mt-10">
          {lead && <PostLink post={lead} featured />}
          {rest.length > 0 && (
            <div className="divide-y divide-border border-t border-border">
              {rest.map((p) => (
                <PostLink key={p.id} post={p} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function PostLink({
  post,
  featured = false,
}: {
  post: ReturnType<typeof mergePublishedPosts>[number];
  featured?: boolean;
}) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className={featured ? "group block pb-10" : "group flex gap-6 py-8"}
    >
      {post.cover_image_url && (
        <img
          src={imageSrc(post.cover_image_url, featured ? 1200 : 640)}
          alt={post.title}
          width={featured ? 896 : 160}
          height={featured ? 384 : 112}
          loading="lazy"
          decoding="async"
          className={
            featured
              ? "mt-4 h-72 w-full rounded-md object-cover"
              : "h-28 w-40 shrink-0 rounded-md object-cover"
          }
        />
      )}
      <div>
        <div className="eyebrow text-muted-foreground">
          {featured && <span className="text-crimson">Featured · </span>}
          {[post.kicker, formatPostDate(post.published_at), author.name]
            .filter(Boolean)
            .join(" · ")}
        </div>
        <h2
          className={
            featured
              ? "mt-2 text-4xl font-semibold leading-tight group-hover:text-primary sm:text-5xl"
              : "mt-1 text-2xl font-semibold group-hover:text-primary"
          }
        >
          {post.title}
        </h2>
        <p
          className={
            featured ? "mt-4 text-lg text-muted-foreground" : "mt-2 text-sm text-muted-foreground"
          }
        >
          {post.excerpt}
        </p>
      </div>
    </Link>
  );
}
