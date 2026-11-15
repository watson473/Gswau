import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useT } from "@/i18n";
import { useSuspenseQuery } from "@tanstack/react-query";
import { author } from "@/lib/catalog";
import { postQuery, productsQuery } from "@/lib/catalog.functions";
import { formatPostDate, imageSrc, productLinkPhrases, splitByPhrases } from "@/lib/display";
import {
  blogPostingNode,
  breadcrumbList,
  jsonLdGraph,
  originFromMatches,
  shareMeta,
} from "@/lib/share";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    const [post] = await Promise.all([
      context.queryClient.ensureQueryData(postQuery(params.slug)),
      context.queryClient.ensureQueryData(productsQuery),
    ]);
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData, matches }) => {
    if (!loaderData)
      return { meta: [{ title: "Not found — GSWAU" }, { name: "robots", content: "noindex" }] };
    const description =
      loaderData.excerpt.trim() ||
      "Articles from Gs. W. Augustin on growing a barber or beauty business.";
    const path = `/blog/${loaderData.slug}`;
    return shareMeta({
      title: `${loaderData.title} — GSWAU Blog`,
      socialTitle: loaderData.title,
      description,
      path,
      type: "article",
      image: loaderData.cover_image_url,
      imageAlt: loaderData.title,
      assetOrigin: originFromMatches(matches),
      extraMeta: loaderData.published_at
        ? [{ property: "article:published_time", content: loaderData.published_at }]
        : undefined,
      jsonLd: jsonLdGraph(
        breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: loaderData.title, path },
        ]),
        blogPostingNode({
          slug: loaderData.slug,
          title: loaderData.title,
          excerpt: description,
          publishedAt: loaderData.published_at,
          updatedAt: loaderData.updated_at,
          image: loaderData.cover_image_url,
        }),
      ),
    });
  },
  component: Post,
});

function Post() {
  const { t } = useT();
  const { slug } = Route.useParams();
  const { data: p } = useSuspenseQuery(postQuery(slug));
  const { data: products } = useSuspenseQuery(productsQuery);
  if (!p) return null;
  const phrases = productLinkPhrases(products);
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <div className="eyebrow text-crimson">{formatPostDate(p.published_at)}</div>
      <h1 className="mt-3 text-5xl font-semibold leading-tight">{p.title}</h1>
      <p className="mt-3 text-base text-muted-foreground">By {author.name}</p>
      {p.cover_image_url && (
        <img
          src={imageSrc(p.cover_image_url, 1200)}
          alt={p.title}
          className="mt-8 w-full rounded-md object-cover"
        />
      )}
      <PostBody body={p.body} phrases={phrases} />
      {slug === "raise-your-prices-without-losing-clients" && (
        <Link
          to="/calculator"
          className="mt-10 block rounded-lg border border-gold/40 bg-card p-5 shadow-card transition hover:border-gold"
        >
          <div className="eyebrow text-crimson">{t("calc.eyebrow")}</div>
          <h2 className="mt-2 text-2xl font-semibold">{t("home.cta.calculator")}</h2>
          <p className="mt-2 text-base text-muted-foreground">{t("blog.calc.line")}</p>
        </Link>
      )}
    </article>
  );
}

// Plain text with blank lines between paragraphs; a paragraph starting "## " is a subheading,
// and one whose lines all start "- " is a bullet list.
function LinkedText({
  text,
  phrases,
}: {
  text: string;
  phrases: ReturnType<typeof productLinkPhrases>;
}) {
  return splitByPhrases(text, phrases).map((part, index) =>
    part.slug ? (
      <Link key={index} to="/library/$slug" params={{ slug: part.slug }} className="underline">
        {part.text}
      </Link>
    ) : (
      <span key={index}>{part.text}</span>
    ),
  );
}

function PostBody({
  body,
  phrases,
}: {
  body: string;
  phrases: ReturnType<typeof productLinkPhrases>;
}) {
  const blocks = body
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);
  return (
    <div className="mt-8 space-y-5 text-lg leading-relaxed">
      {blocks.map((b, i) => {
        if (b.startsWith("## "))
          return (
            <h2 key={i} className="pt-4 text-3xl font-semibold">
              <LinkedText text={b.slice(3)} phrases={phrases} />
            </h2>
          );
        const lines = b.split("\n");
        if (lines.every((l) => l.startsWith("- ")))
          return (
            <ul key={i} className="list-disc space-y-2 pl-6">
              {lines.map((l, j) => (
                <li key={j}>
                  <LinkedText text={l.slice(2)} phrases={phrases} />
                </li>
              ))}
            </ul>
          );
        return (
          <p key={i} className="whitespace-pre-line">
            <LinkedText text={b} phrases={phrases} />
          </p>
        );
      })}
    </div>
  );
}
