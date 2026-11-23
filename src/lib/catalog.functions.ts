import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { codePostBySlug, upgradedLiveBySlug, type BlogFaq } from "./blog-posts";
import { bundleBookSlugs, bundleSlug, displayTitle } from "./display";
import { onStore } from "./gumroad-store";
import { publicClient } from "./public-client.server";
import type { PodcastEpisode } from "./podcast";

const PRODUCT_COLS =
  "id,slug,type,title,subtitle,description,cover_image_url,gallery_urls,price_cents,is_free,is_featured,access_tier,preview_path,file_size_label,length_label,buy_url,position,audio_path,created_at";

const RATING_COLS = "product_id,review_count,average,stars_1,stars_2,stars_3,stars_4,stars_5";

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("products")
    .select(PRODUCT_COLS)
    .eq("is_published", true)
    .order("position");
  if (error) throw new Error(error.message);
  const { data: ratings } = await publicClient().from("product_ratings").select(RATING_COLS);
  const byProduct = new Map((ratings ?? []).map((r) => [r.product_id, r]));
  return data.map((p) => ({
    ...p,
    title: displayTitle(p.slug, p.title),
    buy_url: onStore(p.buy_url),
    rating_average: byProduct.get(p.id)?.average ?? null,
    review_count: byProduct.get(p.id)?.review_count ?? 0,
  }));
});

// Lessons per published course, for the homepage numbers. Same public outline the course pages show.
export const countCourseLessons = createServerFn({ method: "GET" }).handler(async () => {
  const sb = publicClient();
  const { data: courses, error } = await sb
    .from("products")
    .select("id")
    .eq("is_published", true)
    .eq("type", "course");
  if (error) throw new Error(error.message);
  const outlines = await Promise.all(
    courses.map((c) => sb.rpc("course_outline", { _course: c.id })),
  );
  return outlines.reduce((sum, o) => sum + (o.data?.length ?? 0), 0);
});

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const sb = publicClient();
    const { data: product, error } = await sb
      .from("products")
      .select(PRODUCT_COLS)
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!product) return null;
    const [
      { data: modules },
      { data: outline },
      { data: bundle },
      { data: rating },
      { data: reviews },
    ] = await Promise.all([
      sb.from("modules").select("id,title,position").eq("course_id", product.id).order("position"),
      sb.rpc("course_outline", { _course: product.id }),
      sb
        .from("bundle_items")
        .select(
          "product:products!bundle_items_product_id_fkey(slug,title,cover_image_url,price_cents)",
        )
        .eq("bundle_id", product.id),
      sb.from("product_ratings").select(RATING_COLS).eq("product_id", product.id).maybeSingle(),
      sb
        .from("testimonials")
        .select("id,name,location,quote,rating,created_at")
        .eq("product_id", product.id)
        .eq("is_published", true)
        .order("created_at", { ascending: false }),
    ]);
    let books = (bundle ?? []).map((row) => bundleBook(row.product)).filter((row) => row !== null);
    // The join table is empty for this bundle. The five titles are the ones named on its Gumroad page.
    if (books.length === 0 && product.slug === bundleSlug) {
      const { data: named } = await sb
        .from("products")
        .select("slug,title,cover_image_url,price_cents")
        .in("slug", [...bundleBookSlugs])
        .eq("is_published", true);
      const bySlug = new Map((named ?? []).map((row) => [row.slug, row]));
      books = bundleBookSlugs
        .map((slug) => bySlug.get(slug))
        .filter((row) => row !== undefined)
        .map((row) => bundleBook(row))
        .filter((row) => row !== null);
    }
    return {
      product: {
        ...product,
        title: displayTitle(product.slug, product.title),
        buy_url: onStore(product.buy_url),
      },
      modules: modules ?? [],
      outline: outline ?? [],
      bundle: books,
      rating,
      reviews: reviews ?? [],
    };
  });

function bundleBook(value: unknown) {
  const row = Array.isArray(value) ? value[0] : value;
  if (!row || typeof row !== "object") return null;
  const book = row as {
    slug?: string;
    title?: string;
    cover_image_url?: string | null;
    price_cents?: number | null;
  };
  if (!book.slug || !book.title) return null;
  return {
    slug: book.slug,
    title: displayTitle(book.slug, book.title),
    cover_image_url: book.cover_image_url ?? null,
    price_cents: book.price_cents ?? 0,
  };
}

