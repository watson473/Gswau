import { describe, expect, it } from "vitest";
import { isNewlyPublished, NEW_WINDOW_DAYS } from "@/lib/new-drop";

const now = Date.parse("2026-11-24T21:00:00Z");
const day = 24 * 60 * 60 * 1000;

describe("isNewlyPublished", () => {
  it("uses one seven-day window", () => {
    expect(NEW_WINDOW_DAYS).toBe(7);
  });

  it("marks a drop inside the window as new", () => {
    expect(isNewlyPublished(new Date(now - day).toISOString(), now)).toBe(true);
    expect(isNewlyPublished(new Date(now - (NEW_WINDOW_DAYS * day - 1)).toISOString(), now)).toBe(
      true,
    );
    expect(isNewlyPublished(new Date(now).toISOString(), now)).toBe(true);
  });

  it("drops the badge once the window has passed", () => {
    expect(isNewlyPublished(new Date(now - NEW_WINDOW_DAYS * day).toISOString(), now)).toBe(false);
    expect(isNewlyPublished(new Date(now - 8 * day).toISOString(), now)).toBe(false);
  });

  it("ignores a missing, unreadable, or future date", () => {
    expect(isNewlyPublished(null, now)).toBe(false);
    expect(isNewlyPublished(undefined, now)).toBe(false);
    expect(isNewlyPublished("", now)).toBe(false);
    expect(isNewlyPublished("not-a-date", now)).toBe(false);
    expect(isNewlyPublished(new Date(now + day).toISOString(), now)).toBe(false);
  });
});
