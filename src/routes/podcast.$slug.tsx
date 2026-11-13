import { createFileRoute, notFound } from "@tanstack/react-router";
import { EpisodeArticleView } from "@/components/EpisodeArticle";
import {
  episodeArticleBySlug,
  episodeArticleJsonLd,
  episodeArticleUrl,
} from "@/lib/podcast-articles";

export const Route = createFileRoute("/podcast/$slug")({
  loader: ({ params }) => {
    const article = episodeArticleBySlug(params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Not found — GSWAU" }, { name: "robots", content: "noindex" }],
      };
    }
    const url = episodeArticleUrl(loaderData);
    return {
      meta: [
        { title: loaderData.documentTitle },
        { name: "description", content: loaderData.description },
        { property: "og:title", content: loaderData.socialTitle },
        { property: "og:description", content: loaderData.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:site_name", content: "GSWAU" },
        { property: "article:published_time", content: loaderData.published },
        { property: "article:section", content: "Clippers and Shears" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: loaderData.socialTitle },
        { name: "twitter:description", content: loaderData.description },
        { "script:ld+json": episodeArticleJsonLd(loaderData) },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: EpisodePage,
});

function EpisodePage() {
  const article = Route.useLoaderData();
  return <EpisodeArticleView article={article} />;
}
