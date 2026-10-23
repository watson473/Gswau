import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/catalog.functions";
import { BookCard } from "@/components/Cards";
import { Eyebrow } from "@/components/SiteChrome";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "Programs & Courses — GSWAU" },
      {
        name: "description",
        content:
          "Video courses, the GSWAU Barber Success Bundle, Business Bootcamp and flagship guides by Gs. W. Augustin.",
      },
      { property: "og:title", content: "Programs & Courses — GSWAU" },
      {
        property: "og:description",
        content: "Flagship business programs for barbers and stylists.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
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
      <Eyebrow>Flagship</Eyebrow>
      <h1 className="mt-3 text-5xl font-semibold">Programs</h1>
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
