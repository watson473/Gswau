import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import { publicClient } from "./public-client.server";

const PRODUCT_COLS =
  "id,slug,type,title,subtitle,description,cover_image_url,price_cents,is_free,is_featured,buy_url,position";

export const listProducts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await publicClient()
    .from("products")
    .select(PRODUCT_COLS)
    .eq("is_published", true)
    .order("position");
  if (error) throw new Error(error.message);
  return data;
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
    const [{ data: modules }, { data: outline }, { data: bundle }] = await Promise.all([
      sb.from("modules").select("id,title,position").eq("course_id", product.id).order("position"),
      sb.rpc("course_outline", { _course: product.id }),
      sb
        .from("bundle_items")
        .select("product:products!bundle_items_product_id_fkey(slug,title,cover_image_url)")
        .eq("bundle_id", product.id),
    ]);
    return {
      product,
      modules: modules ?? [],
      outline: outline ?? [],
      bundle: (bundle ?? []).map((b) => b.product).filter(Boolean),
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
export const postsQuery = queryOptions({ queryKey: ["posts"], queryFn: () => listPosts() });
export const postQuery = (slug: string) =>
  queryOptions({ queryKey: ["post", slug], queryFn: () => getPost({ data: { slug } }) });

export type Product = Awaited<ReturnType<typeof listProducts>>[number];
