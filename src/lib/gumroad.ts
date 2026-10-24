// Turns a Gumroad notification (ping or resource subscription) into what it means for GSWAU.
// Pure and shared with tests; the database work happens in gumroad.server.ts.

export type GumroadFields = Record<string, string>;

export type MembershipPlan = "monthly" | "annual";
export type MembershipStatus = "active" | "cancelled" | "past_due" | "ended";

export type GumroadEvent =
  | { kind: "purchase"; saleId: string }
  | { kind: "membership_charge"; saleId: string; subscriptionId: string; firstCharge: boolean }
  | { kind: "membership_change"; subscriptionId: string; resource: string }
  | { kind: "refund"; saleId: string; subscriptionId: string | null }
  | { kind: "ignore"; reason: string };

export type GumroadEventInfo = {
  event: GumroadEvent;
  resource: string;
  email: string | null;
  saleId: string | null;
  subscriptionId: string | null;
  gumroadProductId: string | null;
  permalink: string | null;
  isTest: boolean;
  timestamp: string | null;
  dedupeKey: string;
};

const truthy = (v: string | undefined) => v === "true" || v === "1";

export function parseGumroadBody(body: string): GumroadFields {
  const out: GumroadFields = {};
  new URLSearchParams(body).forEach((value, key) => {
    out[key] = value;
  });
  return out;
}

export function interpretGumroad(resource: string, f: GumroadFields): GumroadEventInfo {
  const saleId = f["sale_id"] || null;
  const subscriptionId = f["subscription_id"] || null;
  const email =
    (f["email"] || f["user_email"] || f["purchaser_email"] || "").trim().toLowerCase() || null;
  const permalink = f["permalink"] || f["product_permalink"] || null;
  const timestamp =
    f["ended_at"] ||
    f["cancelled_at"] ||
    f["restarted_at"] ||
    f["updated_at"] ||
    f["sale_timestamp"] ||
    null;
  const base = {
    resource,
    email,
    saleId,
    subscriptionId,
    gumroadProductId: f["product_id"] || null,
    permalink,
    isTest: truthy(f["test"]),
    timestamp,
  };
  const key = (...parts: (string | null)[]) => [resource, ...parts].map((p) => p ?? "").join(":");

  let event: GumroadEvent;
  if (resource === "sale") {
    if (!saleId) event = { kind: "ignore", reason: "sale without sale_id" };
    else if (truthy(f["refunded"]) || truthy(f["chargebacked"]) || truthy(f["disputed"]))
      event = { kind: "refund", saleId, subscriptionId };
    else if (subscriptionId)
      event = {
        kind: "membership_charge",
        saleId,
        subscriptionId,
        firstCharge: !truthy(f["is_recurring_charge"]),
      };
    else event = { kind: "purchase", saleId };
  } else if (resource === "refund" || resource === "dispute") {
    event = saleId
      ? { kind: "refund", saleId, subscriptionId }
      : { kind: "ignore", reason: "refund without sale_id" };
  } else if (
    resource === "cancellation" ||
    resource === "subscription_ended" ||
    resource === "subscription_restarted" ||
    resource === "subscription_updated"
  ) {
    event = subscriptionId
      ? { kind: "membership_change", subscriptionId, resource }
      : { kind: "ignore", reason: `${resource} without subscription_id` };
  } else {
    event = { kind: "ignore", reason: `unhandled resource ${resource}` };
  }

  const dedupeKey =
    event.kind === "membership_change"
      ? key(subscriptionId, timestamp)
      : key(saleId ?? subscriptionId);
  return { ...base, event, dedupeKey };
}

export function planFromRecurrence(recurrence: string | null | undefined): MembershipPlan {
  return recurrence === "yearly" || recurrence === "annual" || recurrence === "annually"
    ? "annual"
    : "monthly";
}

// End of the period a charge pays for (the next renewal date).
export function periodEnd(chargedAt: Date, plan: MembershipPlan): Date {
  const end = new Date(chargedAt);
  if (plan === "annual") end.setUTCFullYear(end.getUTCFullYear() + 1);
  else end.setUTCMonth(end.getUTCMonth() + 1);
  return end;
}

// Maps a Gumroad subscriber record to our membership status.
// Gumroad subscriber fields: cancelled_at, ended_at, failed_at, user_requested_cancellation_at, status.
export function statusFromSubscriber(s: {
  status?: string | null;
  cancelled_at?: string | null;
  ended_at?: string | null;
  failed_at?: string | null;
  user_requested_cancellation_at?: string | null;
}): MembershipStatus {
  switch (s.status) {
    case "alive":
      return "active";
    case "pending_cancellation":
      return "cancelled";
    case "pending_failure":
      return "past_due";
    case "failed_payment":
    case "fixed_subscription_period_ended":
    case "cancelled":
      return "ended";
  }
  if (s.ended_at || s.failed_at) return "ended";
  if (s.cancelled_at || s.user_requested_cancellation_at) return "cancelled";
  return "active";
}

export function isMembershipPermalink(permalink: string | null, configured: string) {
  const list = configured
    .split(/[\s,]+/)
    .map((x) => x.trim())
    .filter(Boolean);
  // If no membership product is configured yet, any recurring sale counts as the membership.
  return list.length === 0 || (permalink != null && list.includes(permalink));
}
