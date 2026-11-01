import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { getMfaState, verifyCode, type MfaState } from "@/lib/mfa";
import { contact } from "@/lib/site";

// Second step of signing in, for accounts with two-step sign-in turned on.
export const Route = createFileRoute("/_authenticated/mfa")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  head: () => ({
    meta: [{ title: "Enter your code — GSWAU" }, { name: "robots", content: "noindex" }],
  }),
  component: MfaPage,
});

const safe = (to?: string) => (to && to.startsWith("/") && !to.startsWith("//") ? to : "/account");

function MfaPage() {
  const { redirect } = Route.useSearch();
  const navigate = useNavigate();
  const [state, setState] = useState<MfaState | null>(null);
  const [factorId, setFactorId] = useState<string | undefined>();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    getMfaState().then((s) => {
      if (!s.needsCode) navigate({ to: safe(redirect), replace: true });
      else {
        setState(s);
        setFactorId(s.factors[0]?.id);
      }
    });
  }, [navigate, redirect]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      await verifyCode(code, factorId);
      navigate({ to: safe(redirect), replace: true });
    } catch (err) {
      setMsg(err instanceof Error ? err.message : String(err));
      setBusy(false);
    }
  }

  if (!state) return <p className="mx-auto max-w-md px-5 py-16 text-muted-foreground">Loading…</p>;
  return (
    <div className="mx-auto max-w-md px-5 py-16">
      <h1 className="text-4xl font-semibold">Enter your code</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Open your authenticator app and type the six-digit code for GSWAU.
      </p>
      <form onSubmit={submit} className="mt-6 space-y-3">
        {state.factors.length > 1 && (
          <label className="block text-sm">
            Device
            <select
              value={factorId}
              onChange={(e) => setFactorId(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2"
            >
              {state.factors.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <input
          required
          autoFocus
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]{6}"
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          placeholder="123456"
          aria-label="Six-digit code"
          className="w-full rounded-md border border-input bg-background px-4 py-3 text-center text-2xl tracking-[0.4em]"
        />
        <button className="btn-gold w-full" disabled={busy || code.length !== 6}>
          {busy ? "Checking…" : "Continue"}
        </button>
        {msg && (
          <p role="alert" className="text-sm text-crimson">
            {msg}
          </p>
        )}
      </form>
      <button type="button" onClick={() => setHelp(!help)} className="mt-6 text-sm underline">
        Lost your phone?
      </button>
      {help && (
        <div className="mt-3 space-y-2 rounded-md bg-secondary p-4 text-sm">
          <p>
            If you added a backup device, choose it above and use its code. Codes also work from an
            authenticator app restored from your phone's backup.
          </p>
          <p>
            Otherwise, email <a href={`mailto:${contact.email}`}>{contact.email}</a> from the
            address on your account. After we confirm it's you, we'll turn off two-step sign-in so
            you can sign in with your password and set it up again.
          </p>
        </div>
      )}
    </div>
  );
}
