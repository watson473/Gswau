import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/catalog.functions";
import { BookCard } from "@/components/Cards";
import { Eyebrow } from "@/components/SiteChrome";
import {
  breadcrumbList,
  canonicalUrl,
  jsonLdGraph,
  organizationId,
  shareMeta,
  websiteId,
} from "@/lib/share";

export const Route = createFileRoute("/library/")({
  head: () => {
    const description =
      "Every GSWAU audiobook, bundle and course by Gs. W. Augustin on pricing, clientele, branding, leadership and running a shop.";
    return shareMeta({
      title: "Library: Books for Barbers & Stylists — GSWAU",
      description,
      path: "/library",
      jsonLd: jsonLdGraph(
        breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Library", path: "/library" },
        ]),
        {
          "@type": "CollectionPage",
          "@id": canonicalUrl("/library"),
          url: canonicalUrl("/library"),
          name: "Library",
          description,
          isPartOf: { "@id": websiteId },
          about: { "@id": organizationId },
        },
      ),
    });
  },
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
