import { createFileRoute, redirect } from "@tanstack/react-router";

// Coaching has been discontinued; the old address goes to the homepage.
export const Route = createFileRoute("/coaching")({
  beforeLoad: () => {
    throw redirect({ to: "/", statusCode: 301 });
  },
});
