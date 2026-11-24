import { describe, expect, it } from "vitest";

import {
  courseOfferNow,
  courseOffers,
  formatMoney,
  formatPlanAmount,
  membershipPrices,
} from "@/lib/catalog";
import { gumroadStore, onStore } from "@/lib/gumroad-store";
import { annualCheckoutUrl } from "@/components/Pricing";
import { publicPaths, sitemapXml } from "@/lib/sitemap";
import en from "@/i18n/locales/en.json";

describe("The Price Shift course offer", () => {
  const founding = Date.parse("2026-11-27T04:59:00Z"); // 11:59 PM Nov 26, Nassau
  const after = Date.parse("2026-11-27T05:00:00Z"); // midnight, start of Nov 27, Nassau

  it("uses the founding code on the course's own Gumroad product until Nov 26 ends", () => {
    const offer = courseOfferNow("the-price-shift-course", founding)!;
    expect(offer.url).toBe("https://mawgroupofcompanies.gumroad.com/l/vlepqs/FOUNDING47");
    expect(offer.url).not.toContain("ogijmt"); // the $23.99 audiobook
    expect(en[offer.labelKey]).toBe(
      "Buy the course: $97 — $47 for the first 25 with code FOUNDING47",
    );
  });

  it("switches to the plain link and $97 only after Nov 26", () => {
    const offer = courseOfferNow("the-price-shift-course", after)!;
    expect(offer.url).toBe("https://mawgroupofcompanies.gumroad.com/l/vlepqs");
    expect(en[offer.labelKey]).toBe("Buy the course: $97");
    expect(courseOffers["the-price-shift-course"]!.gumroadPermalink).toBe("vlepqs");
  });

  it("leaves the audiobook page without a course offer", () => {
    expect(courseOffers["the-price-shift"]).toBeUndefined();
    expect(courseOfferNow("the-price-shift")).toBeUndefined();
  });
});

describe("Gumroad store address", () => {
  it("moves old-address product links onto the current store, keeping the code", () => {
    expect(gumroadStore).toBe("https://mawgroupofcompanies.gumroad.com");
    expect(onStore("https://gswau.gumroad.com/l/hapsir")).toBe(
      "https://mawgroupofcompanies.gumroad.com/l/hapsir",
    );
    expect(onStore("https://gumroad.com/l/membership")).toBe(
      "https://mawgroupofcompanies.gumroad.com/l/membership",
    );
    expect(onStore("https://mawgroupofcompanies.gumroad.com/l/tvmee")).toBe(
      "https://mawgroupofcompanies.gumroad.com/l/tvmee",
    );
  });

  it("leaves other links alone", () => {
    const manage = "https://app.gumroad.com/subscriptions/abc/manage";
    expect(onStore(manage)).toBe(manage);
    expect(onStore("https://public-files.gumroad.com/x0sxgt1b")).toBe(
      "https://public-files.gumroad.com/x0sxgt1b",
    );
    expect(onStore("https://gswau.com/pricing")).toBe("https://gswau.com/pricing");
    expect(onStore(null)).toBeNull();
    expect(onStore("")).toBe("");
  });
});

describe("Displayed yearly membership price", () => {
  it("shows $199.99 a year and keeps the monthly price", () => {
    expect(membershipPrices.annual).toBe(199.99);
    expect(formatPlanAmount(membershipPrices.annual)).toBe("$199.99");
    expect(formatPlanAmount(membershipPrices.monthly)).toBe("$19.99");
    expect(formatPlanAmount(membershipPrices.annual)).toMatch(/\.99$/);
    // $199.99 / 12 is $16.67. Gumroad's yearly charge is a separate product and is not in this repo.
    expect(formatMoney(membershipPrices.annual / 12)).toBe("$16.67");
  });

  it("sends Join Annual to the yearly Gumroad product, not the monthly page", () => {
    expect(annualCheckoutUrl).toBe("https://mawgroupofcompanies.gumroad.com/l/fhqrks");
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
    expect(xml).toContain("<loc>https://gswau.com/videos</loc>");
    expect(xml).toContain("<loc>https://gswau.com/pricing</loc>");
    expect(xml).not.toContain("/admin");
    expect(xml).not.toContain("/account");
    expect(xml).not.toContain("/auth");
    expect(xml).not.toContain("/api/");
    expect(xml).not.toContain("/reset-password");
  });
});
