import { spotifyEpisodeId } from "@/lib/podcast";
import { SITE_ORIGIN } from "@/lib/site";

// Episode article pages. Copy is the approved Episode 1 draft. Timestamps are from the
// start of each clip file, not the full episode clock. Internal transcript paths stay off the page.
// The visible "gswau.com/podcast" link keeps this www address. Canonical and JSON-LD use SITE_ORIGIN.
export const podcastPageUrl = "https://www.gswau.com/podcast";
export const kitNewsletterUrl = "https://gs-w-augustin-university.kit.com/34a8ef6dee";

const spotifyEpisodeUrl =
  "https://open.spotify.com/episode/4mNNq4uXFtCN1LhQ6DTZvs?si=dbbc7b576652437e";

export type EpisodeSection = {
  id: string;
  heading: string;
  caption: string;
  body: string;
  quote: string;
  quoteCite: string;
};

export type EpisodeFaq = {
  question: string;
  answer: string;
};

export type EpisodeArticle = {
  slug: string;
  kicker: string;
  title: string;
  /** Document title. Leads with the search phrase; the visible H1 stays the episode title. */
  documentTitle: string;
  socialTitle: string;
  description: string;
  lede: string;
  spotifyUrl: string;
  spotifyEpisodeId: string;
  /** Lowercase fragment of an RSS title that identifies this episode. */
  titleMatch: string;
  /** When this article page was added. Not backdated to the Spotify upload. */
  published: string;
  /** Spotify/RSS publish time for the episode itself. */
  episodePublished: string;
  glance: { id: string; label: string; note: string }[];
  sections: EpisodeSection[];
  faqs: EpisodeFaq[];
};

export const raiseYourPricesArticle: EpisodeArticle = {
  slug: "raise-your-prices-without-losing-your-chair",
  kicker: "Clippers and Shears Podcast, Episode 1",
  title: "Raise Your Prices Without Losing Your Chair",
  documentTitle:
    "How to Raise Barber Prices Without Losing Your Chair — Clippers and Shears, Episode 1 | GSWAU",
  socialTitle: "How to Raise Barber Prices Without Losing Your Chair",
  description:
    "How to raise barber prices without losing clients, what a cheap price says, and how to price a haircut with floor math. Clippers and Shears, Episode 1.",
  lede: "Your price is already talking before the clippers turn on. This episode is about what a cheap number says, why raising it feels like jumping off a roof, and the one bit of floor math to do tonight.",
  spotifyUrl: spotifyEpisodeUrl,
  spotifyEpisodeId: "4mNNq4uXFtCN1LhQ6DTZvs",
  titleMatch: "losing your chair",
  published: "2026-11-11",
  episodePublished: "2026-11-03",
  glance: [
    { id: "s1", label: "What a $15 price says", note: "from clip-01, at 0:09" },
    { id: "s2", label: "Why the number feels so hard to change", note: "from clip-04, at 0:03" },
    {
      id: "s3",
      label: "“You’re way too cheap” is not a compliment",
      note: "from clip-09, at 0:12",
    },
    { id: "s4", label: "Raise the service before the price", note: "from clip-02, at 0:13" },
    {
      id: "s5",
      label: "How to tell clients the price is going up",
      note: "from clip-08, at 0:21",
    },
    { id: "s6", label: "Do your floor math tonight", note: "from clip-10, at 0:07" },
  ],
  sections: [
    {
      id: "s1",
      heading: "1. What a $15 price says",
      caption:
        "From clip-01, at 0:09–0:38. Times are from the start of the clip, not the full episode.",
      body: "When the host travels, he skips the cheapest barber on purpose. He does not debate it. He sees $15 and moves on. Before the cape goes on, the client already has an opinion, and the price is a big part of that opinion. A cheap number says things the barber may not mean to say: still learning, will take anybody, will rush you. You might be the best barber in the city. A $15 price tells people you’re not.",
      quote:
        "“You might be the best barber in the city, but a $15 price is telling people you’re not.”",
      quoteCite: "From clip-01, at 0:34",
    },
    {
      id: "s2",
      heading: "2. Why the number feels so hard to change",
      caption: "From clip-04, at 0:03–0:40.",
      body: "Raising a price is “just a number” on the board, and it can still feel like jumping off a roof. The episode traces that feeling to how a lot of people were raised: talking about money is rude, charge what people can afford, be grateful for the clients you have, and if you’re too expensive they’ll go down the street. Being cheap gets mistaken for being humble, or for being nice.",
      quote: "“Being cheap is being tired.”",
      quoteCite: "From clip-04, at 0:39",
    },
    {
      id: "s3",
      heading: "3. “You’re way too cheap” is not a compliment",
      caption: "From clip-09, at 0:00–0:21.",
      body: "A regular of about two years loves the cut, hands over $35, and says the barber is way too cheap. The barber says thank you, as if it were a compliment. It was not. That moment is why they made the episode.",
      quote: "“It was not a compliment.”",
      quoteCite: "From clip-09, at 0:18",
    },
    {
      id: "s4",
      heading: "4. Raise the service before the price",
      caption: "From clip-02, at 0:13–0:28.",
      body: "You cannot only change the number and deliver the same haircut. If the cut goes from $35 to $55 and the client gets last week’s exact service, “he’s gonna feel some kind of way.” The rule in the episode is to raise the service first, so the price matches the promise: a clean station, tools that look cared for, being on time, a real consultation before the clippers, and small extras that do not cost much.",
      quote: "“Before you raise your price, you raise your service.”",
      quoteCite: "From clip-02, at 0:13",
    },
    {
      id: "s5",
      heading: "5. How to tell clients the price is going up",
      caption: "From clip-08, at 0:21–0:52.",
      body: "The host’s first attempt started with an apology. The correction in the episode is blunt: you are not begging for more money. You are informing clients about a business decision. Groceries do not apologise when eggs go up. The three steps: give two to four weeks’ notice, be clear and do not ramble, and thank them for their loyalty — warm, not cold — then stop talking.",
      quote:
        "“Listen, you are not begging for more money. You’re informing your clients about a business decision.”",
      quoteCite: "From clip-08, at 0:21",
    },
    {
      id: "s6",
      heading: "6. Do your floor math tonight",
      caption: "From clip-10, at 0:07–0:26.",
      body: "If a listener does only one thing this week, the episode’s answer is to do the floor math tonight. Write down monthly business costs, write down what you want to take home, add them, divide by the days you want to work, then divide by how many clients you comfortably see in a day. That number is the floor. If the current price is already under it, the question is not whether to raise. It is when.",
      quote: "“And that number is your floor.”",
      quoteCite: "From clip-10, at 0:24",
    },
  ],
  faqs: [
    {
      question: "Why does raising a barber’s price feel so hard?",
      answer:
        "Because a lot of people were raised to treat talk about money as rude, and to “charge what people can afford.” The episode says that feeling is why a simple change on the board can feel like jumping off a roof. (clip-04, 0:03–0:21)",
    },
    {
      question: "What does a cheap price say to a client?",
      answer:
        "It can say “I’m still learning,” “I’ll take anybody,” and “I’m going to rush you,” even when none of that is true. (clip-01, 0:24–0:33)",
    },
    {
      question: "What if everybody leaves after a price increase?",
      answer:
        "The episode’s honest answer is that some people will leave, not everybody, and that a price increase works like a filter: the people who trust you tend to stay; the people who were only there for the price are more likely to go. (clip-07, 0:06–0:31)",
    },
    {
      question: "What is the one thing to do tonight?",
      answer:
        "Sit down with a piece of paper or the notes app and work out the floor: costs plus take-home, divided by working days, divided by comfortable clients per day. (clip-10, 0:07–0:26)",
    },
  ],
};

