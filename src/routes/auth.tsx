import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";

const safe = (p?: string) => (p && p.startsWith("/") && !p.startsWith("//") ? p : "/account");

export const Route = createFileRoute("/auth")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Sign in — GSWAU" },
      {
        name: "description",
        content: "Sign in to GSWAU to read your books and take your courses.",
      },
      { property: "og:title", content: "Sign in — GSWAU" },
      { property: "og:description", content: "Access your GSWAU library." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"in" | "up" | "forgot">("in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const target = safe(redirect);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: target });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((e, s) => {
      if (e === "SIGNED_IN" && s) navigate({ to: target });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate, target]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    if (mode === "in") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg(error.message);
    } else if (mode === "up") {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin + target, data: { full_name: name } },
      });
      setMsg(error ? error.message : "Check your email to confirm your account.");
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setMsg(error ? error.message : "Check your email for a reset link.");
    }
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-4xl font-semibold">
        {mode === "up" ? "Create your account" : mode === "forgot" ? "Reset password" : "Sign in"}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Use the same email you bought with to unlock your books.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        {mode === "up" && (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Full name"
            maxLength={100}
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm"
          />
        )}
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm"
        />
        {mode !== "forgot" && (
          <input
            required
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password (8+ characters)"
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm"
          />
        )}
        <button disabled={busy} className="btn-gold w-full">
          {busy
            ? "Please wait…"
            : mode === "up"
              ? "Create account"
              : mode === "forgot"
                ? "Send reset link"
                : "Sign in"}
        </button>
      </form>
      {msg && <p className="mt-4 text-sm">{msg}</p>}
      <div className="mt-6 flex justify-between text-sm">
        {mode === "in" ? (
          <button className="underline" onClick={() => setMode("up")}>
            Create an account
          </button>
        ) : (
          <button className="underline" onClick={() => setMode("in")}>
            Back to sign in
          </button>
        )}
        {mode === "in" && (
          <button className="underline" onClick={() => setMode("forgot")}>
            Forgot password?
          </button>
        )}
      </div>
    </div>
  );
}
