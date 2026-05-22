import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import ar from "./locales/ar.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import tr from "./locales/tr.json";
import id from "./locales/id.json";

export const LANGUAGES = [
  { code: "en", label: "English",    flag: "🇬🇧", dir: "ltr" },
  { code: "ar", label: "العربية",    flag: "🇸🇦", dir: "rtl" },
  { code: "es", label: "Español",    flag: "🇪🇸", dir: "ltr" },
  { code: "fr", label: "Français",   flag: "🇫🇷", dir: "ltr" },
  { code: "tr", label: "Türkçe",     flag: "🇹🇷", dir: "ltr" },
  { code: "id", label: "Indonesia",  flag: "🇮🇩", dir: "ltr" },
] as const;

export type LangCode = typeof LANGUAGES[number]["code"];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, ar: { translation: ar }, es: { translation: es }, fr: { translation: fr }, tr: { translation: tr }, id: { translation: id } },
    fallbackLng: "en",
    supportedLngs: ["en", "ar", "es", "fr", "tr", "id"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "falfalla-lang",
    },
    interpolation: { escapeValue: false },
  });

// Apply RTL direction when Arabic is selected
export function applyDirection(lang: string) {
  const isRtl = lang === "ar";
  document.documentElement.dir = isRtl ? "rtl" : "ltr";
  document.documentElement.lang = lang;
}

// Apply on load
i18n.on("languageChanged", applyDirection);
applyDirection(i18n.language);

export default i18n;
