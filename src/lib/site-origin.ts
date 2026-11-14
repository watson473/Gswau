import { createIsomorphicFn } from "@tanstack/react-start";
import { SITE_ORIGIN } from "@/lib/site";

// Host of this response. On the server it follows the request (so a Vercel preview
// points at its own image). In the browser it is the page's host.
export const requestOrigin = createIsomorphicFn()
  .client(() => window.location.origin)
  .server(async () => {
    try {
      const { getRequestUrl } = await import("@tanstack/react-start/server");
      const url = getRequestUrl({ xForwardedHost: true, xForwardedProto: true });
      if (url.protocol === "http:" || url.protocol === "https:") return url.origin;
    } catch {
      // No request in scope.
    }
    const host = process.env["VERCEL_URL"];
    if (process.env["VERCEL_ENV"] === "preview" && host) return `https://${host}`;
    return SITE_ORIGIN;
  });
