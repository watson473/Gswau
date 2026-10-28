import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { publicClient } from "./public-client.server";

// Newsletter and free-chapter sign-ups: saved to the site's email list, then sent to Kit.
// A Kit problem never fails the sign-up; the site's list keeps every email either way.
export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        email: z.string().trim().toLowerCase().email().max(255),
        name: z.string().trim().max(100).optional(),
        source: z.string().min(1).max(100),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const { error } = await publicClient()
      .from("leads")
      .insert({ email: data.email, source: data.source });
    if (error) throw new Error("Could not save your email");
    try {
      const { addToKit } = await import("./kit.server");
      await addToKit(data.email, new URL(getRequest().url).origin, data.name || undefined);
    } catch (err) {
      console.error("[kit]", err);
    }
    return { ok: true };
  });
