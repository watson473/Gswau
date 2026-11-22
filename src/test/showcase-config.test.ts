import { describe, expect, it } from "vitest";
import { priceShiftLastDay, priceShiftSlideOn } from "@/lib/showcase.config";

describe("The Price Shift slide in the homepage phone", () => {
  it("says the founding price lasts until Nov 26", () => {
    expect(priceShiftLastDay("en")).toBe("Nov 26");
  });

  it("shows through the end of Nov 26 in Nassau and hides after", () => {
    expect(priceShiftSlideOn(Date.parse("2026-11-26T23:59:00-05:00"))).toBe(true);
    expect(priceShiftSlideOn(Date.parse("2026-11-27T00:00:00-05:00"))).toBe(false);
  });
});
