// GSWAU's public contact details and policy dates, used by the Company pages.
export const contact = {
  email: "gswauniversity@gmail.com",
  phone: "917-410-3384",
  phoneHref: "tel:+19174103384",
};

export const businessName = "GSW Augustin University (GSWAU)";

// Shown as "Last updated" on Terms of Use, Privacy Policy and Refund Policy.
export const policiesUpdated = "October 28, 2026";

// Page title and description tags for the Company pages.
export function pageMeta(title: string, description: string) {
  return {
    meta: [
      { title: `${title} — GSWAU` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — GSWAU` },
      { property: "og:description", content: description },
    ],
  };
}
