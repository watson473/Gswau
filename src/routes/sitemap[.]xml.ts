import { createFileRoute } from "@tanstack/react-router";

// TanStack Start serves this file route at /sitemap.xml. The brackets keep the dot literal.
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const { publicPaths, sitemapXml } = await import("@/lib/sitemap");
        const { publishedContentPaths } = await import("@/lib/sitemap.server");
        const xml = sitemapXml([...publicPaths, ...(await publishedContentPaths())]);
        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
