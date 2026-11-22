import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Calculator, Mic, Pause, SkipBack, SkipForward } from "lucide-react";
import logo from "@/assets/brand/logo.webp";
import type { Product } from "@/lib/catalog.functions";
import { formatMoney } from "@/lib/catalog";
import { calculateChairEarnings, CHAIR_EARNINGS_DEFAULTS } from "@/lib/chairEarnings";
import { imageSrc } from "@/lib/display";
import { episodeAnchor, podcastName, tidyEpisodeTitle, type PodcastEpisode } from "@/lib/podcast";
import { articleForEpisode } from "@/lib/podcast-articles";
import { priceShiftLastDay, priceShiftSlideOn, showcaseConfig } from "@/lib/showcase.config";
import { track } from "@/lib/analytics";
import { useT } from "@/i18n";

type SlideKey = "calculator" | "audiobook" | "course" | "podcast";
type Slide = {
  key: SlideKey;
  link: (children: ReactNode, onClick: () => void) => ReactNode;
  body: ReactNode;
};

const example = calculateChairEarnings(CHAIR_EARNINGS_DEFAULTS);

// The newest episode, and its number counted from the relaunch (oldest first).
function latestEpisode(episodes: PodcastEpisode[]) {
  const from = new Date(showcaseConfig.podcastNumberedFrom).getTime();
  const numbered = episodes
    .filter((e) => e.publishedAt && new Date(e.publishedAt).getTime() >= from)
    .sort((a, b) => a.publishedAt!.localeCompare(b.publishedAt!));
  const latest = numbered.at(-1) ?? episodes[0];
  if (!latest) return null;
  const index = numbered.indexOf(latest);
  return { episode: latest, number: index >= 0 ? index + 1 : null };
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

// Counts up to `value` while `run` is true. Shows the final number straight away otherwise.
function CountUp({ value, run, locale }: { value: number; run: boolean; locale: string }) {
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (!run) {
      setShown(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / 1100);
      setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [run, value]);
  return (
    <>
      {new Intl.NumberFormat(locale, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(shown)}
    </>
  );
}

function Cover({ src, show }: { src: string | null; show: boolean }) {
  return (
    <div className="sc-cover aspect-square w-full overflow-hidden rounded-lg bg-navy ring-1 ring-gold/30">
      {src && show && (
        <img
          src={imageSrc(src, 480, 480)}
          alt=""
          width={400}
          height={400}
          decoding="async"
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}

const up = (i: number) => ({ "--i": i }) as CSSProperties;

// A drawing of a phone in the hero that rotates through four real things on the site.
export function HeroShowcase({
  book,
  courses,
  episodes,
}: {
  book: Product | undefined;
  courses: Product[];
  episodes: PodcastEpisode[];
}) {
  const { t, locale } = useT();
  const reduced = usePrefersReducedMotion();
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [hovering, setHovering] = useState(false);
  const [touching, setTouching] = useState(false);
  const [focused, setFocused] = useState(false);
  const [offscreen, setOffscreen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0, 1]));

  const course = priceShiftSlideOn()
    ? courses.find((c) => c.slug === showcaseConfig.priceShiftSlug)
    : undefined;
  const latest = latestEpisode(episodes);
  const keys = (
    ["calculator", book && "audiobook", course && "course", latest && "podcast"] as const
  ).filter(Boolean) as SlideKey[];
  const count = keys.length;
  const current = Math.min(active, count - 1);
  const paused = hovering || touching || focused || offscreen || hidden;
  const coverShown = (key: SlideKey) => seen.has(keys.indexOf(key));

  const slides: Slide[] = [];
  slides.push({
    key: "calculator",
    link: (children, onClick) => (
      <Link to="/calculator" onClick={onClick} className="sc-link">
        {children}
      </Link>
    ),
    body: (
      <>
        <div className="sc-cover relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-[radial-gradient(circle_at_50%_30%,color-mix(in_oklch,var(--gold)_22%,transparent),transparent_70%)] ring-1 ring-gold/40">
          <span className="eyebrow absolute left-2.5 top-2.5 rounded-sm bg-gold/15 px-1.5 py-0.5 text-[0.5rem] text-gold">
            {t("home.show.calc.example")}
          </span>
          <Calculator className="h-6 w-6 text-gold/80" aria-hidden="true" />
          <div className="mt-2 font-display text-[2.1rem] font-semibold leading-none text-gold">
            <CountUp
              value={example.yearly}
              run={mounted && !reduced && current === 0}
              locale={locale}
            />
          </div>
          <div className="mt-1 text-xs text-primary-foreground/75">
            {t("home.show.calc.perYear")}
          </div>
          <p className="mt-3 px-3 text-center text-[0.55rem] leading-snug text-primary-foreground/60">
            {t("home.show.calc.basis", {
              price: CHAIR_EARNINGS_DEFAULTS.price,
              clients: CHAIR_EARNINGS_DEFAULTS.clientsPerDay,
              days: CHAIR_EARNINGS_DEFAULTS.daysPerWeek,
              weeks: CHAIR_EARNINGS_DEFAULTS.weeksPerYear,
            })}
          </p>
        </div>
        <div className="sc-up eyebrow mt-3 text-[0.55rem] text-gold" style={up(0)}>
          {t("home.show.calc.eyebrow")}
        </div>
        <div
          className="sc-up mt-1 inline-flex items-center gap-1.5 font-display text-base font-semibold leading-snug"
          style={up(1)}
        >
          {t("home.show.calc.cta")}
          <ArrowRight className="h-4 w-4 text-gold" aria-hidden="true" />
        </div>
      </>
    ),
  });

  if (book) {
    slides.push({
      key: "audiobook",
      link: (children, onClick) => (
        <Link
          to="/library/$slug"
          params={{ slug: book.slug }}
          onClick={onClick}
          className="sc-link"
        >
          {children}
        </Link>
      ),
      body: (
        <>
          <Cover src={book.cover_image_url} show={coverShown("audiobook")} />
          <div className="sc-up eyebrow mt-3 text-[0.55rem] text-gold" style={up(0)}>
            {t("home.hero.phoneNow")}
          </div>
          <div
            className="sc-up mt-1 line-clamp-2 font-display text-base font-semibold leading-snug"
            style={up(1)}
          >
            {book.title}
          </div>
          <div className="sc-up mt-3 h-1 overflow-hidden rounded-full bg-white/15" style={up(2)}>
            <span className="sc-play block h-full w-2/5 origin-left rounded-full bg-gold-gradient" />
          </div>
          <div
            className="sc-up mt-3 flex items-center justify-center gap-5 text-primary-foreground/85"
            style={up(3)}
          >
            <SkipBack className="h-4 w-4" aria-hidden="true" />
            <span className="grid h-10 w-10 place-items-center rounded-full bg-gold-gradient text-navy-deep">
              <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
            </span>
            <SkipForward className="h-4 w-4" aria-hidden="true" />
          </div>
        </>
      ),
    });
  }

  if (course) {
    slides.push({
      key: "course",
      link: (children, onClick) => (
        <Link
          to="/library/$slug"
          params={{ slug: course.slug }}
          onClick={onClick}
          className="sc-link"
        >
          {children}
        </Link>
      ),
      body: (
        <>
          <Cover src={course.cover_image_url} show={coverShown("course")} />
          <div className="sc-up eyebrow mt-3 text-[0.55rem] text-gold" style={up(0)}>
            {t("home.show.course.eyebrow")}
          </div>
          <div
            className="sc-up mt-1 line-clamp-2 font-display text-base font-semibold leading-snug"
            style={up(1)}
          >
            {course.title}
          </div>
          <div className="sc-up mt-2 text-xs font-semibold text-gold" style={up(2)}>
            {t("home.show.course.price", {
              price: showcaseConfig.priceShiftFoundingPrice,
              date: priceShiftLastDay(locale),
            })}
          </div>
        </>
      ),
    });
  }

  if (latest) {
    const { episode, number } = latest;
    const article = articleForEpisode(episode);
    slides.push({
      key: "podcast",
      link: (children, onClick) =>
        article ? (
          <Link
            to="/podcast/$slug"
            params={{ slug: article.slug }}
            onClick={onClick}
            className="sc-link"
          >
            {children}
          </Link>
        ) : (
          <Link to="/podcast" hash={episodeAnchor(episode)} onClick={onClick} className="sc-link">
            {children}
          </Link>
        ),
      body: (
        <>
          <div className="sc-cover relative flex aspect-square w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-[radial-gradient(circle_at_50%_35%,color-mix(in_oklch,var(--gold)_20%,transparent),transparent_70%)] ring-1 ring-gold/40">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-gold-gradient text-navy-deep">
              <Mic className="h-6 w-6" aria-hidden="true" />
            </span>
            <div className="mt-4 flex h-8 items-end gap-1" aria-hidden="true">
              {[0.5, 0.9, 0.65, 1, 0.75, 0.45, 0.85].map((h, i) => (
                <span
                  key={i}
                  className="sc-wave w-1.5 origin-bottom rounded-full bg-gold"
                  style={{ height: `${h * 100}%`, "--i": i } as CSSProperties}
                />
              ))}
            </div>
            <div className="mt-3 font-display text-sm font-semibold text-primary-foreground/90">
              {podcastName}
            </div>
            {number && (
              <div className="eyebrow mt-1 text-[0.5rem] text-gold">
                {t("home.show.podcast.number", { n: number })}
              </div>
            )}
          </div>
          <div className="sc-up eyebrow mt-3 text-[0.55rem] text-gold" style={up(0)}>
            {t("home.show.podcast.eyebrow")}
          </div>
          <div
            className="sc-up mt-1 line-clamp-2 font-display text-base font-semibold leading-snug"
            style={up(1)}
          >
            {tidyEpisodeTitle(episode.title)}
          </div>
        </>
      ),
    });
  }

  useEffect(() => setMounted(true), []);

  // Covers load only once their slide is next up.
  useEffect(() => {
    setSeen((s) => {
      const next = (current + 1) % count;
      if (s.has(current) && s.has(next)) return s;
      return new Set([...s, current, next]);
    });
  }, [current, count]);

  // Pause while the phone is off screen or the tab is in the background.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOffscreen(!e?.isIntersecting));
    io.observe(el);
    const vis = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", vis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", vis);
    };
  }, []);

  // With motion on, the gold fill in the active dot sets the pace: when it ends, the next slide
  // comes in, and pausing the fill pauses the slideshow. With reduced motion, a plain timer does.
  useEffect(() => {
    if (!mounted || !reduced || paused || count < 2) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % count), showcaseConfig.slideMs);
    return () => window.clearTimeout(id);
  }, [mounted, reduced, paused, count, current, cycle]);

  const next = () => {
    if (count > 1) setActive((a) => (a + 1) % count);
  };
  const goTo = (i: number) => {
    setActive(i);
    setCycle((c) => c + 1);
  };

  return (
    <figure
      ref={rootRef}
      data-no-reveal
      className="hero-showcase mx-auto w-[236px] sm:w-[250px] lg:w-[236px]"
      aria-roledescription="carousel"
      aria-label={t("home.show.label")}
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovering(true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && setHovering(false)}
      onPointerDown={(e) => e.pointerType !== "mouse" && setTouching(true)}
      onPointerUp={(e) => e.pointerType !== "mouse" && setTouching(false)}
      onPointerCancel={() => setTouching(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false);
      }}
    >
      <div className="rounded-[2.4rem] bg-gradient-to-b from-gold/70 via-gold/25 to-gold/50 p-[2px] shadow-[0_0_60px_-14px_var(--gold)]">
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
            <div className="mt-3 grid">
              {slides.map((s, i) => {
                const on = i === current;
                return (
                  <div
                    key={s.key}
                    className="sc-slide [grid-area:1/1]"
                    data-active={on ? "" : undefined}
                    aria-hidden={!on}
                    inert={!on}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} / ${count}: ${t(`home.show.name.${s.key}`)}`}
                  >
                    {s.link(s.body, () => track("hero_slide_tap", { slide: s.key }))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {count > 1 && (
        <div className="mt-3 flex items-center justify-center">
          {slides.map((s, i) => {
            const on = i === current;
            return (
              <button
                key={s.key}
                type="button"
                onClick={() => goTo(i)}
                aria-label={t("home.show.dot", { n: i + 1, name: t(`home.show.name.${s.key}`) })}
                aria-current={on ? "true" : undefined}
                className="group grid h-8 min-w-8 place-items-center px-1.5 focus-visible:outline-none"
              >
                <span
                  className={`relative block h-1.5 overflow-hidden rounded-full transition-all duration-500 group-focus-visible:ring-2 group-focus-visible:ring-gold ${
                    on ? "w-7 bg-gold/25" : "w-1.5 bg-gold/40 group-hover:bg-gold/70"
                  }`}
                >
                  {on && (
                    <span
                      key={`${current}-${cycle}`}
                      className="sc-timer absolute inset-0 origin-left rounded-full bg-gold"
                      style={
                        {
                          "--sc-ms": `${showcaseConfig.slideMs}ms`,
                          animationPlayState: paused || !mounted ? "paused" : "running",
                        } as CSSProperties
                      }
                      onAnimationEnd={next}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
      <figcaption className="mt-3 text-center font-display text-base font-semibold text-gold">
        {t("home.hero.phoneCaption")}
      </figcaption>
    </figure>
  );
}
