import ko from "./ko";
import en from "./en";
import type { Locale } from "@/types";
import type { Dictionary } from "./ko";

export type { TranslationKey, Dictionary } from "./ko";

export const dictionaries: Record<Locale, Dictionary> = { ko, en };

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: "한국어",
  en: "영어",
};

export const DEFAULT_LOCALE: Locale = "ko";
