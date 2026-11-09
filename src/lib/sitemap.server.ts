import { publicClient } from "@/lib/public-client.server";
import { isPublicSlug } from "@/lib/sitemap";

// Published library titles and blog posts. A catalog outage still leaves the static pages.
export async function publishedContentPaths(): Promise<string[]> {
  try {
    const sb = publicClient();
    const [products, posts] = await Promise.all([
      sb.from("products").select("slug").eq("is_published", true),
      sb.from("blog_posts").select("slug").eq("is_published", true),
    ]);
    const paths: string[] = [];
    for (const row of products.data ?? []) {
      if (row.slug && isPublicSlug(row.slug)) paths.push(`/library/${row.slug}`);
    }
    for (const row of posts.data ?? []) {
      if (row.slug && isPublicSlug(row.slug)) paths.push(`/blog/${row.slug}`);
    }
    return paths;
  } catch (err) {
    console.error("[sitemap]", err);
    return [];
  }
}
