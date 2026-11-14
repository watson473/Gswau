import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { faqPlainEntries } from "@/lib/faq";
import { raiseYourPricesArticle } from "@/lib/podcast-articles";
import {
  canonicalUrl,
  courseNode,
  defaultShareImage,
  organizationNode,
  SHARE_IMAGE_HEIGHT,
  SHARE_IMAGE_WIDTH,
  socialProfiles,
  twitterSite,
} from "@/lib/share";
import { Route as RootRoute } from "@/routes/__root";
import { Route as AboutRoute } from "@/routes/about";
import { Route as AuthRoute } from "@/routes/auth";
import { Route as BlogIndexRoute } from "@/routes/blog.index";
import { Route as BlogRoute } from "@/routes/blog.$slug";
import { Route as CalculatorRoute } from "@/routes/calculator";
import { Route as ContactRoute } from "@/routes/contact";
import { Route as CoursesRoute } from "@/routes/courses.index";
import { Route as FaqRoute } from "@/routes/faq";
import { Route as HomeRoute } from "@/routes/index";
import { Route as LibraryIndexRoute } from "@/routes/library.index";
import { Route as LibraryRoute } from "@/routes/library.$slug";
import { Route as PodcastIndexRoute } from "@/routes/podcast.index";
import { Route as PodcastRoute } from "@/routes/podcast.$slug";
import { Route as PricingRoute } from "@/routes/pricing";
import { Route as PrivacyRoute } from "@/routes/privacy";
import { Route as ProgramsRoute } from "@/routes/programs";
import { Route as RefundsRoute } from "@/routes/refunds";
import { Route as TermsRoute } from "@/routes/terms";

type HeadResult = {
  meta?: readonly object[];
  links?: readonly { rel?: string; href?: string }[];
};

type HeadFn = (ctx: never) => HeadResult;

function renderHead(head: HeadFn | undefined, ctx: object = {}) {
  if (!head) throw new Error("route has no head");
  return head({ matches: [], params: {}, loaderData: undefined, ...ctx } as never);
}

function content(tag: object, key: "name" | "property") {
  if (!(key in tag)) return undefined;
  const record = tag as { name?: string; property?: string; content?: string };
  return { key: record[key], content: record.content ?? "" };
}

// Same precedence as TanStack Router: the deepest route wins for a name or property.
function mergeHeads(layers: HeadResult[]) {
  const seen = new Set<string>();
  const tags: object[] = [];
  const scripts: unknown[] = [];
  let title: string | undefined;
  for (let i = layers.length - 1; i >= 0; i--) {
    const metas = layers[i]?.meta ?? [];
    for (let j = metas.length - 1; j >= 0; j--) {
      const tag = metas[j]!;
      if ("title" in tag && typeof tag.title === "string") {
        if (!title) title = tag.title;
        continue;
      }
      if ("script:ld+json" in tag) {
        scripts.push(tag["script:ld+json"]);
        continue;
      }
      const named = content(tag, "name") ?? content(tag, "property");
      if (named?.key) {
        if (seen.has(named.key)) continue;
        seen.add(named.key);
      }
      tags.push(tag);
    }
  }
  return {
    title,
    tags: tags.reverse(),
    scripts: scripts.reverse(),
    links: layers.flatMap((layer) => layer.links ?? []),
  };
}

const KNOWN_TYPES = new Set([
  "AboutPage",
  "Answer",
  "Article",
  "AudioObject",
  "Blog",
  "BlogPosting",
  "Brand",
  "BreadcrumbList",
  "CollectionPage",
  "ContactPage",
  "Course",
  "CourseInstance",
  "FAQPage",
  "ImageObject",
  "ListItem",
  "Offer",
  "Organization",
  "Person",
  "PodcastEpisode",
  "PodcastSeries",
  "Product",
  "QuantitativeValue",
  "Question",
  "Syllabus",
  "UnitPriceSpecification",
  "WebPage",
  "WebSite",
]);

const REQUIRED: Record<string, string[]> = {
  AboutPage: ["name", "url"],
  Answer: ["text"],
  Article: ["headline"],
  AudioObject: ["contentUrl"],
  Blog: ["name", "url"],
  BlogPosting: ["headline"],
  Brand: ["name"],
  BreadcrumbList: ["itemListElement"],
  CollectionPage: ["name", "url"],
  ContactPage: ["name", "url"],
  Course: ["name", "description", "provider"],
  CourseInstance: ["courseMode"],
  FAQPage: ["mainEntity"],
  ImageObject: ["url"],
  ListItem: ["position", "name", "item"],
  Offer: ["price", "priceCurrency"],
  Organization: ["name", "url", "logo"],
  Person: ["name"],
  PodcastEpisode: ["name", "url"],
  PodcastSeries: ["name", "url"],
  Product: ["name", "offers"],
  QuantitativeValue: ["value", "unitCode"],
  Question: ["name", "acceptedAnswer"],
  Syllabus: ["name"],
  UnitPriceSpecification: ["price", "priceCurrency"],
  WebSite: ["name", "url"],
};

