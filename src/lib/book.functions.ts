import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

// Written books, read as a flip book. Each book's formatted PDF and its page images live in the
// private bucket under <product id>/book/ (not linked from file_path, so browsers can't open them
// directly). The server checks the same rules as the audiobooks: members and buyers can read;
// only buyers (and admins) can download the PDF.
const PAGE_SECONDS = 30 * 60;
const DOWNLOAD_SECONDS = 2 * 60;
const input = z.object({ productId: z.string().uuid() });

async function rightsFor(supabase: SupabaseClient<Database>, productId: string) {
  const { data } = await supabase.rpc("audiobook_rights", { _product: productId });
  return { canRead: !!data?.[0]?.can_listen, canDownload: !!data?.[0]?.can_download };
}

// The page images (short-lived links) and whether a Download button belongs on the reader.
export const getBookPages = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => input.parse(d))
  .handler(async ({ context, data }) => {
    const rights = await rightsFor(context.supabase, data.productId);
    if (!rights.canRead) throw new Error("No access to this book");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const folder = `${data.productId}/book/pages`;
    const { data: files, error } = await supabaseAdmin.storage
      .from("product-files")
      .list(folder, { limit: 1000, sortBy: { column: "name", order: "asc" } });
    if (error) throw new Error(error.message);
    const paths = (files ?? [])
      .filter((f) => f.name.endsWith(".webp"))
      .map((f) => `${folder}/${f.name}`);
    if (!paths.length) throw new Error("This book isn't ready to read yet");
    const { data: signed, error: signError } = await supabaseAdmin.storage
      .from("product-files")
      .createSignedUrls(paths, PAGE_SECONDS);
    if (signError || !signed) throw new Error("Could not prepare the pages");
    const pages = signed.map((s) => s.signedUrl).filter((u): u is string => !!u);
    return { pages, canDownload: rights.canDownload };
  });

// Buyers only: a two-minute link to download the formatted PDF.
export const getBookDownload = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => input.parse(d))
  .handler(async ({ context, data }) => {
    const rights = await rightsFor(context.supabase, data.productId);
    if (!rights.canDownload) throw new Error("Only buyers can download this book");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const folder = `${data.productId}/book`;
    const { data: files } = await supabaseAdmin.storage.from("product-files").list(folder);
    const pdf = files?.find((f) => f.name.endsWith(".pdf"));
    if (!pdf) throw new Error("This book has no download yet");
    const { data: signed, error } = await supabaseAdmin.storage
      .from("product-files")
      .createSignedUrl(`${folder}/${pdf.name}`, DOWNLOAD_SECONDS, { download: pdf.name });
    if (error || !signed) throw new Error("Could not prepare the download");
    return { url: signed.signedUrl };
  });
