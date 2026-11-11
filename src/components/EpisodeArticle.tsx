import type { EpisodeArticle } from "@/lib/podcast-articles";
import { kitNewsletterUrl, podcastPageUrl } from "@/lib/podcast-articles";

// Alux-style episode page, in the site's ivory, navy and gold. The header monogram
// stays in the site header; this is only the article.
export function EpisodeArticleView({ article }: { article: EpisodeArticle }) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
      <p className="eyebrow text-gold">{article.kicker}</p>
      <h1 className="mt-3 text-4xl font-semibold leading-tight sm:text-5xl">{article.title}</h1>
      <p className="mt-6 text-lg leading-relaxed">{article.lede}</p>
      <ListenLine />
      <NewsletterBox />

      <nav
        aria-label="In this episode"
        className="rounded-md border border-border bg-card p-6 shadow-card"
      >
        <h2 className="text-2xl font-semibold">At a glance</h2>
        <ol className="mt-4 list-decimal space-y-3 pl-5 leading-relaxed">
          {article.glance.map((item) => (
            <li key={item.id}>
              <a href={`#${item.id}`} className="font-medium hover:text-gold">
                {item.label}
              </a>
              <span className="text-muted-foreground"> — {item.note}</span>
            </li>
          ))}
        </ol>
      </nav>

      {article.sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <h2 className="mt-14 text-2xl font-semibold">{section.heading}</h2>
          <p className="mt-3 text-sm text-muted-foreground">{section.caption}</p>
          <p className="mt-4 leading-relaxed">{section.body}</p>
          <blockquote className="my-6 border-l-[3px] border-gold bg-secondary px-5 py-5 sm:px-6">
            <p className="font-display text-xl font-medium italic leading-snug sm:text-2xl">
              {section.quote}
            </p>
            <cite className="mt-3 block font-sans text-sm font-medium not-italic text-muted-foreground">
              {section.quoteCite}
            </cite>
          </blockquote>
        </section>
      ))}

      <section id="faq" className="scroll-mt-24">
        <h2 className="mt-14 text-2xl font-semibold">FAQ</h2>
        <div className="mt-4 border-b border-border">
          {article.faqs.map((faq) => (
            <div key={faq.question} className="border-t border-border py-4">
              <h3 className="font-sans text-lg font-semibold">{faq.question}</h3>
              <p className="mt-3 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <h2 className="mt-14 text-2xl font-semibold">Listen and the newsletter</h2>
      <ListenLine />
      <NewsletterBox />
    </article>
  );
}

function ListenLine() {
  return (
    <p className="my-6 font-semibold">
      Wanna listen? Head to{" "}
      <a
        href={podcastPageUrl}
        className="underline decoration-gold/60 underline-offset-2 hover:text-gold"
      >
        gswau.com/podcast
      </a>{" "}
      for the full episode, or listen on{" "}
      <a
        href="https://open.spotify.com/episode/4mNNq4uXFtCN1LhQ6DTZvs?si=dbbc7b576652437e"
        target="_blank"
        rel="noopener noreferrer"
        className="underline decoration-gold/60 underline-offset-2 hover:text-gold"
      >
        Spotify
      </a>
      .
    </p>
  );
}

function NewsletterBox() {
  return (
    <div
      role="region"
      aria-label="GSWAU newsletter"
      className="mb-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-gold bg-navy-gradient px-5 py-3.5 shadow-[0_0_34px_-8px_var(--gold)]"
    >
      <p className="min-w-[16rem] flex-1 text-[17px] leading-snug text-white">
        <strong className="text-gold">Education first, in your inbox.</strong> No pitch for a call.
      </p>
      <a
        href={kitNewsletterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-gold shrink-0 !rounded-full !px-6 !py-2.5 no-underline"
      >
        Get the GSWAU newsletter
      </a>
    </div>
  );
}
