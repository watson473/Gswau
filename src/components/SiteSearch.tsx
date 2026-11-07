import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search, X } from "lucide-react";
import { episodesQuery, postsQuery, productsQuery } from "@/lib/catalog.functions";
import { useT } from "@/i18n";

const MAX_PER_GROUP = 6;

// The header's search. Everything it looks through is public, and is only fetched once it opens.
export function SiteSearch() {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        aria-label={t("search.open")}
        onClick={() => setOpen(true)}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-primary-foreground/85 transition hover:bg-gold/10 hover:text-gold"
      >
        <Search className="h-[18px] w-[18px]" aria-hidden="true" />
      </button>
      {open && <SearchPanel onClose={() => setOpen(false)} />}
    </>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const { t } = useT();
  const [query, setQuery] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const products = useQuery(productsQuery);
  const posts = useQuery(postsQuery);
  const episodes = useQuery(episodesQuery);

  useEffect(() => {
    input.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose]);

  const q = query.trim().toLowerCase();
  const matches = (...fields: (string | null | undefined)[]) =>
    q.length > 0 && fields.some((f) => f?.toLowerCase().includes(q));
  const foundTitles = (products.data ?? [])
    .filter((p) => matches(p.title, p.subtitle))
    .slice(0, MAX_PER_GROUP);
  const foundPosts = (posts.data ?? [])
    .filter((p) => matches(p.title, p.excerpt))
    .slice(0, MAX_PER_GROUP);
  const foundEpisodes = (episodes.data ?? [])
    .filter((e) => matches(e.title))
    .slice(0, MAX_PER_GROUP);
  const nothing = foundTitles.length + foundPosts.length + foundEpisodes.length === 0;
  const loading = products.isPending || posts.isPending || episodes.isPending;

  const row =
    "block rounded-md px-3 py-2.5 text-sm text-primary-foreground/90 transition hover:bg-gold/10 hover:text-gold";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={t("search.label")}
      className="fixed inset-0 z-50 bg-navy-deep/80 px-4 pt-20 backdrop-blur-sm sm:pt-24"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glow-card mx-auto flex max-h-[calc(100dvh-7rem)] max-w-2xl flex-col overflow-hidden rounded-xl text-primary-foreground">
        <div className="flex items-center gap-3 border-b border-gold/20 px-4">
          <Search className="h-5 w-5 shrink-0 text-gold" aria-hidden="true" />
          <input
            ref={input}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            aria-label={t("search.label")}
            className="min-w-0 flex-1 bg-transparent py-4 text-base text-primary-foreground placeholder:text-primary-foreground/50 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          <button
            type="button"
            aria-label={t("search.close")}
            onClick={onClose}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-primary-foreground/70 transition hover:text-gold"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div aria-live="polite" className="overflow-y-auto p-2">
          {!q && <p className="px-3 py-4 text-sm text-primary-foreground/60">{t("search.hint")}</p>}
          {q && nothing && (
            <p className="px-3 py-4 text-sm text-primary-foreground/60">
              {loading ? t("search.loading") : t("search.empty", { query })}
            </p>
          )}
          {foundTitles.length > 0 && (
            <Group title={t("search.group.titles")}>
              {foundTitles.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/library/$slug"
                    params={{ slug: p.slug }}
                    onClick={onClose}
                    className={row}
                  >
                    {p.title}
                    <span className="ml-2 text-xs text-primary-foreground/50">
                      {t(`format.${p.type}`)}
                    </span>
                  </Link>
                </li>
              ))}
            </Group>
          )}
          {foundPosts.length > 0 && (
            <Group title={t("search.group.posts")}>
              {foundPosts.map((p) => (
                <li key={p.id}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    onClick={onClose}
                    className={row}
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </Group>
          )}
          {foundEpisodes.length > 0 && (
            <Group title={t("search.group.episodes")}>
              {foundEpisodes.map((e) => (
                <li key={e.id}>
                  <Link to="/podcast" onClick={onClose} className={row}>
                    {e.title}
                  </Link>
                </li>
              ))}
            </Group>
          )}
        </div>
      </div>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="py-1">
      <div className="eyebrow px-3 py-2 text-gold">{title}</div>
      <ul>{children}</ul>
    </div>
  );
}
