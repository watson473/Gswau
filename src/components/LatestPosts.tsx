import { Link } from "@tanstack/react-router";
import type { Post } from "@/lib/catalog.functions";
import { useT } from "@/i18n";

// Homepage "Latest Posts": the three newest posts as large cards, the next four as small ones.
export function LatestPosts({ posts }: { posts: Post[] }) {
  const { t } = useT();
  if (posts.length === 0) return null;
  const large = posts.slice(0, 3);
  const small = posts.slice(3, 7);
  return (
    <section className="bg-navy-deep py-16 text-primary-foreground sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-gold" />
          <span className="eyebrow text-gold">{t("home.posts.eyebrow")}</span>
        </div>
        <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">{t("home.posts.title")}</h2>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {large.map((p) => (
            <PostCard key={p.id} post={p} size="large" />
          ))}
        </div>
        {small.length > 0 && (
          <div className="mt-10 grid gap-6 border-t border-gold/20 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {small.map((p) => (
              <PostCard key={p.id} post={p} size="small" />
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link to="/blog" className="btn-gold">
            {t("home.posts.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}

function PostCard({ post, size }: { post: Post; size: "large" | "small" }) {
  const large = size === "large";
  return (
    <Link to="/blog/$slug" params={{ slug: post.slug }} className="group block">
      <div
        className={`overflow-hidden rounded-md bg-white/5 ring-1 ring-gold/20 transition group-hover:ring-gold ${large ? "aspect-[4/3]" : "aspect-[16/10]"}`}
      >
        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <span className="mt-4 block h-0.5 w-8 bg-gold transition-all group-hover:w-14" />
      <h3
        className={`mt-3 font-semibold leading-snug group-hover:text-gold ${large ? "text-2xl" : "text-lg"}`}
      >
        {post.title}
      </h3>
    </Link>
  );
}