export const episodeArticles = [raiseYourPricesArticle] as const;

export function episodeArticleBySlug(slug: string) {
  return episodeArticles.find((article) => article.slug === slug) ?? null;
}

export function episodeArticleUrl(article: EpisodeArticle) {
  return `${SITE_ORIGIN}/podcast/${article.slug}`;
}

export function articleForEpisode(episode: { title: string; audioUrl: string }) {
  const id = spotifyEpisodeId(episode.audioUrl);
  if (id) {
    const byId = episodeArticles.find((article) => article.spotifyEpisodeId === id);
    if (byId) return byId;
  }
  const title = episode.title.toLowerCase();
  return episodeArticles.find((article) => title.includes(article.titleMatch)) ?? null;
}

export function episodeArticlePlainText(article: EpisodeArticle) {
  return [
    article.kicker,
    article.title,
    article.documentTitle,
    article.description,
    article.lede,
    ...article.glance.flatMap((item) => [item.label, item.note]),
    ...article.sections.flatMap((section) => [
      section.heading,
      section.caption,
      section.body,
      section.quote,
      section.quoteCite,
    ]),
    ...article.faqs.flatMap((faq) => [faq.question, faq.answer]),
    "Listen and the newsletter",
    "Wanna listen? Head to gswau.com/podcast for the full episode, or listen on Spotify.",
    "Education first, in your inbox. No pitch for a call.",
    "Get the GSWAU newsletter",
  ].join("\n");
}

export function episodeArticleJsonLd(article: EpisodeArticle) {
  const url = episodeArticleUrl(article);
  const seriesUrl = `${SITE_ORIGIN}/podcast`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: article.title,
        name: article.socialTitle,
        description: article.description,
        datePublished: article.published,
        dateModified: article.published,
        inLanguage: "en",
        author: { "@type": "Person", name: "Gs. W. Augustin" },
        publisher: {
          "@type": "Organization",
          "@id": `${SITE_ORIGIN}/#organization`,
          name: "GSW Augustin University",
          url: `${SITE_ORIGIN}/`,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_ORIGIN}/icon-512.png`,
            width: 512,
            height: 512,
          },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        isPartOf: { "@type": "WebSite", name: "GSWAU", url: `${SITE_ORIGIN}/` },
        isBasedOn: {
          "@type": "PodcastEpisode",
          name: article.title,
          url: article.spotifyUrl,
          datePublished: article.episodePublished,
          partOfSeries: {
            "@type": "PodcastSeries",
            "@id": `${seriesUrl}#series`,
            name: "Clippers and Shears",
            url: seriesUrl,
          },
        },
      },
      {
        "@type": "PodcastEpisode",
        "@id": `${url}#episode`,
        name: article.title,
        description: article.description,
        datePublished: article.episodePublished,
        url,
        inLanguage: "en",
        author: { "@type": "Person", name: "Gs. W. Augustin" },
        partOfSeries: {
          "@type": "PodcastSeries",
          "@id": `${seriesUrl}#series`,
          name: "Clippers and Shears",
          url: seriesUrl,
        },
        sameAs: article.spotifyUrl,
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: article.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_ORIGIN}/` },
          { "@type": "ListItem", position: 2, name: "Podcast", item: seriesUrl },
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
    ],
  };
}
