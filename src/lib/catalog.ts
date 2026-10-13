export const author = {
  name: "Gs. W. Augustin",
  bio: "Practical books made for barbers and hairstylists who want to improve their skills and make more money. Learn advanced techniques, client retention, branding, and how to run a better business.",
  avatar: "https://public-files.gumroad.com/v5p8qgeco8v7z82zwfqxj3aefssb",
};

export const formatLabel: Record<string, string> = { ebook: "E-book", audiobook: "Audiobook", course: "Course", bundle: "Bundle" };

export const money = (cents: number) => (cents === 0 ? "Free" : `$${(cents / 100).toFixed(2)}`);
