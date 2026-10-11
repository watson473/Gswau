import { Link } from "@tanstack/react-router";
import { type Book, money } from "@/lib/catalog";

export function BookCard({ b }: { b: Book }) {
  return (
    <Link to="/library/$slug" params={{ slug: b.slug }} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-md bg-navy-deep shadow-card">
        <img src={b.cover} alt={b.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        {b.free && <span className="eyebrow absolute right-3 top-3 rounded-sm bg-crimson px-2 py-1 text-primary-foreground">Free</span>}
        {b.format === "Bundle" && <span className="eyebrow absolute right-3 top-3 rounded-sm bg-gold px-2 py-1 text-navy-deep">Bundle</span>}
      </div>
      <div className="mt-3 font-display text-lg leading-tight">{b.title}</div>
      <div className="mt-1 flex justify-between text-sm">
        <span className="text-muted-foreground">{b.format}</span>
        <span className="font-semibold">{money(b.price)}</span>
      </div>
    </Link>
  );
}
