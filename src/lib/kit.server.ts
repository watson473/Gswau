// Server-only: adds newsletter sign-ups to Kit (kit.com). Needs KIT_API_KEY (a v4 key) on the host.
// The optional Kit form ID in Admin > Settings also puts each sign-up on that form, so Kit
// shows where they came from and can start that form's automations.
import { publicClient } from "./public-client.server";

const API = "https://api.kit.com/v4";

async function kitPost(path: string, apiKey: string, body: Record<string, unknown>) {
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

export type KitSignupExtras = {
  /** Custom fields. If Kit rejects them, the signup is retried without fields. */
  fields?: Record<string, string>;
  /**
   * Omit to match the footer. "inactive" asks Kit to send a confirmation email
   * when the connected form uses double opt-in. Existing subscribers keep their state.
   */
  state?: "active" | "inactive";
  /**
   * site_settings key that may hold a numeric Kit tag id.
   * A missing setting or a rejected tag is skipped and never fails the signup.
   */
  tagSettingKey?: string;
};

// Body for POST /subscribers. With no extras this is the footer payload.
export function kitSubscriberBody(
  email: string,
  firstName: string | undefined,
  extras?: Pick<KitSignupExtras, "fields" | "state">,
  includeFields = true,
): Record<string, unknown> {
  const fields = extras?.fields;
  const sendFields = includeFields && !!fields && Object.keys(fields).length > 0;
  return {
    email_address: email,
    ...(firstName ? { first_name: firstName } : {}),
    ...(extras?.state ? { state: extras.state } : {}),
    ...(sendFields ? { fields } : {}),
  };
}

export async function addToKit(
  email: string,
  referrer: string,
  firstName?: string,
  extras?: KitSignupExtras,
) {
  const apiKey = process.env["KIT_API_KEY"];
  if (!apiKey) return "kit not configured";
  // Creates the subscriber, or updates an existing one's first name.
  // Calculator fields are optional: if Kit has not defined them, retry without them.
  try {
    await kitPost("/subscribers", apiKey, kitSubscriberBody(email, firstName, extras, true));
  } catch (err) {
    const hasFields = !!extras?.fields && Object.keys(extras.fields).length > 0;
    if (!hasFields) throw err;
    console.error("[kit] custom fields were not accepted; continuing without them", err);
    await kitPost("/subscribers", apiKey, kitSubscriberBody(email, firstName, extras, false));
  }
  if (extras?.tagSettingKey) {
    try {
      const { data: tagRow } = await publicClient()
        .from("site_settings")
        .select("value")
        .eq("key", extras.tagSettingKey)
        .maybeSingle();
      const tagId = (tagRow?.value ?? "").trim();
      if (/^\d+$/.test(tagId))
        await kitPost(`/tags/${tagId}/subscribers`, apiKey, { email_address: email });
    } catch (err) {
      console.error("[kit] tag was not applied", err);
    }
  }
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
