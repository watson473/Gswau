import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { author, books, featured, freeBook } from "@/lib/catalog";
import { BookCard } from "@/components/Cards";
import { Eyebrow } from "@/components/SiteChrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GSWAU — Books for Barbers & Hairstylists by Gs. W. Augustin" },
      { name: "description", content: "Practical books for barbers and hairstylists: client retention, pricing, branding, leadership and running a profitable shop." },
      { property: "og:title", content: "GSW Augustin University" },
      { property: "og:description", content: "Master your craft and build a profitable business." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <section className="relative overflow-hidden bg-navy-deep text-primary-foreground">
        <img src={hero} alt="Barber fading a client's hair" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-deep via-navy-deep/85 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 py-24 sm:py-36">
          <div className="eyebrow text-gold">Books for barbers & hairstylists</div>
          <h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-[1.02] sm:text-7xl">
            Master your craft. <em className="text-gold">Build a profitable business.</em>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-primary-foreground/75">{author.bio}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/library" className="btn-gold">Browse all {books.length} books</Link>
            {freeBook && <Link to="/library/$slug" params={{ slug: freeBook.slug }} className="btn-ghost">Get a free chapter</Link>}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="flex items-end justify-between">
          <div><Eyebrow>Flagship</Eyebrow><h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Programs</h2></div>
          <Link to="/courses" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">View all</Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">{featured.map((b) => <BookCard key={b.slug} b={b} />)}</div>
      </section>

      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex items-end justify-between">
            <div><Eyebrow>The library</Eyebrow><h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Latest books</h2></div>
            <Link to="/library" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">View all</Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">{books.filter((b) => !b.featured && !b.free).slice(0, 8).map((b) => <BookCard key={b.slug} b={b} />)}</div>
        </div>
      </section>

      <section className="bg-navy-gradient text-primary-foreground">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <img src={author.avatar} alt={author.name} className="mx-auto h-20 w-20 rounded-full border-2 border-gold object-cover" />
          <div className="eyebrow mt-6 text-gold">1:1 Coaching</div>
          <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">A mentor in your corner.</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/75">Private sessions with {author.name} on pricing, hiring, branding and opening your shop.</p>
          <Link to="/coaching" className="btn-gold mt-8">See coaching</Link>
        </div>
      </section>
    </>
  );
}
