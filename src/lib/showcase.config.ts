// The animated phone in the homepage hero. The settings people change live here.

export const showcaseConfig = {
  /** How long each slide stays up, in milliseconds. */
  slideMs: 4000,

  /**
   * The Price Shift founding-price slide.
   * "auto": shows until `endsAt`, then hides itself. "off": hidden now.
   */
  priceShiftSlide: "auto" as "auto" | "off",
  /** End of Nov 26 in Nassau (midnight, UTC-5). The "until Nov 26" text is worked out from this. */
  priceShiftEndsAt: "2026-11-27T05:00:00Z",
  priceShiftSlug: "the-price-shift-course",
  priceShiftFoundingPrice: 47,

  /** Clippers and Shears episodes are numbered from this relaunch date, oldest first. */
  podcastNumberedFrom: "2026-11-01T00:00:00Z",
} as const;

export function priceShiftSlideOn(now = Date.now()) {
  return (
    showcaseConfig.priceShiftSlide === "auto" &&
    now < new Date(showcaseConfig.priceShiftEndsAt).getTime()
  );
}

/** "Nov 26": the last day of the founding price, in Nassau time. */
export function priceShiftLastDay(locale = "en") {
  const last = new Date(new Date(showcaseConfig.priceShiftEndsAt).getTime() - 60_000);
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    day: "numeric",
    timeZone: "America/Nassau",
  }).format(last);
}
