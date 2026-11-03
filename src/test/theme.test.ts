import { describe, expect, it } from "vitest";
import { resolveTheme } from "@/lib/theme";

describe("theme choice", () => {
  it("follows the system when nothing is saved", () => {
    expect(resolveTheme(null, false)).toBe("light");
    expect(resolveTheme(null, true)).toBe("dark");
    expect(resolveTheme("other", true)).toBe("dark");
  });

  it("keeps a saved choice over the system setting", () => {
    expect(resolveTheme("dark", false)).toBe("dark");
    expect(resolveTheme("light", true)).toBe("light");
  });
});
