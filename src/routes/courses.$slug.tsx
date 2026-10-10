import { createFileRoute, notFound } from "@tanstack/react-router";
import { courses, money } from "@/lib/catalog";
import { Eyebrow } from "@/components/SiteChrome";

export const Route = createFileRoute("/courses/$slug")({
  loader: ({ params }) => {
    const course = courses.find((c) => c.slug === params.slug);
    if (!course) throw notFound();
    return { course };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Course not found — GSWAU" }, { name: "robots", content: "noindex" }] };
    const c = loaderData.course;
    return { meta: [
      { title: `${c.title} — GSWAU` }, { name: "description", content: c.tagline },
      { property: "og:title", content: c.title }, { property: "og:description", content: c.tagline },
    ] };
  },
  component: CoursePage,
});

function CoursePage() {
  const { course: c } = Route.useLoaderData();
  const lessons = c.modules.reduce((n, m) => n + m.lessons.length, 0);
  return (
    <>
      <section className="bg-navy-deep text-primary-foreground">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:items-center">
          <div>
            <div className="eyebrow text-gold">{c.level} · {c.hours} hours · {lessons} lessons</div>
            <h1 className="mt-4 text-5xl font-semibold leading-tight">{c.title}</h1>
            <p className="mt-4 text-lg text-primary-foreground/75">{c.tagline}</p>
            <div className="mt-8 flex items-center gap-5">
              <span className="font-display text-4xl text-gold">{money(c.price)}</span>
              <button className="btn-gold" disabled title="Checkout coming soon">Enroll — coming soon</button>
            </div>
          </div>
          <img src={c.image} alt={c.title} width={1280} height={720} className="aspect-video w-full rounded-lg object-cover shadow-card" />
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-14 px-5 py-16 md:grid-cols-[1fr_320px]">
        <div>
          <Eyebrow>What you'll learn</Eyebrow>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {c.learn.map((l) => <li key={l} className="flex gap-3 rounded-md border border-border bg-card p-4 text-sm"><span className="text-gold">✦</span>{l}</li>)}
          </ul>
          <h2 className="mt-14 text-3xl font-semibold">Curriculum</h2>
          <div className="mt-5 divide-y divide-border rounded-md border border-border bg-card">
            {c.modules.map((m, i) => (
              <div key={m.title} className="p-5">
                <div className="eyebrow text-muted-foreground">Module {i + 1}</div>
                <div className="mt-1 font-display text-xl font-semibold">{m.title}</div>
                <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">{m.lessons.map((l) => <li key={l}>— {l}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
        <aside className="space-y-6">
          <div className="rounded-md bg-secondary p-6">
            <div className="eyebrow text-crimson">Instructor</div>
            <div className="mt-2 font-display text-2xl font-semibold">GSW Augustin</div>
            <p className="mt-2 text-sm text-muted-foreground">Barber, shop owner and founder of GSWAU — teaching the business side the trade never taught.</p>
          </div>
          <blockquote className="rounded-md border-l-4 border-gold bg-card p-6 shadow-card">
            <p className="font-display text-xl italic">“{c.testimonial.quote}”</p>
            <footer className="mt-3 text-sm text-muted-foreground">{c.testimonial.name}</footer>
          </blockquote>
        </aside>
      </div>
    </>
  );
}
