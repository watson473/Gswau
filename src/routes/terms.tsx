import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { businessName, contact, pageMeta, policiesUpdated } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  head: () => pageMeta("Terms of Use", "The terms for using the GSWAU website and services."),
  component: Terms,
});

function Terms() {
  return (
    <InfoPage eyebrow="The Company" title="Terms of Use" updated={policiesUpdated}>
      <p>
        These terms apply to the GSWAU website and everything offered through it, including
        audiobooks, courses, membership, the podcast, the newsletter and coaching. The site is run
        by {businessName}. By using the site you agree to these terms. If you do not agree, please
        do not use the site.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>You must be at least 18, or have permission from a parent or guardian.</li>
        <li>Give an email address you can access, and keep your password private.</li>
        <li>You are responsible for anything done with your account.</li>
        <li>One account is for one person. Please do not share your sign-in.</li>
      </ul>

      <h2>Purchases and payments</h2>
      <p>
        Audiobooks, memberships and coaching are sold through Gumroad, our payment provider.
        Gumroad’s own terms also apply to your payment. Prices are shown before you pay and may
        change in the future; a change never affects a purchase you have already made.
      </p>

      <h2>Membership</h2>
      <p>
        A membership renews automatically each month or year until you cancel. You can cancel at any
        time and keep access until the end of the period you have paid for. Membership gives access
        to the audiobooks and courses marked as included; some products may be sold separately.
      </p>

      <h2>Refunds</h2>
      <p>
        Refunds are covered by our <Link to="/refunds">Refund Policy</Link>.
      </p>

      <h2>Using our content</h2>
      <p>
        All audiobooks, courses, podcast episodes, articles, images and other content on GSWAU
        belong to {businessName} or the people who licensed them to us. When you buy or join, you
        get a personal licence to listen to and use the content for your own learning. You may not:
      </p>
      <ul>
        <li>copy, share, sell, rent or give away the audiobooks or courses;</li>
        <li>upload them to other websites, apps or groups;</li>
        <li>use them to create competing products or train software.</li>
      </ul>

      <h2>Coaching</h2>
      <p>
        Coaching sessions are booked through Calendly after payment. Please arrive on time.
        Cancellations and rescheduling follow our <Link to="/refunds">Refund Policy</Link>.
      </p>

      <h2>Educational content only</h2>
      <p>
        Our content and coaching share experience and practical ideas for barbers and hairstylists.
        They are not legal, financial, tax or medical advice, and results depend on your own work
        and circumstances. We do not guarantee any particular income or result.
      </p>

      <h2>Your behaviour on the site</h2>
      <p>
        Please be respectful when you leave reviews or send messages. Do not post anything unlawful,
        offensive or misleading, or try to break or misuse the site. We may remove content or close
        accounts that break these terms.
      </p>

      <h2>Other services</h2>
      <p>
        The site links to and uses services run by others, such as Gumroad, Calendly, Spotify and
        Kit. We are not responsible for those services, and their own terms apply.
      </p>

      <h2>Limits of our responsibility</h2>
      <p>
        We work to keep the site available and accurate, but it is provided “as is”. As far as the
        law allows, GSWAU is not liable for indirect or unexpected losses, and our total liability
        to you is limited to the amount you paid us in the 12 months before the claim. Nothing in
        these terms limits rights you have by law that cannot be limited.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        We may update these terms from time to time. The date at the top shows the latest version.
        If you keep using the site after a change, the new terms apply.
      </p>

      <h2>Governing law</h2>
      <p>
        These terms are governed by the laws of{" "}
        <mark className="rounded bg-gold/30 px-1">[to confirm: country or state]</mark>.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email <a href={`mailto:${contact.email}`}>{contact.email}</a>{" "}
        or call {contact.phone}.
      </p>
    </InfoPage>
  );
}
