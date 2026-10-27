import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";
import { useT } from "@/i18n";

export function SubscribeBox({ source = "subscribe-box" }: { source?: string }) {
  const { t } = useT();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  if (state === "done")
    return (
      <p role="status" className="text-sm font-semibold">
        {t("subscribe.done")}
      </p>
    );
  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={async (e) => {
        e.preventDefault();
        setState("sending");
        const { error } = await supabase
          .from("leads")
          .insert({ email: email.trim().toLowerCase(), source });
        if (!error) track("newsletter_signup", { source });
        setState(error ? "error" : "done");
      }}
    >
      <input
        required
        type="email"
        autoComplete="email"
        maxLength={255}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("subscribe.placeholder")}
        aria-label={t("subscribe.placeholder")}
        className="flex-1 rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground"
      />
      <button className="btn-gold" disabled={state === "sending"}>
        {state === "sending" ? t("subscribe.sending") : t("subscribe.button")}
      </button>
      {state === "error" && (
        <p role="alert" className="text-sm text-crimson">
          {t("subscribe.error")}
        </p>
      )}
    </form>
  );
}
