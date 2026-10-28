import { Link } from "@tanstack/react-router";
import { useState } from "react";
import logo from "@/assets/brand/logo.png";
import { author } from "@/lib/catalog";
import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/i18n";

// The one place the logo is drawn. To swap it, replace src/assets/brand/logo.png and run `npm run brand`.
export function Logo({ size = 40 }: { size?: number }) {
  const { t } = useT();
  return (
    <img
      src={logo}
      alt={t("brand.logoAlt")}
      width={size}
      height={size}
      className="rounded-full object-cover"
      style={{ width: size, height: size }}
    />
  );
}

const navItems = [
  { to: "/library", key: "nav.library" },
  { to: "/courses", key: "nav.programs" },
  { to: "/podcast", key: "nav.podcast" },
  { to: "/pricing", key: "nav.pricing" },
  { to: "/coaching", key: "nav.coaching" },
  { to: "/blog", key: "nav.blog" },
] as const;

export function Header() {
  const { user, isAdmin } = useAuth();
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const account = user ? (
    <Link to="/account" className="rounded-sm border border-gold/50 px-3 py-1.5 text-gold">
      {t("nav.myLibrary")}
    </Link>
  ) : (
    <Link to="/auth" className="rounded-sm border border-gold/50 px-3 py-1.5 text-gold">
      {t("nav.signIn")}
    </Link>
  );
  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-navy-deep/95 text-primary-foreground backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
        <Link to="/" className="flex shrink-0 items-center gap-3" onClick={() => setOpen(false)}>
          <Logo />
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold">{t("brand.name")}</div>
            <div className="eyebrow text-[0.55rem] text-gold">{t("brand.tagline")}</div>
          </div>
        </Link>
        <nav aria-label={t("nav.main")} className="hidden items-center gap-6 text-sm lg:flex">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="whitespace-nowrap text-primary-foreground/80 transition hover:text-gold"
              activeProps={{ className: "text-gold" }}
            >
              {t(n.key)}
            </Link>
          ))}
          {isAdmin && (
            <Link to="/admin" className="text-gold">
              {t("nav.admin")}
            </Link>
          )}
          {account}
        </nav>
        <div className="flex items-center gap-3 text-sm lg:hidden">
          {account}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
            className="rounded-sm px-2 py-1.5 text-primary-foreground/90"
          >
            {open ? t("nav.close") : t("nav.menu")}
          </button>
        </div>
      </div>
      {open && (
        <nav
          id="mobile-nav"
          aria-label={t("nav.main")}
          className="border-t border-gold/20 lg:hidden"
        >
          <ul className="mx-auto max-w-6xl px-5 py-2">
            {navItems.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base text-primary-foreground/90"
                  activeProps={{ className: "text-gold" }}
                >
                  {t(n.key)}
                </Link>
              </li>
            ))}
            {isAdmin && (
              <li>
                <Link to="/admin" onClick={() => setOpen(false)} className="block py-3 text-gold">
                  {t("nav.admin")}
                </Link>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="eyebrow flex items-center gap-3 text-crimson">
      <span className="h-px w-8 bg-crimson" />
      {children}
    </div>
  );
}
