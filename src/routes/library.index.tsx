import { createFileRoute } from "@tanstack/react-router";
import { books } from "@/lib/catalog";
import { BookCard } from "@/components/Cards";
import { Eyebrow } from "@/components/SiteChrome";

export const Route = createFileRoute("/library/")({
  head: () => ({
    meta: [
      { title: "Library: Books for Barbers & Stylists — GSWAU" },
      { name: "description", content: "All 25 GSWAU e-books by Gs. W. Augustin on pricing, clientele, branding, leadership and running a barbershop or salon." },
      { property: "og:title", content: "The GSWAU Library" },
      { property: "og:description", content: "Practical books for barbers and hairstylists." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Eyebrow>The library</Eyebrow>
      <h1 className="mt-3 text-5xl font-semibold">All books</h1>
      <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">{books.map((b) => <BookCard key={b.slug} b={b} />)}</div>
    </div>
  ),
});
