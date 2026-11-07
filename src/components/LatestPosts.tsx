import { Link } from "@tanstack/react-router";
import type { Post } from "@/lib/catalog.functions";
import { GoldText } from "@/components/GoldText";
import { Slider } from "@/components/Slider";
import { useT } from "@/i18n";

// Homepage "Latest Posts": the three newest posts as large cards, the next four as small ones.
export function LatestPosts({ posts }: { posts: Post[] }) {
  const { t } = useT();
  if (posts.length === 0) return null;
  return (
    <section className="bg-navy-deep py-14 text-primary-foreground sm:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-gold" />
          <span className="eyebrow text-gold">{t("home.posts.eyebrow")}</span>
        </div>
        <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">
          <GoldText text={t("home.posts.title")} />
        </h2>

        <div className="mt-10">
          <Slider slideClass="basis-[85%] sm:basis-1/2 lg:basis-1/3" label={t("slider.posts")}>
            {posts.slice(0, 9).map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </Slider>
        </div>

        <div className="mt-12 text-center">
          <Link to="/blog" className="btn-gold !rounded-full">
            {t("home.posts.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}

function PostCard({ post }: { post: Post }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="glow-card group block h-full overflow-hidden rounded-xl"
    >
      <div className="aspect-[4/3] overflow-hidden bg-white/5">
        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        )}
      </div>
      <div className="p-5">
        <span className="block h-0.5 w-8 bg-gold transition-all group-hover:w-14" />
        <h3 className="mt-3 text-2xl font-semibold leading-snug transition group-hover:text-gold">
          {post.title}
        </h3>
      </div>
    </Link>
  );
}
