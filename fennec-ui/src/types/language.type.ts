export const LANGUAGES = {
  es: "Español",
  en: "English",
} as const;

export type LanguageKey = keyof typeof LANGUAGES;
