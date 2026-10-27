// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  interpretGumroad,
  isMembershipProduct,
  parseGumroadBody,
  periodEnd,
  planFromRecurrence,
  statusFromSubscriber,
} from "@/lib/gumroad";

const sale = (extra: Record<string, string> = {}) =>
  parseGumroadBody(
    new URLSearchParams({
      sale_id: "S1",
      email: "Buyer@Example.com",
      product_id: "P1",
      permalink: "qegay",
      sale_timestamp: "2026-10-01T10:00:00Z",
      ...extra,
    }).toString(),
  );

describe("interpreting Gumroad notifications", () => {
  it("treats a one-off sale as a purchase", () => {
    const info = interpretGumroad("sale", sale());
    expect(info.event).toEqual({ kind: "purchase", saleId: "S1" });
    expect(info.email).toBe("buyer@example.com");
    expect(info.dedupeKey).toBe("sale:S1");
  });

  it("treats a sale with a subscription as a membership charge", () => {
    const first = interpretGumroad("sale", sale({ subscription_id: "SUB1" }));
    expect(first.event).toMatchObject({ kind: "membership_charge", firstCharge: true });
    const renewal = interpretGumroad(
      "sale",
      sale({ subscription_id: "SUB1", is_recurring_charge: "true" }),
    );
    expect(renewal.event).toMatchObject({ kind: "membership_charge", firstCharge: false });
  });

  it("treats refunded sales and refund notifications as refunds", () => {
    expect(interpretGumroad("sale", sale({ refunded: "true" })).event.kind).toBe("refund");
    expect(interpretGumroad("refund", sale()).event.kind).toBe("refund");
  });

  it("treats cancellations and endings as membership changes, deduplicated by time", () => {
    const a = interpretGumroad("cancellation", { subscription_id: "SUB1", cancelled_at: "t1" });
    const b = interpretGumroad("subscription_ended", { subscription_id: "SUB1", ended_at: "t2" });
    expect(a.event.kind).toBe("membership_change");
    expect(a.dedupeKey).not.toBe(b.dedupeKey);
  });

  it("flags test pings", () => {
    expect(interpretGumroad("sale", sale({ test: "true" })).isTest).toBe(true);
  });
});

describe("membership helpers", () => {
  it("maps Gumroad recurrence to our plans", () => {
    expect(planFromRecurrence("yearly")).toBe("annual");
    expect(planFromRecurrence("monthly")).toBe("monthly");
  });

  it("computes the next renewal date", () => {
    const start = new Date("2026-01-31T00:00:00Z");
    expect(periodEnd(start, "annual").toISOString()).toBe("2027-01-31T00:00:00.000Z");
    expect(periodEnd(new Date("2026-03-15T00:00:00Z"), "monthly").toISOString()).toBe(
      "2026-04-15T00:00:00.000Z",
    );
  });

  it("maps subscriber states", () => {
    expect(statusFromSubscriber({ status: "alive" })).toBe("active");
    expect(statusFromSubscriber({ status: "pending_cancellation" })).toBe("cancelled");
    expect(statusFromSubscriber({ status: "pending_failure" })).toBe("past_due");
    expect(statusFromSubscriber({ status: "payment_method_update_required" })).toBe("past_due");
    expect(statusFromSubscriber({ status: "failed_payment" })).toBe("ended");
    expect(statusFromSubscriber({ ended_at: "2026-01-01" })).toBe("ended");
  });

  it("recognises the membership product by any of its Gumroad names", () => {
    expect(isMembershipProduct(["gswau-membership"], "gswau-membership, other")).toBe(true);
    expect(isMembershipProduct(["qegay"], "gswau-membership")).toBe(false);
    expect(isMembershipProduct(["anything"], "")).toBe(true);
    // The API gives the random short link; the notification gives the custom one.
    expect(isMembershipProduct(["xYzAb", "membership", "P9"], "membership")).toBe(true);
    expect(isMembershipProduct(["xYzAb", null, "P9"], "membership, P9")).toBe(true);
  });
});
