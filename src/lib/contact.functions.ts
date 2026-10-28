import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { publicClient } from "./public-client.server";

// Contact Us form: saves the message for Admin > Messages.
export const sendContactMessage = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        name: z.string().trim().min(1).max(100),
        email: z.string().trim().toLowerCase().email().max(255),
        subject: z.string().trim().max(150),
        message: z.string().trim().min(1).max(5000),
        // Left empty by people; bots that fill every field are quietly ignored.
        website: z.string().max(200).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    if (data.website) return { ok: true };
    const { error } = await publicClient().from("contact_messages").insert({
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
    });
    if (error) throw new Error("Could not send your message");
    return { ok: true };
  });
