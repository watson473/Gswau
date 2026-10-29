export const author = {
  name: "Gs. W. Augustin",
  bio: "Practical books made for barbers and hairstylists who want to improve their skills and make more money. Learn advanced techniques, client retention, branding, and how to run a better business.",
  avatar: "https://public-files.gumroad.com/v5p8qgeco8v7z82zwfqxj3aefssb",
};

export const formatLabel: Record<string, string> = {
  ebook: "Audiobook",
  audiobook: "Audiobook",
  course: "Course",
  bundle: "Bundle",
};

export const money = (cents: number) => (cents === 0 ? "Free" : `$${(cents / 100).toFixed(2)}`);

// Shown on the site; must match the prices set on the Gumroad membership product.
export const membershipPrices = { monthly: 19.99, annual: 199.99 } as const;

export const formatMoney = (amount: number, locale = "en") =>
  new Intl.NumberFormat(locale, { style: "currency", currency: "USD" }).format(amount);

// Paid audiobooks (excludes the free chapter, bundles and courses).
export function bookCount(products: { type: string; access_tier: string }[]) {
  return products.filter(
    (p) => (p.type === "ebook" || p.type === "audiobook") && p.access_tier !== "free",
  ).length;
}
