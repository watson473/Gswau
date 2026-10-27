import { createFileRoute } from "@tanstack/react-router";
import { Eyebrow } from "@/components/SiteChrome";

export const Route = createFileRoute("/coaching")({
  head: () => ({
    meta: [
      { title: "1:1 Coaching — GSWAU" },
      {
        name: "description",
        content: "Private business coaching sessions for barbers and stylists.",
      },
      { property: "og:title", content: "1:1 Coaching — GSWAU" },
      { property: "og:description", content: "A mentor in your corner." },
    ],
  }),
  component: Coaching,
});

// Each Gumroad product shows the buyer the Calendly booking link after payment.
const plans = [
  {
    name: "Single Session",
    price: "$150",
    desc: "60 minutes on one challenge — pricing, hiring or branding.",
    buyUrl: "https://gswau.gumroad.com/l/sttsrx",
  },
  {
    name: "Growth Month",
    price: "$500",
    desc: "Four weekly sessions plus messaging support between calls.",
    buyUrl: "https://gswau.gumroad.com/l/iyggt",
    featured: true,
  },
  {
    name: "Shop Launch",
    price: "$1,200",
    desc: "Twelve weeks taking you from chair to shop opening.",
    buyUrl: "https://gswau.gumroad.com/l/fsqiqd",
  },
];

function Coaching() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <Eyebrow>Private mentorship</Eyebrow>
      <h1 className="mt-3 text-5xl font-semibold">1:1 Coaching</h1>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`rounded-lg p-8 shadow-card ${p.featured ? "bg-navy-gradient text-primary-foreground" : "bg-card"}`}
          >
            <div className={`eyebrow ${p.featured ? "text-gold" : "text-crimson"}`}>
              {p.featured ? "Most popular" : "Coaching"}
            </div>
            <h2 className="mt-3 text-3xl font-semibold">{p.name}</h2>
            <div className="mt-2 font-display text-4xl">{p.price}</div>
            <p className="mt-4 text-sm opacity-80">{p.desc}</p>
            <a href={p.buyUrl} rel="noopener" className="btn-gold mt-8 w-full">
              Book for {p.price}
            </a>
            <p className="mt-3 text-center text-xs opacity-70">
              Pay on Gumroad, then pick your time on Calendly.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
