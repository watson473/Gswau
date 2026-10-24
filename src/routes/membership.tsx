import { createFileRoute, redirect } from "@tanstack/react-router";

// Old address; the membership now lives on /pricing.
export const Route = createFileRoute("/membership")({
  beforeLoad: () => {
    throw redirect({ to: "/pricing", statusCode: 301 });
  },
});
