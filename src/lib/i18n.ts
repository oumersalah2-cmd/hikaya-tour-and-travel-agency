export const locales = ["en", "om", "am"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const localeLabels: Record<Locale, string> = {
  en: "English",
  om: "Afaan Oromoo",
  am: "አማርኛ",
};
