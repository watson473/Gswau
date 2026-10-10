import { createFileRoute } from "@tanstack/react-router";
import { books } from "@/lib/catalog";
import { BookCard } from "@/components/Cards";
import { Eyebrow } from "@/components/SiteChrome";

export const Route = createFileRoute("/library/")({
  head: () => ({
    meta: [
      { title: "Library: E-books & Audiobooks — GSWAU" },
      { name: "description", content: "E-books and audiobooks on building a barber or beauty business." },
      { property: "og:title", content: "The GSWAU Library" },
      { property: "og:description", content: "E-books and audiobooks for barbers and stylists." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Eyebrow>The library</Eyebrow>
      <h1 className="mt-3 text-5xl font-semibold">Books & audiobooks</h1>
      <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">{books.map((b) => <BookCard key={b.slug} b={b} />)}</div>
    </div>
  ),
});
