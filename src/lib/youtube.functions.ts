import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import type { YoutubeVideo } from "./videos";

// Long lessons only. The handler lives in a server module so the API key stays there.
export const listLongFormVideos = createServerFn({ method: "GET" }).handler(
  async (): Promise<YoutubeVideo[]> => {
    const { loadLongFormVideos } = await import("./youtube.server");
    return loadLongFormVideos();
  },
);

export const videosQuery = queryOptions({
  queryKey: ["long-form-videos"],
  queryFn: () => listLongFormVideos(),
});
