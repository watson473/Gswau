// Saved choice overrides the system. No saved choice follows the device.
export const THEME_KEY = "gswau_theme";

export type ThemeChoice = "light" | "dark";

export function resolveTheme(saved: string | null, systemDark: boolean): ThemeChoice {
  if (saved === "light" || saved === "dark") return saved;
  return systemDark ? "dark" : "light";
}

export function savedTheme(): ThemeChoice | null {
  try {
    const value = localStorage.getItem(THEME_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function applyTheme(choice: ThemeChoice | null) {
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = resolveTheme(choice, systemDark) === "dark";
  document.documentElement.classList.toggle("dark", dark);
}

// Runs in the document head, before first paint, so the page does not flash the wrong theme.
export const themeBootScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");var d=t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`;
