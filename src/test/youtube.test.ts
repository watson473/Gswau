import { describe, expect, it } from "vitest";
import { isNewlyPublished, NEW_WINDOW_DAYS } from "@/lib/new-drop";
import {
  fallbackLongFormVideo,
  fallbackLongFormVideos,
  isLongFormDuration,
  LONG_FORM_MIN_SECONDS,
  longFormFromUploads,
  parseIsoDuration,
  VIDEOS_TAB_LAUNCHED_AT,
  youtubeEmbedUrl,
} from "@/lib/videos";

describe("Long-form YouTube videos", () => {
  it("keeps a lesson only when it runs strictly over 10 minutes", () => {
    expect(LONG_FORM_MIN_SECONDS).toBe(600);
    expect(parseIsoDuration("PT10M")).toBe(600);
    expect(parseIsoDuration("PT10M1S")).toBe(601);
    expect(parseIsoDuration("PT30M")).toBe(1800);
    expect(parseIsoDuration("PT30M1S")).toBe(1801);
    expect(parseIsoDuration("PT36M")).toBe(36 * 60);
    expect(parseIsoDuration("PT1H2M3S")).toBe(3723);
    expect(parseIsoDuration("PT59S")).toBe(59);
    expect(parseIsoDuration("")).toBe(0);
    expect(parseIsoDuration("nope")).toBe(0);
    expect(isLongFormDuration(180)).toBe(false);
    expect(isLongFormDuration(600)).toBe(false);
    expect(isLongFormDuration(601)).toBe(true);
    expect(isLongFormDuration(1800)).toBe(true);
    expect(fallbackLongFormVideo.durationSeconds).toBe(36 * 60);
    expect(isLongFormDuration(fallbackLongFormVideo.durationSeconds)).toBe(true);
  });

  it("drops Shorts, a 10-minute video, and private rows, newest first", () => {
    const videos = longFormFromUploads([
      {
        id: "short111111",
        title: "A short #Shorts",
        publishedAt: "2026-11-24T00:00:00Z",
        duration: "PT45S",
      },
      {
        id: "shortmax3mn",
        title: "A three-minute Short",
        publishedAt: "2026-11-24T00:30:00Z",
        duration: "PT3M",
      },
      {
        id: "exactly10mn",
        title: "Exactly ten",
        publishedAt: "2026-11-24T01:00:00Z",
        duration: "PT10M",
      },
      {
        id: "elevenmin11",
        title: "Just over ten",
        publishedAt: "2026-11-24T02:00:00Z",
        duration: "PT10M1S",
      },
      {
        id: "dqI6Pj4cl8U",
        title: "How Does a Haircut Actually Make Money?",
        publishedAt: "2026-11-21T16:00:21Z",
        duration: "PT36M",
      },
      {
        id: "newerlong11",
        title: "A later lesson",
        publishedAt: "2026-11-24T12:00:00Z",
        duration: "PT45M",
      },
      {
        id: "privatevid1",
        title: "Private video",
        publishedAt: "2026-11-24T18:00:00Z",
        duration: "PT50M",
      },
    ]);

    expect(videos.map((video) => video.id)).toEqual(["newerlong11", "elevenmin11", "dqI6Pj4cl8U"]);
  });

  it("falls back to the one known 36-minute lesson", () => {
    expect(fallbackLongFormVideos).toEqual([
      {
        id: fallbackLongFormVideo.id,
        title: fallbackLongFormVideo.title,
        publishedAt: fallbackLongFormVideo.publishedAt,
      },
    ]);
    expect(fallbackLongFormVideos).toHaveLength(1);
  });

  it("builds a nocookie embed only for a real video id", () => {
    expect(youtubeEmbedUrl(fallbackLongFormVideo.id)).toBe(
      "https://www.youtube-nocookie.com/embed/dqI6Pj4cl8U?autoplay=1",
    );
    expect(youtubeEmbedUrl("not an id")).toBeNull();
    expect(youtubeEmbedUrl("short")).toBeNull();
  });

  it("shows the Videos tab mark for seven days after the launch instant", () => {
    const launch = Date.parse(VIDEOS_TAB_LAUNCHED_AT);
    const day = 24 * 60 * 60 * 1000;
    expect(NEW_WINDOW_DAYS).toBe(7);
    expect(isNewlyPublished(VIDEOS_TAB_LAUNCHED_AT, launch + 6 * day)).toBe(true);
    expect(isNewlyPublished(VIDEOS_TAB_LAUNCHED_AT, launch + NEW_WINDOW_DAYS * day)).toBe(false);
  });
});
