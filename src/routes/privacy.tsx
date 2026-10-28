import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { businessName, contact, pageMeta, policiesUpdated } from "@/lib/site";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageMeta("Privacy Policy", "What information GSWAU collects, why, and the choices you have."),
  component: Privacy,
});

function Privacy() {
  return (
    <InfoPage eyebrow="The Company" title="Privacy Policy" updated={policiesUpdated}>
      <p>
        This policy explains what information {businessName} collects when you use the GSWAU
        website, how we use it and the choices you have. We collect only what we need to run the
        site and never sell your personal information.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Your account:</strong> your email address and a securely stored password.
        </li>
        <li>
          <strong>Your purchases:</strong> when you buy through Gumroad, Gumroad tells us your email
          address, what you bought and the status of your membership. We never receive your card
          details.
        </li>
        <li>
          <strong>Newsletter:</strong> your email address and, if you give it, your first name.
        </li>
        <li>
          <strong>Messages:</strong> the name, email address and message you send us through the
          contact form.
        </li>
        <li>
          <strong>Site use:</strong> simple counts of actions such as sign-ups, preview reads,
          podcast plays and newsletter sign-ups, linked to a random ID stored in your browser, not
          to your name.
        </li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>to give you access to what you bought and to your membership;</li>
        <li>to send the newsletter, if you signed up;</li>
        <li>to answer your messages and support requests;</li>
        <li>to understand which parts of the site are useful and improve them;</li>
        <li>to keep the site secure and prevent misuse.</li>
      </ul>

      <h2>Services that help us run GSWAU</h2>
      <p>We share information only with the services we use to run the site:</p>
      <ul>
        <li>
          <strong>Supabase</strong>: our database, accounts and file storage.
        </li>
        <li>
          <strong>Vercel</strong>: hosts the website.
        </li>
        <li>
          <strong>Gumroad</strong>: takes payments and manages memberships.
        </li>
        <li>
          <strong>Kit</strong>: sends the newsletter.
        </li>
        <li>
          <strong>Spotify for Creators</strong>: delivers the podcast audio.
        </li>
        <li>
          <strong>Google Fonts and Unsplash</strong>: provide the site’s fonts and some blog photos.
        </li>
      </ul>
      <p>
        When your browser loads audio, fonts or images from these services, they can see your IP
        address, as with any website. Each service has its own privacy policy.
      </p>

      <h2>Cookies and browser storage</h2>
      <p>
        We use your browser’s storage to keep you signed in and to hold the random ID used for site
        counts. We do not use advertising cookies or third-party tracking for adverts.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep your account and purchase records while your account is open and as long as needed
        for accounting and legal reasons. You can ask us to delete your account at any time.
      </p>

      <h2>Your choices and rights</h2>
      <ul>
        <li>Unsubscribe from the newsletter with the link in any email.</li>
        <li>
          Ask us for a copy of your information, to correct it or to delete it, by emailing{" "}
          <a href={`mailto:${contact.email}`}>{contact.email}</a>.
        </li>
      </ul>

      <h2>Children</h2>
      <p>
        GSWAU is made for adults working in the beauty industry. It is not meant for children under
        13, and we do not knowingly collect their information.
      </p>

      <h2>Security</h2>
      <p>
        We use secure connections and trusted providers to protect your information. No system is
        perfectly secure, so please use a strong password and keep it private.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The date at the top shows the latest version.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about your privacy? Email <a href={`mailto:${contact.email}`}>{contact.email}</a>{" "}
        or call {contact.phone}.
      </p>
    </InfoPage>
  );
}
