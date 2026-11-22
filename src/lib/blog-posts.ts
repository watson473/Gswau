import episodeBody from "@/content/blog/clippers-and-shears-ep-1-your-price-is-a-message.md?raw";
import priceBody from "@/content/blog/how-to-price-a-haircut.md?raw";
import consultBody from "@/content/blog/how-to-talk-to-barber-clients.md?raw";
import taperBody from "@/content/blog/taper-vs-fade.md?raw";
import { faqsFromMarkdown } from "@/lib/blog-markdown";
import { isPublicSlug } from "@/lib/sitemap";

// Published from the repo so a preview can render them without writing the live
// blog_posts table. A row that already exists for the same slug always wins.
export const LEAD_POST_SLUG = "clippers-and-shears-ep-1-your-price-is-a-message";

const publishedDay = "2026-11-22";

export type BlogFaq = { question: string; answer: string };

export type CodeBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_image_url: null;
  is_published: true;
  published_at: string;
  created_at: string;
  updated_at: string;
  body_format: "markdown";
  kicker: string;
  faqs: BlogFaq[];
};

function post(input: {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  kicker: string;
  hour: string;
}): CodeBlogPost {
  const published_at = `${publishedDay}T${input.hour}:00:00.000Z`;
  return {
    id: `code-${input.slug}`,
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    body: input.body.trim(),
    cover_image_url: null,
    is_published: true,
    published_at,
    created_at: published_at,
    updated_at: published_at,
    body_format: "markdown",
    kicker: input.kicker,
    faqs: faqsFromMarkdown(input.body),
  };
}

export const codeBlogPosts: CodeBlogPost[] = [
  post({
    slug: LEAD_POST_SLUG,
    title: "Your Price Is a Message",
    excerpt:
      "What a cheap price tells clients before the clippers turn on, why raising it feels like jumping off a roof, and the floor math to do tonight. From Clippers and Shears, Episode 1.",
    kicker: "Clippers and Shears Podcast, Episode 1",
    hour: "23",
    body: episodeBody,
  }),
  post({
    slug: "how-to-price-a-haircut",
    title: "How to Price a Haircut (and a Fade): Find Your Floor First",
    excerpt:
      "Price from the floor up. The one calculation that sets your lowest number, why a fade uses the same math, how to say the price so it lands, and the three numbers to watch.",
    kicker: "Clippers and Shears Podcast, Episode 1, plus GSWAU short lessons",
    hour: "22",
    body: priceBody,
  }),
  post({
    slug: "how-to-talk-to-barber-clients",
    title: "How to Talk to Barber Clients: The Consult Before the Clippers",
    excerpt:
      "Six short GSWAU lessons on the consult, in order: greet, let them finish, say it back, drop the three phrases that lose clients, read talk or quiet, and leave the quiet alone.",
    kicker: "GSWAU short lessons",
    hour: "21",
    body: consultBody,
  }),
  post({
    slug: "taper-vs-fade",
    title: "Taper vs Fade, in Plain Words",
    excerpt:
      "What clients mean by a taper and a fade, then the GSWAU skin-fade blend in five steps and the lineup lesson that keeps the hairline natural.",
    kicker: "GSWAU short lessons",
    hour: "20",
    body: taperBody,
  }),
];

const bySlug = new Map(codeBlogPosts.map((post) => [post.slug, post]));

export function codePostBySlug(slug: string) {
  return bySlug.get(slug) ?? null;
}

export const codeBlogSlugs = codeBlogPosts.map((post) => post.slug);

type ListedPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string | null;
  published_at: string | null;
};

export type MergedPost = ListedPost & { kicker?: string };

// Lead post first, then newest published_at. Database rows are never replaced.
export function mergePublishedPosts(dbPosts: ListedPost[]): MergedPost[] {
  const seen = new Set(dbPosts.map((post) => post.slug));
  const merged: MergedPost[] = [
    ...dbPosts,
    ...codeBlogPosts
      .filter((post) => !seen.has(post.slug))
      .map((post) => ({
        id: post.id,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        cover_image_url: post.cover_image_url,
        published_at: post.published_at,
        kicker: post.kicker,
      })),
  ];
  merged.sort((a, b) => {
    if (a.slug === LEAD_POST_SLUG) return -1;
    if (b.slug === LEAD_POST_SLUG) return 1;
    const at = a.published_at ? Date.parse(a.published_at) : 0;
    const bt = b.published_at ? Date.parse(b.published_at) : 0;
    return bt - at;
  });
  return merged;
}

export function addCodePostPaths(paths: string[]) {
  const next = [...paths];
  for (const slug of codeBlogSlugs) {
    const path = `/blog/${slug}`;
    if (isPublicSlug(slug) && !next.includes(path)) next.push(path);
  }
  return next;
}
