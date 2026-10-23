import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function SubscribeBox({ source = "subscribe-box" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  if (state === "done")
    return <p className="text-sm font-semibold">You're subscribed — thank you!</p>;
  return (
    <form
      className="flex flex-col gap-3 sm:flex-row"
      onSubmit={async (e) => {
        e.preventDefault();
        setState("sending");
        const { error } = await supabase
          .from("leads")
          .insert({ email: email.trim().toLowerCase(), source });
        setState(error ? "error" : "done");
      }}
    >
      <input
        required
        type="email"
        maxLength={255}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Your email address"
        aria-label="Your email address"
        className="flex-1 rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground"
      />
      <button className="btn-gold" disabled={state === "sending"}>
        {state === "sending" ? "Subscribing…" : "Subscribe"}
      </button>
      {state === "error" && (
        <p className="text-sm text-crimson">Something went wrong — please try again.</p>
      )}
    </form>
  );
}
