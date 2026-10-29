import { Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { formatMoney, membershipPrices } from "@/lib/catalog";
import { settingsQuery } from "@/lib/catalog.functions";
import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/i18n";

// Gumroad selects the yearly recurrence when this parameter is present.
// Confirmed on the public membership page: ?recurrence=yearly shows $199.99 a year.
function withYearlyRecurrence(url: string) {
  if (!url) return url;
  try {
    const next = new URL(url);
    if (!next.searchParams.has("recurrence")) next.searchParams.set("recurrence", "yearly");
    return next.toString();
  } catch {
    return url;
  }
}

// Monthly vs annual membership, annual highlighted. Checkout links come from Admin > Settings.
export function PricingPlans() {
  const { t, locale } = useT();
  const { data: settings } = useSuspenseQuery(settingsQuery);
  const { isMember } = useAuth();
  // Annual first so it leads on phones.
  const plans = [
    {
      id: "annual",
      name: t("pricing.annual"),
      price: formatMoney(membershipPrices.annual, locale),
      per: t("pricing.perYear"),
      note: t("pricing.annualNote", {
        monthly: formatMoney(membershipPrices.annual / 12, locale),
      }),
      url: withYearlyRecurrence(settings.annualUrl),
      featured: true,
    },
    {
      id: "monthly",
      name: t("pricing.monthly"),
      price: formatMoney(membershipPrices.monthly, locale),
      per: t("pricing.perMonth"),
      note: t("pricing.monthlyNote"),
      url: settings.monthlyUrl,
      featured: false,
    },
  ];
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2">
        {plans.map((p) => (
          <div
            key={p.id}
            className={`lift lift-box relative rounded-lg p-7 shadow-card ${
              p.featured ? "bg-navy-gradient text-primary-foreground ring-2 ring-gold" : "bg-card"
            }`}
          >
            {p.featured && (
              <div className="eyebrow mb-3 inline-block rounded-sm bg-gold px-2 py-1 text-navy-deep">
                {t("pricing.annualBadge")}
              </div>
            )}
            <h3 className="text-2xl font-semibold">{p.name}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="font-display text-5xl font-semibold">{p.price}</span>
              <span className={p.featured ? "text-primary-foreground/75" : "text-muted-foreground"}>
                {p.per}
              </span>
            </div>
            <p
              className={`mt-2 text-sm ${p.featured ? "text-primary-foreground/75" : "text-muted-foreground"}`}
            >
              {p.note}
            </p>
            {isMember ? (
              <Link to="/account" className="btn-gold mt-6 w-full">
                {t("pricing.openLibrary")}
              </Link>
            ) : p.url ? (
              <a href={p.url} className="btn-gold mt-6 w-full" rel="noopener">
                {t("pricing.join", { plan: p.name })}
              </a>
            ) : (
              <button type="button" className="btn-gold mt-6 w-full" disabled>
                {t("pricing.comingSoon")}
              </button>
            )}
          </div>
        ))}
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">{t("pricing.paidWith")}</p>
    </div>
  );
}
