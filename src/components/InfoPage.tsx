import type { ReactNode } from "react";
import { Eyebrow } from "@/components/SiteChrome";

// Layout for the Company pages: heading, optional "last updated" line and readable text.
export function InfoPage({
  eyebrow,
  title,
  updated,
  children,
}: {
  eyebrow: string;
  title: string;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">{title}</h1>
      {updated && <p className="mt-3 text-sm text-muted-foreground">Last updated {updated}</p>}
      <div className="mt-8 text-lg leading-relaxed [&_a]:text-primary [&_a]:underline [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-semibold [&_li]:mt-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </div>
    </article>
  );
}
