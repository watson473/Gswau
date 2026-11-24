// How long a video or episode keeps the "New" badge. One window for every list.
// A drop is new when it was published less than this many whole days ago.
// A missing date, a date that cannot be read, or a future date is not new.
export const NEW_WINDOW_DAYS = 7;

const DAY_MS = 24 * 60 * 60 * 1000;

export function isNewlyPublished(
  publishedAt: string | null | undefined,
  now = Date.now(),
): boolean {
  if (!publishedAt) return false;
  const published = Date.parse(publishedAt);
  if (Number.isNaN(published)) return false;
  const age = now - published;
  return age >= 0 && age < NEW_WINDOW_DAYS * DAY_MS;
}
