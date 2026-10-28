import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { BookOpen, GraduationCap, Headphones, Mail, Mic } from "lucide-react";
import { Logo } from "@/components/SiteChrome";
import { socialIconPaths } from "@/components/socialIcons";
import { author } from "@/lib/catalog";
import { podcastName } from "@/lib/podcast";
import { subscribeNewsletter } from "@/lib/newsletter.functions";
import { track } from "@/lib/analytics";
import { useT } from "@/i18n";

// Social profiles, shown as icons in the footer.
const socialLinks: { name: keyof typeof socialIconPaths; label: string; url: string }[] = [
  { name: "instagram", label: "Instagram", url: "https://www.instagram.com/gswau_" },
  {
    name: "facebook",
    label: "Facebook",
    url: "https://www.facebook.com/profile.php?id=61580415614670",
  },
  { name: "youtube", label: "YouTube", url: "https://www.youtube.com/@gswau" },
  { name: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@gswau" },
  { name: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/gswau-71b5ba384" },
  { name: "threads", label: "Threads", url: "https://www.threads.com/@gswau_" },
  { name: "x", label: "X", url: "https://x.com/gswau_" },
];

const usefulLinks = [
  { to: "/library", key: "nav.library" },
  { to: "/courses", key: "nav.programs" },
  { to: "/coaching", key: "nav.coaching" },
  { to: "/pricing", key: "nav.pricing" },
  { to: "/blog", key: "nav.blog" },
] as const;

const resources = [
  { to: "/library", key: "footer.res.audiobooks", Icon: Headphones },
  { to: "/courses", key: "footer.res.courses", Icon: GraduationCap },
  { to: "/podcast", key: "footer.res.podcast", Icon: Mic },
  { to: "/library", key: "footer.res.previews", Icon: BookOpen },
] as const;

// Company pages. `to` is null until the page exists; those show as plain text.
const companyLinks: { key: string; to: null }[] = [
  { key: "footer.co.about", to: null },
  { key: "footer.co.contact", to: null },
  { key: "footer.co.faq", to: null },
  { key: "footer.co.terms", to: null },
  { key: "footer.co.privacy", to: null },
  { key: "footer.co.refunds", to: null },
];

export function SiteFooter() {
  return (
    <>
      <NewsletterStrip />
      <Footer />
    </>
  );
}

function NewsletterStrip() {
  const { t } = useT();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const field =
    "w-full rounded-md border border-gold/30 bg-white/5 px-4 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:border-gold focus:outline-none";

  return (
    <section
      id="newsletter"
      className="border-t-2 border-gold bg-navy-gradient text-primary-foreground"
    >
      <div className="mx-auto grid max-w-6xl items-center gap-6 px-5 py-10 sm:py-12 lg:grid-cols-[1fr_1.3fr] lg:gap-10">
        <div>
          <div className="eyebrow text-gold">{t("footer.news.eyebrow")}</div>
          <h2 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">
            {t("footer.news.title")}
          </h2>
        </div>
        {state === "done" ? (
          <p role="status" className="text-lg font-semibold text-gold">
            {t("subscribe.done")}
          </p>
        ) : (
          <form
            className="flex flex-col gap-3 sm:flex-row"
            onSubmit={async (e) => {
              e.preventDefault();
              setState("sending");
              try {
                await subscribeNewsletter({ data: { email, name, source: "footer" } });
                track("newsletter_signup", { source: "footer" });
                setState("done");
              } catch {
                setState("error");
              }
            }}
          >
            <input
              type="text"
              autoComplete="given-name"
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("footer.news.name")}
              aria-label={t("footer.news.name")}
              className={field}
            />
            <input
              required
              type="email"
              autoComplete="email"
              maxLength={255}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("subscribe.placeholder")}
              aria-label={t("subscribe.placeholder")}
              className={field}
            />
            <button className="btn-gold shrink-0" disabled={state === "sending"}>
              {state === "sending" ? t("subscribe.sending") : t("footer.news.button")}
            </button>
          </form>
        )}
        {state === "error" && (
          <p role="alert" className="text-sm text-gold lg:col-start-2">
            {t("subscribe.error")}
          </p>
        )}
      </div>
    </section>
  );
}

function Heading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="eyebrow mb-5 flex items-center gap-3 text-gold">
      <span className="h-px w-6 bg-gold" />
      {children}
    </h3>
  );
}

function Footer() {
  const { t } = useT();
  const link = "text-primary-foreground/70 transition hover:text-gold";
  return (
    <footer className="bg-navy-deep text-sm text-primary-foreground/70">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1.2fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <Logo size={48} />
            <span className="font-display text-2xl text-primary-foreground">GSWAU</span>
          </Link>
          <p className="mt-5 max-w-xs leading-relaxed">
            {t("footer.about", { author: author.name })}
          </p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {socialLinks.map((s) => {
              const icon = (
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path d={socialIconPaths[s.name]} fill="currentColor" />
                </svg>
              );
              const cls =
                "grid h-9 w-9 place-items-center rounded-full ring-1 ring-gold/40 text-gold transition";
              return (
                <li key={s.name}>
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener"
                      aria-label={s.label}
                      className={`${cls} hover:bg-gold hover:text-navy-deep`}
                    >
                      {icon}
                    </a>
                  ) : (
                    <span title={s.label} className={cls}>
                      {icon}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        <nav aria-label={t("footer.useful")}>
          <Heading>{t("footer.useful")}</Heading>
          <ul className="space-y-3">
            {usefulLinks.map((l) => (
              <li key={l.key}>
                <Link to={l.to} className={link}>
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t("footer.resources")}>
          <Heading>{t("footer.resources")}</Heading>
          <ul className="space-y-3">
            {resources.map(({ to, key, Icon }) => (
              <li key={key}>
                <Link to={to} className={`${link} inline-flex items-center gap-3`}>
                  <Icon className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                  {t(key, { podcast: podcastName })}
                </Link>
              </li>
            ))}
            <li>
              <a href="#newsletter" className={`${link} inline-flex items-center gap-3`}>
                <Mail className="h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
                {t("footer.res.newsletter")}
              </a>
            </li>
          </ul>
        </nav>

        <nav aria-label={t("footer.company")}>
          <Heading>{t("footer.company")}</Heading>
          <ul className="space-y-3">
            {companyLinks.map((l) => (
              <li key={l.key}>
                <span className="text-primary-foreground/45">{t(l.key)}</span>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-gold/15">
        <p className="mx-auto max-w-6xl px-5 py-6 text-xs text-primary-foreground/55">
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
