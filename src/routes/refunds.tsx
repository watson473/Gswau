import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { contact, pageMeta, policiesUpdated } from "@/lib/site";

export const Route = createFileRoute("/refunds")({
  head: () =>
    pageMeta("Refund Policy", "GSWAU refund rules for audiobooks, membership and coaching."),
  component: Refunds,
});

function Refunds() {
  return (
    <InfoPage eyebrow="The Company" title="Refund Policy" updated={policiesUpdated}>
      <p>
        We want you to be happy with what you buy from GSWAU. This policy explains when a refund is
        possible. Payments are processed by Gumroad, and any refund is returned to the payment
        method you used.
      </p>

      <h2>Audiobooks and other single purchases</h2>
      <p>
        Audiobooks and other digital products can be accessed as soon as you buy them, so all sales
        are final. We will give a refund only if:
      </p>
      <ul>
        <li>you were charged more than once for the same purchase, or</li>
        <li>a file does not work and we are unable to fix it for you.</li>
      </ul>

      <h2>Membership</h2>
      <p>
        You can cancel your membership at any time. After you cancel, you keep access until the end
        of the month or year you have already paid for, and you will not be charged again.
        Membership payments that have already been made are not refunded, including for any unused
        part of a month or year.
      </p>

      <h2>Coaching: Single Session</h2>
      <ul>
        <li>
          If you cancel at least 48 hours before your session, you can choose a full refund or move
          the session to another time.
        </li>
        <li>
          Sessions cancelled less than 48 hours before they start, missed sessions and sessions that
          have already taken place are not refunded.
        </li>
      </ul>

      <h2>Coaching: Growth Month and Shop Launch</h2>
      <ul>
        <li>If you cancel before your first session, you get a full refund.</li>
        <li>
          Once the package has started, unused sessions can be rescheduled but are not refunded.
        </li>
      </ul>

      <h2>How to ask for a refund</h2>
      <p>
        Email <a href={`mailto:${contact.email}`}>{contact.email}</a> or call {contact.phone}.
        Please include the email address you used to pay and what you bought. If your refund is
        approved, we process it through Gumroad. The time it takes to appear on your statement
        depends on your bank or card provider.
      </p>
      <p>
        If you think you were charged by mistake, please <Link to="/contact">contact us</Link>{" "}
        before contacting your bank, so we can sort it out quickly.
      </p>
    </InfoPage>
  );
}
