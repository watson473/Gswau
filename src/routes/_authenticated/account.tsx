import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatMoney, membershipPrices } from "@/lib/catalog";
import { Eyebrow } from "@/components/SiteChrome";
import { createTranslator, defaultLocale, useT } from "@/i18n";

const t0 = createTranslator(defaultLocale);

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({
    meta: [{ title: t0("library.meta.title") }, { name: "robots", content: "noindex" }],
  }),
  component: Account,
});

const PRODUCT_COLS = "id,slug,title,type,access_tier,cover_image_url,file_path,audio_path";

type Owned = {
  id: string;
  slug: string;
  title: string;
  type: string;
  access_tier: string;
  cover_image_url: string | null;
  file_path: string | null;
  audio_path: string | null;
};
type Why = "purchased" | "member" | "free";

function useLibrary() {
  return useQuery({
    queryKey: ["my-library"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      const uid = u.user!.id;
      const email = (u.user!.email ?? "").toLowerCase();
      const [{ data: ents }, { data: memberships }, { data: isMember }, { data: profile }] =
        await Promise.all([
          // RLS returns rows linked to this account or to its email.
          supabase
            .from("entitlements")
            .select(`product:products(${PRODUCT_COLS})`)
            .is("revoked_at", null),
          supabase
            .from("memberships")
            .select("plan,status,current_period_end,ended_at,manage_url,source")
            .order("updated_at", { ascending: false }),
          supabase.rpc("has_membership", { _user: uid }),
          supabase.from("profiles").select("full_name").eq("id", uid).maybeSingle(),
        ]);
      const owned = new Map<string, { p: Owned; why: Why }>();
      const direct = (ents ?? []).map((e) => e.product).filter(Boolean) as Owned[];
      direct.forEach((p) => owned.set(p.id, { p, why: "purchased" }));
      const bundleIds = direct.filter((p) => p.type === "bundle").map((p) => p.id);
      if (bundleIds.length) {
        const { data: items } = await supabase
          .from("bundle_items")
          .select(`product:products!bundle_items_product_id_fkey(${PRODUCT_COLS})`)
          .in("bundle_id", bundleIds);
        (items ?? []).forEach((i) => {
          const p = i.product as Owned | null;
          if (p) owned.set(p.id, { p, why: "purchased" });
        });
      }
      const tiers = isMember ? ["free", "members"] : ["free"];
      const { data: open } = await supabase
        .from("products")
        .select(PRODUCT_COLS)
        .in("access_tier", tiers as ("free" | "members")[])
        .eq("is_published", true)
        .order("position");
      (open ?? []).forEach((p) => {
        if (!owned.has(p.id))
          owned.set(p.id, { p, why: p.access_tier === "free" ? "free" : "member" });
      });
      return {
        items: [...owned.values()],
        membership: memberships?.[0] ?? null,
        isMember: !!isMember,
        name: profile?.full_name ?? null,
        email,
      };
    },
  });
}

type Membership = NonNullable<NonNullable<ReturnType<typeof useLibrary>["data"]>["membership"]>;

