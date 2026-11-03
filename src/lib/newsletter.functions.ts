import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { calculatorConfig } from "./calculator.config";
import { calculateChairEarnings, kitFieldsForEstimate } from "./chairEarnings";
import { publicClient } from "./public-client.server";

const calculatorInput = z.object({
  price: z.number().finite(),
  clientsPerDay: z.number().finite(),
  daysPerWeek: z.number().finite(),
  weeksPerYear: z.number().finite(),
  tipsOn: z.boolean(),
  tipPct: z.number().finite(),
  payModel: z.enum(["keep100", "boothRent", "commission"]),
  boothRentPerWeek: z.number().finite(),
  commissionPct: z.number().finite(),
});

// Newsletter and free-book sign-ups: saved to the site's email list, then sent to Kit.
// A Kit problem never fails the sign-up; the site's list keeps every email either way.
// The footer sends email, name, and source only. The calculator may also send `calculator`.
export const subscribeNewsletter = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        email: z.string().trim().toLowerCase().email().max(255),
        name: z.string().trim().max(100).optional(),
        source: z.string().min(1).max(100),
        // Calculator only. Left empty by a person. A filled value is ignored as a bot.
        honeypot: z.string().max(200).optional(),
        // Calculator only. Page address, including UTMs, used as the Kit referrer.
        pageUrl: z.string().trim().max(1000).optional(),
        calculator: calculatorInput.optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    if (data.honeypot?.trim()) return { ok: true };

    const { error } = await publicClient()
      .from("leads")
      .insert({ email: data.email, source: data.source });
    if (error) throw new Error("Could not save your email");
    try {
      const { addToKit } = await import("./kit.server");
      const origin = new URL(getRequest().url).origin;
      if (data.calculator) {
        const estimate = calculateChairEarnings(data.calculator);
        await addToKit(data.email, pageReferrer(origin, data.pageUrl), data.name || undefined, {
          fields: kitFieldsForEstimate(estimate),
          ...(calculatorConfig.requireEmailConfirmation ? { state: "inactive" as const } : {}),
          tagSettingKey: "kit_calculator_tag_id",
        });
      } else {
        await addToKit(data.email, origin, data.name || undefined);
      }
    } catch (err) {
      console.error("[kit]", err);
    }
    return { ok: true };
  });

function pageReferrer(origin: string, pageUrl: string | undefined) {
  if (!pageUrl) return origin;
  try {
    const page = new URL(pageUrl);
    if (page.protocol !== "https:" && page.protocol !== "http:") return origin;
    return page.toString();
  } catch {
    return origin;
  }
}
