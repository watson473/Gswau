import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { pageMeta } from "@/lib/site";
import { author } from "@/lib/catalog";
import { podcastName } from "@/lib/podcast";

export const Route = createFileRoute("/about")({
  head: () =>
    pageMeta(
      "About Us",
      "GSWAU is the education platform for barbers and hairstylists worldwide, created by Gs. W. Augustin.",
    ),
  component: About,
});

function About() {
  return (
    <InfoPage eyebrow="The Company" title="About GSWAU">
      <p>
        GSWAU, short for GSW Augustin University, is the education platform for barbers and
        hairstylists worldwide, created by {author.name}.
      </p>
      <p>
        Everything here is practical and made for people behind the chair: how to improve your
        skills, keep your clients coming back, build your brand and run a better, more profitable
        business.
      </p>

      <h2>What we offer</h2>
      <ul>
        <li>
          <strong>Audiobooks</strong> on pricing, building a clientele, branding, leadership and
          running a shop.
        </li>
        <li>
          <strong>Courses</strong> that turn the lessons into practical steps.
        </li>
        <li>
          <strong>The {podcastName} Podcast</strong>, free for everyone.
        </li>
        <li>
          <strong>1:1 coaching</strong> with {author.name} for barbers and stylists who want
          personal guidance.
        </li>
        <li>
          <strong>A weekly newsletter</strong> with one practical tip to cut better and earn more.
        </li>
      </ul>

      <h2>Membership</h2>
      <p>
        Anyone can browse the site, read free previews and listen to the podcast. Members get every
        audiobook and the courses for one monthly or yearly price.
      </p>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/library" className="btn-gold !no-underline !text-navy-deep">
          Explore the library
        </Link>
        <Link to="/pricing" className="btn-ghost !no-underline !text-foreground">
          See membership
        </Link>
      </div>
    </InfoPage>
  );
}
