import { describe, expect, it } from "vitest";

import {
  displayTitle,
  formatKey,
  formatPostDate,
  imageSrc,
  metaDescription,
  productLinkPhrases,
  splitByPhrases,
} from "@/lib/display";

describe("Catalogue titles", () => {
  it("uses the corrected titles and straightens curly quotes", () => {
    expect(
      displayTitle(
        "its-more-than-just-a-haircut-use-product-selling-principles",
        "Its more than just a haircut use product selling principles",
      ),
    ).toBe("It's More Than Just a Haircut: Use Product-Selling Principles");
    expect(displayTitle("profits-beyond-the-chair", "Profits beyond the chair")).toBe(
      "Profits Beyond the Chair",
    );
    expect(displayTitle("the-barbers-toolkit", "The Barbers Toolkit")).toBe("The Barber's Toolkit");
    expect(displayTitle("the-people-s-shop", "  The People’s Shop")).toBe("The People's Shop");
  });

  it("labels a free PDF as a chapter and leaves audiobooks alone", () => {
    expect(
      formatKey({ type: "ebook", access_tier: "free", audio_path: null, length_label: "3 pages" }),
    ).toBe("format.chapter");
    expect(
      formatKey({
        type: "ebook",
        access_tier: "members",
        audio_path: "book.mp3",
        length_label: "89 minutes",
      }),
    ).toBe("format.ebook");
  });
});

describe("Meta descriptions", () => {
  it("stops on a word instead of mid-word", () => {
    expect(metaDescription("abcdefghij klmnopqrst", 15)).toBe("abcdefghij");
    expect(metaDescription("Short description.")).toBe("Short description.");
    const text =
      "The service doesn't end when your client leaves the chair and this book makes that crystal clear.";
    const cut = metaDescription(text, 80);
    expect(cut.length).toBeLessThanOrEqual(80);
    expect(text.startsWith(cut)).toBe(true);
    expect(text[cut.length]).toBe(" ");
  });
});

describe("Dates and images", () => {
  it("writes a post date so the day and month cannot be swapped", () => {
    expect(formatPostDate("2026-10-28T16:00:00.000Z")).toBe("28 Oct 2026");
    expect(formatPostDate(null)).toBe("");
  });

  it("asks Supabase to resize a cover and leaves other hosts alone", () => {
    const cover = "https://example.supabase.co/storage/v1/object/public/covers/the-price-shift.jpg";
    expect(imageSrc(cover, 640)).toBe(
      "https://example.supabase.co/storage/v1/render/image/public/covers/the-price-shift.jpg?width=640&quality=60&resize=cover",
    );
    expect(imageSrc("https://cdn.example.com/art.jpg", 640)).toBe(
      "https://cdn.example.com/art.jpg",
    );
  });
});

describe("Blog links", () => {
  it("links a book title without changing the sentence", () => {
    const phrases = productLinkPhrases([
      {
        slug: "the-price-shift",
        title: "The Price Shift",
        type: "ebook",
      },
      {
        slug: "the-price-shift-course",
        title: "The Price Shift",
        type: "course",
      },
      {
        slug: "its-more-than-just-a-haircut-use-product-selling-principles",
        title: "It's More Than Just a Haircut: Use Product-Selling Principles",
        type: "ebook",
      },
    ]);
    expect(splitByPhrases("Go deeper: The Price Shift, in the library.", phrases)).toEqual([
      { text: "Go deeper: " },
      { text: "The Price Shift", slug: "the-price-shift" },
      { text: ", in the library." },
    ]);
    expect(
      splitByPhrases("Read It's More Than Just a Haircut, and then stop.", phrases).some(
        (part) => part.slug === "its-more-than-just-a-haircut-use-product-selling-principles",
      ),
    ).toBe(true);
  });
});
