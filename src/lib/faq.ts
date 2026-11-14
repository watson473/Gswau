import { formatPlanAmount, membershipPrices } from "@/lib/catalog";
import { podcastName } from "@/lib/podcast";
import { contact } from "@/lib/site";

// FAQ copy, shared by the page and FAQPage structured data. Parts keep the links
// that the sentences already had.
export type FaqPart =
  | { kind: "text"; text: string }
  | { kind: "link"; to: "/pricing" | "/refunds" | "/contact"; text: string }
  | { kind: "mail" };

export type FaqEntry = { question: string; parts: FaqPart[] };

const monthly = formatPlanAmount(membershipPrices.monthly);
const yearly = formatPlanAmount(membershipPrices.annual);

export const faqEntries: FaqEntry[] = [
  {
    question: "What is GSWAU?",
    parts: [
      {
        kind: "text",
        text: `GSWAU is an education platform for barbers and hairstylists. It offers audiobooks, courses, the ${podcastName} Podcast, and a weekly newsletter.`,
      },
    ],
  },
  {
    question: "What do I get with a membership?",
    parts: [
      {
        kind: "text",
        text: `Members can listen to every audiobook and take the courses included with membership. You can choose to pay ${monthly} a month or ${yearly} a year. See `,
      },
      { kind: "link", to: "/pricing", text: "Pricing" },
      { kind: "text", text: " for details." },
    ],
  },
  {
    question: "How do I pay?",
    parts: [
      {
        kind: "text",
        text: "Purchases and memberships are paid securely through Gumroad, our payment provider. GSWAU never sees or stores your card details.",
      },
    ],
  },
  {
    question: "I bought something. How do I get access?",
    parts: [
      {
        kind: "text",
        text: "Create an account on this site with the same email address you used at checkout. Your purchases and membership then appear in My library. If you already have an account, sign in with that email.",
      },
    ],
  },
  {
    question: "I bought on Gumroad before this site existed. Do I keep my audiobooks?",
    parts: [
      {
        kind: "text",
        text: "Yes. Sign up with the email address you used on Gumroad and your earlier purchases will be in My library.",
      },
    ],
  },
  {
    question: "How do I cancel my membership?",
    parts: [
      {
        kind: "text",
        text: "Use the “Manage membership” link in your Gumroad receipt email, or the link in My library. You keep access until the end of the period you have already paid for.",
      },
    ],
  },
  {
    question: "Can I get a refund?",
    parts: [
      { kind: "text", text: "Please see our " },
      { kind: "link", to: "/refunds", text: "Refund Policy" },
      { kind: "text", text: "." },
    ],
  },
  {
    question: "Can I try before I buy?",
    parts: [
      {
        kind: "text",
        text: "Yes. Many audiobooks have a free preview, and the podcast and newsletter are free for everyone.",
      },
    ],
  },
  {
    question: "Can I share my account or files?",
    parts: [
      {
        kind: "text",
        text: "No. Your account and purchases are for your own personal use. Please do not share, resell or upload the audiobooks or courses anywhere else.",
      },
    ],
  },
  {
    question: "I forgot my password.",
    parts: [
      {
        kind: "text",
        text: "Use “Forgot password?” on the sign-in page and we will email you a link to set a new one.",
      },
    ],
  },
  {
    question: "How do I stop the newsletter?",
    parts: [
      {
        kind: "text",
        text: "Every newsletter email has an unsubscribe link at the bottom.",
      },
    ],
  },
  {
    question: "My question isn't answered here.",
    parts: [
      { kind: "link", to: "/contact", text: "Contact us" },
      { kind: "text", text: `: call ${contact.phone} or email ` },
      { kind: "mail" },
      { kind: "text", text: "." },
    ],
  },
];

export function faqAnswerText(entry: FaqEntry) {
  return entry.parts
    .map((part) => {
      if (part.kind === "text" || part.kind === "link") return part.text;
      return contact.email;
    })
    .join("");
}

export function faqPlainEntries() {
  return faqEntries.map((entry) => ({
    question: entry.question,
    answer: faqAnswerText(entry),
  }));
}
