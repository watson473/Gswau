// @vitest-environment node
import { describe, expect, it } from "vitest";
import { blogHref, faqsFromMarkdown, parseBlogBlocks } from "@/lib/blog-markdown";
import {
  LEAD_POST_SLUG,
  UPGRADED_LIVE_SLUG,
  addCodePostPaths,
  codeBlogPosts,
  codePostBySlug,
  mergePublishedPosts,
  upgradedLivePost,
  upgradedLiveUpdatedAt,
} from "@/lib/blog-posts";
import { calculateChairEarnings } from "@/lib/chairEarnings";

const liveSlugs = [
  "raise-your-prices-without-losing-clients",
  "build-your-clientele-from-zero",
  "from-chair-to-shop-owner",
  "know-your-numbers-real-cost-of-a-haircut",
  "rebook-at-the-chair",
  "booth-rent-or-commission",
  "retail-products-extra-income",
];

const banned = [
  "NEEDS MAW REVIEW",
  "NEW EXPLAINER COPY",
  "This section is not from",
  "$197",
  "Gumroad",
  "Calendly",
  "free strategy call",
  "Zoom",
];

describe("new blog posts", () => {
  it("leads with Episode 1 and leaves the seven live slugs alone", () => {
    expect(codeBlogPosts.map((post) => post.slug)).toEqual([
      LEAD_POST_SLUG,
      "how-to-price-a-haircut",
      "how-to-talk-to-barber-clients",
      "taper-vs-fade",
    ]);
    for (const slug of liveSlugs) expect(codePostBySlug(slug)).toBeNull();

    const older = liveSlugs.map((slug, index) => ({
      id: slug,
      slug,
      title: slug,
      excerpt: "",
      cover_image_url: null,
      published_at: `2026-10-28T01:${30 + index}:00.000Z`,
    }));
    const merged = mergePublishedPosts(older);
    expect(merged[0]?.slug).toBe(LEAD_POST_SLUG);
    expect(merged.map((post) => post.slug).slice(0, 4)).toEqual([
      LEAD_POST_SLUG,
      "how-to-price-a-haircut",
      "how-to-talk-to-barber-clients",
      "taper-vs-fade",
    ]);
    expect(merged.filter((post) => post.slug === "rebook-at-the-chair")).toHaveLength(1);

    const existing = mergePublishedPosts([
      {
        id: "db",
        slug: LEAD_POST_SLUG,
        title: "Database title",
        excerpt: "Database excerpt",
        cover_image_url: null,
        published_at: "2020-01-01T00:00:00.000Z",
      },
    ]);
    expect(existing.filter((post) => post.slug === LEAD_POST_SLUG)).toHaveLength(1);
    expect(existing[0]?.title).toBe("Database title");
  });

  it("keeps reader copy and hides editor notes", () => {
    const episode = codePostBySlug(LEAD_POST_SLUG);
    expect(episode?.body).toContain("two to four weeks’ notice");
    expect(episode?.body).not.toContain("four to six");
    expect(episode?.faqs).toHaveLength(4);
    expect(codePostBySlug("how-to-price-a-haircut")?.faqs).toHaveLength(5);
    expect(codePostBySlug("how-to-talk-to-barber-clients")?.faqs).toHaveLength(5);
    expect(codePostBySlug("taper-vs-fade")?.faqs).toHaveLength(4);

    const priceAnswer = codePostBySlug("how-to-price-a-haircut")?.faqs.find((faq) =>
      faq.question.startsWith("What if my current price"),
    );
    expect(priceAnswer?.answer).toContain("Your Price Is a Message");
    expect(priceAnswer?.answer).toContain(
      "How to Raise Your Prices Without Losing Your Best Clients",
    );

    for (const post of codeBlogPosts) {
      expect(post.published_at.startsWith("2026-11-22")).toBe(true);
      for (const phrase of banned) expect(post.body).not.toContain(phrase);
      expect(post.body).toContain("https://gs-w-augustin-university.kit.com/34a8ef6dee");
    }
    expect(episode?.body).toContain("https://www.gswau.com/podcast");
    expect(episode?.body).toContain("https://open.spotify.com/episode/4mNNq4uXFtCN1LhQ6DTZvs");
    expect(codePostBySlug("how-to-price-a-haircut")?.body).toContain("open.spotify.com");
    expect(codePostBySlug("how-to-talk-to-barber-clients")?.body).not.toContain("spotify");
    expect(codePostBySlug("taper-vs-fade")?.body).not.toContain("spotify");
    expect(codePostBySlug("taper-vs-fade")?.body).toContain("In plain words, a fade is a cut");
  });

  it("adds the four posts to a sitemap without dropping existing paths", () => {
    const paths = addCodePostPaths(["/blog/rebook-at-the-chair"]);
    expect(paths[0]).toBe("/blog/rebook-at-the-chair");
    for (const post of codeBlogPosts) expect(paths).toContain(`/blog/${post.slug}`);
  });

  it("parses links, the notice conflict, and FAQ questions", () => {
    const blocks = parseBlogBlocks(codePostBySlug(LEAD_POST_SLUG)?.body ?? "");
    const linked = blocks.flatMap((block) => {
      if (block.type === "p") return block.lines.flat();
      if (block.type === "faq") return block.lines.flat();
      return [];
    });
    expect(linked).toContainEqual({
      type: "link",
      text: "How to Raise Your Prices Without Losing Your Best Clients",
      href: "/blog/raise-your-prices-without-losing-clients",
    });
    expect(faqsFromMarkdown(codePostBySlug("taper-vs-fade")?.body ?? "")[0]?.question).toBe(
      "What is the difference between a taper and a fade?",
    );
  });
});

