import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/catalog.functions";
import { BookCard } from "@/components/Cards";
import { Eyebrow } from "@/components/SiteChrome";

export const Route = createFileRoute("/library/")({
  head: () => ({
    meta: [
      { title: "Library: Books for Barbers & Stylists — GSWAU" },
      {
        name: "description",
        content:
          "Every GSWAU audiobook, bundle and course by Gs. W. Augustin on pricing, clientele, branding, leadership and running a shop.",
      },
      { property: "og:title", content: "The GSWAU Library" },
      { property: "og:description", content: "Practical books for barbers and hairstylists." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: Library,
});

function Library() {
  const { data } = useSuspenseQuery(productsQuery);
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Eyebrow>The library</Eyebrow>
      <h1 className="mt-3 text-5xl font-semibold">All titles</h1>
      <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
        {data.map((b) => (
          <BookCard key={b.id} b={b} />
        ))}
      </div>
    </div>
  );
}
