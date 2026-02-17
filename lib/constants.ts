import type { Category, PeriodFilter, Rating, WebVitalMetric } from "@/types";

// ------------------------------------------
// Core Web Vitals Thresholds
// ------------------------------------------

export const CWV_THRESHOLDS: Record<
  WebVitalMetric,
  { good: number; poor: number }
> = {
  LCP: { good: 2500, poor: 4000 },
  INP: { good: 200, poor: 500 },
  CLS: { good: 0.1, poor: 0.25 },
};

// ------------------------------------------
// Score Rating Thresholds
// ------------------------------------------

export const SCORE_THRESHOLDS = {
  good: 90,
  needsImprovement: 50,
} as const;

// ------------------------------------------
// Rating Colors
// ------------------------------------------

export const RATING_COLORS: Record<
  Rating,
  { bg: string; text: string; border: string }
> = {
  good: { bg: "#052E16", text: "#22C55E", border: "#166534" },
  "needs-improvement": { bg: "#451A03", text: "#F59E0B", border: "#92400E" },
  poor: { bg: "#450A0A", text: "#EF4444", border: "#991B1B" },
};

// ------------------------------------------
// Category Labels (Korean)
// ------------------------------------------

export const CATEGORY_LABELS: Record<Category, string> = {
  performance: "성능",
  accessibility: "접근성",
  "best-practices": "권장사항",
  seo: "SEO",
};

// ------------------------------------------
// Period Filters
// ------------------------------------------

export const PERIOD_FILTERS: PeriodFilter[] = [
  { label: "최근 7일", days: 7 },
  { label: "최근 30일", days: 30 },
  { label: "최근 90일", days: 90 },
  { label: "전체", days: 365 },
];

// ------------------------------------------
// Chart Colors
// ------------------------------------------

export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
] as const;

// ------------------------------------------
// Web Vital Units
// ------------------------------------------

export const WEB_VITAL_UNITS: Record<WebVitalMetric, string> = {
  LCP: "ms",
  INP: "ms",
  CLS: "",
};

// ------------------------------------------
// Web Vital Labels (Korean)
// ------------------------------------------

export const WEB_VITAL_LABELS: Record<WebVitalMetric, string> = {
  LCP: "최대 콘텐츠 페인트",
  INP: "다음 페인트까지 상호작용",
  CLS: "누적 레이아웃 시프트",
};
