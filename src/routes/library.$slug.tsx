import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { author, formatLabel, money } from "@/lib/catalog";
import { productQuery } from "@/lib/catalog.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Stars } from "@/components/Cards";

export const Route = createFileRoute("/library/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return { meta: [{ title: "Not found — GSWAU" }, { name: "robots", content: "noindex" }] };
    const b = loaderData.product;
    const d = b.description.slice(0, 155);
    const meta = [
      { title: `${b.title} — GSWAU` },
      { name: "description", content: d },
      { property: "og:title", content: b.title },
      { property: "og:description", content: d },
      { property: "og:type", content: "product" },
      { name: "twitter:card", content: "summary_large_image" },
    ];
    const image = b.gallery_urls[0] ?? b.cover_image_url;
    if (image)
      meta.push(
        { property: "og:image", content: image },
        { name: "twitter:image", content: image },
      );
    return { meta };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(productQuery(slug));
  const { user } = useAuth();
  const [shown, setShown] = useState(0);
  const { data: hasAccess } = useQuery({
    queryKey: ["has-access", user?.id, data?.product.id],
    enabled: !!user && !!data,
    queryFn: async () => {
      const { data: ok } = await supabase.rpc("has_access", { _product: data!.product.id });
      return !!ok;
    },
  });
  if (!data) return null;
  const { product: b, modules, outline, bundle, rating, reviews } = data;
  const images = b.gallery_urls.length
    ? b.gallery_urls
    : b.cover_image_url
      ? [b.cover_image_url]
      : [];
  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 md:grid-cols-[360px_1fr]">
      <div>
        {images.length > 0 && (
          <img
            src={images[shown] ?? images[0]}
            alt={b.title}
            className="w-full rounded-md shadow-card"
          />
        )}
        {images.length > 1 && (
          <div className="mt-3 flex gap-3">
            {images.map((src, i) => (
              <button
                key={src}
                onClick={() => setShown(i)}
                className={`h-16 w-16 overflow-hidden rounded-sm border-2 ${i === shown ? "border-gold" : "border-transparent"}`}
                aria-label={`Show image ${i + 1}`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <div className="eyebrow text-crimson">
          {formatLabel[b.type]} · by {author.name}
        </div>
        <h1 className="mt-3 text-5xl font-semibold leading-tight">{b.title}</h1>
        {b.subtitle && (
          <p className="mt-2 font-display text-xl italic text-muted-foreground">{b.subtitle}</p>
        )}
        <div className="mt-8 rounded-md border border-border bg-card p-6">
          <div className="font-display text-4xl font-semibold">{money(b.price_cents)}</div>
          {b.is_free ? (
            <FreeForm source={b.slug} buyUrl={b.buy_url} />
          ) : (
            <div className="mt-4 flex flex-wrap gap-3">
              {hasAccess && b.type === "course" && (
                <Link to="/learn/$slug" params={{ slug: b.slug }} className="btn-gold">
                  Go to course
                </Link>
              )}
              {hasAccess && b.type !== "course" && (
                <Link to="/account" className="btn-gold">
                  Open in my library
                </Link>
              )}
              {!hasAccess && b.included_with_subscription && (
                <Link to="/membership" className="btn-gold">
                  Subscribe to read this
                </Link>
              )}
              {!hasAccess && b.type === "course" && user && (
                <Link to="/learn/$slug" params={{ slug: b.slug }} className="btn-ghost">
                  Free preview lessons
                </Link>
              )}
              {!user && (
                <Link to="/auth" className="btn-ghost">
                  Sign in
                </Link>
              )}
            </div>
          )}
          {b.included_with_subscription && !b.is_free && (
            <p className="mt-3 text-sm text-muted-foreground">
              Included with a GSWAU subscription — browse the site free, subscribe to read.
            </p>
          )}
          {(b.file_size_label || b.length_label) && (
            <dl className="mt-4 flex gap-8 border-t border-border pt-4 text-sm">
              {b.file_size_label && (
                <div>
                  <dt className="eyebrow text-muted-foreground">Size</dt>
                  <dd className="mt-1 font-semibold">{b.file_size_label}</dd>
                </div>
              )}
              {b.length_label && (
                <div>
                  <dt className="eyebrow text-muted-foreground">
                    {/page/i.test(b.length_label) ? "Length" : "Duration"}
                  </dt>
                  <dd className="mt-1 font-semibold">{b.length_label}</dd>
                </div>
              )}
            </dl>
          )}
        </div>
        <p className="mt-8 whitespace-pre-line leading-relaxed">{b.description}</p>

        {bundle.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold">Included in this bundle</h2>
            <ul className="mt-4 space-y-2">
              {bundle.map(
                (x) =>
                  x && (
                    <li key={x.slug}>
                      <Link to="/library/$slug" params={{ slug: x.slug }} className="underline">
                        {x.title}
                      </Link>
                    </li>
                  ),
              )}
            </ul>
          </div>
        )}

        {modules.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold">Curriculum</h2>
            <div className="mt-4 divide-y divide-border rounded-md border border-border bg-card">
              {modules.map((m, i) => (
                <div key={m.id} className="p-5">
                  <div className="eyebrow text-muted-foreground">Module {i + 1}</div>
                  <div className="mt-1 font-display text-xl font-semibold">{m.title}</div>
                  <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    {outline
                      .filter((l) => l.module_id === m.id)
                      .map((l) => (
                        <li key={l.lesson_id}>
                          — {l.title}
                          {l.duration_minutes ? ` · ${l.duration_minutes} min` : ""}
                          {l.is_preview ? " · Free preview" : ""}
                        </li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        <ReviewsSection productId={b.id} rating={rating} reviews={reviews} signedIn={!!user} />
      </div>
    </div>
  );
}

type Reviews = NonNullable<
  Awaited<ReturnType<typeof import("@/lib/catalog.functions").getProduct>>
>;

function ReviewsSection({
  productId,
  rating,
  reviews,
  signedIn,
}: {
  productId: string;
  rating: Reviews["rating"];
  reviews: Reviews["reviews"];
  signedIn: boolean;
}) {
  const count = rating?.review_count ?? 0;
  const bars = [
    [5, rating?.stars_5],
    [4, rating?.stars_4],
    [3, rating?.stars_3],
    [2, rating?.stars_2],
    [1, rating?.stars_1],
  ] as const;
  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold">Ratings</h2>
      {count > 0 && rating ? (
        <div className="mt-4 flex flex-wrap items-center gap-8">
          <div>
            <div className="font-display text-5xl font-semibold">
              {Number(rating.average).toFixed(1)}
            </div>
            <Stars n={Math.round(Number(rating.average))} />
            <div className="mt-1 text-xs text-muted-foreground">
              ({count} {count === 1 ? "rating" : "ratings"})
            </div>
          </div>
          <div className="min-w-48 flex-1 space-y-1.5 text-sm">
            {bars.map(([n, c]) => (
              <div key={n} className="flex items-center gap-3">
                <span className="w-14 text-muted-foreground">{n} stars</span>
                <div className="h-2 flex-1 rounded-full bg-secondary">
                  <div
                    className="h-2 rounded-full bg-gold"
                    style={{ width: `${Math.round(((c ?? 0) / count) * 100)}%` }}
                  />
                </div>
                <span className="w-10 text-right text-muted-foreground">
                  {Math.round(((c ?? 0) / count) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">No ratings yet.</p>
      )}
      <div className="mt-6 space-y-4">
        {reviews.map((r) => (
          <blockquote
            key={r.id}
            className="rounded-md border-l-4 border-gold bg-card p-5 shadow-card"
          >
            <Stars n={r.rating} />
            <p className="mt-2 leading-relaxed">“{r.quote}”</p>
            <footer className="mt-2 text-sm text-muted-foreground">
              {r.name}
              {r.location ? `, ${r.location}` : ""}
            </footer>
          </blockquote>
        ))}
      </div>
      {signedIn ? (
        <ProductReviewForm productId={productId} />
      ) : (
        <p className="mt-6 text-sm text-muted-foreground">
          <Link to="/auth" className="underline">
            Sign in
          </Link>{" "}
          to leave a rating.
        </p>
      )}
    </div>
  );
}

function ProductReviewForm({ productId }: { productId: string }) {
  const [form, setForm] = useState({ name: "", quote: "", rating: 5 });
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  if (state === "done")
    return <p className="mt-6 text-sm">Thank you! Your review will appear once it's approved.</p>;
  return (
    <form
      className="mt-6 space-y-3 rounded-md border border-border bg-card p-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setState("sending");
        const { data: u } = await supabase.auth.getUser();
        const { error } = await supabase
          .from("testimonials")
          .insert({ ...form, product_id: productId, user_id: u.user!.id });
        setState(error ? "error" : "done");
      }}
    >
      <div className="font-display text-xl font-semibold">Rate this book</div>
      <input
        required
        maxLength={80}
        placeholder="Your name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm"
      />
      <textarea
        required
        maxLength={600}
        rows={4}
        placeholder="What did you think?"
        value={form.quote}
        onChange={(e) => setForm({ ...form, quote: e.target.value })}
        className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm"
      />
      <select
        value={form.rating}
        onChange={(e) => setForm({ ...form, rating: Number(e.target.value) })}
        className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm"
      >
        {[5, 4, 3, 2, 1].map((n) => (
          <option key={n} value={n}>
            {n} stars
          </option>
        ))}
      </select>
      <button className="btn-gold" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Submit rating"}
      </button>
      {state === "error" && (
        <p className="text-sm text-crimson">Couldn't send — please try again.</p>
      )}
    </form>
  );
}

function FreeForm({ source, buyUrl }: { source: string; buyUrl: string | null }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [email, setEmail] = useState("");
  if (state === "done")
    return (
      <p className="mt-4 text-sm">
        You're on the list.{" "}
        {buyUrl && (
          <a
            href={buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
          >
            Download your free chapter
          </a>
        )}
      </p>
    );
  return (
    <form
      className="mt-4 flex flex-col gap-3 sm:flex-row"
      onSubmit={async (e) => {
        e.preventDefault();
        setState("sending");
        const { error } = await supabase
          .from("leads")
          .insert({ email: email.trim().toLowerCase(), source });
        setState(error ? "error" : "done");
      }}
    >
      <input
        required
        type="email"
        maxLength={255}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@email.com"
        className="flex-1 rounded-md border border-input bg-background px-4 py-3 text-sm"
      />
      <button className="btn-gold" disabled={state === "sending"}>
        {state === "sending" ? "Sending…" : "Send it free"}
      </button>
      {state === "error" && (
        <p className="text-sm text-crimson">Something went wrong — please try again.</p>
      )}
    </form>
  );
}
