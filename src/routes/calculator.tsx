import { createFileRoute } from "@tanstack/react-router";
import { ChairCalculator } from "@/components/ChairCalculator";
import { createTranslator, defaultLocale } from "@/i18n";

const t0 = createTranslator(defaultLocale);

export const Route = createFileRoute("/calculator")({
  head: () => {
    const title = t0("calc.meta.title");
    const description = t0("calc.meta.description");
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: "https://gswau.com/calculator" },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: "https://gswau.com/calculator" }],
    };
  },
  component: CalculatorPage,
});

function CalculatorPage() {
  return <ChairCalculator />;
}
