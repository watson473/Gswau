import { createContext, createElement, useContext, type ReactNode } from "react";
import en from "./locales/en.json";

// Translation files are flat JSON ("section.key": "text"), the same shape i18next and most
// translation tools read. Plurals use the i18next suffixes: "key_one", "key_other".
// To add a language: copy locales/en.json to locales/<code>.json, translate, add it below.
type Messages = Record<string, string>;
const locales: Record<string, Messages> = { en };

export const supportedLocales = Object.keys(locales);
export const defaultLocale = "en";
const rtlLocales = new Set(["ar", "ur", "fa", "he"]);

export function textDirection(locale: string) {
  return rtlLocales.has(locale.split("-")[0] ?? locale) ? "rtl" : "ltr";
}

export type TranslateFn = (key: string, vars?: Record<string, string | number>) => string;

export function createTranslator(locale: string): TranslateFn {
  const fallback: Messages = en;
  const messages = locales[locale] ?? fallback;
  const plural = new Intl.PluralRules(locale);
  return (key, vars) => {
    let lookup = key;
    const count = vars?.["count"];
    if (typeof count === "number") {
      const form = `${key}_${plural.select(count)}`;
      if (messages[form] ?? fallback[form]) lookup = form;
    }
    const template = messages[lookup] ?? fallback[lookup] ?? key;
    return vars
      ? template.replace(/\{\{(\w+)\}\}/g, (_, name) => String(vars[name] ?? ""))
      : template;
  };
}

const I18nContext = createContext({ locale: defaultLocale, t: createTranslator(defaultLocale) });

export function I18nProvider({ locale, children }: { locale: string; children: ReactNode }) {
  return createElement(
    I18nContext.Provider,
    { value: { locale, t: createTranslator(locale) } },
    children,
  );
}

export function useT() {
  return useContext(I18nContext);
}
