// Content for the public guide at /guides/how-to-get-more-barber-clients.
// Written so a search engine or an AI tool can quote any section on its own.
// Every number here is a labelled example, not a statistic.

export const clientsGuide = {
  path: "/guides/how-to-get-more-barber-clients",
  title: "How to Get More Clients as a Barber",
  description:
    "Get more barber clients by keeping the ones you have, making booking easy and asking for referrals: a step-by-step method, a worked example and common mistakes.",
  published: "2026-11-27",
  shortAnswer:
    "Most barbers get more clients by keeping the ones they already have, not by chasing strangers. Rebook every client before they leave the chair, make booking take less than a minute, and ask happy clients to send someone your way. Then show your work every week where local people look, and track where each new client came from so you do more of what works.",
} as const;

export const clientsSteps = [
  {
    title: "Decide who you want in your chair",
    body: "Write down the clients you want more of: the cuts they book, how often they come and what they are willing to pay. Everything you post and say should speak to them.",
  },
  {
    title: "Make booking take less than a minute",
    body: "Use one booking link and put it everywhere: your social profiles, your business card and your messages. Answer booking messages quickly. Every extra step loses people.",
  },
  {
    title: "Rebook every client before they leave",
    body: "While they are still in the chair, suggest a date for the next visit based on how fast their cut grows out, and book it on the spot. A new client only becomes a regular if they come back.",
  },
  {
    title: "Ask for the referral",
    body: "Happy clients will recommend you, but most will not think to unless you ask. A simple line works: if you know anyone looking for a barber, send them my way. Hand them a card or your booking link to pass on.",
  },
  {
    title: "Show your work every week",
    body: "Post clear photos of finished cuts, with the client's permission, in good light and from the same angles each time. Steady, honest posts beat chasing a viral video.",
  },
  {
    title: "Be easy to find locally",
    body: "Keep your shop name, address, hours and booking link correct everywhere people search, including maps. Ask happy clients to leave an honest review there.",
  },
  {
    title: "Track where new clients come from",
    body: "Ask every new client how they found you and write it down. Once a month, look at the list and put more time into what brings people in and less into what does not.",
  },
] as const;

export const clientsMistakes = [
  {
    title: "Cutting your price to get clients",
    body: "A low price brings in people who are shopping for a low price, and they leave for the next one. Price from your numbers, and win clients with the cut and the experience.",
  },
  {
    title: "Chasing new clients and forgetting the ones you have",
    body: "If new clients do not come back, you have to find them again every month. Keeping the clients you already have is the cheapest way to grow.",
  },
  {
    title: "Making people work to book you",
    body: "No booking link, slow replies or a phone that goes to voicemail all send clients to the next barber. Make it easy to say yes.",
  },
  {
    title: "Counting followers instead of bookings",
    body: "Likes do not pay rent. What matters is how many people book from what you post. Put your booking link where they can tap it.",
  },
  {
    title: "Trying everything at once",
    body: "Posting on every app, running a promotion and handing out flyers in the same week makes it impossible to tell what worked. Pick two or three things and do them well.",
  },
  {
    title: "Never asking",
    body: "Not asking for the rebooking, the referral or the review leaves clients on the table. Most people are happy to help when they are asked plainly.",
  },
] as const;

// The worked example. Round numbers, chosen to keep the arithmetic easy to follow.
// It assumes regulars come once a month and nobody leaves, to keep the method clear.
export const clientsExample = {
  newClientsPerMonth: 10,
  pricePerVisit: 40,
  months: 6,
  keptBefore: 3,
  keptAfter: 6,
} as const;

export function clientsExampleNumbers(example = clientsExample) {
  const regulars = (kept: number) => kept * example.months;
  const monthly = (kept: number) => regulars(kept) * example.pricePerVisit;
  return {
    regularsBefore: regulars(example.keptBefore),
    regularsAfter: regulars(example.keptAfter),
    monthlyBefore: monthly(example.keptBefore),
    monthlyAfter: monthly(example.keptAfter),
    extraPerMonth: monthly(example.keptAfter) - monthly(example.keptBefore),
  };
}

export const clientsFaqs = [
  {
    question: "What is the fastest way for a barber to get more clients?",
    answer:
      "Start with the people already in your chair. Rebook every client before they leave and ask happy clients to send someone your way. Those clients already trust you, so it costs nothing and works faster than finding strangers.",
  },
  {
    question: "Should I offer discounts to get new barber clients?",
    answer:
      "Be careful. A lower price attracts people who are shopping on price, and they tend to leave for the next deal. If you use an offer, make it a thank-you for a referral that books, not a cut to your normal price.",
  },
  {
    question: "How do I get barber clients without social media?",
    answer:
      "Rebook every client, ask for referrals, keep your shop details correct on maps and ask for honest reviews. Hand out cards with your booking link, and take walk-ins when your shop allows it. Social media helps, but it is not the only way.",
  },
  {
    question: "How do I get clients as a new barber with no clientele?",
    answer:
      "Tell everyone you know that you are cutting and where to book you. Take walk-ins and overflow from busier barbers in your shop, give every first-time client a real consultation, and rebook them before they leave. Every regular starts as one first visit.",
  },
  {
    question: "How long does it take to build a full book as a barber?",
    answer:
      "It depends on where you work, how much time you can put in and how many new clients come back. There is no fixed timeline. Track how many new clients you get each month and how many of them rebook, and you will see your own progress clearly.",
  },
] as const;
