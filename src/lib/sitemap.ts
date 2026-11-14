import { SITE_ORIGIN } from "@/lib/site";

// Pages a visitor can open without signing in. Redirects, account pages, and the API are omitted.
export const publicPaths = [
  "/",
  "/programs",
  "/pricing",
  "/calculator",
  "/podcast",
  "/library",
  "/courses",
  "/blog",
  "/about",
  "/faq",
  "/contact",
  "/auth",
  "/privacy",
  "/terms",
  "/refunds",
] as const;

export function isPublicSlug(slug: string) {
  return /^[A-Za-z0-9][A-Za-z0-9_-]{0,180}$/.test(slug);
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function sitemapXml(paths: readonly string[], origin = SITE_ORIGIN) {
  const urls = paths.map((path) => {
    const loc = path === "/" ? `${origin}/` : `${origin}${path}`;
    return `  <url>\n    <loc>${escapeXml(loc)}</loc>\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}
