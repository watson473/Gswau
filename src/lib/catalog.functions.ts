import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { publicClient } from "./public-client.server";
import type { PodcastEpisode } from "./podcast";

const PRODUCT_COLS =
  "id,slug,type,title,subtitle,description,cover_image_url,gallery_urls,price_cents,is_free,is_featured,access_tier,preview_path,file_size_label,length_label,buy_url,position";

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
    rating_average: byProduct.get(p.id)?.average ?? null,
    review_count: byProduct.get(p.id)?.review_count ?? 0,
  }));
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
        .select("product:products!bundle_items_product_id_fkey(slug,title,cover_image_url)")
        .eq("bundle_id", product.id),
      sb.from("product_ratings").select(RATING_COLS).eq("product_id", product.id).maybeSingle(),
      sb
        .from("testimonials")
        .select("id,name,location,quote,rating,created_at")
        .eq("product_id", product.id)
        .eq("is_published", true)
        .order("created_at", { ascending: false }),
    ]);
    return {
      product,
      modules: modules ?? [],
      outline: outline ?? [],
      bundle: (bundle ?? []).map((b) => b.product).filter(Boolean),
      rating,
      reviews: reviews ?? [],
    };
  });

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
  return data ?? [];
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
    return post;
  });

// Newest first: straight from Spotify when its keys are set, otherwise Admin > Podcast.
export const listEpisodes = createServerFn({ method: "GET" }).handler(
  async (): Promise<PodcastEpisode[]> => {
    try {
      const { spotifyEpisodes } = await import("./spotify.server");
      const fromSpotify = await spotifyEpisodes();
      if (fromSpotify?.length) return fromSpotify;
    } catch (err) {
      console.error("[spotify]", err);
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

export const getSettings = createServerFn({ method: "GET" }).handler(async () => {
  const { data } = await publicClient().from("site_settings").select("key,value");
  const map = Object.fromEntries((data ?? []).map((r) => [r.key, r.value]));
  return {
    monthlyUrl: map["membership_monthly_url"] ?? "",
    annualUrl: map["membership_annual_url"] ?? "",
    previewPages: Number(map["preview_pages"] ?? 10) || 10,
  };
});

export const productsQuery = queryOptions({
  queryKey: ["products"],
  queryFn: () => listProducts(),
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
