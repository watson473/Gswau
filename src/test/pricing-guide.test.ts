import { describe, expect, it } from "vitest";
import { author } from "@/lib/catalog";
import {
  exampleNumbers,
  pricingFaqs,
  pricingGuide,
} from "@/lib/guides/how-to-price-barber-services";
import { Route } from "@/routes/guides.how-to-price-barber-services";

type Head = () => {
  meta: { title?: string; name?: string; content?: string }[];
  scripts?: { type?: string; children?: string }[];
};

describe("How to price barber services guide", () => {
  it("works the example out to round, checkable numbers", () => {
    const n = exampleNumbers();
    expect(n.costs).toBe(1500);
    expect(n.needed).toBe(6000);
    expect(n.hours).toBe(120);
    expect(n.perHour).toBe(50);
    expect(n.services.map((s) => s.price)).toEqual([40, 50]);
  });

  it("has a title, description, byline and FAQPage data", () => {
    expect(author.name).toBe("Gs. W. Augustin");
    expect(pricingGuide.description.length).toBeLessThanOrEqual(160);
    expect(pricingFaqs.length).toBeGreaterThanOrEqual(4);
    const head = (Route.options.head as Head)();
    expect(head.meta.find((m) => m.title)?.title).toBe("How to Price Your Barber Services — GSWAU");
    const ld = JSON.stringify(head.scripts ?? head);
    expect(ld).toContain("FAQPage");
    expect(ld).toContain("Gs. W. Augustin");
    for (const f of pricingFaqs) expect(ld).toContain(f.question);
  });
});
