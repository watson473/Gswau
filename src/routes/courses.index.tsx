import { createFileRoute } from "@tanstack/react-router";
import { featured } from "@/lib/catalog";
import { BookCard } from "@/components/Cards";
import { Eyebrow } from "@/components/SiteChrome";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "Programs — GSWAU" },
      { name: "description", content: "The GSWAU Barber Success Bundle, Business Bootcamp and flagship leadership and marketing guides by Gs. W. Augustin." },
      { property: "og:title", content: "Programs — GSWAU" },
      { property: "og:description", content: "Flagship business programs for barbers and stylists." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Eyebrow>Flagship</Eyebrow>
      <h1 className="mt-3 text-5xl font-semibold">Programs</h1>
      <p className="mt-4 max-w-xl text-muted-foreground">Our most complete titles — the Bootcamp, leadership and marketing guides, and the Success Bundle.</p>
      <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">{featured.map((b) => <BookCard key={b.slug} b={b} />)}</div>
    </div>
  ),
});