const FORBIDDEN = new Set([
  "aggregateRating",
  "bestRating",
  "ratingValue",
  "review",
  "reviewCount",
  "worstRating",
]);

function assertJsonLd(value: unknown, path = "$") {
  const parsed = JSON.parse(JSON.stringify(value)) as unknown;
  walkJsonLd(parsed, path);
  return parsed;
}

function walkJsonLd(value: unknown, path: string) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => walkJsonLd(item, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  const record = value as Record<string, unknown>;
  for (const key of Object.keys(record)) {
    if (FORBIDDEN.has(key)) throw new Error(`${path}.${key} is not allowed in structured data`);
  }
  const type = record["@type"];
  const types = Array.isArray(type) ? type : type ? [type] : [];
  for (const name of types) {
    if (typeof name !== "string" || !KNOWN_TYPES.has(name)) {
      throw new Error(`Unknown schema.org type ${String(name)} at ${path}`);
    }
    for (const field of REQUIRED[name] ?? []) {
      if (record[field] == null || record[field] === "") {
        throw new Error(`${name} at ${path} is missing ${field}`);
      }
    }
  }
  for (const [key, child] of Object.entries(record)) {
    if (key === "@context" || key === "@type") continue;
    walkJsonLd(child, `${path}.${key}`);
  }
}

function tag(merged: ReturnType<typeof mergeHeads>, attribute: string) {
  const found = merged.tags.find((item) => {
    const named = content(item, "name") ?? content(item, "property");
    return named?.key === attribute;
  });
  const named = found ? (content(found, "name") ?? content(found, "property")) : undefined;
  return named?.content;
}

function expectShareTags(
  merged: ReturnType<typeof mergeHeads>,
  path: string,
  options?: { image?: string; type?: string },
) {
  const url = canonicalUrl(path);
  expect(merged.title).toBeTruthy();
  expect(tag(merged, "description")).toBeTruthy();
  expect(tag(merged, "og:title")).toBeTruthy();
  expect(tag(merged, "og:description")).toBe(tag(merged, "description"));
  expect(tag(merged, "og:url")).toBe(url);
  expect(tag(merged, "og:site_name")).toBe("GSWAU");
  expect(tag(merged, "og:type")).toBe(options?.type ?? "website");
  expect(tag(merged, "og:image")).toBe(options?.image ?? defaultShareImage());
  expect(tag(merged, "twitter:card")).toBe("summary_large_image");
  expect(tag(merged, "twitter:site")).toBe(twitterSite);
  expect(tag(merged, "twitter:title")).toBe(tag(merged, "og:title"));
  expect(tag(merged, "twitter:description")).toBe(tag(merged, "description"));
  expect(tag(merged, "twitter:image")).toBe(tag(merged, "og:image"));
  const canonical = merged.links.filter((link) => link.rel === "canonical");
  expect(canonical).toEqual([{ rel: "canonical", href: url }]);
  if (!options?.image) {
    expect(tag(merged, "og:image:width")).toBe(String(SHARE_IMAGE_WIDTH));
    expect(tag(merged, "og:image:height")).toBe(String(SHARE_IMAGE_HEIGHT));
  } else {
    expect(tag(merged, "og:image:width")).toBeUndefined();
    expect(tag(merged, "og:image:height")).toBeUndefined();
  }
  for (const script of merged.scripts) assertJsonLd(script);
}

const rootHead = renderHead(RootRoute.options.head as HeadFn, {
  loaderData: { origin: "https://gswau.com" },
});

describe("Share image", () => {
  it("is a 1200x630 PNG and the logo mark is 512x512", () => {
    expect(pngSize("public/og-image.png")).toEqual({
      width: SHARE_IMAGE_WIDTH,
      height: SHARE_IMAGE_HEIGHT,
    });
    expect(pngSize("public/icon-512.png")).toEqual({ width: 512, height: 512 });
    expect(defaultShareImage()).toBe("https://gswau.com/og-image.png");
  });
});

