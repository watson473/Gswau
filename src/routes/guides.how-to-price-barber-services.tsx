import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Calculator, GraduationCap } from "lucide-react";
import { Eyebrow } from "@/components/SiteChrome";
import { author, courseOffers, formatMoney } from "@/lib/catalog";
import { gumroadLink } from "@/lib/gumroad-store";
import {
  exampleNumbers,
  pricingExample,
  pricingFaqs,
  pricingGuide,
  pricingMistakes,
  raiseSignals,
  raiseSteps,
} from "@/lib/guides/how-to-price-barber-services";
import { breadcrumbList, canonicalUrl, faqPage, jsonLdGraph, shareMeta } from "@/lib/share";

const PRICE_SHIFT_SLUG = "the-price-shift-course";
// The plain course link, built from the store address setting and the course's Gumroad code.
const priceShiftOffer = courseOffers[PRICE_SHIFT_SLUG];
const priceShiftBuyUrl = priceShiftOffer ? gumroadLink(priceShiftOffer.gumroadPermalink) : null;

export const Route = createFileRoute("/guides/how-to-price-barber-services")({
  head: () =>
    shareMeta({
      title: `${pricingGuide.title} — GSWAU`,
      socialTitle: pricingGuide.title,
      description: pricingGuide.description,
      path: pricingGuide.path,
      type: "article",
      extraMeta: [{ property: "article:published_time", content: pricingGuide.published }],
      jsonLd: jsonLdGraph(
        breadcrumbList([
          { name: "Home", path: "/" },
          { name: pricingGuide.title, path: pricingGuide.path },
        ]),
        {
          "@type": "Article",
          "@id": `${canonicalUrl(pricingGuide.path)}#article`,
          headline: pricingGuide.title,
          description: pricingGuide.description,
          url: canonicalUrl(pricingGuide.path),
          mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl(pricingGuide.path) },
          inLanguage: "en",
          datePublished: pricingGuide.published,
          author: { "@type": "Person", name: author.name },
          publisher: { "@type": "Organization", name: "GSWAU" },
        },
        faqPage(
          pricingFaqs.map((f) => ({ question: f.question, answer: f.answer })),
          pricingGuide.path,
        ),
      ),
    }),
  component: PricingGuide,
});