function MembershipCard({ m, isMember }: { m: Membership | null; isMember: boolean }) {
  const { t, locale } = useT();
  const date = (iso: string | null) => (iso ? new Date(iso).toLocaleDateString(locale) : "");
  if (!m || (!isMember && m.status === "ended"))
    return (
      <div className="rounded-lg bg-navy-gradient p-6 text-primary-foreground sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div>
          <h2 className="text-2xl font-semibold">
            {m ? t("membership.status.ended") : t("membership.none.title")}
          </h2>
          <p className="mt-1 text-sm text-primary-foreground/80">
            {t("membership.none.body", { price: formatMoney(membershipPrices.monthly, locale) })}
          </p>
        </div>
        <Link to="/pricing" className="btn-gold mt-4 shrink-0 sm:mt-0">
          {m ? t("membership.rejoin") : t("membership.none.cta")}
        </Link>
      </div>
    );
  const status = m.status as "active" | "cancelled" | "past_due" | "ended";
  const when =
    status === "active" && m.current_period_end
      ? t("membership.renews", { date: date(m.current_period_end) })
      : status === "ended"
        ? t("membership.endedOn", { date: date(m.ended_at) })
        : m.current_period_end
          ? t("membership.endsOn", { date: date(m.current_period_end) })
          : "";
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow text-muted-foreground">{t("membership.title")}</div>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <span className="font-display text-2xl font-semibold">
              {t(`membership.plan.${m.plan}`)}
            </span>
            <span
              className={`rounded-sm px-2 py-0.5 text-xs font-semibold ${
                status === "active"
                  ? "bg-gold text-navy-deep"
                  : status === "past_due"
                    ? "bg-crimson text-primary-foreground"
                    : "bg-secondary"
              }`}
            >
              {t(`membership.status.${status}`)}
            </span>
          </div>
          {when && <p className="mt-1 text-sm text-muted-foreground">{when}</p>}
          {status === "past_due" && (
            <p role="alert" className="mt-2 text-sm text-crimson">
              {t("membership.pastDue")}
            </p>
          )}
        </div>
        {m.source === "gumroad" &&
          (m.manage_url ? (
            <a href={m.manage_url} rel="noopener" className="btn-ghost">
              {t("membership.manage")}
            </a>
          ) : (
            <p className="max-w-xs text-xs text-muted-foreground">{t("membership.manageHelp")}</p>
          ))}
      </div>
    </div>
  );
}

function Account() {
  const { t } = useT();
  const { data, isLoading } = useLibrary();
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [err, setErr] = useState<string | null>(null);

  async function download(p: Owned, path: string | null) {
    setErr(null);
    if (!path) return setErr(t("library.notReady", { title: p.title }));
    const { data: s, error } = await supabase.storage
      .from("product-files")
      .createSignedUrl(path, 300, { download: true });
    if (error || !s) return setErr(t("library.downloadFailed"));
    window.location.href = s.signedUrl;
  }

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>
            {data?.name ? t("library.welcomeName", { name: data.name }) : t("library.welcome")}
          </Eyebrow>
          <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{t("library.title")}</h1>
          {data && (
            <p className="mt-2 text-sm text-muted-foreground">
              {t("library.signedInAs", { email: data.email })}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <Link to="/account/review" className="rounded-md border border-border px-4 py-2 text-sm">
            {t("library.review")}
          </Link>
          <button onClick={signOut} className="rounded-md border border-border px-4 py-2 text-sm">
            {t("library.signOut")}
          </button>
        </div>
      </div>
      {isLoading || !data ? (
        <p className="mt-10 text-muted-foreground">{t("library.loading")}</p>
      ) : (
        <>
          <div className="mt-8">
            <MembershipCard m={data.membership} isMember={data.isMember} />
          </div>
          {err && (
            <p role="alert" className="mt-6 text-sm text-crimson">
              {err}
            </p>
          )}
          <div className="mt-10 grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-4">
            {data.items.map(({ p, why }) => (
              <div key={p.id}>
                {p.cover_image_url && (
                  <img
                    src={p.cover_image_url}
                    alt=""
                    width={300}
                    height={300}
                    loading="lazy"
                    className="aspect-square w-full rounded-md object-cover shadow-card"
                  />
                )}
                <div className="mt-3 font-display text-lg leading-tight">{p.title}</div>
                <div className="text-xs text-muted-foreground">
                  {t(`format.${p.type}`)} · {t(`library.why.${why}`)}
                </div>
                {p.type === "course" ? (
                  <Link
                    to="/learn/$slug"
                    params={{ slug: p.slug }}
                    className="btn-gold mt-3 w-full"
                  >
                    {t("library.startCourse")}
                  </Link>
                ) : p.type !== "bundle" ? (
                  <div className="mt-3 grid gap-2">
                    <button onClick={() => download(p, p.file_path)} className="btn-gold w-full">
                      {t("library.downloadPdf")}
                    </button>
                    {p.audio_path && (
                      <button
                        onClick={() => download(p, p.audio_path)}
                        className="btn-ghost w-full"
                      >
                        {t("library.downloadAudio")}
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
          <p className="mt-10 rounded-md bg-secondary p-5 text-sm text-muted-foreground">
            {t("library.missing")}
          </p>
        </>
      )}
    </div>
  );
}
