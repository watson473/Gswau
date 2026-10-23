import { Link } from "@tanstack/react-router";
import { formatLabel, money } from "@/lib/catalog";
import type { Product } from "@/lib/catalog.functions";

export function BookCard({ b }: { b: Product }) {
  return (
    <Link to="/library/$slug" params={{ slug: b.slug }} className="group block">
      <div className="relative aspect-square overflow-hidden rounded-md bg-navy-deep shadow-card">
        {b.cover_image_url && (
          <img
            src={b.cover_image_url}
            alt={b.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        )}
        {b.is_free && (
          <span className="eyebrow absolute right-3 top-3 rounded-sm bg-crimson px-2 py-1 text-primary-foreground">
            Free
          </span>
        )}
        {b.included_with_subscription && (
          <span className="eyebrow absolute bottom-3 left-3 rounded-sm bg-navy-deep/90 px-2 py-1 text-gold">
            Subscribers
          </span>
        )}
        {(b.type === "bundle" || b.type === "course") && (
          <span className="eyebrow absolute right-3 top-3 rounded-sm bg-gold px-2 py-1 text-navy-deep">
            {formatLabel[b.type]}
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-lg leading-tight">{b.title}</div>
      <div className="mt-1 flex justify-between text-sm">
        <span className="text-muted-foreground">{formatLabel[b.type]}</span>
        <span className="font-semibold">{money(b.price_cents)}</span>
      </div>
      {b.review_count > 0 && b.rating_average != null && (
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <Stars n={Math.round(Number(b.rating_average))} />
          <span>
            {Number(b.rating_average).toFixed(1)} ({b.review_count})
          </span>
        </div>
      )}
    </Link>
  );
}

export function Stars({ n }: { n: number }) {
  return (
    <span className="text-gold" aria-label={`${n} out of 5`}>
      {"★".repeat(n)}
      <span className="opacity-30">{"★".repeat(5 - n)}</span>
    </span>
  );
}
