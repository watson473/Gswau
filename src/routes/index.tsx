import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  GraduationCap,
  Headphones,
  Mic,
  Newspaper,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react";
import logo from "@/assets/brand/logo.png";
import { author, bookCount } from "@/lib/catalog";
import {
  episodesQuery,
  lessonCountQuery,
  postsQuery,
  productsQuery,
  settingsQuery,
  testimonialsQuery,
  type Product,
} from "@/lib/catalog.functions";
import { BookCard, Stars } from "@/components/Cards";
import { GoldText } from "@/components/GoldText";
import { LatestPodcasts } from "@/components/LatestPodcasts";
import { LatestPosts } from "@/components/LatestPosts";
import { PricingPlans } from "@/components/Pricing";
import { Slider } from "@/components/Slider";
import { createTranslator, defaultLocale, useT } from "@/i18n";
import { originFromMatches, shareMeta } from "@/lib/share";

const t0 = createTranslator(defaultLocale);

// Member photos for the trust strip, once there are real ones (with their permission). They appear
// inside the gold pill. It stays text only until then: no stock or made-up faces.
const memberPhotos: string[] = [];

export const Route = createFileRoute("/")({
  head: ({ loaderData, matches }) => {
    const description = t0("home.meta.description", {
      count: loaderData ? bookCount(loaderData[0]) : 23,
    });
    return shareMeta({
      title: t0("home.meta.title"),
      description,
      path: "/",
      assetOrigin: originFromMatches(matches),
    });
  },
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(productsQuery),
      context.queryClient.ensureQueryData(testimonialsQuery),
      context.queryClient.ensureQueryData(episodesQuery),
      context.queryClient.ensureQueryData(settingsQuery),
      context.queryClient.ensureQueryData(postsQuery),
      context.queryClient.ensureQueryData(lessonCountQuery),
    ]),
  component: Index,
});

