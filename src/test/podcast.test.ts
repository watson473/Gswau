// @vitest-environment node
import { describe, expect, it } from "vitest";
import { episodeFromSpotify, formatEpisodeDate, spotifyEpisodeId } from "@/lib/podcast";

describe("spotifyEpisodeId", () => {
  it("reads the episode id from Spotify links", () => {
    expect(spotifyEpisodeId("https://open.spotify.com/episode/4WgXk6Oo6Pg3vdPl4AJdZp")).toBe(
      "4WgXk6Oo6Pg3vdPl4AJdZp",
    );
    expect(
      spotifyEpisodeId("https://open.spotify.com/intl-fr/episode/4WgXk6Oo6Pg3vdPl4AJdZp?si=abc"),
    ).toBe("4WgXk6Oo6Pg3vdPl4AJdZp");
  });

  it("treats anything else as an audio file", () => {
    expect(spotifyEpisodeId("https://example.com/episode-1.mp3")).toBeNull();
    expect(spotifyEpisodeId("https://open.spotify.com/show/65QG3LPqhf9qn4ddtSZaGE")).toBeNull();
  });
});

describe("episodes from Spotify's Web API", () => {
  it("become the site's episode shape, with the largest image", () => {
    const e = episodeFromSpotify({
      id: "4WgXk6Oo6Pg3vdPl4AJdZp",
      name: "Episode 3, Part 2",
      description: "The science of hair.",
      release_date: "2025-07-07",
      duration_ms: 1453987,
      images: [
        { url: "small.jpg", width: 64 },
        { url: "large.jpg", width: 640 },
      ],
    });
    expect(e).toEqual({
      id: "4WgXk6Oo6Pg3vdPl4AJdZp",
      title: "Episode 3, Part 2",
      description: "The science of hair.",
      publishedAt: "2025-07-07",
      durationLabel: "24 min",
      audioUrl: "https://open.spotify.com/episode/4WgXk6Oo6Pg3vdPl4AJdZp",
      image: "large.jpg",
    });
    expect(spotifyEpisodeId(e.audioUrl)).toBe("4WgXk6Oo6Pg3vdPl4AJdZp");
  });

  it("show a bare release date as that calendar day in any time zone", () => {
    expect(formatEpisodeDate("2025-07-07", "en-US")).toBe("Jul 7, 2025");
    expect(formatEpisodeDate("2025-06-21T03:13:00Z", "en-US")).toBe("Jun 21, 2025");
    expect(formatEpisodeDate(null)).toBe("");
  });
});
