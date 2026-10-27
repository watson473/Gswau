import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertAdmin } from "./admin-gumroad.functions";

const emailInput = z.object({ email: z.string().trim().toLowerCase().email().max(255) });

// Admin > Email list: checks the Kit key and looks the email up on Kit (changes nothing).
export const checkKit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ email: z.string().trim().toLowerCase().max(255) }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { kitCheck } = await import("./kit.server");
    return kitCheck(data.email || null);
  });

// Admin > Email list: sends one email to Kit now and reports Kit's answer, errors included.
export const sendToKit = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => emailInput.parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { addToKit } = await import("./kit.server");
    try {
      return { result: await addToKit(data.email, new URL(getRequest().url).origin) };
    } catch (err) {
      return { result: `failed: ${err instanceof Error ? err.message : String(err)}` };
    }
  });
