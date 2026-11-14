import type { JSX } from "react";
import { createTranslator, defaultLocale } from "@/i18n";
import { author, formatMoney, membershipPrices } from "@/lib/catalog";
import { articleForEpisode } from "@/lib/podcast-articles";
import { podcastName, podcastRssUrl, spotifyShowUrl, type PodcastEpisode } from "@/lib/podcast";
import { SITE_ORIGIN, contact } from "@/lib/site";

// Share tags and JSON-LD. Canonical URLs always use https://gswau.com. The default
// share image can follow the request host so a preview deploy still has a picture.
const t = createTranslator(defaultLocale);

export const SITE_NAME = "GSWAU";
export const ORGANIZATION_NAME = "GSW Augustin University";
export const SHARE_IMAGE_PATH = "/og-image.png";
export const LOGO_PATH = "/icon-512.png";
export const SHARE_IMAGE_WIDTH = 1200;
export const SHARE_IMAGE_HEIGHT = 630;
export const LOGO_SIZE = 512;

export const organizationId = `${SITE_ORIGIN}/#organization`;
export const websiteId = `${SITE_ORIGIN}/#website`;

// Footer profiles. sameAs is built from this list so it cannot drift from the icons.
export const socialProfiles = [
  { name: "instagram", label: "Instagram", url: "https://www.instagram.com/gswau_" },
  {
    name: "facebook",
    label: "Facebook",
    url: "https://www.facebook.com/profile.php?id=61580415614670",
  },
  { name: "youtube", label: "YouTube", url: "https://www.youtube.com/@gswau" },
  { name: "tiktok", label: "TikTok", url: "https://www.tiktok.com/@gswau" },
  { name: "linkedin", label: "LinkedIn", url: "https://www.linkedin.com/in/gswau-71b5ba384" },
  { name: "threads", label: "Threads", url: "https://www.threads.com/@gswau_" },
  { name: "x", label: "X", url: "https://x.com/gswau_" },
] as const;

export const twitterSite = "@gswau_";

type ExtraMeta = { name: string; content: string } | { property: string; content: string };

// A concrete @graph document. Cast only at the script tag so TanStack's meta type accepts it
// without widening every builder to an index signature.
function jsonLdScript(doc: object) {
  return {
    "script:ld+json": doc as {
      "@context": "https://schema.org";
      "@graph": Array<{ "@type": string | string[] }>;
    },
  };
}

export function canonicalUrl(path: string) {
  if (path === "/" || path === "") return `${SITE_ORIGIN}/`;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_ORIGIN}${normalized.split("?")[0]}`;
}

export function absoluteHttpsImage(url: string | null | undefined) {
  if (!url || !url.startsWith("https://") || /\s/.test(url)) return null;
  return url;
}

export function defaultShareImage(origin = SITE_ORIGIN) {
  return `${origin.replace(/\/$/, "")}${SHARE_IMAGE_PATH}`;
}

export function originFromMatches(
  matches: readonly { routeId?: string; loaderData?: unknown }[] | undefined,
) {
  const data = matches?.find((match) => match.routeId === "__root__")?.loaderData;
  if (!data || typeof data !== "object" || !("origin" in data)) return SITE_ORIGIN;
  const origin = (data as { origin?: unknown }).origin;
  return typeof origin === "string" && /^https?:\/\/[^/]+$/.test(origin) ? origin : SITE_ORIGIN;
}

export function shareMeta(input: {
  title: string;
  description: string;
  path: string;
  socialTitle?: string;
  type?: "website" | "article" | "product";
  image?: string | null;
  imageAlt?: string;
  assetOrigin?: string;
  /** Root head omits these so a cover image is not labeled 1200×630. */
  dimensions?: boolean;
  canonical?: boolean;
  extraMeta?: ExtraMeta[] | undefined;
  jsonLd?: object | object[];
}) {
  const url = canonicalUrl(input.path);
  const customImage = absoluteHttpsImage(input.image);
  const image = customImage ?? defaultShareImage(input.assetOrigin);
  const socialTitle = input.socialTitle ?? input.title;
  const alt = input.imageAlt ?? (customImage ? socialTitle : "GSWAU gold logo");
  const docs =
    input.jsonLd == null ? [] : Array.isArray(input.jsonLd) ? input.jsonLd : [input.jsonLd];
  return {
    meta: [
      { title: input.title },
      { name: "description", content: input.description },
      { property: "og:title", content: socialTitle },
      { property: "og:description", content: input.description },
      { property: "og:url", content: url },
      { property: "og:site_name", content: SITE_NAME },
      { property: "og:type", content: input.type ?? "website" },
      { property: "og:image", content: image },
      { property: "og:image:alt", content: alt },
      ...(!customImage && input.dimensions !== false
        ? [
            { property: "og:image:width", content: String(SHARE_IMAGE_WIDTH) },
            { property: "og:image:height", content: String(SHARE_IMAGE_HEIGHT) },
          ]
        : []),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: twitterSite },
      { name: "twitter:title", content: socialTitle },
      { name: "twitter:description", content: input.description },
      { name: "twitter:image", content: image },
      { name: "twitter:image:alt", content: alt },
      ...(input.extraMeta ?? []),
      ...docs.map((doc) => jsonLdScript(doc)),
    ] as Array<JSX.IntrinsicElements["meta"]>,
    links: input.canonical === false ? [] : [{ rel: "canonical" as const, href: url }],
  };
}

// Company pages share one title pattern. `path` is the canonical path on gswau.com.
export function pageMeta(title: string, description: string, path: string) {
  return shareMeta({
    title: `${title} — GSWAU`,
    description,
    path,
    jsonLd: jsonLdGraph(
      breadcrumbList([
        { name: "Home", path: "/" },
        { name: title, path },
      ]),
    ),
  });
}

export function jsonLdGraph(...nodes: object[]) {
  return { "@context": "https://schema.org" as const, "@graph": nodes };
}

export function breadcrumbList(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function faqPage(entries: { question: string; answer: string }[], path: string) {
  return {
    "@type": "FAQPage",
    "@id": `${canonicalUrl(path)}#faq`,
    url: canonicalUrl(path),
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: { "@type": "Answer", text: entry.answer },
    })),
  };
}