describe("Structured data facts", () => {
  it("describes the organization from the footer profiles and the about page", () => {
    const organization = organizationNode();
    expect(organization.name).toBe("GSWAU");
    expect(organization.alternateName).toContain("GSW Augustin University");
    expect(organization.url).toBe("https://gswau.com/");
    expect(organization.sameAs).toEqual(socialProfiles.map((profile) => profile.url));
    expect(organization.email).toBe("gswauniversity@gmail.com");
    expect(organization.telephone).toBe("+19174103384");
    assertJsonLd({ "@context": "https://schema.org", "@graph": [organization] });
  });

  it("prices membership only at the amounts the pricing page shows", () => {
    const merged = mergeHeads([rootHead, renderHead(PricingRoute.options.head as HeadFn)]);
    expectShareTags(merged, "/pricing");
    const product = findNodes(merged.scripts, "Product")[0] as {
      offers: { name: string; price: number; priceCurrency: string }[];
    };
    expect(product.offers.map((offer) => [offer.name, offer.price, offer.priceCurrency])).toEqual([
      ["Monthly", 19.99, "USD"],
      ["Annual", 199, "USD"],
    ]);
    expect(JSON.stringify(product)).not.toContain("gumroad");
  });

  it("keeps the FAQ answers that are already on the page", () => {
    const answers = faqPlainEntries();
    expect(answers.map((entry) => entry.question)).toContain("What is GSWAU?");
    expect(answers.map((entry) => entry.answer)).toEqual([
      "GSWAU is an education platform for barbers and hairstylists. It offers audiobooks, courses, the Clippers and Shears Podcast, and a weekly newsletter.",
      "Members can listen to every audiobook and take the courses included with membership. You can choose to pay $19.99 a month or $199 a year. See Pricing for details.",
      "Purchases and memberships are paid securely through Gumroad, our payment provider. GSWAU never sees or stores your card details.",
      "Create an account on this site with the same email address you used at checkout. Your purchases and membership then appear in My library. If you already have an account, sign in with that email.",
      "Yes. Sign up with the email address you used on Gumroad and your earlier purchases will be in My library.",
      "Use the “Manage membership” link in your Gumroad receipt email, or the link in My library. You keep access until the end of the period you have already paid for.",
      "Please see our Refund Policy.",
      "Yes. Many audiobooks have a free preview, and the podcast and newsletter are free for everyone.",
      "No. Your account and purchases are for your own personal use. Please do not share, resell or upload the audiobooks or courses anywhere else.",
      "Use “Forgot password?” on the sign-in page and we will email you a link to set a new one.",
      "Every newsletter email has an unsubscribe link at the bottom.",
      "Contact us: call 917-410-3384 or email gswauniversity@gmail.com.",
    ]);
    const merged = mergeHeads([rootHead, renderHead(FaqRoute.options.head as HeadFn)]);
    expectShareTags(merged, "/faq");
    expect(findNodes(merged.scripts, "FAQPage")).toHaveLength(1);
  });

  it("adds a course only for a course, and skips a price the page does not show", () => {
    const included = courseNode({
      slug: "shop-basics",
      title: "Shop Basics",
      description: "A short course for the chair.",
      accessTier: "members",
      priceCents: 0,
      modules: [{ id: "m1", title: "Open the shop", position: 1 }],
      lessons: [{ moduleId: "m1", title: "The floor" }],
    });
    expect(included.offers).toBeUndefined();
    expect(included.syllabusSections).toEqual([
      { "@type": "Syllabus", name: "Open the shop", position: 1, description: "The floor" },
    ]);

    const sold = courseNode({
      slug: "shop-launch",
      title: "Shop Launch",
      description: "A separate course.",
      accessTier: "premium",
      priceCents: 4999,
    });
    expect(sold.offers).toMatchObject({ "@type": "Offer", price: 49.99, priceCurrency: "USD" });
    assertJsonLd({ "@context": "https://schema.org", "@graph": [included, sold] });
  });
});