export const listTestimonials = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("testimonials")
    .select("id,name,location,quote,rating")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6);
  return data ?? [];
});

export const listPosts = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient()
    .from("blog_posts")
    .select("id,slug,title,excerpt,cover_image_url,published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return (data ?? []).map((post) => {
    const upgrade = upgradedLiveBySlug(post.slug);
    return upgrade ? { ...post, cover_image_url: upgrade.cover_image_url } : post;
  });
});

export const getPost = createServerFn({ method: "GET" })
  .inputValidator((d) => z.object({ slug: z.string().min(1).max(200) }).parse(d))
  .handler(async ({ data }) => {
    const { data: post } = await publicClient()
      .from("blog_posts")
      .select("*")
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();
    // A published database row wins, except the booth-rent post upgraded in this repo.
    const upgrade = upgradedLiveBySlug(data.slug);
    if (post && upgrade) {
      return {
        ...post,
        title: upgrade.title,
        excerpt: upgrade.excerpt,
        body: upgrade.body,
        body_format: upgrade.body_format,
        cover_image_url: upgrade.cover_image_url,
        updated_at: upgrade.updated_at,
        faqs: upgrade.faqs,
      };
    }
    if (post) return { ...post, faqs: [] as BlogFaq[] };
    const code = codePostBySlug(data.slug);
    if (code) return code;
    if (!upgrade) return null;
    return {
      id: `code-${upgrade.slug}`,
      slug: upgrade.slug,
      title: upgrade.title,
      excerpt: upgrade.excerpt,
      body: upgrade.body,
      cover_image_url: upgrade.cover_image_url,
      is_published: true as const,
      published_at: "2026-10-28T01:34:26.616Z",
      created_at: "2026-10-28T01:34:26.616Z",
      updated_at: upgrade.updated_at,
      body_format: upgrade.body_format,
      faqs: upgrade.faqs,
    };
  });

// Newest first: from the show's RSS feed, or Admin > Podcast if the feed can't be read.
export const listEpisodes = createServerFn({ method: "GET" }).handler(
  async (): Promise<PodcastEpisode[]> => {
    try {
      const { feedEpisodes } = await import("./podcast-feed.server");
      const fromFeed = await feedEpisodes();
      if (fromFeed.length) return fromFeed;
    } catch (err) {
      console.error("[podcast feed]", err);
    }
    const { data } = await publicClient()
      .from("podcast_episodes")
      .select("id,title,description,audio_url,cover_image_url,duration_label,published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false });
    return (data ?? []).map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      publishedAt: e.published_at,
      durationLabel: e.duration_label,
      audioUrl: e.audio_url,
      image: e.cover_image_url,
    }));
  },
);

function parseFlipbooks(value: string | undefined): Record<string, number> {
  try {
    const parsed: unknown = JSON.parse(value ?? "{}");
    return parsed && typeof parsed === "object" ? (parsed as Record<string, number>) : {};
  } catch {
    return {};
  }
}

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient().from("site_settings").select("key,value");
  const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  return {
    monthlyUrl: onStore(map["membership_monthly_url"] ?? ""),
    annualUrl: onStore(map["membership_annual_url"] ?? ""),
    previewPages: Number(map["preview_pages"] ?? 10) || 10,
    // Product id -> page count, for books that can be read as a flip book.
    flipbooks: parseFlipbooks(map["flipbooks"]),
  };
});

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
});
export const lessonCountQuery = queryOptions({
  queryKey: ["lesson-count"],
  queryFn: () => countCourseLessons(),
});
export const productQuery = (slug: string) =>
  queryOptions({ queryKey: ["product", slug], queryFn: () => getProduct({ data: { slug } }) });
export const testimonialsQuery = queryOptions({
  queryKey: ["testimonials"],
  queryFn: () => listTestimonials(),
});
export const episodesQuery = queryOptions({
  queryKey: ["episodes"],
  queryFn: () => listEpisodes(),
});
export const settingsQuery = queryOptions({
  queryKey: ["settings"],
  queryFn: () => getSettings(),
});
export const postsQuery = queryOptions({ queryKey: ["posts"], queryFn: () => listPosts() });
export const postQuery = (slug: string) =>
  queryOptions({ queryKey: ["post", slug], queryFn: () => getPost({ data: { slug } }) });

export type Product = Awaited<ReturnType<typeof listProducts>>[number];
export type Post = Awaited<ReturnType<typeof listPosts>>[number];
