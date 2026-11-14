import { createFileRoute } from "@tanstack/react-router";
import { ChairCalculator } from "@/components/ChairCalculator";
import { createTranslator, defaultLocale } from "@/i18n";
import { breadcrumbList, jsonLdGraph, shareMeta } from "@/lib/share";

const t0 = createTranslator(defaultLocale);

export const Route = createFileRoute("/calculator")({
  head: () => {
    const title = t0("calc.meta.title");
    const description = t0("calc.meta.description");
    return shareMeta({
      title,
      description,
      path: "/calculator",
      jsonLd: jsonLdGraph(
        breadcrumbList([
          { name: "Home", path: "/" },
          { name: "Free Calculator", path: "/calculator" },
        ]),
      ),
    });
  },
  component: CalculatorPage,
});

function CalculatorPage() {
  return <ChairCalculator />;
}
