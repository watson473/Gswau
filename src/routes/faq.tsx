import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { podcastName } from "@/lib/podcast";
import { contact, pageMeta } from "@/lib/site";

export const Route = createFileRoute("/faq")({
  head: () =>
    pageMeta(
      "FAQ",
      "Answers about GSWAU audiobooks, membership, coaching, purchases and your account.",
    ),
  component: Faq,
});

function Faq() {
  return (
    <InfoPage eyebrow="The Company" title="Frequently Asked Questions">
      <h2>What is GSWAU?</h2>
      <p>
        GSWAU is an education platform for barbers and hairstylists. It offers audiobooks, courses,
        the {podcastName} Podcast, a weekly newsletter and 1:1 coaching.
      </p>

      <h2>What do I get with a membership?</h2>
      <p>
        Members can listen to every audiobook and take the courses included with membership. You can
        choose to pay $19.99 a month or $199 a year. See <Link to="/pricing">Pricing</Link> for
        details.
      </p>

      <h2>How do I pay?</h2>
      <p>
        Purchases and memberships are paid securely through Gumroad, our payment provider. GSWAU
        never sees or stores your card details.
      </p>

      <h2>I bought something. How do I get access?</h2>
      <p>
        Create an account on this site with the same email address you used at checkout. Your
        purchases and membership then appear in My library. If you already have an account, sign in
        with that email.
      </p>

      <h2>I bought on Gumroad before this site existed. Do I keep my audiobooks?</h2>
      <p>
        Yes. Sign up with the email address you used on Gumroad and your earlier purchases will be
        in My library.
      </p>

      <h2>How do I cancel my membership?</h2>
      <p>
        Use the “Manage membership” link in your Gumroad receipt email, or the link in My library.
        You keep access until the end of the period you have already paid for.
      </p>

      <h2>Can I get a refund?</h2>
      <p>
        Please see our <Link to="/refunds">Refund Policy</Link>.
      </p>

      <h2>Can I try before I buy?</h2>
      <p>
        Yes. Many audiobooks have a free preview, and the podcast and newsletter are free for
        everyone.
      </p>

      <h2>How does coaching work?</h2>
      <p>
        Choose a coaching plan on the <Link to="/coaching">Coaching</Link> page and pay through
        Gumroad. After payment you receive a link to book your session time on Calendly.
      </p>

      <h2>Can I share my account or files?</h2>
      <p>
        No. Your account and purchases are for your own personal use. Please do not share, resell or
        upload the audiobooks or courses anywhere else.
      </p>

      <h2>I forgot my password.</h2>
      <p>
        Use “Forgot password?” on the sign-in page and we will email you a link to set a new one.
      </p>

      <h2>How do I stop the newsletter?</h2>
      <p>Every newsletter email has an unsubscribe link at the bottom.</p>

      <h2>My question isn't answered here.</h2>
      <p>
        <Link to="/contact">Contact us</Link>: call {contact.phone} or email{" "}
        <a href={`mailto:${contact.email}`}>{contact.email}</a>.
      </p>
    </InfoPage>
  );
}
