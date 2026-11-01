import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getMfaState, type MfaState } from "@/lib/mfa";

type Enrolling = { factorId: string; qr: string; secret: string };

// My library > Two-step sign-in: turn it on with an authenticator app, add a backup device,
// or turn it off. Admins must keep at least one device.
export function TwoStepSettings({ required = false }: { required?: boolean }) {
  const [state, setState] = useState<MfaState | null>(null);
  const [enrolling, setEnrolling] = useState<Enrolling | null>(null);
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const reload = () => getMfaState().then(setState);
  useEffect(() => {
    void reload();
  }, []);

  async function start() {
    setMsg(null);
    setBusy(true);
    // Clear any half-finished setup first, so the new one starts clean.
    const { data } = await supabase.auth.mfa.listFactors();
    for (const f of data?.all ?? [])
      if (f.status === "unverified") await supabase.auth.mfa.unenroll({ factorId: f.id });
    const n = (state?.factors.length ?? 0) + 1;
    const { data: enrolled, error } = await supabase.auth.mfa.enroll({
      factorType: "totp",
      friendlyName: n === 1 ? "Authenticator app" : `Backup device ${n - 1}`,
      issuer: "GSWAU",
    });
    setBusy(false);
    if (error || !enrolled)
      return setMsg(error?.message ?? "Couldn't start setup. Please try again.");
    setEnrolling({
      factorId: enrolled.id,
      qr: enrolled.totp.qr_code,
      secret: enrolled.totp.secret,
    });
    setCode("");
  }

  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    if (!enrolling) return;
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: enrolling.factorId,
      code: code.trim(),
    });
    setBusy(false);
    if (error) return setMsg("That code didn't work. Check the time on your phone and try again.");
    setEnrolling(null);
    setMsg("Done. You'll be asked for a code each time you sign in.");
    await reload();
  }

  async function cancel() {
    if (enrolling) await supabase.auth.mfa.unenroll({ factorId: enrolling.factorId });
    setEnrolling(null);
    setMsg(null);
  }

  async function remove(id: string) {
    if (!confirmRemove()) return;
    setBusy(true);
    setMsg(null);
    const { error } = await supabase.auth.mfa.unenroll({ factorId: id });
    setBusy(false);
    if (error)
      setMsg(
        "To change two-step sign-in, sign out and back in with your code first, then try again.",
      );
    await reload();
  }
  const confirmRemove = () =>
    window.confirm("Remove this device? You won't need a code from it to sign in any more.");

  if (!state) return null;
  const on = state.factors.length > 0;
  const keepOne = state.isAdmin && state.factors.length === 1;

  return (
    <section id="security" className="rounded-lg border border-border bg-card p-6">
      <h2 className="text-2xl font-semibold">Two-step sign-in</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        {on
          ? "On. After your password, you'll enter a six-digit code from your authenticator app."
          : "Add a second step to signing in: a six-digit code from an authenticator app on your phone, such as Google Authenticator, Microsoft Authenticator or 1Password."}
      </p>
      {required && !on && (
        <p className="mt-3 rounded-md bg-gold/20 p-3 text-sm font-semibold">
          Admin accounts must turn on two-step sign-in before using Admin.
        </p>
      )}

      {on && (
        <ul className="mt-4 divide-y divide-border rounded-md border border-border text-sm">
          {state.factors.map((f) => (
            <li key={f.id} className="flex items-center justify-between gap-3 px-4 py-3">
              <span>{f.name}</span>
              {!keepOne && (
                <button
                  onClick={() => remove(f.id)}
                  disabled={busy}
                  className="text-crimson underline"
                >
                  Remove
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {enrolling ? (
        <form onSubmit={confirm} className="mt-5 space-y-4">
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            <li>Open your authenticator app and add a new account.</li>
            <li>Scan this code, or type the setup key below.</li>
            <li>Enter the six-digit code the app shows.</li>
          </ol>
          <img
            src={enrolling.qr}
            alt="QR code for your authenticator app"
            width={180}
            height={180}
            className="rounded-md bg-white p-2"
          />
          <p className="break-all text-xs text-muted-foreground">
            Setup key: <span className="font-mono text-foreground">{enrolling.secret}</span>
          </p>
          <input
            required
            inputMode="numeric"
            autoComplete="one-time-code"
            pattern="[0-9]{6}"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="123456"
            aria-label="Six-digit code"
            className="w-48 rounded-md border border-input bg-background px-4 py-3 text-center text-xl tracking-[0.3em]"
          />
          <div className="flex flex-wrap gap-3">
            <button className="btn-gold" disabled={busy || code.length !== 6}>
              {busy ? "Checking…" : "Confirm"}
            </button>
            <button type="button" onClick={cancel} className="btn-ghost">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-5 flex flex-wrap gap-3">
          <button onClick={start} disabled={busy} className={on ? "btn-ghost" : "btn-gold"}>
            {on ? "Add a backup device" : "Turn on two-step sign-in"}
          </button>
        </div>
      )}

      {msg && <p className="mt-3 text-sm">{msg}</p>}

      <details className="mt-5 text-sm text-muted-foreground">
        <summary className="cursor-pointer">If you lose your phone</summary>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            Add a backup device now (a second phone, a tablet or a password manager), so you can
            still get a code.
          </li>
          <li>Most authenticator apps can back up to the cloud and restore to a new phone.</li>
          <li>
            No backup? Contact us from your account's email. Once we confirm it's you, we turn off
            two-step sign-in so you can set it up again.
          </li>
        </ul>
      </details>
    </section>
  );
}
