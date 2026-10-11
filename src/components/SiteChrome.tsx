import { Link } from "@tanstack/react-router";
import { author } from "@/lib/catalog";

export function Crest() {
  return <img src={author.avatar} alt="GSWAU crest" className="h-10 w-10 rounded-full border-2 border-gold object-cover" />;
}

export function Header() {
  const nav = [
    { to: "/courses", label: "Programs" },
    { to: "/library", label: "Library" },
    { to: "/coaching", label: "Coaching" },
  ] as const;
  return (
    <header className="sticky top-0 z-40 border-b border-gold/20 bg-navy-deep/95 text-primary-foreground backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link to="/" className="flex items-center gap-3">
          <Crest />
          <div className="leading-tight">
            <div className="font-display text-lg font-semibold">GSWAU</div>
            <div className="eyebrow text-[0.55rem] text-gold">Augustin University</div>
          </div>
        </Link>
        <nav className="flex items-center gap-4 text-sm sm:gap-7">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="text-primary-foreground/80 transition hover:text-gold" activeProps={{ className: "text-gold" }}>
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-navy-deep text-primary-foreground/70">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Crest />
          <span className="font-display text-lg text-primary-foreground">GSW Augustin University</span>
        </div>
        <p className="text-xs">© {2026} GSWAU · Education for the business of beauty.</p>
      </div>
    </footer>
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