describe("booth rent explainer", () => {
  const body = upgradedLivePost.body;

  function firstChairWin(weeklyRent: number, keepPct: number) {
    const rent = weeklyRent * 52;
    for (let services = 1; services <= 5000; services++) {
      const revenue = services * 35;
      if (revenue - rent > revenue * (keepPct / 100)) return services;
    }
    throw new Error("no break-even");
  }

  it("keeps the live slug and replaces only that post's public copy", () => {
    expect(codePostBySlug(UPGRADED_LIVE_SLUG)).toBeNull();
    expect(upgradedLivePost.slug).toBe("booth-rent-or-commission");
    expect(upgradedLivePost.title).toBe("Booth Rent or Commission: Which Pays You More?");
    expect(upgradedLiveUpdatedAt).toBe("2026-11-23T00:00:00.000Z");

    const merged = mergePublishedPosts([
      {
        id: "db",
        slug: UPGRADED_LIVE_SLUG,
        title: "Booth Rent or Commission: Which Pays You More?",
        excerpt: "old excerpt",
        cover_image_url: "https://example.com/cover.jpg",
        published_at: "2026-10-28T01:34:26.616Z",
      },
    ]);
    expect(merged.filter((post) => post.slug === UPGRADED_LIVE_SLUG)).toHaveLength(1);
    expect(merged.find((post) => post.slug === UPGRADED_LIVE_SLUG)?.excerpt).toBe(
      upgradedLivePost.excerpt,
    );
    expect(merged.find((post) => post.slug === UPGRADED_LIVE_SLUG)?.published_at).toBe(
      "2026-10-28T01:34:26.616Z",
    );
    expect(merged.find((post) => post.slug === UPGRADED_LIVE_SLUG)?.cover_image_url).toBe(
      upgradedLivePost.cover_image_url,
    );
    expect(upgradedLivePost.cover_image_url).toContain("photo-1593702275687-f8b402bf1fb5");
    expect(upgradedLivePost.cover_image_url).not.toContain("1759134198561");
    const kept = mergePublishedPosts([
      {
        id: "other",
        slug: "rebook-at-the-chair",
        title: "Rebooking",
        excerpt: "old",
        cover_image_url: "https://example.com/other.jpg",
        published_at: "2026-10-28T01:30:00.000Z",
      },
    ]);
    expect(kept.find((post) => post.slug === "rebook-at-the-chair")?.cover_image_url).toBe(
      "https://example.com/other.jpg",
    );
  });

  it("uses question headings, three internal links, and labeled example math", () => {
    const headings = [...body.matchAll(/^## (.+)$/gm)].map((match) => match[1]);
    expect(headings.length).toBeGreaterThanOrEqual(5);
    for (const heading of headings) expect(heading?.endsWith("?")).toBe(true);

    const hrefs = [...body.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)].map((match) => match[1] ?? "");
    expect(hrefs.filter((href) => href.startsWith("/"))).toEqual([
      "/calculator",
      "/podcast#episode-bdfdfa59-1f38-49dc-97cd-2e3eb623b411",
      "/library/rent-the-chair-or-own-the-shop",
    ]);
    expect(blogHref("/podcast#episode-bdfdfa59-1f38-49dc-97cd-2e3eb623b411")).toEqual({
      kind: "internal",
      path: "/podcast#episode-bdfdfa59-1f38-49dc-97cd-2e3eb623b411",
    });
    expect(blogHref("/calculator")).toEqual({ kind: "internal", path: "/calculator" });
    expect(blogHref("/library/rent-the-chair-or-own-the-shop")).toEqual({
      kind: "internal",
      path: "/library/rent-the-chair-or-own-the-shop",
    });

    for (const phrase of banned) expect(body).not.toContain(phrase);
    expect(body).toContain("Example, not survey data.");
    expect(body).toContain("May 2015: 14,350 wage-and-salary barbers");
    expect(body).toContain(
      "May 2025: 15,000 barbers, median $18.37 an hour, mean annual wage $47,070.",
    );
    expect(body).toContain("$26,770");
    expect(body).toContain("$61,090");
    expect(body).toContain("17.7%");
    expect(body).toContain("https://www.bls.gov/oes/2023/may/oes395011.htm");
    expect(body).toContain("https://www.bls.gov/news.release/ocwage.t01.htm");
    expect(body).toContain("https://salonrenter.com/barber-booth-rent/");

    const full = { price: 35, clientsPerDay: 8, daysPerWeek: 5, weeksPerYear: 48, tipsOn: false };
    expect(
      calculateChairEarnings({ ...full, payModel: "commission", commissionPct: 60 }).yearly,
    ).toBe(40320);
    expect(
      calculateChairEarnings({ ...full, payModel: "commission", commissionPct: 50 }).yearly,
    ).toBe(33600);
    expect(
      calculateChairEarnings({ ...full, payModel: "boothRent", boothRentPerWeek: 150 }).yearly,
    ).toBe(59400);
    expect(
      calculateChairEarnings({ ...full, payModel: "boothRent", boothRentPerWeek: 200 }).yearly,
    ).toBe(56800);
    expect(
      calculateChairEarnings({ ...full, payModel: "boothRent", boothRentPerWeek: 250 }).yearly,
    ).toBe(54200);
    expect(
      calculateChairEarnings({ ...full, payModel: "boothRent", boothRentPerWeek: 300 }).yearly,
    ).toBe(51600);
    const thin = { ...full, clientsPerDay: 4 };
    expect(
      calculateChairEarnings({ ...thin, payModel: "commission", commissionPct: 60 }).yearly,
    ).toBe(20160);
    expect(
      calculateChairEarnings({ ...thin, payModel: "boothRent", boothRentPerWeek: 300 }).yearly,
    ).toBe(18000);
    expect(body).toContain("$40,320");
    expect(body).toContain("$33,600");
    expect(body).toContain("$59,400");
    expect(body).toContain("$56,800");
    expect(body).toContain("$54,200");
    expect(body).toContain("$51,600");
    expect(body).toContain("$20,160");
    expect(body).toContain("$18,000");
    expect(firstChairWin(200, 60)).toBe(743);
    expect(firstChairWin(300, 60)).toBe(1115);
    expect(firstChairWin(200, 50)).toBe(595);
    expect(body).toContain("743 services");
    expect(body).toContain("1,115 services");
    expect(body).toContain("595 services");
  });
});
