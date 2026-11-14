import { createFileRoute, Link } from "@tanstack/react-router";
import { Eyebrow } from "@/components/SiteChrome";
import { formatPlanAmount, membershipPrices } from "@/lib/catalog";
import { podcastName } from "@/lib/podcast";
import { pageMeta } from "@/lib/share";

const monthly = formatPlanAmount(membershipPrices.monthly);
const yearly = formatPlanAmount(membershipPrices.annual);

export const Route = createFileRoute("/programs")({
  head: () =>
    pageMeta(
      "Programs",
      `GSWAU programs: membership at ${monthly} a month or ${yearly} a year, the free earnings calculator, and the ${podcastName} podcast.`,
      "/programs",
    ),
  component: ProgramsPage,
});

const offers = [
  {
    to: "/pricing",
    eyebrow: "Membership",
    title: "Membership",
    price: `${monthly}/mo or ${yearly}/yr`,
    body: "Every audiobook, plus the short courses included with membership.",
  },
  {
    to: "/calculator",
    eyebrow: "Free tool",
    title: "Earnings calculator",
    price: "Free",
    body: "A free pre-tax estimate for the clients you serve.",
  },
  {
    to: "/podcast",
    eyebrow: "Listen free",
    title: `${podcastName} podcast`,
    price: "Free",
    body: "The podcast for barbers and hairstylists, free for everyone.",
  },
] as const;

function ProgramsPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:py-20">
      <Eyebrow>GSWAU</Eyebrow>
      <h1 className="mt-3 text-4xl font-semibold sm:text-6xl">Programs</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Three ways to use GSWAU: the membership, the free calculator, and the podcast.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {offers.map((offer) => (
          <Link
            key={offer.to}
            to={offer.to}
            className="block rounded-lg bg-card p-6 shadow-card transition hover:ring-1 hover:ring-gold"
          >
            <Eyebrow>{offer.eyebrow}</Eyebrow>
            <h2 className="mt-3 text-3xl font-semibold">{offer.title}</h2>
            <p className="mt-3 font-display text-2xl text-gold">{offer.price}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{offer.body}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
