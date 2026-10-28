// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  episodesFromRss,
  formatEpisodeDate,
  spotifyEpisodeId,
  tidyEpisodeTitle,
} from "@/lib/podcast";

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

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss><channel>
  <title><![CDATA[Clippers and Shears Podcast ]]></title>
  <itunes:image href="https://cdn.example.com/show.jpg"/>
  <item>
    <title><![CDATA[Podcast Episode 1: Building a trust fund as a barber or a hairstylist.]]></title>
    <description><![CDATA[<p>This episode focuses on building a trust fund &amp; more.</p><p>Second paragraph.</p>]]></description>
    <guid isPermaLink="false">ep-1</guid>
    <pubDate>Tue, 27 May 2025 06:10:00 GMT</pubDate>
    <enclosure url="https://anchor.fm/s/1/podcast/play/1/ep1.mp3" length="1" type="audio/mpeg"/>
    <itunes:duration>00:07:33</itunes:duration>
  </item>
  <item>
    <title><![CDATA[Podcast Episode 3 : Part 2-The Science of Hair Understanding Hair Types and Textures]]></title>
    <description><![CDATA[<p>Part two.</p>]]></description>
    <guid isPermaLink="false">ep-3-2</guid>
    <pubDate>Mon, 07 Jul 2025 05:22:40 GMT</pubDate>
    <enclosure url="https://anchor.fm/s/1/podcast/play/2/ep3-2.mp3" length="1" type="audio/mpeg"/>
    <itunes:duration>1454</itunes:duration>
    <itunes:image href="https://cdn.example.com/ep3.jpg"/>
  </item>
  <item>
    <title>An item without audio</title>
  </item>
</channel></rss>`;

describe("episodes from the RSS feed", () => {
  it("are read newest first, skipping items without audio", () => {
    const eps = episodesFromRss(feed);
    expect(eps.map((e) => e.id)).toEqual(["ep-3-2", "ep-1"]);
    expect(eps[0]).toEqual({
      id: "ep-3-2",
      title: "Episode 3, Part 2: The Science of Hair Understanding Hair Types and Textures",
      description: "Part two.",
      publishedAt: "2025-07-07T05:22:40.000Z",
      durationLabel: "24 min",
      audioUrl: "https://anchor.fm/s/1/podcast/play/2/ep3-2.mp3",
      image: "https://cdn.example.com/ep3.jpg",
    });
  });

  it("turn episode notes into text and fall back to the show's artwork", () => {
    const ep1 = episodesFromRss(feed)[1]!;
    expect(ep1.title).toBe("Episode 1: Building a trust fund as a barber or a hairstylist");
    expect(ep1.description).toBe(
      "This episode focuses on building a trust fund & more.\n\nSecond paragraph.",
    );
    expect(ep1.durationLabel).toBe("8 min");
    expect(ep1.image).toBe("https://cdn.example.com/show.jpg");
  });

  it("tidy titles but leave others alone", () => {
    expect(tidyEpisodeTitle("Bonus: Q&A")).toBe("Bonus: Q&A");
  });

  it("show a release date as Spotify's calendar day in any time zone", () => {
    expect(formatEpisodeDate("2025-07-07", "en-US")).toBe("Jul 7, 2025");
    expect(formatEpisodeDate("2025-06-21T03:13:00Z", "en-US")).toBe("Jun 21, 2025");
    expect(formatEpisodeDate(null)).toBe("");
  });
});
