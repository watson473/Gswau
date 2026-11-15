import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/catalog.functions";
import { BookCard } from "@/components/Cards";
import { Eyebrow } from "@/components/SiteChrome";
import {
  breadcrumbList,
  canonicalUrl,
  courseNode,
  jsonLdGraph,
  organizationId,
  originFromMatches,
  shareMeta,
  websiteId,
} from "@/lib/share";

const coursesDescription =
  "Video courses included with a GSWAU membership, plus flagship guides by Gs. W. Augustin.";

function coursesJsonLd(
  products:
    | readonly {
        type: string;
        slug: string;
        title: string;
        description: string;
        cover_image_url: string | null;
        access_tier: string;
        price_cents: number;
      }[]
    | undefined,
) {
  const courses = (products ?? []).filter((product) => product.type === "course");
  return jsonLdGraph(
    breadcrumbList([
      { name: "Home", path: "/" },
      { name: "Courses", path: "/courses" },
    ]),
    {
      "@type": "CollectionPage",
      "@id": canonicalUrl("/courses"),
      url: canonicalUrl("/courses"),
      name: "Courses",
      description: coursesDescription,
      isPartOf: { "@id": websiteId },
      about: { "@id": organizationId },
    },
    ...courses.map((product) =>
      courseNode({
        slug: product.slug,
        title: product.title,
        description: product.description,
        coverImage: product.cover_image_url,
        accessTier: product.access_tier,
        priceCents: product.price_cents,
      }),
    ),
  );
}

export const Route = createFileRoute("/courses/")({
  head: ({ loaderData, matches }) =>
    shareMeta({
      title: "Courses — GSWAU",
      description: coursesDescription,
      path: "/courses",
      assetOrigin: originFromMatches(matches),
      jsonLd: coursesJsonLd(loaderData),
    }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: Programs,
});

function Programs() {
  const { data } = useSuspenseQuery(productsQuery);
  const courses = data.filter((p) => p.type === "course");
  const featured = data.filter((p) => p.is_featured && p.type !== "course");
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Eyebrow>Watch</Eyebrow>
      <h1 className="mt-3 text-5xl font-semibold">Courses</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Video courses included with membership. Every audiobook is in the{" "}
        <Link to="/library" className="underline">
          library
        </Link>
        .
      </p>
      {courses.length > 0 && (
        <>
          <h2 className="mt-12 text-3xl font-semibold">Video courses</h2>
          <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
            {courses.map((b) => (
              <BookCard key={b.id} b={b} />
            ))}
          </div>
        </>
      )}
      <h2 className="mt-12 text-3xl font-semibold">Flagship guides & bundles</h2>
      <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
        {featured.map((b) => (
          <BookCard key={b.id} b={b} />
        ))}
      </div>
    </div>
  );
}
