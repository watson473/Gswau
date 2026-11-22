// @vitest-environment node
import { describe, expect, it } from "vitest";
import { faqsFromMarkdown, parseBlogBlocks } from "@/lib/blog-markdown";
import {
  LEAD_POST_SLUG,
  addCodePostPaths,
  codeBlogPosts,
  codePostBySlug,
  mergePublishedPosts,
} from "@/lib/blog-posts";

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
