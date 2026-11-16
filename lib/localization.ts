import { demosTranslations } from "./translations/demos";
import { studioTranslations } from "./translations/studio";

export const locales = {
  en: { name: "English", region: "en-GB" },
  pl: { name: "Polski", region: "pl-PL" },
  fr: { name: "Français", region: "fr-FR" },
  de: { name: "Deutsch", region: "de-DE" },
  es: { name: "Español", region: "es-ES" },
  it: { name: "Italiano", region: "it-IT" },
} as const;

export type Lang = keyof typeof locales;
export type Pair = readonly [english: string, polish: string];
export const languages = Object.keys(locales) as Lang[];
export const isLanguage = (lang: string): lang is Lang => Object.hasOwn(locales, lang);

const translationIndex = { fr: 0, de: 1, es: 2, it: 3 } as const;
const translations: Partial<Record<string, readonly [string, string, string, string]>> = {
  ...studioTranslations,
  ...demosTranslations,
};

export function tr(lang: Lang, [english, polish]: Pair): string {
  if (lang === "en") return english;
  if (lang === "pl") return polish;
  return translations[english]?.[translationIndex[lang]] ?? english;
}
