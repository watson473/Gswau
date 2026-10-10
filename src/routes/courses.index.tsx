import { createFileRoute } from "@tanstack/react-router";
import { courses } from "@/lib/catalog";
import { CourseCard } from "@/components/Cards";
import { Eyebrow } from "@/components/SiteChrome";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "Courses — GSWAU" },
      { name: "description", content: "Video courses on pricing, clientele, branding and shop ownership for barbers and stylists." },
      { property: "og:title", content: "Courses — GSWAU" },
      { property: "og:description", content: "Business courses for barbers and stylists." },
    ],
  }),
  component: () => (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Eyebrow>Catalog</Eyebrow>
      <h1 className="mt-3 text-5xl font-semibold">Courses</h1>
      <div className="mt-10 grid gap-8 md:grid-cols-2">{courses.map((c) => <CourseCard key={c.slug} c={c} />)}</div>
    </div>
  ),
});
