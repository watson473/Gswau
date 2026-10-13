import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { author, formatLabel, money } from "@/lib/catalog";
import { productQuery } from "@/lib/catalog.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/library/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!data) throw notFound();
    return data;
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found — GSWAU" }, { name: "robots", content: "noindex" }] };
    const b = loaderData.product;
    const d = b.description.slice(0, 155);
    const meta = [
      { title: `${b.title} — GSWAU` }, { name: "description", content: d },
      { property: "og:title", content: b.title }, { property: "og:description", content: d },
      { property: "og:type", content: "product" }, { name: "twitter:card", content: "summary_large_image" },
    ];
    if (b.cover_image_url) meta.push({ property: "og:image", content: b.cover_image_url }, { name: "twitter:image", content: b.cover_image_url });
    return { meta };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(productQuery(slug));
  const { user } = useAuth();
  if (!data) return null;
  const { product: b, modules, outline, bundle } = data;
  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-5 py-16 md:grid-cols-[360px_1fr]">
      {b.cover_image_url && <img src={b.cover_image_url} alt={b.title} className="w-full rounded-md shadow-card" />}
      <div>
        <div className="eyebrow text-crimson">{formatLabel[b.type]} · by {author.name}</div>
        <h1 className="mt-3 text-5xl font-semibold leading-tight">{b.title}</h1>
        {b.subtitle && <p className="mt-2 font-display text-xl italic text-muted-foreground">{b.subtitle}</p>}
        <div className="mt-8 rounded-md border border-border bg-card p-6">
          <div className="font-display text-4xl font-semibold">{money(b.price_cents)}</div>
          {b.is_free ? <FreeForm source={b.slug} buyUrl={b.buy_url} /> : (
            <div className="mt-4 flex flex-wrap gap-3">
              {b.buy_url && <a href={b.buy_url} target="_blank" rel="noopener noreferrer" className="btn-gold">Buy now</a>}
              {b.type === "course" && <Link to="/learn/$slug" params={{ slug: b.slug }} className="btn-ghost">Go to course</Link>}
            </div>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Bought it? {user ? <Link to="/account" className="underline">Open your library</Link> : <Link to="/auth" className="underline">Sign in</Link>} to download it here, using the same email you paid with.
          </p>
        </div>
        <p className="mt-8 whitespace-pre-line leading-relaxed">{b.description}</p>

        {bundle.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold">Included in this bundle</h2>
            <ul className="mt-4 space-y-2">{bundle.map((x) => x && <li key={x.slug}><Link to="/library/$slug" params={{ slug: x.slug }} className="underline">{x.title}</Link></li>)}</ul>
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
                    {outline.filter((l) => l.module_id === m.id).map((l) => (
                      <li key={l.lesson_id}>— {l.title}{l.duration_minutes ? ` · ${l.duration_minutes} min` : ""}{l.is_preview ? " · Free preview" : ""}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FreeForm({ source, buyUrl }: { source: string; buyUrl: string | null }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [email, setEmail] = useState("");
  if (state === "done") return (
    <p className="mt-4 text-sm">You're on the list. {buyUrl && <a href={buyUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">Download your free chapter</a>}</p>
  );
  return (
    <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={async (e) => {
      e.preventDefault(); setState("sending");
      const { error } = await supabase.from("leads").insert({ email: email.trim().toLowerCase(), source });
      setState(error ? "error" : "done");
    }}>
      <input required type="email" maxLength={255} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="flex-1 rounded-md border border-input bg-background px-4 py-3 text-sm" />
      <button className="btn-gold" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send it free"}</button>
      {state === "error" && <p className="text-sm text-crimson">Something went wrong — please try again.</p>}
    </form>
  );
}
