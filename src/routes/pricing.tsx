import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery, settingsQuery } from "@/lib/catalog.functions";
import { bookCount } from "@/lib/catalog";
import { Eyebrow } from "@/components/SiteChrome";
import { PricingPlans } from "@/components/Pricing";
import { createTranslator, defaultLocale, useT } from "@/i18n";

const t0 = createTranslator(defaultLocale);

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: t0("pricing.meta.title") },
      { name: "description", content: t0("pricing.meta.description") },
      { property: "og:title", content: t0("pricing.meta.title") },
      { property: "og:description", content: t0("pricing.meta.description") },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(productsQuery),
      context.queryClient.ensureQueryData(settingsQuery),
    ]),
  component: Pricing,
});

function List({ title, items, tone }: { title: string; items: string[]; tone: "gold" | "muted" }) {
  return (
    <div className="rounded-lg bg-card p-6 shadow-card">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <ul className="mt-4 space-y-2 text-sm">
        {items.map((i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden className={tone === "gold" ? "text-gold" : "text-muted-foreground"}>
              {tone === "gold" ? "✓" : "–"}
            </span>
            <span>{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Pricing() {
  const { t } = useT();
  const { data: products } = useSuspenseQuery(productsQuery);
  const count = bookCount(products);
  const faq = [1, 2, 3, 4].map((n) => ({ q: t(`pricing.faq.q${n}`), a: t(`pricing.faq.a${n}`) }));
  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
      <div className="text-center">
        <div className="flex justify-center">
          <Eyebrow>{t("pricing.eyebrow")}</Eyebrow>
        </div>
        <h1 className="mt-3 text-4xl font-semibold sm:text-6xl">{t("pricing.title")}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          {t("pricing.subtitle")}
        </p>
      </div>
      <div className="mx-auto mt-10 max-w-3xl">
        <PricingPlans />
      </div>
      <div className="mt-14 grid gap-6 md:grid-cols-3">
        <List
          tone="gold"
          title={t("pricing.included.title")}
          items={[
            t("pricing.included.books", { count }),
            t("pricing.included.audio"),
            t("pricing.included.courses"),
            t("pricing.included.devices"),
          ]}
        />
        <List
          tone="gold"
          title={t("pricing.free.title")}
          items={[
            t("pricing.free.browse"),
            t("pricing.free.preview"),
            t("pricing.free.podcast"),
            t("pricing.free.newsletter"),
          ]}
        />
        <List
          tone="muted"
          title={t("pricing.extra.title")}
          items={[t("pricing.extra.premium"), t("pricing.extra.coaching")]}
        />
      </div>
      <section className="mx-auto mt-16 max-w-3xl">
        <h2 className="text-3xl font-semibold">{t("pricing.faq.title")}</h2>
        <div className="mt-6 divide-y divide-border rounded-lg border border-border bg-card">
          {faq.map((f) => (
            <details key={f.q} className="group p-5">
              <summary className="cursor-pointer list-none font-semibold">{f.q}</summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
