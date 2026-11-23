// Display fixes for catalogue text, dates, and image URLs. Prices and product
// rows still come from the database; this only corrects how they are shown.

const titleBySlug: Record<string, string> = {
  "its-more-than-just-a-haircut-use-product-selling-principles":
    "It's More Than Just a Haircut: Use Product-Selling Principles",
  "profits-beyond-the-chair": "Profits Beyond the Chair",
  "the-barbers-toolkit": "The Barber's Toolkit",
};

// The five books named on the Gumroad bundle page (Gumroad code tvmee).
// Used only when the bundle has no rows in bundle_items.
export const bundleBookSlugs = [
  "booked-and-busy",
  "from-posts-to-profits",
  "before-the-cut",
  "cutting-edge-leadership",
  "cut-and-go",
] as const;

export const bundleSlug = "gswau-barber-success-bundle";

export function displayTitle(slug: string, title: string) {
  const named = titleBySlug[slug] ?? title;
  return named
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

type FormatSource = {
  type: string;
  is_free?: boolean;
  access_tier?: string;
  audio_path?: string | null;
  length_label?: string | null;
};

// A free PDF chapter is not an audiobook. Anything with audio stays an audiobook.
export function formatKey(product: FormatSource) {
  const free = product.is_free === true || product.access_tier === "free";
  const pages = !!product.length_label && /page/i.test(product.length_label);
  const pdf =
    free &&
    product.type !== "course" &&
    product.type !== "bundle" &&
    (pages || !product.audio_path);
  if (pdf) return "format.chapter";
  return `format.${product.type}`;
}

// Keep a meta description on a word boundary instead of slicing mid-word.
export function metaDescription(text: string, max = 155) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const slice = clean.slice(0, max);
  const space = slice.lastIndexOf(" ");
  // A space in the slice is a word boundary. A single word longer than the limit is cut as-is.
  const cut = (space >= 0 ? slice.slice(0, space) : slice).replace(/[,:;.!?—–-]+$/u, "");
  return cut;
}

// "28 Oct 2026", so the day and the month cannot be swapped.
export function formatPostDate(iso: string | null | undefined) {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

const SUPABASE_OBJECT = "/storage/v1/object/public/";
const SUPABASE_RENDER = "/storage/v1/render/image/public/";

// Supabase image transforms, or a smaller Unsplash URL. Other hosts are unchanged.
// Pass a height too for a cropped box: with a width alone Supabase keeps the full height.
export function imageSrc(url: string, width: number, height?: number) {
  if (url.includes("images.unsplash.com")) {
    const parsed = new URL(url);
    parsed.searchParams.set("auto", "format");
    parsed.searchParams.set("fit", "crop");
    parsed.searchParams.set("q", "60");
    parsed.searchParams.set("w", String(width));
    return parsed.toString();
  }
  const marker = url.indexOf(SUPABASE_OBJECT);
  if (marker === -1) return url;
  const [base] = url.split("?");
  if (!base) return url;
  const rendered = base.replace(SUPABASE_OBJECT, SUPABASE_RENDER);
  const params = new URLSearchParams();
  params.set("width", String(width));
  if (height) params.set("height", String(height));
  params.set("quality", "60");
  params.set("resize", "cover");
  return `${rendered}?${params.toString()}`;
}

export type LinkPhrase = { phrase: string; slug: string };

export function productLinkPhrases(
  products: { slug: string; title: string; type: string }[],
): LinkPhrase[] {
  const books = products.filter((product) => product.type !== "course");
  const phrases: LinkPhrase[] = books.map((product) => ({
    phrase: product.title,
    slug: product.slug,
  }));
  const haircut = books.find(
    (product) => product.slug === "its-more-than-just-a-haircut-use-product-selling-principles",
  );
  if (haircut) phrases.push({ phrase: "It's More Than Just a Haircut", slug: haircut.slug });
  return phrases;
}

export type TextPart = { text: string; slug?: string };

function findPhrase(text: string, phrase: string) {
  const haystack = text.toLowerCase();
  const needle = phrase.toLowerCase();
  let from = 0;
  while (from < haystack.length) {
    const index = haystack.indexOf(needle, from);
    if (index === -1) return -1;
    const before = index === 0 ? "" : (text[index - 1] ?? "");
    const after = text[index + phrase.length] ?? "";
    if (!/[A-Za-z0-9]/.test(before) && !/[A-Za-z0-9]/.test(after)) return index;
    from = index + 1;
  }
  return -1;
}

// Split plain text so known book titles can become links. The original wording stays.
export function splitByPhrases(text: string, phrases: LinkPhrase[]): TextPart[] {
  const parts: TextPart[] = [];
  let rest = text;
  while (rest.length > 0) {
    let best: { index: number; length: number; slug: string } | null = null;
    for (const phrase of phrases) {
      if (!phrase.phrase) continue;
      const index = findPhrase(rest, phrase.phrase);
      if (index === -1) continue;
      const length = phrase.phrase.length;
      if (!best || index < best.index || (index === best.index && length > best.length)) {
        best = { index, length, slug: phrase.slug };
      }
    }
    if (!best) {
      parts.push({ text: rest });
      break;
    }
    if (best.index > 0) parts.push({ text: rest.slice(0, best.index) });
    parts.push({ text: rest.slice(best.index, best.index + best.length), slug: best.slug });
    rest = rest.slice(best.index + best.length);
  }
  return parts;
}
