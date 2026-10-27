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

export async function addToKit(email: string, referrer: string) {
  const apiKey = process.env["KIT_API_KEY"];
  if (!apiKey) return "kit not configured";
  // Creates the subscriber, or leaves an existing one as they are.
  await kitPost("/subscribers", apiKey, { email_address: email });
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
