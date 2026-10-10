import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero.jpg";
import { books, courses } from "@/lib/catalog";
import { BookCard, CourseCard } from "@/components/Cards";
import { Eyebrow } from "@/components/SiteChrome";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GSWAU — GSW Augustin University | Barber & Beauty Business Education" },
      { name: "description", content: "Courses, e-books, audiobooks and 1:1 coaching that turn barbers and stylists into business owners." },
      { property: "og:title", content: "GSW Augustin University" },
      { property: "og:description", content: "The business school for barbers and stylists." },
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
          <div className="eyebrow text-gold">Est. for the business of beauty</div>
          <h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-[1.02] sm:text-7xl">
            Master the craft. <em className="text-gold">Own the business.</em>
          </h1>
          <p className="mt-6 max-w-lg text-lg text-primary-foreground/75">
            University-grade training for barbers and stylists — courses, books and coaching built by people who've run the chair.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link to="/courses" className="btn-gold">Explore courses</Link>
            <Link to="/library/$slug" params={{ slug: "free-chapter" }} className="btn-ghost">Get a free chapter</Link>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-secondary">
        <div className="mx-auto grid max-w-6xl grid-cols-3 divide-x divide-border px-5 py-8 text-center">
          {[["2,400+", "Students enrolled"], ["4.9/5", "Average rating"], ["1:1", "Coaching available"]].map(([a, b]) => (
            <div key={b}><div className="font-display text-3xl font-semibold text-primary">{a}</div><div className="text-xs text-muted-foreground">{b}</div></div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <Eyebrow>Flagship programs</Eyebrow>
        <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Courses</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-2">{courses.map((c) => <CourseCard key={c.slug} c={c} />)}</div>
      </section>

      <section className="bg-secondary py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="flex items-end justify-between">
            <div><Eyebrow>The library</Eyebrow><h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Books & audiobooks</h2></div>
            <Link to="/library" className="text-sm font-semibold text-primary underline-offset-4 hover:underline">View all</Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">{books.map((b) => <BookCard key={b.slug} b={b} />)}</div>
        </div>
      </section>

      <section className="bg-navy-gradient text-primary-foreground">
        <div className="mx-auto max-w-4xl px-5 py-20 text-center">
          <div className="eyebrow text-gold">1:1 Coaching</div>
          <h2 className="mt-4 text-4xl font-semibold sm:text-5xl">A mentor in your corner.</h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/75">Private sessions on pricing, hiring, branding and opening your shop.</p>
          <Link to="/coaching" className="btn-gold mt-8">See coaching</Link>
        </div>
      </section>
    </>
  );
}
