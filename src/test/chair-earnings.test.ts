import { describe, expect, it } from "vitest";
import {
  CHAIR_EARNINGS_DEFAULTS,
  calculateChairEarnings,
  kitFieldsForEstimate,
} from "@/lib/chairEarnings";
import { kitSubscriberBody } from "@/lib/kit.server";

describe("chair earnings", () => {
  it("defaults to 8 × $35 × 5 × 48 = $67,200", () => {
    const result = calculateChairEarnings(CHAIR_EARNINGS_DEFAULTS);
    expect(result.servicesPerYear).toBe(8 * 5 * 48);
    expect(result.serviceRevenue).toBe(67200);
    expect(result.tips).toBe(0);
    expect(result.rentDeduction).toBe(0);
    expect(result.yearly).toBe(67200);
    expect(result.weekly).toBe(1400);
    expect(result.monthly).toBe(5600);
    expect(result.priceLever).toBe(9600);
  });

  it("fills defaults when nothing is passed", () => {
    expect(calculateChairEarnings().yearly).toBe(67200);
  });

  it("matches the worked example: 15% tips and $250/week booth rent = $64,280", () => {
    const result = calculateChairEarnings({
      ...CHAIR_EARNINGS_DEFAULTS,
      tipsOn: true,
      tipPct: 15,
      payModel: "boothRent",
      boothRentPerWeek: 250,
    });
    expect(result.tips).toBe(10080);
    expect(result.rentDeduction).toBe(13000);
    expect(result.serviceTakeHome).toBe(54200);
    expect(result.yearly).toBe(64280);
    expect(result.weekly).toBe(1339.17);
    // Rent does not change when the price goes up by $5. Tips do, because they are a percent.
    expect(result.priceLever).toBe(11040);
  });

  it("keeps commission on services and keeps tips in full", () => {
    const result = calculateChairEarnings({
      ...CHAIR_EARNINGS_DEFAULTS,
      tipsOn: true,
      tipPct: 15,
      payModel: "commission",
      commissionPct: 60,
    });
    expect(result.serviceTakeHome).toBe(40320);
    expect(result.tips).toBe(10080);
    expect(result.yearly).toBe(50400);
    // $5 × 8 × 5 × 48 = $9,600 of services, 60% kept, plus 15% tips on the full $9,600.
    expect(result.priceLever).toBe(7200);
  });

  it("clamps out-of-range and non-finite inputs", () => {
    const result = calculateChairEarnings({
      price: Number.POSITIVE_INFINITY,
      clientsPerDay: 0,
      daysPerWeek: 9,
      weeksPerYear: Number.NaN,
      tipPct: 80,
      boothRentPerWeek: 9000,
      commissionPct: 1,
      tipsOn: true,
      payModel: "commission",
    });
    expect(result.price).toBe(35);
    expect(result.clientsPerDay).toBe(1);
    expect(result.daysPerWeek).toBe(7);
    expect(result.weeksPerYear).toBe(48);
    expect(result.tipPct).toBe(50);
    expect(result.boothRentPerWeek).toBe(2000);
    expect(result.commissionPct).toBe(10);
  });

  it("can go negative when booth rent is larger than services", () => {
    const result = calculateChairEarnings({
      price: 5,
      clientsPerDay: 1,
      daysPerWeek: 1,
      weeksPerYear: 1,
      payModel: "boothRent",
      boothRentPerWeek: 2000,
      tipsOn: false,
    });
    expect(result.serviceRevenue).toBe(5);
    expect(result.rentDeduction).toBe(104000);
    expect(result.yearly).toBe(-103995);
  });

  it("records Kit fields as stylist, chair rate, and the rounded yearly estimate", () => {
    const result = calculateChairEarnings({
      ...CHAIR_EARNINGS_DEFAULTS,
      tipsOn: true,
      tipPct: 15,
      payModel: "boothRent",
    });
    expect(kitFieldsForEstimate(result)).toEqual({
      service_type: "stylist",
      chair_rate: "35",
      yearly_estimate: "64280",
    });
  });
});

describe("Kit subscriber body", () => {
  it("matches the footer when no calculator extras are passed", () => {
    expect(kitSubscriberBody("stylist@example.com", undefined)).toEqual({
      email_address: "stylist@example.com",
    });
    expect(kitSubscriberBody("stylist@example.com", "Ada")).toEqual({
      email_address: "stylist@example.com",
      first_name: "Ada",
    });
  });

  it("adds fields and an inactive state only when asked, and can drop the fields", () => {
    const extras = {
      state: "inactive" as const,
      fields: { service_type: "stylist", chair_rate: "35", yearly_estimate: "67200" },
    };
    expect(kitSubscriberBody("stylist@example.com", "Ada", extras, true)).toEqual({
      email_address: "stylist@example.com",
      first_name: "Ada",
      state: "inactive",
      fields: extras.fields,
    });
    expect(kitSubscriberBody("stylist@example.com", "Ada", extras, false)).toEqual({
      email_address: "stylist@example.com",
      first_name: "Ada",
      state: "inactive",
    });
  });
});
