// GSWAU's public YouTube channel. Long lessons are loaded on the server from the
// YouTube Data API when YOUTUBE_API_KEY is set. This file is the shared shape and
// the one lesson used when that fetch cannot run.
export const youtubeChannelUrl = "https://www.youtube.com/@gswau";
export const youtubeChannelId = "UCD4sRes0HE57pHpDTYRKngA";

// Strictly over 30 minutes. A video of exactly 30:00, and every Short, stays off /videos.
export const LONG_FORM_MIN_SECONDS = 30 * 60;

// The Videos tab shows its NEW mark for NEW_WINDOW_DAYS after this instant, then hides it.
// Change this date to start that week again.
export const VIDEOS_TAB_LAUNCHED_AT = "2026-11-24T00:00:00.000Z";

export type YoutubeVideo = {
  id: string;
  title: string;
  publishedAt: string;
};

// "How Does a Haircut Actually Make Money?" is 36:00, the only long lesson on the
// channel at launch. Publish time is from the channel feed.
export const fallbackLongFormVideo = {
  id: "dqI6Pj4cl8U",
  title: "How Does a Haircut Actually Make Money?",
  publishedAt: "2026-11-21T16:00:21.000Z",
  durationSeconds: 36 * 60,
} as const;

export const fallbackLongFormVideos: readonly YoutubeVideo[] = [
  {
    id: fallbackLongFormVideo.id,
    title: fallbackLongFormVideo.title,
    publishedAt: fallbackLongFormVideo.publishedAt,
  },
];

const videoId = /^[A-Za-z0-9_-]{11}$/;

export function isLongFormDuration(seconds: number) {
  return Number.isFinite(seconds) && seconds > LONG_FORM_MIN_SECONDS;
}

// YouTube's contentDetails.duration, for example "PT36M1S" or "PT1H2M".
export function parseIsoDuration(value: string) {
  const match = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(value.trim());
  if (!match) return 0;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  if (![hours, minutes, seconds].every(Number.isFinite)) return 0;
  return hours * 3600 + minutes * 60 + seconds;
}

export function longFormFromUploads(
  videos: { id: string; title: string; publishedAt: string; duration: string }[],
): YoutubeVideo[] {
  const kept: YoutubeVideo[] = [];
  for (const video of videos) {
    if (!videoId.test(video.id) || !isLongFormDuration(parseIsoDuration(video.duration))) continue;
    const title = video.title.trim();
    const publishedAt = video.publishedAt.trim();
    if (!title || title === "Private video" || title === "Deleted video") continue;
    if (!Number.isFinite(Date.parse(publishedAt))) continue;
    kept.push({ id: video.id, title, publishedAt });
  }
  return kept.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function youtubeWatchUrl(id: string) {
  return `https://www.youtube.com/watch?v=${id}`;
}

// Privacy-enhanced player. The page mounts this only after a click.
export function youtubeEmbedUrl(id: string) {
  if (!videoId.test(id)) return null;
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1`;
}

export function youtubeThumbnailUrl(id: string) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
