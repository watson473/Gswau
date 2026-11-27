import type { ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, GraduationCap } from "lucide-react";
import { Eyebrow } from "@/components/SiteChrome";
import { author, formatMoney } from "@/lib/catalog";
import {
  clientsExample,
  clientsExampleNumbers,
  clientsFaqs,
  clientsGuide,
  clientsMistakes,
  clientsSteps,
} from "@/lib/guides/how-to-get-more-barber-clients";
import { pricingGuide } from "@/lib/guides/how-to-price-barber-services";
import { breadcrumbList, canonicalUrl, faqPage, jsonLdGraph, shareMeta } from "@/lib/share";

// The members library book that covers this topic in depth.
const CLIENTELE_BOOK_SLUG = "the-art-of-building-your-clientele-in-the-barber-and-beauty-industry";

export const Route = createFileRoute("/guides/how-to-get-more-barber-clients")({
  head: () =>
    shareMeta({
      title: `${clientsGuide.title} — GSWAU`,
      socialTitle: clientsGuide.title,
      description: clientsGuide.description,
      path: clientsGuide.path,
      type: "article",
      extraMeta: [{ property: "article:published_time", content: clientsGuide.published }],
      jsonLd: jsonLdGraph(
        breadcrumbList([
          { name: "Home", path: "/" },
          { name: clientsGuide.title, path: clientsGuide.path },
        ]),
        {
          "@type": "Article",
          "@id": `${canonicalUrl(clientsGuide.path)}#article`,
          headline: clientsGuide.title,
          description: clientsGuide.description,
          url: canonicalUrl(clientsGuide.path),
          mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl(clientsGuide.path) },
          inLanguage: "en",
          datePublished: clientsGuide.published,
          author: { "@type": "Person", name: author.name },
          publisher: { "@type": "Organization", name: "GSWAU" },
        },
        faqPage(
          clientsFaqs.map((f) => ({ question: f.question, answer: f.answer })),
          clientsGuide.path,
        ),
      ),
    }),
  component: ClientsGuide,
});

function ClientsGuide() {
  const n = clientsExampleNumbers();
  const ex = clientsExample;
  const money = (amount: number) => formatMoney(amount).replace(/\.00$/, "");
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <Eyebrow>Guide</Eyebrow>
      <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">
        {clientsGuide.title}
      </h1>
      <p className="mt-3 text-base text-muted-foreground">By {author.name}</p>

      <section
        aria-labelledby="short-answer"
        className="mt-8 rounded-lg border-l-4 border-gold bg-card p-6 shadow-card"
      >
        <h2 id="short-answer" className="eyebrow text-crimson">
          The short answer
        </h2>
        <p className="mt-3 text-lg leading-relaxed">{clientsGuide.shortAnswer}</p>
      </section>

      <div className="mt-6">
        <Link to="/library/$slug" params={{ slug: CLIENTELE_BOOK_SLUG }} className="btn-gold">
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          Read The Art of Building Your Clientele
        </Link>
      </div>

      <Prose>
        <h2>How to get more clients as a barber, step by step</h2>
        <ol>
          {clientsSteps.map((s) => (
            <li key={s.title}>
              <strong>{s.title}.</strong> {s.body}
            </li>
          ))}
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
          These numbers are made up to show the method. Use your own. To keep it simple, regulars
          come once a month and nobody leaves.
        </p>

        <ExampleStep n="1" title="The starting point">
          A barber gets <strong>{ex.newClientsPerMonth} new clients a month</strong> and charges{" "}
          <strong>{money(ex.pricePerVisit)} a visit</strong>.
        </ExampleStep>
        <ExampleStep
          n="2"
          title={`If ${ex.keptBefore} of every ${ex.newClientsPerMonth} come back`}
        >
          {ex.keptBefore} new regulars a month × {ex.months} months ={" "}
          <strong>{n.regularsBefore} regulars</strong>. {n.regularsBefore} ×{" "}
          {money(ex.pricePerVisit)} = <strong>{money(n.monthlyBefore)} a month</strong> in repeat
          bookings.
        </ExampleStep>
        <ExampleStep n="3" title={`If ${ex.keptAfter} of every ${ex.newClientsPerMonth} come back`}>
          {ex.keptAfter} new regulars a month × {ex.months} months ={" "}
          <strong>{n.regularsAfter} regulars</strong>. {n.regularsAfter} × {money(ex.pricePerVisit)}{" "}
          = <strong>{money(n.monthlyAfter)} a month</strong> in repeat bookings.
        </ExampleStep>
        <ExampleStep n="4" title="The difference">
          <strong>{money(n.extraPerMonth)} more a month</strong>, from the same{" "}
          {ex.newClientsPerMonth} new clients.
        </ExampleStep>
        <p className="mt-6 text-base">
          The barber did not find a single extra new client. Rebooking and looking after the people
          already in the chair doubled what those new clients were worth.
        </p>
      </section>

      <Prose>
        <h2>Common mistakes barbers make when trying to get clients</h2>
        <ul>
          {clientsMistakes.map((m) => (
            <li key={m.title}>
              <strong>{m.title}.</strong> {m.body}
            </li>
          ))}
        </ul>

        <h2 id="faq">Frequently asked questions about getting barber clients</h2>
        {clientsFaqs.map((f) => (
          <div key={f.question}>
            <h3>{f.question}</h3>
            <p>{f.answer}</p>
          </div>
        ))}

        <h2>Related guides</h2>
        <ul>
          <li>
            <Link to={pricingGuide.path}>{pricingGuide.title}</Link>: set prices that cover your
            costs, so every new client is worth having.
          </li>
        </ul>
        <p>From the blog:</p>
        <ul>
          <li>
            <Link to="/blog/$slug" params={{ slug: "build-your-clientele-from-zero" }}>
              Building a Clientele From Zero
            </Link>
          </li>
          <li>
            <Link to="/blog/$slug" params={{ slug: "rebook-at-the-chair" }}>
              Rebooking at the Chair: Fill Next Month Before Today Ends
            </Link>
          </li>
        </ul>
      </Prose>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        <div className="rounded-lg border border-gold/40 bg-card p-6 shadow-card">
          <BookOpen className="h-6 w-6 text-gold" aria-hidden="true" />
          <h2 className="mt-3 text-2xl font-semibold">The Art of Building Your Clientele</h2>
          <p className="mt-2 text-base text-muted-foreground">
            The book that covers each of these habits in detail, in the GSWAU library.
          </p>
          <div className="mt-4">
            <Link to="/library/$slug" params={{ slug: CLIENTELE_BOOK_SLUG }} className="btn-gold">
              Open the book
            </Link>
          </div>
        </div>
        <div className="rounded-lg border border-gold/40 bg-card p-6 shadow-card">
          <GraduationCap className="h-6 w-6 text-gold" aria-hidden="true" />
          <h2 className="mt-3 text-2xl font-semibold">GSWAU membership</h2>
          <p className="mt-2 text-base text-muted-foreground">
            Every GSWAU audiobook and the video courses, for barbers who want the full method.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/pricing" className="btn-gold">
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
