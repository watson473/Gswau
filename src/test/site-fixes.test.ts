import { describe, expect, it } from "vitest";

import { formatMoney, formatPlanAmount, membershipPrices } from "@/lib/catalog";
import { annualCheckoutUrl } from "@/components/Pricing";
import { publicPaths, sitemapXml } from "@/lib/sitemap";

describe("Displayed yearly membership price", () => {
  it("shows $199 a year and keeps the monthly price", () => {
    expect(membershipPrices.annual).toBe(199);
    expect(formatPlanAmount(membershipPrices.annual)).toBe("$199");
    expect(formatPlanAmount(membershipPrices.monthly)).toBe("$19.99");
    expect(formatPlanAmount(membershipPrices.annual).includes(".")).toBe(false);
    // $199 / 12 is $16.58. Gumroad's yearly charge is a separate product and is not in this repo.
    expect(formatMoney(membershipPrices.annual / 12)).toBe("$16.58");
  });

  it("sends Join Annual to the yearly Gumroad product, not the monthly page", () => {
    expect(annualCheckoutUrl).toBe("https://gswau.gumroad.com/l/fhqrks");
    expect(annualCheckoutUrl).not.toContain("/l/membership");
  });
});

describe("Sitemap", () => {
  it("lists the public pages and leaves private routes out", () => {
    const xml = sitemapXml(publicPaths);

    expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(xml).toContain('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"');
    expect(xml).toContain("<loc>https://gswau.com/</loc>");
    expect(xml).toContain("<loc>https://gswau.com/programs</loc>");
    expect(xml).toContain("<loc>https://gswau.com/calculator</loc>");
    expect(xml).toContain("<loc>https://gswau.com/podcast</loc>");
    expect(xml).toContain("<loc>https://gswau.com/pricing</loc>");
    expect(xml).not.toContain("/admin");
    expect(xml).not.toContain("/account");
    expect(xml).not.toContain("/auth");
    expect(xml).not.toContain("/api/");
    expect(xml).not.toContain("/reset-password");
  });
});
