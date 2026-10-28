// @vitest-environment node
import { describe, expect, it } from "vitest";
import { spotifyEpisodeId } from "@/lib/podcast";

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
