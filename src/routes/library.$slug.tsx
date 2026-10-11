import { createFileRoute, notFound } from "@tanstack/react-router";
import { author, books, money } from "@/lib/catalog";

export const Route = createFileRoute("/library/$slug")({
  loader: ({ params }) => {
    const book = books.find((b) => b.slug === params.slug);
    if (!book) throw notFound();
    return { book };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found — GSWAU" }, { name: "robots", content: "noindex" }] };
    const b = loaderData.book;
    const d = b.description.slice(0, 155);
    return { meta: [
      { title: `${b.title} — GSWAU` }, { name: "description", content: d },
      { property: "og:title", content: b.title }, { property: "og:description", content: d },
      { property: "og:type", content: "product" }, { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: b.cover }, { name: "twitter:image", content: b.cover },
    ] };
  },
  component: BookPage,
});

function BookPage() {
  const { book: b } = Route.useLoaderData();
  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 md:grid-cols-[360px_1fr]">
      <img src={b.cover} alt={b.title} className="w-full rounded-md shadow-card" />
      <div>
        <div className="eyebrow text-crimson">{b.format} · by {author.name}</div>
        <h1 className="mt-3 text-5xl font-semibold leading-tight">{b.title}</h1>
        {b.subtitle && <p className="mt-2 font-display text-xl italic text-muted-foreground">{b.subtitle}</p>}
        <div className="mt-8 rounded-md border border-border bg-card p-6">
          <div className="font-display text-4xl font-semibold">{money(b.price)}</div>
          <a href={b.buyUrl} target="_blank" rel="noopener noreferrer" className="btn-gold mt-4">
            {b.free ? "Get it free" : "Buy now"}
          </a>
          <p className="mt-3 text-xs text-muted-foreground">Secure checkout and instant download.</p>
        </div>
        <p className="mt-8 whitespace-pre-line leading-relaxed">{b.description}</p>
      </div>
    </div>
  );
}
