// Server-only: adds newsletter sign-ups to Kit (kit.com). Needs KIT_API_KEY (a v4 key) on the host.
// The optional Kit form ID in Admin > Settings also puts each sign-up on that form, so Kit
// shows where they came from and can start that form's automations.
import { publicClient } from "./public-client.server";

const API = "https://api.kit.com/v4";

async function kitPost(path: string, apiKey: string, body: Record<string, string>) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Kit-Api-Key": apiKey },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Kit ${path}: ${res.status} ${text.slice(0, 200)}`);
  }
}

async function kitGet<T>(path: string, apiKey: string): Promise<T> {
  const res = await fetch(`${API}${path}`, { headers: { "X-Kit-Api-Key": apiKey } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Kit ${path.split("?")[0]}: ${res.status} ${text.slice(0, 200)}`);
  }
  return (await res.json()) as T;
}

type KitSubscriber = { email_address: string; state: string; created_at: string };
export type KitCheckResult = {
  configured: boolean;
  account?: string;
  error?: string;
  email?: string | null;
  subscriber?: KitSubscriber | null;
};

// Admin > Email list: is the key accepted, and what state is this email in on Kit?
export async function kitCheck(email: string | null): Promise<KitCheckResult> {
  const apiKey = process.env["KIT_API_KEY"];
  if (!apiKey) return { configured: false };
  try {
    const { account } = await kitGet<{ account: { name: string } }>("/account", apiKey);
    let subscriber: KitSubscriber | null = null;
    if (email) {
      const qs = new URLSearchParams({ email_address: email, status: "all" });
      const res = await kitGet<{ subscribers: KitSubscriber[] }>(`/subscribers?${qs}`, apiKey);
      subscriber = res.subscribers[0] ?? null;
    }
    return { configured: true, account: account.name, email, subscriber };
  } catch (err) {
    return { configured: true, error: err instanceof Error ? err.message : String(err) };
  }
}

export async function addToKit(email: string, referrer: string, firstName?: string) {
  const apiKey = process.env["KIT_API_KEY"];
  if (!apiKey) return "kit not configured";
  // Creates the subscriber, or updates an existing one's first name.
  await kitPost("/subscribers", apiKey, {
    email_address: email,
    ...(firstName ? { first_name: firstName } : {}),
  });
  const { data } = await publicClient()
    .from("site_settings")
    .select("value")
    .eq("key", "kit_form_id")
    .maybeSingle();
  const formId = (data?.value ?? "").trim();
  if (/^\d+$/.test(formId))
    await kitPost(`/forms/${formId}/subscribers`, apiKey, { email_address: email, referrer });
  return "added to kit";
}
