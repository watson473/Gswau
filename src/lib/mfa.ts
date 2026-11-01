// Two-step sign-in with an authenticator app (Supabase MFA, TOTP).
// Members can turn it on in My library; admins must have it before they can use Admin.
import { supabase } from "@/integrations/supabase/client";

export type MfaState = {
  // "aal2" once the six-digit code has been entered this session.
  level: "aal1" | "aal2" | null;
  // True when the account has two-step sign-in on but this session hasn't entered a code yet.
  needsCode: boolean;
  factors: { id: string; name: string }[];
  isAdmin: boolean;
};

export async function getMfaState(): Promise<MfaState> {
  const [{ data: aal }, { data: list }, { data: user }] = await Promise.all([
    supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
    supabase.auth.mfa.listFactors(),
    supabase.auth.getUser(),
  ]);
  // Reads the account's own role directly, so an admin who hasn't entered a code yet is still
  // recognised (the admin check used elsewhere only passes after the code).
  const { data: roles } = user.user
    ? await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.user.id)
        .eq("role", "admin")
    : { data: [] };
  return {
    level: aal?.currentLevel === "aal2" ? "aal2" : aal?.currentLevel === "aal1" ? "aal1" : null,
    needsCode: aal?.nextLevel === "aal2" && aal.currentLevel !== "aal2",
    factors: (list?.totp ?? []).map((f) => ({
      id: f.id,
      name: f.friendly_name ?? "Authenticator app",
    })),
    isAdmin: (roles ?? []).length > 0,
  };
}

// Checks a six-digit code against the account's first authenticator and upgrades the session.
export async function verifyCode(code: string, factorId?: string) {
  const id = factorId ?? (await getMfaState()).factors[0]?.id;
  if (!id) throw new Error("Two-step sign-in isn't set up on this account.");
  const { error } = await supabase.auth.mfa.challengeAndVerify({ factorId: id, code: code.trim() });
  if (error) throw new Error("That code didn't work. Check the time on your phone and try again.");
}