function PricingGuide() {
  const n = exampleNumbers();
  const money = (amount: number) => formatMoney(amount).replace(/\.00$/, "");
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <Eyebrow>Guide</Eyebrow>
      <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
        {pricingGuide.title}
      </h1>
      <p className="mt-3 text-base text-muted-foreground">By {author.name}</p>

      <section
        aria-labelledby="short-answer"
        className="mt-8 rounded-lg border-l-4 border-gold bg-card p-6 shadow-card"
      >
        <h2 id="short-answer" className="eyebrow text-crimson">
          The short answer
        </h2>
        <p className="mt-3 text-lg leading-relaxed">{pricingGuide.shortAnswer}</p>
      </section>

      <div className="mt-6">
        <Link to="/calculator" className="btn-gold">
          <Calculator className="h-4 w-4" aria-hidden="true" />
          Try the free pricing calculator
        </Link>
      </div>

      <Prose>
        <h2>How to price your barber services, step by step</h2>
        <ol>
          <li>
            <strong>Add up your monthly costs.</strong> Booth rent, products and supplies, tools and
            their upkeep, and every other cost of running your chair: booking app, card fees,
            insurance, classes.
          </li>
          <li>
            <strong>Count the hours you actually cut.</strong> Only the time a client is in your
            chair. Use a normal week, then multiply by the weeks you work in a month.
          </li>
          <li>
            <strong>Decide the income you want.</strong> The amount you want to pay yourself each
            month, before taxes.
          </li>
          <li>
            <strong>Find what each hour must earn.</strong> Add your costs to your income goal and
            divide by your cutting hours.
          </li>
          <li>
            <strong>Price each service.</strong> Multiply that hourly figure by the time the service
            really takes, including the consultation and clean-up, and round up.
          </li>
        </ol>
      </Prose>

      <section
        aria-labelledby="worked-example"
        className="mt-10 rounded-lg border border-gold/40 bg-card p-6 shadow-card"
      >
        <div className="eyebrow text-crimson">Example only</div>
        <h2 id="worked-example" className="mt-2 text-2xl font-semibold">
          A worked example with round numbers
        </h2>
        <p className="mt-2 text-base text-muted-foreground">
          These numbers are made up to show the method. Use your own.
        </p>

        <h3 className="mt-6 font-sans text-sm font-bold uppercase tracking-wider">
          1. Monthly costs
        </h3>
        <table className="mt-2 w-full text-base">
          <tbody>
            {pricingExample.costs.map((c) => (
              <tr key={c.label} className="border-b border-border">
                <td className="py-2 pr-4">{c.label}</td>
                <td className="py-2 text-right tabular-nums">{money(c.amount)}</td>
              </tr>
            ))}
            <tr className="font-semibold">
              <td className="py-2 pr-4">Total costs</td>
              <td className="py-2 text-right tabular-nums">{money(n.costs)}</td>
            </tr>
          </tbody>
        </table>

        <ExampleStep n="2" title="Hours actually cutting">
          {pricingExample.cuttingHoursPerWeek} hours a week × {pricingExample.weeksPerMonth} weeks ={" "}
          <strong>{n.hours} hours a month</strong>
        </ExampleStep>
        <ExampleStep n="3" title="Income wanted">
          <strong>{money(pricingExample.incomeGoal)} a month</strong>, before taxes
        </ExampleStep>
        <ExampleStep n="4" title="What each hour must earn">
          ({money(n.costs)} + {money(pricingExample.incomeGoal)}) ÷ {n.hours} hours ={" "}
          <strong>{money(n.perHour)} an hour</strong>
        </ExampleStep>
        <h3 className="mt-6 font-sans text-sm font-bold uppercase tracking-wider">
          5. Price per service
        </h3>
        <ul className="mt-2 space-y-2 text-base">
          {n.services.map((s) => (
            <li key={s.name}>
              {s.name}, {s.minutes} minutes: {money(n.perHour)} × {s.minutes}/60 ={" "}
              {formatMoney(s.exact)}, rounded up to <strong>{money(s.price)}</strong>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-base">
          If the shop down the street charges less, that does not change your numbers. It tells you
          how clearly you need to show clients what they get from you.
        </p>
      </section>

      <Prose>
        <h2>Common pricing mistakes barbers make</h2>
        <ul>
          {pricingMistakes.map((m) => (
            <li key={m.title}>
              <strong>{m.title}.</strong> {m.body}
            </li>
          ))}
        </ul>

        <h2>When and how to raise your prices without losing good clients</h2>
        <p>It is time to look at your prices when:</p>
        <ul>
          {raiseSignals.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p>When you raise them:</p>
        <ol>
          {raiseSteps.map((s) => (
            <li key={s.title}>
              <strong>{s.title}.</strong> {s.body}
            </li>
          ))}
        </ol>

        <h2 id="faq">Frequently asked questions about barber pricing</h2>
        {pricingFaqs.map((f) => (
          <div key={f.question}>
            <h3>{f.question}</h3>
            <p>{f.answer}</p>
          </div>
        ))}
      </Prose>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        <div className="rounded-lg border border-gold/40 bg-card p-6 shadow-card">
          <Calculator className="h-6 w-6 text-gold" aria-hidden="true" />
          <h2 className="mt-3 text-2xl font-semibold">Free pricing calculator</h2>
          <p className="mt-2 text-base text-muted-foreground">
            Put in your own prices and clients and see what a week in your chair earns.
          </p>
          <div className="mt-4">
            <Link to="/calculator" className="btn-gold">
              Try the free pricing calculator
            </Link>
          </div>
        </div>
        <div className="rounded-lg border border-gold/40 bg-card p-6 shadow-card">
          <GraduationCap className="h-6 w-6 text-gold" aria-hidden="true" />
          <h2 className="mt-3 text-2xl font-semibold">The Price Shift course</h2>
          <p className="mt-2 text-base text-muted-foreground">
            The full course on setting and raising your prices. $97, or included with the GSWAU
            membership.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {priceShiftBuyUrl && (
              <a href={priceShiftBuyUrl} rel="noopener" className="btn-gold">
                Get The Price Shift
              </a>
            )}
            <Link to="/pricing" className="btn-ghost">
              See membership
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="mt-10 text-lg leading-relaxed [&>h2:first-child]:mt-0 [&_a]:text-primary [&_a]:underline [&_h2]:mt-12 [&_h2]:text-3xl [&_h2]:font-semibold [&_h3]:mt-8 [&_h3]:text-2xl [&_h3]:font-semibold [&_li]:mt-3 [&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
      {children}
    </div>
  );
}

function ExampleStep({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <>
      <h3 className="mt-6 font-sans text-sm font-bold uppercase tracking-wider">
        {n}. {title}
      </h3>
      <p className="mt-2 text-base">{children}</p>
    </>
  );
}
