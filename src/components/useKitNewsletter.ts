import { useEffect, useState } from "react";
import { track } from "@/lib/analytics";
import { kitGuardSignal, postKitForm } from "@/lib/kit-form";
import { subscribeNewsletter } from "@/lib/newsletter.functions";

export type KitNewsletterState = "idle" | "sending" | "done" | "error" | "check";

// Posts the visitor's browser to Kit's public form, then keeps a copy on the site list.
// A Kit security check stays on the page until Kit confirms it. A site-list problem
// does not hide a Kit success, and a Kit problem does not show a success.
export function useKitNewsletter(source: string) {
  const [state, setState] = useState<KitNewsletterState>("idle");
  const [guardUrl, setGuardUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pending, setPending] = useState<{ email: string; name?: string } | null>(null);

  useEffect(() => {
    if (state !== "check") return;
    const onMessage = (event: MessageEvent) => {
      const signal = kitGuardSignal({ origin: event.origin, data: event.data });
      if (signal === "confirmed") {
        const saved = pending;
        if (saved) void rememberLead(saved.email, saved.name, source);
        setGuardUrl(null);
        setState("done");
      } else if (signal === "failed") {
        setGuardUrl(null);
        setErrorMessage(null);
        setState("error");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [pending, source, state]);

  async function submit(email: string, name?: string) {
    setState("sending");
    setErrorMessage(null);
    setGuardUrl(null);
    setPending({ email, ...(name ? { name } : {}) });
    try {
      const result = await postKitForm(email, name);
      if (result.status === "success") {
        await rememberLead(email, name, source);
        setState("done");
        return;
      }
      if (result.status === "quarantined") {
        setGuardUrl(result.url);
        setState("check");
        return;
      }
      setErrorMessage(result.message);
      setState("error");
    } catch {
      setErrorMessage(null);
      setState("error");
    }
  }

  return { state, guardUrl, errorMessage, submit };
}

async function rememberLead(email: string, name: string | undefined, source: string) {
  try {
    await subscribeNewsletter({
      data: { email, source, ...(name ? { name } : {}) },
    });
    track("newsletter_signup", { source });
  } catch (err) {
    console.error("[newsletter]", err);
  }
}
