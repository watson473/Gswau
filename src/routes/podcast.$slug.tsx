import { createFileRoute, notFound } from "@tanstack/react-router";
import { EpisodeArticleView } from "@/components/EpisodeArticle";
import { episodeArticleBySlug, episodeArticleJsonLd } from "@/lib/podcast-articles";
import { originFromMatches, shareMeta } from "@/lib/share";

export const Route = createFileRoute("/podcast/$slug")({
  loader: ({ params }) => {
    const article = episodeArticleBySlug(params.slug);
    if (!article) throw notFound();
    return article;
  },
  head: ({ loaderData, matches }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Not found — GSWAU" }, { name: "robots", content: "noindex" }],
      };
    }
    return shareMeta({
      title: loaderData.documentTitle,
      socialTitle: loaderData.socialTitle,
      description: loaderData.description,
      path: `/podcast/${loaderData.slug}`,
      type: "article",
      assetOrigin: originFromMatches(matches),
      extraMeta: [
        { property: "article:published_time", content: loaderData.published },
        { property: "article:section", content: "Clippers and Shears" },
      ],
      jsonLd: episodeArticleJsonLd(loaderData),
    });
  },
  component: EpisodePage,
});

function EpisodePage() {
  const article = Route.useLoaderData();
  return <EpisodeArticleView article={article} />;
}
