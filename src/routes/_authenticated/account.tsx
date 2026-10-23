import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatLabel } from "@/lib/catalog";
import { Eyebrow } from "@/components/SiteChrome";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [
      { title: "My library — GSWAU" },
      { name: "description", content: "Your GSWAU books and courses." },
      { property: "og:title", content: "My library — GSWAU" },
      { property: "og:description", content: "Your books and courses." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Account,
});

type Owned = {
  id: string;
  slug: string;
  title: string;
  type: string;
  cover_image_url: string | null;
  file_path: string | null;
};

function useLibrary() {
  return useQuery({
    queryKey: ["my-library"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user!.id;
      const { data: ents } = await supabase
        .from("entitlements")
        .select("product:products(id,slug,title,type,cover_image_url,file_path)")
        .eq("user_id", uid);
      const owned = new Map<string, Owned>();
      const direct = (ents ?? []).map((e) => e.product).filter(Boolean) as Owned[];
      direct.forEach((p) => owned.set(p.id, p));
      const bundleIds = direct.filter((p) => p.type === "bundle").map((p) => p.id);
      if (bundleIds.length) {
        const { data: items } = await supabase
          .from("bundle_items")
          .select(
            "product:products!bundle_items_product_id_fkey(id,slug,title,type,cover_image_url,file_path)",
          )
          .in("bundle_id", bundleIds);
        (items ?? []).forEach(
          (i) => i.product && owned.set((i.product as Owned).id, i.product as Owned),
        );
      }
      const { data: subscribed } = await supabase.rpc("has_subscription", { _user: uid });
      if (subscribed) {
        const { data: included } = await supabase
          .from("products")
          .select("id,slug,title,type,cover_image_url,file_path")
          .eq("included_with_subscription", true)
          .eq("is_published", true);
        (included ?? []).forEach((p) => owned.set(p.id, p));
      }
      const { data: free } = await supabase
        .from("products")
        .select("id,slug,title,type,cover_image_url,file_path")
        .eq("is_free", true);
      (free ?? []).forEach((p) => owned.set(p.id, p));
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name,email")
        .eq("id", uid)
        .maybeSingle();
      return {
        items: [...owned.values()],
        profile,
        email: u.user!.email,
        subscribed: !!subscribed,
      };
    },
  });
}

function Account() {
  const { data, isLoading } = useLibrary();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [err, setErr] = useState<string | null>(null);

  async function download(p: Owned) {
    setErr(null);
    if (!p.file_path) return setErr(`"${p.title}" isn't ready to download here yet.`);
    const { data: s, error } = await supabase.storage
      .from("product-files")
      .createSignedUrl(p.file_path, 300, { download: true });
    if (error || !s) return setErr("Download failed — please try again.");
    window.location.href = s.signedUrl;
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>
            Welcome back{data?.profile?.full_name ? `, ${data.profile.full_name}` : ""}
          </Eyebrow>
          <h1 className="mt-3 text-5xl font-semibold">My library</h1>
          <p className="mt-2 text-sm text-muted-foreground">Signed in as {data?.email}</p>
        </div>
        <div className="flex gap-3">
          <Link
            to="/account/review"
            className="btn-ghost-dark rounded-md border border-border px-4 py-2 text-sm"
          >
            Leave a review
          </Link>
          <button onClick={signOut} className="rounded-md border border-border px-4 py-2 text-sm">
            Sign out
          </button>
        </div>
      </div>
      {err && <p className="mt-6 text-sm text-crimson">{err}</p>}
      {isLoading ? (
        <p className="mt-10 text-muted-foreground">Loading…</p>
      ) : (
        <>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {data?.items.map((p) => (
              <div key={p.id}>
                {p.cover_image_url && (
                  <img
                    src={p.cover_image_url}
                    alt={p.title}
                    className="aspect-square w-full rounded-md object-cover shadow-card"
                  />
                )}
                <div className="mt-3 font-display text-lg leading-tight">{p.title}</div>
                <div className="text-xs text-muted-foreground">{formatLabel[p.type]}</div>
                {p.type === "course" ? (
                  <Link
                    to="/learn/$slug"
                    params={{ slug: p.slug }}
                    className="btn-gold mt-3 w-full"
                  >
                    Start course
                  </Link>
                ) : p.type !== "bundle" ? (
                  <button onClick={() => download(p)} className="btn-gold mt-3 w-full">
                    Download
                  </button>
                ) : null}
              </div>
            ))}
          </div>
          <p className="mt-10 rounded-md bg-secondary p-5 text-sm text-muted-foreground">
            {data?.subscribed ? (
              "You're a subscriber — every book and course included with the subscription is in your library."
            ) : (
              <>
                Your library has the free chapter and anything granted to your account.{" "}
                <Link to="/membership" className="underline">
                  Subscribe
                </Link>{" "}
                to unlock all the books and courses.
              </>
            )}
          </p>
        </>
      )}
    </div>
  );
}
