import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { assertAdmin } from "./admin-gumroad.functions";

// Admin > Members: turn off two-step sign-in for someone who lost their phone, after confirming
// it's really them. They can then sign in with their password and set it up again.
export const resetTwoStep = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ email: z.string().trim().toLowerCase().email() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    let userId: string | null = null;
    for (let page = 1; page <= 20 && !userId; page++) {
      const { data: list, error } = await supabaseAdmin.auth.admin.listUsers({
        page,
        perPage: 200,
      });
      if (error) throw new Error(error.message);
      userId = list.users.find((u) => u.email?.toLowerCase() === data.email)?.id ?? null;
      if (list.users.length < 200) break;
    }
    if (!userId) return { result: `No account uses ${data.email}.` };
    if (userId === context.userId)
      return { result: "You can't reset your own two-step sign-in here." };
    const { data: factors, error } = await supabaseAdmin.auth.admin.mfa.listFactors({ userId });
    if (error) throw new Error(error.message);
    if (!factors.factors.length)
      return { result: `${data.email} doesn't have two-step sign-in on.` };
    for (const f of factors.factors)
      await supabaseAdmin.auth.admin.mfa.deleteFactor({ id: f.id, userId });
    return {
      result: `Two-step sign-in is off for ${data.email} (${factors.factors.length} device${factors.factors.length > 1 ? "s" : ""} removed).`,
    };
  });
