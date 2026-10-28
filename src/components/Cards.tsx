import { Link } from "@tanstack/react-router";
import { formatMoney } from "@/lib/catalog";
import type { Product } from "@/lib/catalog.functions";
import { useT } from "@/i18n";

export function BookCard({ b, eager = false }: { b: Product; eager?: boolean }) {
  const { t, locale } = useT();
  const badge =
    b.access_tier === "free"
      ? { text: t("card.free"), cls: "bg-crimson text-primary-foreground" }
      : b.access_tier === "premium"
        ? { text: t("card.premium"), cls: "bg-gold text-navy-deep" }
        : b.type === "bundle" || b.type === "course"
          ? { text: t(`format.${b.type}`), cls: "bg-gold text-navy-deep" }
          : null;
  return (
    <Link to="/library/$slug" params={{ slug: b.slug }} className="group lift block">
      <div
        data-parallax="cover"
        className="lift-shadow relative aspect-square overflow-hidden rounded-md bg-navy-deep shadow-card"
      >
        {b.cover_image_url && (
          <img
            src={b.cover_image_url}
            alt=""
            width={400}
            height={400}
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
          />
        )}
        {badge && (
          <span className={`eyebrow absolute right-3 top-3 rounded-sm px-2 py-1 ${badge.cls}`}>
            {badge.text}
          </span>
        )}
        {b.access_tier === "members" && b.type !== "bundle" && (
          <span className="eyebrow absolute bottom-3 left-3 rounded-sm bg-navy-deep/90 px-2 py-1 text-gold">
            {t("card.members")}
          </span>
        )}
      </div>
      <div className="mt-3 font-display text-lg leading-tight">{b.title}</div>
      <div className="mt-1 flex justify-between text-sm">
        <span className="text-muted-foreground">{t(`format.${b.type}`)}</span>
        <span className="font-semibold">
          {b.price_cents === 0 ? t("price.free") : formatMoney(b.price_cents / 100, locale)}
        </span>
      </div>
      {b.review_count > 0 && b.rating_average != null && (
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <Stars n={Math.round(Number(b.rating_average))} />
          <span>
            {t("card.rating", {
              average: Number(b.rating_average).toFixed(1),
              count: b.review_count,
            })}
          </span>
        </div>
      )}
    </Link>
  );
}

export function Stars({ n }: { n: number }) {
  return (
    <span className="text-gold" aria-label={`${n} / 5`}>
      {"★".repeat(n)}
      <span className="opacity-30">{"★".repeat(5 - n)}</span>
    </span>
  );
}
