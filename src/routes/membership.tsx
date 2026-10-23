import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQuery } from "@/lib/catalog.functions";
import { BookCard } from "@/components/Cards";
import { Eyebrow } from "@/components/SiteChrome";
import { SubscribeBox } from "@/components/SubscribeBox";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/membership")({
  head: () => ({
    meta: [
      { title: "Membership — GSWAU" },
      {
        name: "description",
        content:
          "Browse GSWAU free. Subscribe to read every book and take the courses, and listen to the podcast.",
      },
      { property: "og:title", content: "Membership — GSWAU" },
      { property: "og:description", content: "Subscribe to unlock every GSWAU book and course." },
      { property: "og:type", content: "website" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  component: Membership,
});

function Membership() {
  const { data } = useSuspenseQuery(productsQuery);
  const { user, isSubscriber } = useAuth();
  const included = data.filter((p) => p.included_with_subscription);
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Eyebrow>Membership</Eyebrow>
      <h1 className="mt-3 text-5xl font-semibold">Read everything. Learn at your pace.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        The website is free to browse, and the podcast is free to listen to. Paid subscribers get
        access to the books and courses below, right here on the site.
      </p>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {[
          [
            "Free for everyone",
            "Browse every title, read descriptions and reviews, and listen to the podcast.",
          ],
          [
            "Subscribers",
            `Read and download ${included.length || "all the"} included books and take the included courses.`,
          ],
          ["Coaching", "Private 1:1 sessions with Gs. W. Augustin, booked separately."],
        ].map(([t, d]) => (
          <div key={t} className="rounded-lg bg-card p-6 shadow-card">
            <h2 className="text-2xl font-semibold">{t}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 rounded-lg bg-navy-gradient p-8 text-primary-foreground">
        {isSubscriber ? (
          <>
            <h2 className="text-3xl font-semibold">You're a subscriber.</h2>
            <Link to="/account" className="btn-gold mt-5">
              Open my library
            </Link>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-semibold">Become a subscriber</h2>
            <p className="mt-2 max-w-xl text-sm text-primary-foreground/75">
              Online checkout is coming soon. Leave your email and you'll be the first to know — or
              sign in once your subscription is switched on.
            </p>
            <div className="mt-5 max-w-lg text-foreground">
              <SubscribeBox source="membership" />
            </div>
            {!user && (
              <Link to="/auth" className="mt-4 inline-block text-sm text-gold underline">
                Already subscribed? Sign in
              </Link>
            )}
          </>
        )}
      </div>
      {included.length > 0 && (
        <>
          <h2 className="mt-14 text-3xl font-semibold">Included with a subscription</h2>
          <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-4">
            {included.map((b) => (
              <BookCard key={b.id} b={b} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
