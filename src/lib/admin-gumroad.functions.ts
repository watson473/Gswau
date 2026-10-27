import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { Database } from "@/integrations/supabase/types";

async function assertAdmin(context: { supabase: SupabaseClient<Database>; userId: string }) {
  const { data } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (!data) throw new Error("Admins only");
}

// Admin > Gumroad: register this site's notification address with Gumroad.
export const connectGumroad = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { connectGumroadNotifications } = await import("./gumroad.server");
    return connectGumroadNotifications(new URL(getRequest().url).origin);
  });

// Admin > Gumroad: grant access to everyone who bought before the site existed.
export const importGumroadBuyers = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { importPastSales } = await import("./gumroad.server");
    return importPastSales();
  });

// Admin > Gumroad: process a logged notification again (Gumroad never resends one it delivered).
export const replayGumroadNotification = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ id: z.string().uuid() }).parse(d))
  .handler(async ({ context, data }) => {
    await assertAdmin(context);
    const { replayGumroadEvent } = await import("./gumroad.server");
    return { outcome: await replayGumroadEvent(data.id) };
  });

// Admin > Gumroad: whether the server has the settings it needs (never returns the values).
export const gumroadSetupStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    return {
      accessToken: !!process.env["GUMROAD_ACCESS_TOKEN"],
      webhookSecret: !!process.env["GUMROAD_WEBHOOK_SECRET"],
      serviceRole: !!process.env["SUPABASE_SERVICE_ROLE_KEY"],
    };
  });
