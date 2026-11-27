// Content for the public guide at /guides/how-to-price-barber-services.
// Written so a search engine or an AI tool can quote any section on its own.
// Every number here is a labelled example, not a statistic.

export const pricingGuide = {
  path: "/guides/how-to-price-barber-services",
  title: "How to Price Your Barber Services",
  description:
    "Price your barber services from your costs, your time and the income you want: a step-by-step method, a worked example, and when to raise your prices.",
  published: "2026-11-27",
  shortAnswer:
    "Price your barber services from three numbers: what your business costs you each month, the hours you actually spend cutting, and the income you want to take home. Add your costs to your income goal, divide by your cutting hours to get what each hour must earn, then multiply by how long each service takes. Do not set your price by copying the shop down the street.",
} as const;

// The worked example. Round numbers, chosen to keep the arithmetic easy to follow.
export const pricingExample = {
  costs: [
    { label: "Booth rent", amount: 1000 },
    { label: "Products and supplies", amount: 200 },
    { label: "Tools and upkeep (clippers, blades, sharpening)", amount: 100 },
    { label: "Other business costs (booking app, insurance, education)", amount: 200 },
  ],
  incomeGoal: 4500,
  cuttingHoursPerWeek: 30,
  weeksPerMonth: 4,
  services: [
    { name: "Haircut", minutes: 45 },
    { name: "Haircut and beard", minutes: 60 },
  ],
} as const;

export function exampleNumbers(example = pricingExample) {
  const costs = example.costs.reduce((sum, c) => sum + c.amount, 0);
  const needed = costs + example.incomeGoal;
  const hours = example.cuttingHoursPerWeek * example.weeksPerMonth;
  const perHour = needed / hours;
  const services = example.services.map((s) => {
    const exact = (perHour * s.minutes) / 60;
    // Rounded up to the next $5, so the price covers the hour it is based on.
    return { ...s, exact, price: Math.ceil(exact / 5) * 5 };
  });
  return { costs, needed, hours, perHour, services };
}

export const pricingMistakes = [
  {
    title: "Copying the shop down the street",
    body: "Their rent, their hours and their goals are not yours. Their price tells you what the local range looks like, not what you need to charge.",
  },
  {
    title: "Counting hours in the shop instead of hours in the chair",
    body: "Time spent waiting, cleaning, answering messages and posting online is real work, but it is not paid by a client. Price from the hours you actually cut.",
  },
  {
    title: "Leaving costs out",
    body: "Blades, sharpening, card fees, the booking app, insurance and classes all come out of what you earn. If they are not in your numbers, they come out of your pay.",
  },
  {
    title: "Planning on a perfect year",
    body: "Holidays, sick days, slow weeks and no-shows happen. Base your hours on a normal week, not your best one.",
  },
  {
    title: "One price for every service",
    body: "A 20-minute lineup and a 60-minute cut with a beard and a design should not cost the same. Price each service by the time and skill it takes.",
  },
  {
    title: "Discounting to fill the chair",
    body: "Regular discounts teach clients to wait for them. If the chair is empty, look at your marketing and your booking first.",
  },
  {
    title: "Never raising prices",
    body: "Your costs go up and your skills improve. A price you set years ago is paying you for the barber you were then.",
  },
] as const;

export const raiseSignals = [
  "Your book is full most weeks and new clients wait to get in.",
  "Your costs have gone up since you last set your prices.",
  "You have added training, skills or a service you did not offer before.",
  "You have not looked at your prices in a year or more.",
] as const;

export const raiseSteps = [
  {
    title: "Run the numbers first",
    body: "Work out the new price with the method above so you can explain it calmly and stand behind it.",
  },
  {
    title: "Give clients notice",
    body: "Tell them a few weeks ahead, for example 30 days. Say it in the chair, then put it in writing with the date it starts.",
  },
  {
    title: "Keep it short and clear",
    body: "Name the new price and the date. You do not need to apologise or give a long reason.",
  },
  {
    title: "Start with new clients if you are unsure",
    body: "New bookings can pay the new price straight away while regulars move over on the date you announced.",
  },
  {
    title: "Keep the service the same or better",
    body: "Clients notice the price change once. They notice the quality every visit.",
  },
  {
    title: "Accept that a few may leave",
    body: "Someone who only chose you because you were the cheapest may go. That opens time for clients who value your work.",
  },
] as const;

export const pricingFaqs = [
  {
    question: "How much should I charge for a haircut?",
    answer:
      "There is no single right number. Add your monthly business costs to the income you want, divide by the hours you actually cut each month, and multiply that hourly figure by how long the haircut takes. That gives you a price that pays your costs and pays you.",
  },
  {
    question: "Should I charge the same as other barbers in my area?",
    answer:
      "Know the local range so you understand the market, but do not set your price from it. Other barbers have different costs, hours and goals. Set your price from your own numbers, then decide how you will show clients the value of your work.",
  },
  {
    question: "How often should I raise my prices?",
    answer:
      "Review your prices at least once a year, and again whenever your costs change. Raise them when your numbers show you are under-charging, when your book stays full, or when you have added skills or services.",
  },
  {
    question: "Will I lose clients if I raise my prices?",
    answer:
      "You may lose a few, usually the ones who chose you only on price. Give notice, tell clients the new price and the date clearly, and keep your service consistent. The time that opens up can go to clients who value your work.",
  },
  {
    question: "Should I charge more for beards, designs or longer services?",
    answer:
      "Yes. Price each service by the time and skill it takes. A service that takes twice as long should not cost the same as a quick cut.",
  },
] as const;
