import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { pageMeta } from "@/lib/share";

// Coaching is not sold here. The old address explains that, instead of sending people home.
export const Route = createFileRoute("/coaching")({
  head: () =>
    pageMeta(
      "Coaching",
      "One-to-one coaching is not offered on GSWAU. The membership includes the audiobooks and video courses.",
      "/coaching",
    ),
  component: Coaching,
});

function Coaching() {
  return (
    <InfoPage eyebrow="GSWAU" title="Coaching">
      <p>One-to-one coaching is not offered on this site.</p>
      <p>
        The membership includes the audiobooks and the video courses. You can also browse the
        library one title at a time.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/pricing" className="btn-gold !no-underline !text-navy-deep">
          See membership
        </Link>
        <Link to="/library" className="btn-ghost !no-underline !text-foreground">
          Browse the library
        </Link>
      </div>
    </InfoPage>
  );
}
