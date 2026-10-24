// Server-only: verifies Gumroad notifications with the Gumroad API and grants or removes access.
// Needs GUMROAD_ACCESS_TOKEN, GUMROAD_WEBHOOK_SECRET and SUPABASE_SERVICE_ROLE_KEY on the host.
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Json } from "@/integrations/supabase/types";
import {
  interpretGumroad,
  isMembershipPermalink,
  periodEnd,
  planFromRecurrence,
  statusFromSubscriber,
  type GumroadFields,
} from "./gumroad";

const API = "https://api.gumroad.com/v2";

type Sale = {
  id: string;
  email?: string;
  purchase_email?: string;
  product_id?: string;
  product_permalink?: string;
  permalink?: string;
  created_at?: string;
  timestamp?: string;
  subscription_id?: string | null;
  recurrence?: string | null;
  refunded?: boolean;
  chargedback?: boolean;
};
type Subscriber = {
  id: string;
  product_id?: string;
  user_email?: string;
  recurrence?: string | null;
  status?: string | null;
  cancelled_at?: string | null;
  ended_at?: string | null;
  failed_at?: string | null;
  user_requested_cancellation_at?: string | null;
};

function token() {
  const t = process.env["GUMROAD_ACCESS_TOKEN"];
  if (!t) throw new Error("GUMROAD_ACCESS_TOKEN is not set on the server.");
  return t;
}

async function gumroadGet<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const qs = new URLSearchParams({ ...params, access_token: token() });
  const res = await fetch(`${API}${path}?${qs}`);
  const body = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string } & T;
  if (!res.ok || body.success === false)
    throw new Error(`Gumroad ${path}: ${body.message ?? res.status}`);
  return body;
}

