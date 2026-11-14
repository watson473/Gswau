import { describe, expect, it } from "vitest";

import { formatPlanAmount, membershipPrices } from "@/lib/catalog";
import { publicPaths, sitemapXml } from "@/lib/sitemap";

describe("Displayed yearly membership price", () => {
  it("shows $199 a year and keeps the monthly price", () => {
    expect(membershipPrices.annual).toBe(199);
    expect(formatPlanAmount(membershipPrices.annual)).toBe("$199");
    expect(formatPlanAmount(membershipPrices.monthly)).toBe("$19.99");
    expect(formatPlanAmount(membershipPrices.annual).includes(".")).toBe(false);
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
    expect(xml).not.toContain("/api/");
    expect(xml).not.toContain("/reset-password");
  });
});
