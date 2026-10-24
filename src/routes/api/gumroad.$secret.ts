import { createFileRoute } from "@tanstack/react-router";

// Gumroad posts here for sales, refunds and membership changes (see Admin > Gumroad > Connect).
// The secret in the address stops strangers posting; each sale is still confirmed with Gumroad's API.
export const Route = createFileRoute("/api/gumroad/$secret")({
  server: {
    handlers: {
      POST: async ({ request, params }) => {
        const { verifyWebhookSecret, handleGumroadNotification } =
          await import("@/lib/gumroad.server");
        const { parseGumroadBody } = await import("@/lib/gumroad");
        if (!(await verifyWebhookSecret(params.secret)))
          return new Response("Not found", { status: 404 });
        const fields = parseGumroadBody(await request.text());
        const resource =
          new URL(request.url).searchParams.get("resource") || fields["resource_name"] || "sale";
        try {
          const outcome = await handleGumroadNotification(resource, fields);
          return new Response(outcome, { status: 200 });
        } catch (err) {
          console.error("[gumroad]", err);
          // 500 makes Gumroad retry later.
          return new Response("Error", { status: 500 });
        }
      },
    },
  },
});
