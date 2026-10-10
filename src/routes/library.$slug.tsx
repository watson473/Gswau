import { createFileRoute, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { books, money } from "@/lib/catalog";

export const Route = createFileRoute("/library/$slug")({
  loader: ({ params }) => {
    const book = books.find((b) => b.slug === params.slug);
    if (!book) throw notFound();
    return { book };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found — GSWAU" }, { name: "robots", content: "noindex" }] };
    const b = loaderData.book;
    return { meta: [
      { title: `${b.title} (${b.format}) — GSWAU` }, { name: "description", content: b.description },
      { property: "og:title", content: b.title }, { property: "og:description", content: b.subtitle },
    ] };
  },
  component: BookPage,
});

function BookPage() {
  const { book: b } = Route.useLoaderData();
  const [sent, setSent] = useState(false);
  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 md:grid-cols-[340px_1fr]">
      <img src={b.cover} alt={b.title} width={768} height={1024} className="w-full rounded-md shadow-card" />
      <div>
        <div className="eyebrow text-crimson">{b.format} · {b.detail}</div>
        <h1 className="mt-3 text-5xl font-semibold leading-tight">{b.title}</h1>
        <p className="mt-2 font-display text-xl italic text-muted-foreground">{b.subtitle}</p>
        <p className="mt-6 leading-relaxed">{b.description}</p>
        <div className="mt-8 rounded-md border border-border bg-card p-6">
          <div className="font-display text-4xl font-semibold">{money(b.price)}</div>
          {b.free ? (
            sent ? <p className="mt-4 text-sm">Thanks — your chapter is on its way.</p> : (
              <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
                <input required type="email" placeholder="you@email.com" className="flex-1 rounded-md border border-input bg-background px-4 py-3 text-sm" />
                <button className="btn-gold">Send it free</button>
              </form>
            )
          ) : (
            <button className="btn-gold mt-4" disabled>Buy — checkout coming soon</button>
          )}
        </div>
      </div>
    </div>
  );
}