export async function verifyWebhookSecret(provided: string) {
  const expected = process.env["GUMROAD_WEBHOOK_SECRET"];
  if (!expected || provided.length !== expected.length) return false;
  const { timingSafeEqual } = await import("node:crypto");
  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

async function setting(key: string) {
  const { data } = await supabaseAdmin
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();
  return data?.value ?? "";
}

async function findProduct(gumroadProductId: string | null, permalink: string | null) {
  if (gumroadProductId) {
    const { data } = await supabaseAdmin
      .from("products")
      .select("id,gumroad_product_id")
      .eq("gumroad_product_id", gumroadProductId)
      .maybeSingle();
    if (data) return data;
  }
  if (permalink) {
    const { data } = await supabaseAdmin
      .from("products")
      .select("id,gumroad_product_id")
      .eq("gumroad_permalink", permalink)
      .maybeSingle();
    if (data) {
      // Remember Gumroad's product id for next time.
      if (!data.gumroad_product_id && gumroadProductId)
        await supabaseAdmin
          .from("products")
          .update({ gumroad_product_id: gumroadProductId })
          .eq("id", data.id);
      return data;
    }
  }
  return null;
}

async function userIdFor(email: string) {
  const { data } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .ilike("email", email)
    .maybeSingle();
  return data?.id ?? null;
}

async function record(
  name: "purchase" | "membership_start" | "membership_cancel",
  props: Record<string, string>,
) {
  await supabaseAdmin.from("analytics_events").insert({ name, props, user_id: null });
}

async function grantPurchase(sale: Sale, source: "gumroad" | "import") {
  const email = (sale.email ?? sale.purchase_email ?? "").toLowerCase();
  const permalink = sale.product_permalink ?? sale.permalink ?? null;
  const product = await findProduct(sale.product_id ?? null, permalink);
  if (!email) return "no email on sale";
  if (!product) return `no product matches Gumroad ${sale.product_id ?? permalink}`;
  if (sale.refunded || sale.chargedback) return "sale was refunded";
  const user_id = await userIdFor(email);
  const { data: existing } = await supabaseAdmin
    .from("entitlements")
    .select("id")
    .eq("email", email)
    .eq("product_id", product.id)
    .maybeSingle();
  const row = {
    email,
    user_id,
    product_id: product.id,
    source,
    gumroad_sale_id: sale.id,
    revoked_at: null,
  };
  const { error } = existing
    ? await supabaseAdmin.from("entitlements").update(row).eq("id", existing.id)
    : await supabaseAdmin.from("entitlements").insert(row);
  if (error) throw new Error(error.message);
  if (source === "gumroad") await record("purchase", { product: product.id });
  return "granted";
}

async function upsertMembership(fields: {
  subscriptionId: string;
  email: string;
  gumroadProductId: string | null;
  plan?: "monthly" | "annual";
  status: "active" | "cancelled" | "past_due" | "ended";
  current_period_end?: string;
  cancelled_at?: string | null;
  ended_at?: string | null;
  source: "gumroad" | "import";
}) {
  const user_id = await userIdFor(fields.email);
  const row = {
    email: fields.email,
    user_id,
    status: fields.status,
    source: fields.source,
    gumroad_subscription_id: fields.subscriptionId,
    gumroad_product_id: fields.gumroadProductId,
    manage_url: `https://app.gumroad.com/subscriptions/${fields.subscriptionId}/manage`,
    ...(fields.plan ? { plan: fields.plan } : {}),
    ...(fields.current_period_end ? { current_period_end: fields.current_period_end } : {}),
    ...(fields.cancelled_at !== undefined ? { cancelled_at: fields.cancelled_at } : {}),
    ...(fields.ended_at !== undefined ? { ended_at: fields.ended_at } : {}),
  };
  const { error } = await supabaseAdmin
    .from("memberships")
    .upsert(row, { onConflict: "gumroad_subscription_id" });
  if (error) throw new Error(error.message);
}

async function applyMembershipCharge(
  sale: Sale,
  firstCharge: boolean,
  source: "gumroad" | "import",
) {
  const email = (sale.email ?? sale.purchase_email ?? "").toLowerCase();
  if (!email || !sale.subscription_id) return "no email or subscription on sale";
  const plan = planFromRecurrence(sale.recurrence);
  const chargedAt = new Date(sale.created_at ?? sale.timestamp ?? Date.now());
  await upsertMembership({
    subscriptionId: sale.subscription_id,
    email,
    gumroadProductId: sale.product_id ?? null,
    plan,
    status: sale.refunded || sale.chargedback ? "ended" : "active",
    current_period_end: periodEnd(chargedAt, plan).toISOString(),
    cancelled_at: null,
    ended_at: null,
    source,
  });
  if (firstCharge && source === "gumroad") await record("membership_start", { plan });
  return firstCharge ? "membership started" : "membership renewed";
}

async function syncSubscriber(subscriptionId: string, resource: string) {
  const { subscriber } = await gumroadGet<{ subscriber: Subscriber }>(
    `/subscribers/${subscriptionId}`,
  );
  const status = statusFromSubscriber(subscriber);
  const email = (subscriber.user_email ?? "").toLowerCase();
  if (!email) return "subscriber has no email";
  await upsertMembership({
    subscriptionId,
    email,
    gumroadProductId: subscriber.product_id ?? null,
    plan: planFromRecurrence(subscriber.recurrence),
    status,
    cancelled_at: subscriber.cancelled_at ?? subscriber.user_requested_cancellation_at ?? null,
    ended_at:
      status === "ended"
        ? (subscriber.ended_at ?? subscriber.failed_at ?? new Date().toISOString())
        : null,
    source: "gumroad",
  });
  if (resource === "cancellation" || status === "ended")
    await record("membership_cancel", { status });
  return `membership ${status}`;
}

async function applyRefund(saleId: string, subscriptionId: string | null) {
  await supabaseAdmin
    .from("entitlements")
    .update({ revoked_at: new Date().toISOString() })
    .eq("gumroad_sale_id", saleId);
  if (subscriptionId)
    await supabaseAdmin
      .from("memberships")
      .update({ status: "ended", ended_at: new Date().toISOString() })
      .eq("gumroad_subscription_id", subscriptionId);
  return "access removed";
}

export async function handleGumroadNotification(resource: string, fields: GumroadFields) {
  const info = interpretGumroad(resource, fields);
  const { data: logged, error: logError } = await supabaseAdmin
    .from("gumroad_events")
    .insert({
      dedupe_key: info.dedupeKey,
      resource,
      sale_id: info.saleId,
      subscription_id: info.subscriptionId,
      email: info.email,
      gumroad_product_id: info.gumroadProductId,
      permalink: info.permalink,
      is_test: info.isTest,
      payload: fields as unknown as Json,
    })
    .select("id")
    .single();
  if (logError?.code === "23505") return "duplicate";
  if (logError || !logged) throw new Error(logError?.message ?? "could not log event");

  let outcome: string;
  let error: string | null = null;
  try {
    const e = info.event;
    if (info.isTest) outcome = "test notification received";
    else if (e.kind === "ignore") outcome = `ignored: ${e.reason}`;
    else if (e.kind === "refund") outcome = await applyRefund(e.saleId, e.subscriptionId);
    else if (e.kind === "membership_change")
      outcome = await syncSubscriber(e.subscriptionId, e.resource);
    else {
      // Never trust the notification itself: confirm the sale with Gumroad.
      const { sale } = await gumroadGet<{ sale: Sale }>(`/sales/${e.saleId}`);
      const isMembership =
        e.kind === "membership_charge" &&
        isMembershipPermalink(
          sale.product_permalink ?? info.permalink,
          await setting("membership_permalinks"),
        );
      outcome = isMembership
        ? await applyMembershipCharge(sale, e.firstCharge, "gumroad")
        : await grantPurchase(sale, "gumroad");
    }
  } catch (err) {
    outcome = "failed";
    error = err instanceof Error ? err.message : String(err);
  }
  // A failed event frees its dedupe key so Gumroad's retry is processed again.
  await supabaseAdmin
    .from("gumroad_events")
    .update({
      outcome,
      error,
      ...(error ? { dedupe_key: `${info.dedupeKey}:failed:${logged.id}` } : {}),
    })
    .eq("id", logged.id);
  if (error) throw new Error(error);
  return outcome;
}

// One-time import of every past Gumroad sale, so earlier buyers get their books.
export async function importPastSales() {
  const membershipPermalinks = await setting("membership_permalinks");
  const counts: Record<string, number> = {};
  let pageKey: string | undefined;
  for (let page = 0; page < 200; page++) {
    const res = await gumroadGet<{ sales: Sale[]; next_page_key?: string }>(
      "/sales",
      pageKey ? { page_key: pageKey } : {},
    );
    for (const sale of res.sales ?? []) {
      let outcome: string;
      try {
        outcome =
          sale.subscription_id &&
          isMembershipPermalink(sale.product_permalink ?? null, membershipPermalinks)
            ? await applyMembershipCharge(sale, false, "import")
            : await grantPurchase(sale, "import");
      } catch (err) {
        outcome = `failed: ${err instanceof Error ? err.message : String(err)}`;
      }
      counts[outcome] = (counts[outcome] ?? 0) + 1;
    }
    if (!res.next_page_key) break;
    pageKey = res.next_page_key;
  }
  return counts;
}

const RESOURCES = [
  "sale",
  "refund",
  "dispute",
  "cancellation",
  "subscription_ended",
  "subscription_restarted",
  "subscription_updated",
] as const;

// Registers this site's notification address with Gumroad for every event we use.
export async function connectGumroadNotifications(origin: string) {
  const secret = process.env["GUMROAD_WEBHOOK_SECRET"];
  if (!secret) throw new Error("GUMROAD_WEBHOOK_SECRET is not set on the server.");
  const result: Record<string, string> = {};
  for (const resource_name of RESOURCES) {
    // The event type travels in the address, so the handler never has to guess it.
    const postUrl = `${origin}/api/gumroad/${secret}?resource=${resource_name}`;
    const existing = await gumroadGet<{ resource_subscriptions: { post_url: string }[] }>(
      "/resource_subscriptions",
      { resource_name },
    );
    if (existing.resource_subscriptions?.some((r) => r.post_url === postUrl)) {
      result[resource_name] = "already connected";
      continue;
    }
    const res = await fetch(`${API}/resource_subscriptions`, {
      method: "PUT",
      body: new URLSearchParams({ access_token: token(), resource_name, post_url: postUrl }),
    });
    const body = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
    result[resource_name] = body.success ? "connected" : `failed: ${body.message ?? res.status}`;
  }
  return result;
}
