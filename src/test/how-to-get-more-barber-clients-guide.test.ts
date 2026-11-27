import { describe, expect, it } from "vitest";
import { author } from "@/lib/catalog";
import {
  clientsExampleNumbers,
  clientsFaqs,
  clientsGuide,
} from "@/lib/guides/how-to-get-more-barber-clients";
import { Route } from "@/routes/guides.how-to-get-more-barber-clients";

type Head = () => {
  meta: { title?: string; name?: string; content?: string }[];
  scripts?: { type?: string; children?: string }[];
};

describe("How to get more barber clients guide", () => {
  it("works the example out to round, checkable numbers", () => {
    const n = clientsExampleNumbers();
    expect(n.regularsBefore).toBe(18);
    expect(n.regularsAfter).toBe(36);
    expect(n.monthlyBefore).toBe(720);
    expect(n.monthlyAfter).toBe(1440);
    expect(n.extraPerMonth).toBe(720);
  });

  it("has a 2–4 sentence short answer", () => {
    const sentences = clientsGuide.shortAnswer.split(/(?<=[.!?])\s+/).filter(Boolean);
    expect(sentences.length).toBeGreaterThanOrEqual(2);
    expect(sentences.length).toBeLessThanOrEqual(4);
  });

  it("has a title, description, byline and FAQPage data", () => {
    expect(author.name).toBe("Gs. W. Augustin");
    expect(clientsGuide.description.length).toBeLessThanOrEqual(160);
    expect(clientsFaqs.length).toBeGreaterThanOrEqual(4);
    const head = (Route.options.head as Head)();
    expect(head.meta.find((m) => m.title)?.title).toBe(
      "How to Get More Clients as a Barber — GSWAU",
    );
    const ld = JSON.stringify(head.scripts ?? head);
    expect(ld).toContain("FAQPage");
    expect(ld).toContain("Gs. W. Augustin");
    for (const f of clientsFaqs) expect(ld).toContain(f.question);
  });
});