describe("Public pages", () => {
  const pages: { path: string; head: HeadFn; ctx?: object; type?: string; image?: string }[] = [
    { path: "/", head: HomeRoute.options.head as HeadFn },
    { path: "/programs", head: ProgramsRoute.options.head as HeadFn },
    { path: "/pricing", head: PricingRoute.options.head as HeadFn },
    { path: "/calculator", head: CalculatorRoute.options.head as HeadFn },
    { path: "/podcast", head: PodcastIndexRoute.options.head as HeadFn },
    {
      path: `/podcast/${raiseYourPricesArticle.slug}`,
      head: PodcastRoute.options.head as HeadFn,
      ctx: { loaderData: raiseYourPricesArticle },
      type: "article",
    },
    { path: "/courses", head: CoursesRoute.options.head as HeadFn, ctx: { loaderData: [] } },
    { path: "/library", head: LibraryIndexRoute.options.head as HeadFn },
    { path: "/blog", head: BlogIndexRoute.options.head as HeadFn },
    { path: "/about", head: AboutRoute.options.head as HeadFn },
    { path: "/faq", head: FaqRoute.options.head as HeadFn },
    { path: "/contact", head: ContactRoute.options.head as HeadFn },
    { path: "/auth", head: AuthRoute.options.head as HeadFn },
    { path: "/privacy", head: PrivacyRoute.options.head as HeadFn },
    { path: "/terms", head: TermsRoute.options.head as HeadFn },
    { path: "/refunds", head: RefundsRoute.options.head as HeadFn },
  ];

  it.each(pages)(
    "$path has Open Graph, Twitter, and canonical tags",
    ({ path, head, ctx, type }) => {
      const merged = mergeHeads([rootHead, renderHead(head, ctx)]);
      expectShareTags(merged, path, type ? { type } : {});
      expect(JSON.stringify(merged.scripts)).not.toContain("www.gswau.com");
    },
  );

  it("uses a blog cover and a library cover when they are https URLs", () => {
    const cover = "https://cdn.example.com/cover.jpg";
    const blog = mergeHeads([
      rootHead,
      renderHead(BlogRoute.options.head as HeadFn, {
        loaderData: {
          slug: "raise-prices",
          title: "Raise your prices",
          excerpt: "A note on pricing.",
          cover_image_url: cover,
          published_at: "2026-11-01T00:00:00.000Z",
          updated_at: "2026-11-02T00:00:00.000Z",
          body: "Hello",
        },
      }),
    ]);
    expectShareTags(blog, "/blog/raise-prices", { type: "article", image: cover });
    const posting = findNodes(blog.scripts, "BlogPosting")[0] as { image?: string[] };
    expect(posting.image).toEqual([cover]);
    expect(findNodes(blog.scripts, "Article").length).toBeGreaterThan(0);

    const book = mergeHeads([
      rootHead,
      renderHead(LibraryRoute.options.head as HeadFn, {
        loaderData: productFixture({ type: "ebook", cover: cover }),
      }),
    ]);
    expectShareTags(book, "/library/sample-book", { type: "product", image: cover });
    expect(findNodes(book.scripts, "Course")).toHaveLength(0);

    const course = mergeHeads([
      rootHead,
      renderHead(LibraryRoute.options.head as HeadFn, {
        loaderData: productFixture({ type: "course", cover: "not-a-url" }),
      }),
    ]);
    expectShareTags(course, "/library/sample-book", { type: "product" });
    expect(findNodes(course.scripts, "Course")).toHaveLength(1);
  });

  it("describes the podcast series and the episode page", () => {
    const index = mergeHeads([
      rootHead,
      renderHead(PodcastIndexRoute.options.head as HeadFn, {
        loaderData: [
          {
            id: "ep1",
            title: "Raise Your Prices Without Losing Your Chair",
            description: "What a cheap price says.",
            publishedAt: "2026-11-03T00:00:00.000Z",
            durationLabel: "24 min",
            audioUrl: raiseYourPricesArticle.spotifyUrl,
            image: null,
          },
        ],
      }),
    ]);
    const series = findNodes(index.scripts, "PodcastSeries")[0] as {
      episode: { url: string }[];
    };
    expect(series.episode[0]?.url).toBe(
      "https://gswau.com/podcast/raise-your-prices-without-losing-your-chair",
    );

    const episode = mergeHeads([
      rootHead,
      renderHead(PodcastRoute.options.head as HeadFn, { loaderData: raiseYourPricesArticle }),
    ]);
    expect(findNodes(episode.scripts, "PodcastEpisode").length).toBeGreaterThan(0);
    expect(findNodes(episode.scripts, "BreadcrumbList")).toHaveLength(1);
  });
});

function findNodes(scripts: unknown[], type: string) {
  const found: Record<string, unknown>[] = [];
  const visit = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (!value || typeof value !== "object") return;
    const record = value as Record<string, unknown>;
    const types = Array.isArray(record["@type"]) ? record["@type"] : [record["@type"]];
    if (types.includes(type)) found.push(record);
    for (const child of Object.values(record)) visit(child);
  };
  scripts.forEach(visit);
  return found;
}

function productFixture(input: { type: "ebook" | "course"; cover: string }) {
  return {
    product: {
      slug: "sample-book",
      type: input.type,
      title: "Sample Book",
      description: "A practical book for barbers.",
      gallery_urls: [input.cover],
      cover_image_url: null,
      access_tier: "members",
      price_cents: 0,
    },
    modules: input.type === "course" ? [{ id: "m1", title: "First module", position: 1 }] : [],
    outline: input.type === "course" ? [{ module_id: "m1", title: "Lesson one" }] : [],
  };
}

function pngSize(path: string) {
  const bytes = readFileSync(path);
  expect(bytes.subarray(12, 16).toString("ascii")).toBe("IHDR");
  return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
}
