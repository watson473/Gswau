import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import hero from "@/assets/hero.jpg";
import { author } from "@/lib/catalog";
import { productsQuery, testimonialsQuery } from "@/lib/catalog.functions";
import { BookCard, Stars } from "@/components/Cards";
import { Eyebrow } from "@/components/SiteChrome";
import { SubscribeBox } from "@/components/SubscribeBox";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GSWAU — Books for Barbers & Hairstylists by Gs. W. Augustin" },
      {
        name: "description",
        content:
          "Practical books for barbers and hairstylists: client retention, pricing, branding, leadership and running a profitable shop.",
      },
      { property: "og:title", content: "GSW Augustin University" },
      { property: "og:description", content: "Master your craft and build a profitable business." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(productsQuery),
      context.queryClient.ensureQueryData(testimonialsQuery),
    ]),
  component: Index,
});

function Index() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const { data: testimonials } = useSuspenseQuery(testimonialsQuery);
  const featured = products.filter((p) => p.is_featured || p.type === "course");
  const freeBook = products.find((p) => p.is_free);
  return (
    <>
      <section className="relative overflow-hidden bg-navy-deep text-primary-foreground">
        <img
          src={hero}
          alt="Barber fading a client's hair"
          width={1600}
          height={1008}
          className="absolute inset-0 h-full w-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-36">
          <div className="eyebrow text-gold">Books for barbers & hairstylists</div>
          <h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-[1.02] sm:text-7xl">
            Master your craft. <em className="text-gold">Build a profitable business.</em>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-primary-foreground/75">{author.bio}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/library" className="btn-gold">
              Browse all {products.length} titles
            </Link>
            {freeBook && (
              <Link to="/library/$slug" params={{ slug: freeBook.slug }} className="btn-ghost">
                Get a free chapter
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex items-end justify-between">
          <div>
            <Eyebrow>Flagship</Eyebrow>
            <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Programs</h2>
          </div>
          <Link
            to="/courses"
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
          {featured.slice(0, 8).map((b) => (
            <BookCard key={b.id} b={b} />
          ))}
        </div>
      </section>

      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex items-end justify-between">
            <div>
              <Eyebrow>The library</Eyebrow>
              <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Latest books</h2>
            </div>
            <Link
              to="/library"
              className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {products
              .filter((b) => !b.is_featured && !b.is_free && b.type === "ebook")
              .slice(0, 8)
              .map((b) => (
                <BookCard key={b.id} b={b} />
              ))}
          </div>
        </div>
      </section>

      {testimonials.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-20">
          <Eyebrow>From readers</Eyebrow>
          <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">What students say</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <blockquote
                key={t.id}
                className="rounded-md border-l-4 border-gold bg-card p-6 shadow-card"
              >
                <Stars n={t.rating} />
                <p className="mt-3 font-display text-xl italic">“{t.quote}”</p>
                <footer className="mt-3 text-sm text-muted-foreground">
                  {t.name}
                  {t.location ? `, ${t.location}` : ""}
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      )}

      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <Eyebrow>Membership</Eyebrow>
          <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">
            Browse free. Subscribe to read.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Explore the site and listen to the podcast for free. Subscribers get every book and
            course in their library.
          </p>
          <div className="mx-auto mt-8 max-w-lg text-left">
            <SubscribeBox source="home" />
          </div>
          <Link
            to="/membership"
            className="mt-5 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline"
          >
            See what subscribers get
          </Link>
        </div>
      </section>

      <section className="bg-navy-gradient text-primary-foreground">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <img
            src={author.avatar}
            alt={author.name}
            className="mx-auto h-20 w-20 rounded-full border-2 border-gold object-cover"
          />
          <div className="eyebrow mt-6 text-gold">1:1 Coaching</div>
          <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">A mentor in your corner.</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/75">
            Private sessions with {author.name} on pricing, hiring, branding and opening your shop.
          </p>
          <Link to="/coaching" className="btn-gold mt-8">
            See coaching
          </Link>
        </div>
      </section>
    </>
  );
}