function Index() {
  const { t } = useT();
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: testimonials } = useSuspenseQuery(testimonialsQuery);
  const { data: episodes } = useSuspenseQuery(episodesQuery);
  const { data: posts } = useSuspenseQuery(postsQuery);
  const { data: lessons } = useSuspenseQuery(lessonCountQuery);

  const audiobooks = products.filter((p) => p.type === "ebook" || p.type === "audiobook");
  const courses = products.filter((p) => p.type === "course");
  const newest = [...audiobooks]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 6);
  const phoneBook = audiobooks.find((p) => p.is_featured) ?? audiobooks[0];
  const stats = [
    { key: "home.trust.audiobooks", count: bookCount(products) },
    { key: "home.trust.courses", count: courses.length },
    { key: "home.trust.lessons", count: lessons },
    { key: "home.trust.posts", count: posts.length },
  ].filter((s) => s.count > 0);

  // The whole homepage is navy and gold whichever theme is saved: the .dark tokens apply inside.
  return (
    <div className="dark bg-navy-deep text-foreground">
      <Hero book={phoneBook} />
      <TrustStrip stats={stats} />
      <ResourcesAndNewest newest={newest} />
      <PremiumCourses courses={courses} />
      <LatestPosts posts={posts} />
      <LatestPodcasts episodes={episodes} />

      {testimonials.length > 0 && (
        <section className="bg-navy-deep py-14 sm:py-20">
          <div className="mx-auto max-w-6xl px-5">
            <SectionHead eyebrow={t("home.reviews.eyebrow")} title={t("home.reviews.title")} />
            <div
              className={`mt-10 grid gap-6 ${
                testimonials.length < 3 ? "max-w-2xl" : "md:grid-cols-3"
              }`}
            >
              {testimonials.map((r) => (
                <blockquote key={r.id} className="glow-card glow-card-hover rounded-xl p-6">
                  <Stars n={r.rating} />
                  <p className="mt-3 font-display text-xl italic">“{r.quote}”</p>
                  <footer className="mt-3 text-sm text-muted-foreground">
                    {r.name}
                    {r.location ? `, ${r.location}` : ""}
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="navy-glow bg-navy-deep py-14 sm:py-20">
        <div className="mx-auto max-w-5xl px-5">
          <div className="text-center">
            <div className="eyebrow text-gold">{t("home.pricing.eyebrow")}</div>
            <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">
              <GoldText text={t("home.pricing.title")} />
            </h2>
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <PricingPlans />
          </div>
        </div>
      </section>

      <section className="bg-navy-deep px-4 pt-10 sm:pt-14">
        <div className="glow-card mx-auto flex max-w-6xl flex-col gap-5 rounded-2xl px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-10">
          <div>
            <h2 className="text-3xl font-semibold sm:text-4xl">
              <GoldText text={t("home.calc.title")} />
            </h2>
            <p className="mt-2 text-muted-foreground">{t("home.calc.line")}</p>
          </div>
          <Link to="/calculator" className="btn-ghost shrink-0 !rounded-full">
            {t("home.cta.calculator")}
          </Link>
        </div>
      </section>
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="flex items-center gap-4">
          <span className="h-px w-10 bg-gold" />
          <span className="eyebrow text-gold">{eyebrow}</span>
        </div>
        <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">
          <GoldText text={title} />
        </h2>
      </div>
      {action}
    </div>
  );
}

function Hero({ book }: { book: Product | undefined }) {
  const { t } = useT();
  return (
    <section className="relative overflow-hidden bg-navy-gradient">
      <HeroLines />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:py-20 lg:grid-cols-[1.15fr_auto_0.85fr] lg:items-center lg:gap-10 lg:py-24">
        <div data-no-reveal>
          <div className="eyebrow text-gold">{t("home.hero.eyebrow")}</div>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.02] sm:text-7xl lg:text-[4.5rem]">
            <GoldText text={t("home.hero.welcome")} />
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-primary-foreground/85 sm:text-xl">
            <GoldText text={t("home.hero.line")} />
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link to="/pricing" className="btn-gold !rounded-full">
              {t("home.cta.membership")}
            </Link>
            <Link to="/about" className="btn-ghost !rounded-full">
              {t("home.cta.learnMore")}
            </Link>
          </div>
        </div>

        {book && <PhoneMockup book={book} />}

        <div data-no-reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <Link to="/courses" className="glow-card group block rounded-xl p-6">
            <GraduationCap className="h-7 w-7 text-gold" aria-hidden="true" />
            <h2 className="mt-3 text-2xl font-semibold transition group-hover:text-gold">
              {t("home.tile.invest.title")}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-primary-foreground/75">
              {t("home.tile.invest.body", { author: author.name })}
            </p>
          </Link>
          <div className="glow-card glow-card-hover rounded-xl p-6">
            <Mic className="h-7 w-7 text-gold" aria-hidden="true" />
            <h2 className="mt-3 text-2xl font-semibold">{t("home.tile.content.title")}</h2>
            <p className="mt-1 text-sm leading-relaxed text-primary-foreground/75">
              {t("home.tile.content.body")}
            </p>
            <div className="mt-3 flex gap-5 text-sm font-semibold text-gold">
              <Link to="/podcast" className="inline-flex items-center gap-1 hover:underline">
                {t("home.tile.content.podcast")}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
              <Link to="/blog" className="inline-flex items-center gap-1 hover:underline">
                {t("home.tile.content.blog")}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Soft lines of light behind the hero: blurred wide strokes under thin ones. The blur is drawn once
// and only the whole layer's opacity animates, so it stays smooth on a phone.
function HeroLines() {
  const paths = [
    "M-60 520C260 360 420 610 760 420S1240 120 1660 300",
    "M-60 180C240 320 520 90 820 240S1300 520 1660 380",
    "M-60 640C340 560 620 720 980 560S1420 440 1660 560",
  ];
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1600 700"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      className="hero-lines pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="hero-line-gold" x1="0" x2="1">
          <stop offset="0" stopColor="var(--gold)" stopOpacity="0" />
          <stop offset="0.5" stopColor="var(--gold)" stopOpacity="0.6" />
          <stop offset="1" stopColor="var(--gold)" stopOpacity="0" />
        </linearGradient>
        <filter id="hero-line-blur" x="-5%" y="-30%" width="110%" height="160%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
      </defs>
      <g filter="url(#hero-line-blur)" opacity="0.5">
        {paths.map((d) => (
          <path key={d} d={d} stroke="url(#hero-line-gold)" strokeWidth="12" />
        ))}
      </g>
      {paths.map((d) => (
        <path key={d} d={d} stroke="url(#hero-line-gold)" strokeWidth="1" />
      ))}
    </svg>
  );
}

// A drawing of the site's audiobook player on a phone, using a real book from the library.
function PhoneMockup({ book }: { book: Product }) {
  const { t } = useT();
  return (
    <figure data-no-reveal className="mx-auto w-[236px] sm:w-[250px] lg:w-[236px]">
      <div
        role="img"
        aria-label={t("home.hero.phoneAlt", { title: book.title })}
        className="rounded-[2.4rem] bg-gradient-to-b from-gold/70 via-gold/25 to-gold/50 p-[2px] shadow-[0_0_60px_-14px_var(--gold)]"
      >
        <div className="rounded-[2.3rem] bg-navy-deep p-2">
          <div className="relative overflow-hidden rounded-[1.85rem] bg-navy-gradient px-4 pb-5 pt-7">
            <span className="absolute left-1/2 top-2 h-1.5 w-14 -translate-x-1/2 rounded-full bg-white/15" />
            <div className="flex items-center gap-2">
              <img
                src={logo}
                alt=""
                width={22}
                height={22}
                className="h-[22px] w-[22px] rounded-full"
              />
              <span className="font-display text-sm font-semibold">{t("brand.name")}</span>
            </div>
            {book.cover_image_url && (
              <img
                src={book.cover_image_url}
                alt=""
                width={400}
                height={400}
                decoding="async"
                className="mt-3 aspect-square w-full rounded-lg object-cover ring-1 ring-gold/30"
              />
            )}
            <div className="eyebrow mt-3 text-[0.55rem] text-gold">{t("home.hero.phoneNow")}</div>
            <div className="mt-1 line-clamp-2 font-display text-base font-semibold leading-snug">
              {book.title}
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/15">
              <span className="block h-full w-2/5 rounded-full bg-gold-gradient" />
            </div>
            <div className="mt-3 flex items-center justify-center gap-5 text-primary-foreground/85">
              <SkipBack className="h-4 w-4" aria-hidden="true" />
              <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-gradient text-navy-deep">
                <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
              </span>
              <SkipForward className="h-4 w-4" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>
      <figcaption className="mt-4 text-center font-display text-base font-semibold text-gold">
        {t("home.hero.phoneCaption")}
      </figcaption>
    </figure>
  );
}

function TrustStrip({ stats }: { stats: { key: string; count: number }[] }) {
  const { t } = useT();
  const middle = Math.ceil(stats.length / 2);
  const stat = (s: { key: string; count: number }) => (
    <div key={s.key} className="text-center">
      <div className="font-display text-4xl font-semibold leading-none text-gold">{s.count}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.14em] text-primary-foreground/70">
        {t(s.key, { count: s.count })}
      </div>
    </div>
  );
  return (
    <section className="border-y border-gold/20 bg-navy-deep">
      <div className="mx-auto grid max-w-6xl grid-cols-2 items-center gap-x-6 gap-y-6 px-5 py-8 lg:flex lg:justify-between">
        <div className="order-2 col-span-2 grid grid-cols-2 gap-6 lg:order-none lg:flex lg:gap-12">
          {stats.slice(0, middle).map(stat)}
        </div>
        <div className="order-1 col-span-2 flex justify-center lg:order-none">
          <div className="inline-flex items-center gap-3 rounded-full bg-gold-gradient px-6 py-3 text-center text-sm font-bold text-navy-deep shadow-[0_0_34px_-8px_var(--gold)]">
            {memberPhotos.length > 0 && (
              <span className="flex -space-x-2">
                {memberPhotos.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    width={28}
                    height={28}
                    loading="lazy"
                    className="h-7 w-7 rounded-full object-cover ring-2 ring-navy-deep"
                  />
                ))}
              </span>
            )}
            {t("home.trust.pill")}
          </div>
        </div>
        <div className="order-3 col-span-2 grid grid-cols-2 gap-6 lg:order-none lg:flex lg:gap-12">
          {stats.slice(middle).map(stat)}
        </div>
      </div>
    </section>
  );
}

function ResourcesAndNewest({ newest }: { newest: Product[] }) {
  const { t } = useT();
  const resources = [
    { to: "/library", key: "home.resources.audiobooks", Icon: Headphones },
    { to: "/courses", key: "home.resources.courses", Icon: GraduationCap },
    { to: "/podcast", key: "home.resources.podcast", Icon: Mic },
    { to: "/blog", key: "home.resources.blog", Icon: Newspaper },
    { to: "/library", key: "home.resources.previews", Icon: BookOpen },
  ] as const;
  return (
    <section className="navy-glow bg-navy-deep py-14 sm:py-20">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 lg:grid-cols-[300px_1fr] lg:items-start">
        <aside className="glow-card rounded-2xl p-6 lg:sticky lg:top-24">
          <h2 className="text-3xl font-semibold leading-tight">
            <GoldText text={t("home.resources.title")} />
          </h2>
          <ul className="mt-5 space-y-1">
            {resources.map(({ to, key, Icon }) => (
              <li key={key}>
                <Link
                  to={to}
                  className="group flex items-center gap-3 rounded-lg px-2 py-2.5 font-semibold transition hover:bg-gold/10 hover:text-gold"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-gold ring-1 ring-gold/40 transition group-hover:bg-gold group-hover:text-navy-deep">
                    <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  </span>
                  <span className="flex-1">{t(key)}</span>
                  <ChevronRight
                    className="h-4 w-4 text-gold/70 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div className="min-w-0">
          <SectionHead
            eyebrow={t("home.newest.eyebrow")}
            title={t("home.newest.title")}
            action={
              <Link to="/library" className="btn-ghost shrink-0 !rounded-full !py-2.5">
                {t("home.newest.viewAll")}
              </Link>
            }
          />
          <div className="glow-covers mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 sm:gap-6">
            {newest.map((b) => (
              <BookCard key={b.id} b={b} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function PremiumCourses({ courses }: { courses: Product[] }) {
  const { t } = useT();
  if (courses.length === 0) return null;
  return (
    <section className="bg-navy-deep py-14 sm:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHead eyebrow={t("home.courses.eyebrow")} title={t("home.courses.title")} />
        <div className="glow-covers mt-10">
          <Slider
            slideClass="basis-[82%] sm:basis-[46%] lg:basis-[40%]"
            label={t("slider.courses")}
            arrows
          >
            {courses.map((c) => (
              <BookCard key={c.id} b={c} />
            ))}
          </Slider>
        </div>
        <div className="mt-10 text-center">
          <Link to="/courses" className="btn-gold !rounded-full">
            {t("home.courses.viewAll")}
          </Link>
        </div>
      </div>
    </section>
  );
}