const logoObject = {
  "@type": "ImageObject",
  url: `${SITE_ORIGIN}${LOGO_PATH}`,
  width: LOGO_SIZE,
  height: LOGO_SIZE,
};

const shareImageObject = {
  "@type": "ImageObject",
  url: `${SITE_ORIGIN}${SHARE_IMAGE_PATH}`,
  width: SHARE_IMAGE_WIDTH,
  height: SHARE_IMAGE_HEIGHT,
};

export function organizationNode() {
  return {
    "@type": "Organization",
    "@id": organizationId,
    name: SITE_NAME,
    alternateName: [ORGANIZATION_NAME, "GSW Augustin University (GSWAU)"],
    url: `${SITE_ORIGIN}/`,
    description: `GSWAU, short for ${ORGANIZATION_NAME}, is the education platform for barbers and hairstylists worldwide, created by ${author.name}.`,
    logo: logoObject,
    image: shareImageObject,
    email: contact.email,
    telephone: "+19174103384",
    sameAs: socialProfiles.map((profile) => profile.url),
  };
}

export function websiteNode() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    name: SITE_NAME,
    alternateName: ORGANIZATION_NAME,
    url: `${SITE_ORIGIN}/`,
    description: "Business education for barbers and stylists.",
    inLanguage: "en",
    publisher: { "@id": organizationId },
  };
}

export function siteJsonLd() {
  return jsonLdGraph(organizationNode(), websiteNode());
}

function offer(name: string, price: number, unitCode: "MON" | "ANN", description: string) {
  return {
    "@type": "Offer",
    name,
    price,
    priceCurrency: "USD",
    url: canonicalUrl("/pricing"),
    description,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price,
      priceCurrency: "USD",
      referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode },
    },
  };
}

export function membershipProductNode() {
  const monthly = membershipPrices.monthly;
  const annual = membershipPrices.annual;
  return {
    "@type": "Product",
    "@id": `${canonicalUrl("/pricing")}#membership`,
    name: "GSWAU membership",
    description: t("pricing.meta.description"),
    url: canonicalUrl("/pricing"),
    image: `${SITE_ORIGIN}${SHARE_IMAGE_PATH}`,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: [
      offer(t("pricing.monthly"), monthly, "MON", t("pricing.monthlyNote")),
      offer(
        t("pricing.annual"),
        annual,
        "ANN",
        t("pricing.annualNote", { monthly: formatMoney(annual / 12) }),
      ),
    ],
  };
}

export function pricingJsonLd() {
  return jsonLdGraph(
    breadcrumbList([
      { name: "Home", path: "/" },
      { name: "Pricing", path: "/pricing" },
    ]),
    membershipProductNode(),
    faqPage(
      [1, 2, 3, 4].map((n) => ({
        question: t(`pricing.faq.q${n}`),
        answer: t(`pricing.faq.a${n}`),
      })),
      "/pricing",
    ),
  );
}

export function aboutPageNode() {
  return {
    "@type": "AboutPage",
    "@id": canonicalUrl("/about"),
    url: canonicalUrl("/about"),
    name: "About GSWAU",
    description:
      "GSWAU is the education platform for barbers and hairstylists worldwide, created by Gs. W. Augustin.",
    isPartOf: { "@id": websiteId },
    mainEntity: { "@id": organizationId },
  };
}

export function contactPageNode() {
  return {
    "@type": "ContactPage",
    "@id": canonicalUrl("/contact"),
    url: canonicalUrl("/contact"),
    name: "Contact Us",
    description: "Call, email or send GSWAU a message. We read every message.",
    isPartOf: { "@id": websiteId },
    mainEntity: { "@id": organizationId },
  };
}

const publisher = {
  "@type": "Organization" as const,
  "@id": organizationId,
  name: SITE_NAME,
  url: `${SITE_ORIGIN}/`,
  logo: logoObject,
};

