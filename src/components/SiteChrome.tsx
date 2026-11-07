import { Link, type LinkProps } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Calculator,
  ChevronDown,
  CircleHelp,
  GraduationCap,
  Headphones,
  Info,
  Mail,
  Menu,
  Mic,
  Moon,
  Newspaper,
  Sun,
  X,
  type LucideIcon,
} from "lucide-react";
import logo from "@/assets/brand/logo.png";
import { SiteSearch } from "@/components/SiteSearch";
import { calculatorConfig } from "@/lib/calculator.config";
import { podcastName } from "@/lib/podcast";
import { THEME_KEY, applyTheme } from "@/lib/theme";
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

const contentMenu = [
  { to: "/library", key: "nav.audiobooks", Icon: Headphones },
  { to: "/courses", key: "nav.courses", Icon: GraduationCap },
  { to: "/podcast", key: "nav.podcastFull", Icon: Mic },
  { to: "/blog", key: "nav.blog", Icon: Newspaper },
] as const;

const baseMoreMenu = [
  { to: "/about", key: "nav.about", Icon: Info },
  { to: "/faq", key: "nav.faq", Icon: CircleHelp },
  { to: "/contact", key: "nav.contact", Icon: Mail },
] as const;

// More also carries Free Calculator while calculatorConfig.showInMainNav is on.
const moreMenu = calculatorConfig.showInMainNav
  ? [
      ...baseMoreMenu,
      { to: "/calculator" as const, key: "nav.calculator" as const, Icon: Calculator },
    ]
  : baseMoreMenu;

const topLinks = [
  { to: "/courses", key: "nav.courses" },
  { to: "/library", key: "nav.library" },
] as const;

export function Header() {
  const { user, isAdmin, isMember } = useAuth();
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const account = (
    <Link
      to={user ? "/account" : "/auth"}
      onClick={close}
      className="whitespace-nowrap text-sm text-primary-foreground/85 transition hover:text-gold"
    >
      {user ? t("nav.myLibrary") : t("nav.signIn")}
    </Link>
  );
  // A member has already joined, so the button is not offered to them.
  const join = !isMember && (
    <Link
      to="/pricing"
      onClick={close}
      className="btn-gold whitespace-nowrap !rounded-full !px-4 !py-2 text-sm"
    >
      {t("nav.joinUs")}
    </Link>
  );
  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-navy-deep/95 text-primary-foreground backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-5">
        <Link to="/" className="flex shrink-0 items-center gap-2.5" onClick={close}>
          <Logo />
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold">{t("brand.name")}</div>
            <div className="eyebrow hidden text-[0.55rem] text-gold sm:block">
              {t("brand.tagline")}
            </div>
          </div>
        </Link>
        <nav aria-label={t("nav.main")} className="hidden items-center gap-6 text-sm lg:flex">
          {topLinks.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="whitespace-nowrap text-primary-foreground/85 transition hover:text-gold"
              activeProps={{ className: "text-gold" }}
            >
              {t(n.key)}
            </Link>
          ))}
          <NavDropdown label={t("nav.content")} items={contentMenu} />
          <NavDropdown label={t("nav.more")} items={moreMenu} />
          {isAdmin && (
            <Link to="/admin" className="text-gold">
              {t("nav.admin")}
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <SiteSearch />
          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />
            {account}
          </div>
          {join}
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t("nav.close") : t("nav.menu")}
            onClick={() => setOpen(!open)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-primary-foreground/90 transition hover:text-gold lg:hidden"
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
      <div
        className="menu-panel grid lg:hidden"
        style={{ gridTemplateRows: open ? "1fr" : "0fr", opacity: open ? 1 : 0 }}
      >
        <div className="overflow-hidden">
          <nav
            id="mobile-nav"
            aria-label={t("nav.main")}
            inert={!open}
            className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-gold/20"
          >
            <div className="mx-auto max-w-7xl px-5 py-2">
              <ul>
                {topLinks.map((n) => (
                  <li key={n.to}>
                    <Link
                      to={n.to}
                      onClick={close}
                      className="block py-3 text-base text-primary-foreground/90"
                      activeProps={{ className: "text-gold" }}
                    >
                      {t(n.key)}
                    </Link>
                  </li>
                ))}
              </ul>
              <MobileGroup label={t("nav.content")} items={contentMenu} onPick={close} />
              <MobileGroup label={t("nav.more")} items={moreMenu} onPick={close} />
              {isAdmin && (
                <Link to="/admin" onClick={close} className="block py-3 text-gold">
                  {t("nav.admin")}
                </Link>
              )}
              <div className="mt-2 flex items-center justify-between border-t border-gold/20 py-3">
                {account}
                <ThemeToggle />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

type MenuItem = { to: NonNullable<LinkProps["to"]>; key: string; Icon: LucideIcon };

// Opens on hover where there is a mouse, and on click or keyboard everywhere.
function NavDropdown({ label, items }: { label: string; items: readonly MenuItem[] }) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const closing = useRef(0);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        root.current?.querySelector("button")?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div
      ref={root}
      className="relative"
      onMouseEnter={() => {
        window.clearTimeout(closing.current);
        setOpen(true);
      }}
      onMouseLeave={() => {
        closing.current = window.setTimeout(() => setOpen(false), 140);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 whitespace-nowrap py-2 text-primary-foreground/85 transition hover:text-gold"
      >
        {label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>
      {open && (
        <div className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-2">
          <ul className="glow-card rounded-lg bg-navy-deep p-2">
            {items.map(({ to, key, Icon }) => (
              <li key={key}>
                <Link
                  to={to}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-md px-3 py-2.5 text-primary-foreground/90 transition hover:bg-gold/10 hover:text-gold"
                >
                  <Icon className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                  {t(key, { podcast: podcastName })}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function MobileGroup({
  label,
  items,
  onPick,
}: {
  label: string;
  items: readonly MenuItem[];
  onPick: () => void;
}) {
  const { t } = useT();
  return (
    <div className="mt-2 border-t border-gold/20 pt-3">
      <div className="eyebrow text-gold">{label}</div>
      <ul className="mt-1">
        {items.map(({ to, key, Icon }) => (
          <li key={key}>
            <Link
              to={to}
              onClick={onPick}
              className="flex items-center gap-3 py-3 text-base text-primary-foreground/90"
            >
              <Icon className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              {t(key, { podcast: podcastName })}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ThemeToggle() {
  const { t } = useT();
  const [label, setLabel] = useState(t("theme.toggle"));
  useEffect(() => {
    const sync = () =>
      setLabel(
        document.documentElement.classList.contains("dark") ? t("theme.light") : t("theme.dark"),
      );
    sync();
    window.addEventListener("gswau-theme", sync);
    return () => window.removeEventListener("gswau-theme", sync);
  }, [t]);

  return (
    <button
      type="button"
      onClick={() => {
        const next = document.documentElement.classList.contains("dark") ? "light" : "dark";
        try {
          localStorage.setItem(THEME_KEY, next);
        } catch {
          // The theme still changes for this visit.
        }
        applyTheme(next);
        setLabel(next === "dark" ? t("theme.light") : t("theme.dark"));
        window.dispatchEvent(new Event("gswau-theme"));
      }}
      aria-label={label}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-gold/40 text-gold transition hover:bg-gold/10"
    >
      <Sun className="hidden h-4 w-4 dark:block" aria-hidden="true" />
      <Moon className="h-4 w-4 dark:hidden" aria-hidden="true" />
    </button>
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
