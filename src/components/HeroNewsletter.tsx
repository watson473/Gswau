import { useState } from "react";
import { GoldText } from "@/components/GoldText";
import { track } from "@/lib/analytics";
import { subscribeNewsletter } from "@/lib/newsletter.functions";
import { useT } from "@/i18n";

// Compact homepage signup. Same server function as the footer strip, which adds the
// address to the Kit form configured in Admin > Settings.
export function HeroNewsletter() {
  const { t } = useT();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const field =
    "min-w-0 flex-1 rounded-full border border-gold/30 bg-white/5 px-4 py-2.5 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:border-gold focus:outline-none";

  if (state === "done") {
    return (
      <p
        id="newsletter"
        role="status"
        className="mt-4 scroll-mt-24 text-sm font-semibold text-gold"
      >
        {t("subscribe.done")}
      </p>
    );
  }

  return (
    <form
      id="newsletter"
      className="mt-4 scroll-mt-24"
      aria-label={t("footer.news.eyebrow")}
      onSubmit={async (e) => {
        e.preventDefault();
        setState("sending");
        try {
          await subscribeNewsletter({ data: { email, source: "hero" } });
          track("newsletter_signup", { source: "hero" });
          setState("done");
        } catch {
          setState("error");
        }
      }}
    >
      <label
        htmlFor="hero-newsletter-email"
        className="block text-sm font-medium leading-snug text-primary-foreground/90"
      >
        <GoldText text={t("footer.news.title")} />
      </label>
      <div className="mt-2 flex gap-2">
        <input
          id="hero-newsletter-email"
          required
          type="email"
          name="email"
          autoComplete="email"
          inputMode="email"
          maxLength={255}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("subscribe.placeholder")}
          className={field}
        />
        <button
          type="submit"
          className="btn-gold shrink-0 !rounded-full !px-4 !py-2.5 text-sm"
          disabled={state === "sending"}
        >
          {state === "sending" ? t("subscribe.sending") : t("footer.news.button")}
        </button>
      </div>
      {state === "error" && (
        <p role="alert" className="mt-2 text-sm text-gold">
          {t("subscribe.error")}
        </p>
      )}
    </form>
  );
}
