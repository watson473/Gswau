// Server-only. Reads the @gswau uploads playlist with the YouTube Data API and keeps
// videos longer than 10 minutes. A missing key or a failed read returns the known
// 36-minute lesson so /videos still opens. Successful reads are reused for 10 minutes,
// the same pause the podcast feed uses. The key is YOUTUBE_API_KEY and is never logged.
import {
  fallbackLongFormVideos,
  longFormFromUploads,
  youtubeChannelId,
  type YoutubeVideo,
} from "./videos";

const CACHE_MS = 10 * 60 * 1000;
const API = "https://www.googleapis.com/youtube/v3";

let cached: { at: number; videos: YoutubeVideo[] } | null = null;

export async function loadLongFormVideos(): Promise<YoutubeVideo[]> {
  if (cached && Date.now() - cached.at < CACHE_MS) return cached.videos;
  const key = process.env["YOUTUBE_API_KEY"]?.trim();
  if (!key) return [...fallbackLongFormVideos];
  try {
    const videos = await fetchLongForm(key);
    cached = { at: Date.now(), videos };
    return videos;
  } catch (err) {
    // A failed read still has to render. Remember the fallback briefly so a bad
    // key does not call YouTube on every page view. A later read tries again.
    console.error("[youtube]", safeMessage(err));
    const videos = [...fallbackLongFormVideos];
    cached = { at: Date.now(), videos };
    return videos;
  }
}

async function fetchLongForm(key: string): Promise<YoutubeVideo[]> {
  const channel = await youtubeGet<{
    items?: { contentDetails?: { relatedPlaylists?: { uploads?: string } } }[];
  }>(key, "channels", { part: "contentDetails", id: youtubeChannelId });
  const playlistId = channel.items?.[0]?.contentDetails?.relatedPlaylists?.uploads;
  if (!playlistId) throw new Error("YouTube uploads playlist missing");

  const uploads: { id: string; title: string; publishedAt: string }[] = [];
  let pageToken = "";
  for (let page = 0; page < 3; page++) {
    const data = await youtubeGet<{
      nextPageToken?: string;
      items?: {
        snippet?: { title?: string; publishedAt?: string; resourceId?: { videoId?: string } };
        contentDetails?: { videoId?: string; videoPublishedAt?: string };
      }[];
    }>(key, "playlistItems", {
      part: "snippet,contentDetails",
      playlistId,
      maxResults: "50",
      ...(pageToken ? { pageToken } : {}),
    });
    for (const item of data.items ?? []) {
      const id = item.contentDetails?.videoId ?? item.snippet?.resourceId?.videoId ?? "";
      const title = item.snippet?.title ?? "";
      const publishedAt = item.contentDetails?.videoPublishedAt ?? item.snippet?.publishedAt ?? "";
      if (id && title && publishedAt) uploads.push({ id, title, publishedAt });
    }
    pageToken = data.nextPageToken ?? "";
    if (!pageToken) break;
  }

  const durations = new Map<string, string>();
  for (let index = 0; index < uploads.length; index += 50) {
    const slice = uploads.slice(index, index + 50);
    const data = await youtubeGet<{
      items?: { id?: string; contentDetails?: { duration?: string } }[];
    }>(key, "videos", {
      part: "contentDetails",
      id: slice.map((video) => video.id).join(","),
    });
    for (const item of data.items ?? []) {
      if (item.id) durations.set(item.id, item.contentDetails?.duration ?? "");
    }
  }

  return longFormFromUploads(
    uploads.map((video) => ({ ...video, duration: durations.get(video.id) ?? "" })),
  );
}

async function youtubeGet<T>(key: string, path: string, params: Record<string, string>) {
  const url = new URL(`${API}/${path}`);
  for (const [name, value] of Object.entries(params)) url.searchParams.set(name, value);
  url.searchParams.set("key", key);
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!res.ok) throw new Error(`YouTube ${path}: ${res.status}`);
  return (await res.json()) as T;
}

function safeMessage(err: unknown) {
  const text = err instanceof Error ? err.message : "failed";
  return text.replace(/key=[^&\s]+/gi, "key=redacted");
}
