import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale, Rating, WebVitalMetric } from "@/types";
import { CWV_THRESHOLDS, SCORE_THRESHOLDS } from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a metric value for display.
 * LCP/INP → "1,234 ms", CLS → "0.12"
 */
export function formatMetricValue(
  metric: WebVitalMetric,
  value: number | null
): string {
  if (value === null) return "N/A";
  if (metric === "CLS") return value.toFixed(2);
  return `${Math.round(value).toLocaleString()} ms`;
}

/**
 * Get a score rating based on the 0-100 score.
 */
export function getScoreRating(score: number): Rating {
  if (score >= SCORE_THRESHOLDS.good) return "good";
  if (score >= SCORE_THRESHOLDS.needsImprovement) return "needs-improvement";
  return "poor";
}

/**
 * Get a CWV metric rating based on threshold values.
 */
export function getMetricRating(
  metric: WebVitalMetric,
  value: number
): Rating {
  const thresholds = CWV_THRESHOLDS[metric];
  if (value <= thresholds.good) return "good";
  if (value <= thresholds.poor) return "needs-improvement";
  return "poor";
}

/**
 * Format a date string for display with locale support.
 */
export function formatDate(isoString: string, locale: Locale = "ko"): string {
  const date = new Date(isoString);
  const bcp47 = locale === "ko" ? "ko-KR" : "en-US";
  return date.toLocaleDateString(bcp47, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Normalize a URL by adding https:// if missing.
 */
export function normalizeUrl(url: string): string {
  let normalized = url.trim();
  if (!/^https?:\/\//i.test(normalized)) {
    normalized = `https://${normalized}`;
  }
  return normalized;
}

/**
 * Validate whether a string is a valid URL.
 */
export function isValidUrl(url: string): boolean {
  try {
    const normalized = normalizeUrl(url);
    new URL(normalized);
    return true;
  } catch {
    return false;
  }
}
