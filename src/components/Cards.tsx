import { Link } from "@tanstack/react-router";
import { type Book, type Course, money } from "@/lib/catalog";

export function CourseCard({ c }: { c: Course }) {
  return (
    <Link to="/courses/$slug" params={{ slug: c.slug }} className="group overflow-hidden rounded-lg bg-card shadow-card transition hover:-translate-y-1">
      <div className="relative aspect-video overflow-hidden bg-navy-deep">
        <img src={c.image} alt={c.title} width={1280} height={720} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="eyebrow absolute left-4 top-4 rounded-sm bg-navy-deep/80 px-2 py-1 text-gold">Course</span>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-semibold">{c.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{c.tagline}</p>
        <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-sm">
          <span className="text-muted-foreground">{c.level} · {c.hours}h</span>
          <span className="font-display text-xl font-semibold">{money(c.price)}</span>
        </div>
      </div>
    </Link>
  );
}

export function BookCard({ b }: { b: Book }) {
  return (
    <Link to="/library/$slug" params={{ slug: b.slug }} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-md shadow-card">
        <img src={b.cover} alt={b.title} width={768} height={1024} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep via-navy-deep/70 to-transparent p-4 pt-16">
          <div className="eyebrow text-gold">{b.format}</div>
          <div className="mt-1 font-display text-xl leading-tight text-primary-foreground">{b.title}</div>
        </div>
        {b.free && <span className="eyebrow absolute right-3 top-3 rounded-sm bg-crimson px-2 py-1 text-primary-foreground">Free</span>}
      </div>
      <div className="mt-3 flex justify-between text-sm">
        <span className="text-muted-foreground">{b.detail}</span>
        <span className="font-semibold">{money(b.price)}</span>
      </div>
    </Link>
  );
}
