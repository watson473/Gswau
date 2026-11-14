import { Fragment } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { InfoPage } from "@/components/InfoPage";
import { faqEntries, faqPlainEntries, type FaqPart } from "@/lib/faq";
import { breadcrumbList, faqPage, jsonLdGraph, shareMeta } from "@/lib/share";
import { contact } from "@/lib/site";

export const Route = createFileRoute("/faq")({
  head: () =>
    shareMeta({
      title: "FAQ — GSWAU",
      description: "Answers about GSWAU audiobooks, membership, purchases and your account.",
      path: "/faq",
      jsonLd: jsonLdGraph(
        breadcrumbList([
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]),
        faqPage(faqPlainEntries(), "/faq"),
      ),
    }),
  component: Faq,
});

function FaqPartView({ part }: { part: FaqPart }) {
  if (part.kind === "link") return <Link to={part.to}>{part.text}</Link>;
  if (part.kind === "mail") return <a href={`mailto:${contact.email}`}>{contact.email}</a>;
  return part.text;
}

function Faq() {
  return (
    <InfoPage eyebrow="The Company" title="Frequently Asked Questions">
      {faqEntries.map((entry) => (
        <Fragment key={entry.question}>
          <h2>{entry.question}</h2>
          <p>
            {entry.parts.map((part, index) => (
              <FaqPartView key={index} part={part} />
            ))}
          </p>
        </Fragment>
      ))}
    </InfoPage>
  );
}
