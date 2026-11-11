// @vitest-environment node
import { describe, expect, it } from "vitest";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { QueryClient } from "@tanstack/react-query";
import { routeTree } from "@/routeTree.gen";
import {
  articleForEpisode,
  episodeArticleJsonLd,
  episodeArticlePlainText,
  episodeArticleUrl,
  kitNewsletterUrl,
  podcastPageUrl,
  raiseYourPricesArticle,
} from "@/lib/podcast-articles";

const articlePath = "/podcast/raise-your-prices-without-losing-your-chair";

describe("Episode 1 article", () => {
  it("is a public route, and an unknown episode is not a different page", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const matches = router.matchRoutes(articlePath);
    expect(matches.at(-1)?.routeId).toBe("/podcast/$slug");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);

    const index = router.matchRoutes("/podcast");
    expect(index.some((match) => match.routeId === "/podcast/")).toBe(true);
  });

  it("keeps the approved listen links, Kit signup, and clip timestamps", () => {
    const text = episodeArticlePlainText(raiseYourPricesArticle);
    expect(text).toContain(
      "Wanna listen? Head to gswau.com/podcast for the full episode, or listen on Spotify.",
    );
    expect(podcastPageUrl).toBe("https://www.gswau.com/podcast");
    expect(raiseYourPricesArticle.spotifyUrl).toBe(
      "https://open.spotify.com/episode/4mNNq4uXFtCN1LhQ6DTZvs?si=dbbc7b576652437e",
    );
    expect(kitNewsletterUrl).toBe("https://gs-w-augustin-university.kit.com/34a8ef6dee");
    expect(text).toContain("from clip-01, at 0:09");
    expect(text).toContain("From clip-01, at 0:09–0:38");
    expect(text).toContain("From clip-10, at 0:24");
    expect(text).toContain("(clip-07, 0:06–0:31)");
    expect(text).not.toMatch(/\/workspace\//);
    expect(episodeArticleUrl(raiseYourPricesArticle)).toBe(`https://www.gswau.com${articlePath}`);
  });

  it("uses the pricing search phrases once, without a sales pitch", () => {
    const text = episodeArticlePlainText(raiseYourPricesArticle);
    expect(raiseYourPricesArticle.documentTitle.toLowerCase()).toContain(
      "how to raise barber prices",
    );
    expect(raiseYourPricesArticle.description.toLowerCase()).toContain(
      "how to raise barber prices",
    );
    expect(raiseYourPricesArticle.description.toLowerCase()).toContain("how to price a haircut");
    expect(raiseYourPricesArticle.description.length).toBeLessThanOrEqual(170);
    expect(text).toContain("Why does raising a barber’s price feel so hard?");
    expect(text).toContain("6. Do your floor math tonight");
    for (const banned of [
      /gumroad/i,
      /calendly/i,
      /\$197/,
      /free strategy call/i,
      /dm learn/i,
      /link in caption/i,
    ]) {
      expect(text).not.toMatch(banned);
    }
  });

  it("publishes Article structured data and matches the RSS episode title", () => {
    const graph = episodeArticleJsonLd(raiseYourPricesArticle)["@graph"];
    expect(graph.map((node) => node["@type"])).toEqual(["Article", "FAQPage", "BreadcrumbList"]);
    const article = graph[0]!;
    expect(article.headline).toBe(raiseYourPricesArticle.title);
    expect(article.datePublished).toBe("2026-11-11");
    expect(
      articleForEpisode({
        title: "Raising your prices without losing your chair.",
        audioUrl: "https://anchor.fm/ep.mp3",
      })?.slug,
    ).toBe(raiseYourPricesArticle.slug);
    expect(
      articleForEpisode({
        title: "Something else",
        audioUrl: "https://open.spotify.com/episode/4mNNq4uXFtCN1LhQ6DTZvs?si=abc",
      })?.slug,
    ).toBe(raiseYourPricesArticle.slug);
  });
});
