// Public Kit form behind https://gs-w-augustin-university.kit.com/34a8ef6dee.
// Verified from that page: action https://app.kit.com/forms/10042215/subscriptions,
// data-sv-form="10042215", fields email_address and fields[first_name].
// No API key. Kit may answer "quarantined" and ask the visitor to complete a check.

export const KIT_FORM_ID = "10042215";
export const KIT_FORM_ACTION = `https://app.kit.com/forms/${KIT_FORM_ID}/subscriptions`;
export const KIT_GUARD_ORIGIN = "https://app.kit.com";

export type KitSubscribeResult =
  | { status: "success" }
  | { status: "quarantined"; url: string }
  | { status: "error"; message: string };

const guardUrl = /^https:\/\/app\.kit\.com\/forms\/guards\/[0-9a-f-]+$/i;

function errorMessage(errors: unknown) {
  if (!errors || typeof errors !== "object") return "Something went wrong — please try again.";
  const messages = "messages" in errors ? errors.messages : undefined;
  if (Array.isArray(messages)) {
    const text = messages.find((item) => typeof item === "string" && item.trim());
    if (typeof text === "string") return text;
  }
  return "Something went wrong — please try again.";
}

export function parseKitSubscribeResponse(status: number, body: unknown): KitSubscribeResult {
  const data =
    body && typeof body === "object"
      ? (body as { status?: unknown; url?: unknown; errors?: unknown })
      : null;
  if (status >= 200 && status < 300 && data?.status === "success") return { status: "success" };
  if (data?.status === "quarantined" && typeof data.url === "string" && guardUrl.test(data.url)) {
    return { status: "quarantined", url: data.url };
  }
  return { status: "error", message: errorMessage(data?.errors) };
}

export function kitGuardSignal(event: { origin: string; data: unknown }) {
  if (event.origin !== KIT_GUARD_ORIGIN) return null;
  if (!event.data || typeof event.data !== "object" || !("name" in event.data)) return null;
  const name = event.data.name;
  if (name === "ckjs:guard:confirmed") return "confirmed" as const;
  if (name === "ckjs:guard:failed") return "failed" as const;
  return null;
}

export async function postKitForm(email: string, firstName?: string): Promise<KitSubscribeResult> {
  const body = new FormData();
  body.set("email_address", email.trim());
  const name = firstName?.trim();
  if (name) body.set("fields[first_name]", name);
  if (typeof document !== "undefined") {
    body.set("referrer", document.referrer);
    body.set("host", document.location.href);
    body.set("search", document.location.search);
  }
  body.set("ckjs_version", "6");
  const res = await fetch(KIT_FORM_ACTION, {
    method: "POST",
    body,
    headers: { Accept: "application/json" },
  });
  let payload: unknown = null;
  try {
    payload = await res.json();
  } catch {
    payload = null;
  }
  return parseKitSubscribeResponse(res.status, payload);
}
