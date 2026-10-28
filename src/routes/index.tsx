import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import hero from "@/assets/hero.jpg";
import { author, bookCount } from "@/lib/catalog";
import {
  episodesQuery,
  postsQuery,
  productsQuery,
  settingsQuery,
  testimonialsQuery,
} from "@/lib/catalog.functions";
import { BookCard, Stars } from "@/components/Cards";
import { Eyebrow } from "@/components/SiteChrome";
import { SubscribeBox } from "@/components/SubscribeBox";
import { EpisodePlayer } from "@/components/EpisodePlayer";
import { LatestPosts } from "@/components/LatestPosts";
import { PricingPlans } from "@/components/Pricing";
import { createTranslator, defaultLocale, useT } from "@/i18n";

const t0 = createTranslator(defaultLocale);

export const Route = createFileRoute("/")({
  head: ({ loaderData }) => {
    const description = t0("home.meta.description", {
      count: loaderData ? bookCount(loaderData[0]) : 23,
    });
    return {
      meta: [
        { title: t0("home.meta.title") },
        { name: "description", content: description },
        { property: "og:title", content: t0("home.meta.title") },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(productsQuery),
      context.queryClient.ensureQueryData(testimonialsQuery),
      context.queryClient.ensureQueryData(episodesQuery),
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(postsQuery),
    ]),
  component: Index,
});

function SectionHead({
  eyebrow,
  title,
  link,
}: {
  eyebrow: string;
  title: string;
  link?: ReactLink;
}) {
  const { t } = useT();
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">{title}</h2>
      </div>
      {link && (
        <Link
          to={link}
          className="shrink-0 text-sm font-semibold text-primary underline-offset-4 hover:underline"
        >
          {t("home.viewAll")}
        </Link>
      )}
    </div>
  );
}
type ReactLink = "/library" | "/podcast";

function Index() {
  const { t } = useT();
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: testimonials } = useSuspenseQuery(testimonialsQuery);
  const { data: episodes } = useSuspenseQuery(episodesQuery);
  const { data: posts } = useSuspenseQuery(postsQuery);
  const count = bookCount(products);
  const books = products.filter((p) => p.type === "ebook" || p.type === "audiobook");
  const featured = [
    ...books.filter((p) => p.is_featured),
    ...books.filter((p) => !p.is_featured && p.access_tier === "members"),
  ].slice(0, 8);
  return (
    <>
      <section className="relative overflow-hidden bg-navy-deep text-primary-foreground">
        <img
          src={hero}
          alt=""
          width={1600}
          height={1008}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-navy-deep/30" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:py-32">
          <div className="eyebrow text-gold">{t("home.hero.eyebrow")}</div>
          <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[1.02] sm:text-7xl">
            {t("home.hero.title")} <em className="text-gold">{t("home.hero.titleAccent")}</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-primary-foreground/80">
            {t("home.hero.subtitle", { count })}
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link to="/pricing" className="btn-gold">
              {t("home.cta.membership")}
            </Link>
            <Link to="/podcast" className="btn-ghost">
              {t("home.cta.podcast")}
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
        <div className="text-center">
          <div className="flex justify-center">
            <Eyebrow>{t("home.pricing.eyebrow")}</Eyebrow>
          </div>
          <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">{t("home.pricing.title")}</h2>
        </div>
        <div className="mx-auto mt-10 max-w-3xl">
          <PricingPlans />
        </div>
      </section>

      <section className="bg-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHead
            eyebrow={t("home.featured.eyebrow")}
            title={t("home.featured.title")}
            link="/library"
          />
          <div className="mt-10 grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-4">
            {featured.map((b) => (
              <BookCard key={b.id} b={b} />
            ))}
          </div>
        </div>
      </section>

      {episodes.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <SectionHead
            eyebrow={t("home.podcast.eyebrow")}
            title={t("home.podcast.title")}
            link="/podcast"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {episodes.slice(0, 3).map((ep) => (
              <article key={ep.id} className="rounded-lg bg-card p-5 shadow-card">
                <div className="eyebrow text-muted-foreground">
                  {ep.published_at ? new Date(ep.published_at).toLocaleDateString() : ""}
                  {ep.duration_label ? ` · ${ep.duration_label}` : ""}
                </div>
                <h3 className="mt-2 text-xl font-semibold">{ep.title}</h3>
                <EpisodePlayer url={ep.audio_url} title={ep.title} />
              </article>
            ))}
          </div>
        </section>
      )}

      <LatestPosts posts={posts} />

      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-16 sm:py-20">
          <SectionHead eyebrow={t("home.reviews.eyebrow")} title={t("home.reviews.title")} />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((r) => (
              <blockquote
                key={r.id}
                className="rounded-md border-l-4 border-gold bg-card p-6 shadow-card"
              >
                <Stars n={r.rating} />
                <p className="mt-3 font-display text-xl italic">“{r.quote}”</p>
                <footer className="mt-3 text-sm text-muted-foreground">
                  {r.name}
                  {r.location ? `, ${r.location}` : ""}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      <section className="bg-navy-gradient text-primary-foreground">
        <div className="mx-auto max-w-4xl px-5 py-16 text-center sm:py-20">
          <img
            src={author.avatar}
            alt={author.name}
            width={80}
            height={80}
            loading="lazy"
            className="mx-auto h-20 w-20 rounded-full border-2 border-gold object-cover"
          />
          <div className="eyebrow mt-6 text-gold">{t("home.coaching.eyebrow")}</div>
          <h2 className="mt-4 text-3xl font-semibold sm:text-5xl">{t("home.coaching.title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            {t("home.coaching.body", { author: author.name })}
          </p>
          <Link to="/coaching" className="btn-gold mt-8">
            {t("home.coaching.cta")}
          </Link>
        </div>
      </section>

      <section className="bg-secondary py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <div className="flex justify-center">
            <Eyebrow>{t("home.newsletter.eyebrow")}</Eyebrow>
          </div>
          <h2 className="mt-3 text-3xl font-semibold sm:text-5xl">{t("home.newsletter.title")}</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t("home.newsletter.body")}</p>
          <div className="mx-auto mt-8 max-w-lg text-left">
            <SubscribeBox source="home" />
          </div>
        </div>
      </section>
    </>
  );
}
