import { createServerFn } from "@tanstack/react-start";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

const LISTEN_SECONDS = 30 * 60; // the player asks for a fresh link when one runs out
const DOWNLOAD_SECONDS = 2 * 60;

const productInput = z.object({ productId: z.string().uuid() });

async function rightsFor(supabase: SupabaseClient<Database>, productId: string) {
  const { data } = await supabase.rpc("audiobook_rights", { _product: productId });
  return { canListen: !!data?.[0]?.can_listen, canDownload: !!data?.[0]?.can_download };
}

// What the signed-in visitor may do with this audiobook (members listen; buyers also download).
export const getAudiobookRights = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => productInput.parse(d))
  .handler(async ({ context, data }) => rightsFor(context.supabase, data.productId));

// A short-lived private link to the audio, only after the server has checked the rules. Browsers
// cannot make these links themselves (see migration 0004), so a link can't be stretched or shared
// for long.
export const getAudiobookLink = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => productInput.extend({ download: z.boolean() }).parse(d))
  .handler(async ({ context, data }) => {
    const rights = await rightsFor(context.supabase, data.productId);
    if (!rights.canListen || (data.download && !rights.canDownload))
      throw new Error("No access to this audiobook");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: product } = await supabaseAdmin
      .from("products")
      .select("slug,audio_path")
      .eq("id", data.productId)
      .maybeSingle();
    if (!product?.audio_path) throw new Error("This audiobook has no audio yet");
    const { data: signed, error } = await supabaseAdmin.storage
      .from("product-files")
      .createSignedUrl(
        product.audio_path,
        data.download ? DOWNLOAD_SECONDS : LISTEN_SECONDS,
        data.download ? { download: `${product.slug}.mp3` } : undefined,
      );
    if (error || !signed) throw new Error("Could not prepare the audio");
    return { url: signed.signedUrl, expiresIn: data.download ? DOWNLOAD_SECONDS : LISTEN_SECONDS };
  });