export type CourseShareInput = {
  slug: string;
  title: string;
  description: string;
  coverImage?: string | null;
  accessTier: string;
  priceCents: number;
  modules?: { id: string; title: string; position: number }[];
  lessons?: { moduleId: string; title: string }[];
};

export function courseNode(input: CourseShareInput) {
  const url = canonicalUrl(`/library/${input.slug}`);
  const description = input.description.replace(/\s+/g, " ").trim() || input.title;
  const image = absoluteHttpsImage(input.coverImage);
  const modules = [...(input.modules ?? [])].sort((a, b) => a.position - b.position);
  const syllabusSections = modules.map((module, index) => {
    const lessons = (input.lessons ?? []).filter((lesson) => lesson.moduleId === module.id);
    return {
      "@type": "Syllabus" as const,
      name: module.title,
      position: index + 1,
      ...(lessons.length ? { description: lessons.map((lesson) => lesson.title).join(", ") } : {}),
    };
  });
  const membersOnly = input.accessTier === "members" && input.priceCents === 0;
  return {
    "@type": "Course" as const,
    "@id": `${url}#course`,
    name: input.title,
    description,
    url,
    provider: { "@id": organizationId },
    instructor: { "@type": "Person" as const, name: author.name },
    inLanguage: "en",
    hasCourseInstance: { "@type": "CourseInstance" as const, courseMode: "online" },
    ...(image ? { image } : {}),
    ...(syllabusSections.length ? { syllabusSections } : {}),
    ...(membersOnly
      ? {}
      : {
          offers: {
            "@type": "Offer" as const,
            price: input.priceCents > 0 ? input.priceCents / 100 : 0,
            priceCurrency: "USD",
            url,
          },
        }),
  };
}

export function blogPostingNode(post: {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt?: string | null;
  updatedAt?: string | null;
  image?: string | null;
}) {
  const url = canonicalUrl(`/blog/${post.slug}`);
  const image = absoluteHttpsImage(post.image);
  return {
    "@type": ["BlogPosting", "Article"] as const,
    "@id": `${url}#article`,
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: { "@type": "WebPage" as const, "@id": url },
    inLanguage: "en",
    author: { "@type": "Person" as const, name: author.name },
    publisher,
    ...(image ? { image: [image] } : {}),
    ...(post.publishedAt ? { datePublished: post.publishedAt } : {}),
    ...(post.updatedAt ? { dateModified: post.updatedAt } : {}),
  };
}

export function blogIndexNode() {
  return {
    "@type": "Blog",
    "@id": `${canonicalUrl("/blog")}#blog`,
    name: "Blog",
    description: "Articles from Gs. W. Augustin on growing a barber or beauty business.",
    url: canonicalUrl("/blog"),
    publisher: { "@id": organizationId },
    inLanguage: "en",
  };
}

function podcastEpisodeNode(episode: PodcastEpisode) {
  const title = episode.title.trim();
  if (!title) return null;
  const article = articleForEpisode(episode);
  const pageUrl = article ? canonicalUrl(`/podcast/${article.slug}`) : null;
  const audio = episode.audioUrl.startsWith("https://") ? episode.audioUrl : null;
  if (!pageUrl && !audio) return null;
  const description = episode.description.replace(/\s+/g, " ").trim();
  const image = absoluteHttpsImage(episode.image);
  return {
    "@type": "PodcastEpisode" as const,
    name: title,
    url: pageUrl ?? audio,
    partOfSeries: { "@id": `${canonicalUrl("/podcast")}#series` },
    ...(audio ? { associatedMedia: { "@type": "AudioObject" as const, contentUrl: audio } } : {}),
    ...(episode.publishedAt ? { datePublished: episode.publishedAt } : {}),
    ...(description ? { description: description.slice(0, 500) } : {}),
    ...(image ? { image } : {}),
    ...(pageUrl && audio && audio !== pageUrl ? { sameAs: audio } : {}),
  };
}

export function podcastSeriesNode(episodes: PodcastEpisode[] = []) {
  const episode = episodes.flatMap((item) => {
    const node = podcastEpisodeNode(item);
    return node ? [node] : [];
  });
  return {
    "@type": "PodcastSeries" as const,
    "@id": `${canonicalUrl("/podcast")}#series`,
    name: podcastName,
    url: canonicalUrl("/podcast"),
    description:
      "The podcast for barbers and hairstylists from Gs. W. Augustin: building wealth behind the chair, the craft itself, and the science of hair.",
    webFeed: podcastRssUrl,
    sameAs: spotifyShowUrl,
    image: `${SITE_ORIGIN}${SHARE_IMAGE_PATH}`,
    inLanguage: "en",
    author: { "@type": "Person" as const, name: author.name },
    publisher: { "@id": organizationId },
    ...(episode.length ? { episode } : {}),
  };
}

export function podcastIndexJsonLd(episodes: PodcastEpisode[] = []) {
  return jsonLdGraph(
    breadcrumbList([
      { name: "Home", path: "/" },
      { name: "Podcast", path: "/podcast" },
    ]),
    podcastSeriesNode(episodes),
  );
}
