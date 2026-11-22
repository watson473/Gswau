import { useState } from "react";
import { GoldText } from "@/components/GoldText";
import { useKitNewsletter } from "@/components/useKitNewsletter";
import { KIT_FORM_ACTION } from "@/lib/kit-form";
import { useT } from "@/i18n";

// Compact homepage signup. The browser posts to the public Kit form. No API key.
export function HeroNewsletter() {
  const { t } = useT();
  const [email, setEmail] = useState("");
  const { state, guardUrl, errorMessage, submit } = useKitNewsletter("hero");
  const field =
    "min-w-0 flex-1 rounded-full border border-gold/30 bg-white/5 px-4 py-2.5 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:border-gold focus:outline-none";

  if (state === "done") {
    return (
      <p
        id="newsletter"
        role="status"
        className="mt-4 scroll-mt-24 text-sm font-semibold text-gold"
      >
        {t("subscribe.confirm")}
      </p>
    );
  }

  return (
    <form
      id="newsletter"
      action={KIT_FORM_ACTION}
      method="post"
      className="mt-4 scroll-mt-24"
      aria-label={t("footer.news.eyebrow")}
      onSubmit={async (e) => {
        e.preventDefault();
        await submit(email);
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
          name="email_address"
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
      {state === "check" && guardUrl && (
        <div className="mt-3">
          <p role="status" className="text-sm font-semibold text-gold">
            {t("subscribe.check")}
          </p>
          <iframe
            title="Security check"
            src={guardUrl}
            className="mt-3 h-[520px] w-full max-w-md rounded-md border border-gold/30 bg-white"
          />
        </div>
      )}
      {state === "error" && (
        <p role="alert" className="mt-2 text-sm text-gold">
          {errorMessage ?? t("subscribe.error")}
        </p>
      )}
    </form>
  );
}
