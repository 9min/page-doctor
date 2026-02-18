// ==========================================
// PageDoctor - Central Type Definitions
// ==========================================

/** Supported locale */
export type Locale = "ko" | "en";

/** PSI analysis strategy */
export type Strategy = "mobile" | "desktop";

/** Performance rating */
export type Rating = "good" | "needs-improvement" | "poor";

/** Core Web Vitals metric names */
export type WebVitalMetric = "LCP" | "INP" | "CLS";

/** PSI category names */
export type Category =
  | "performance"
  | "accessibility"
  | "best-practices"
  | "seo";

// ------------------------------------------
// Core Web Vitals
// ------------------------------------------

export interface WebVitals {
  lcp: number | null; // Largest Contentful Paint (ms)
  inp: number | null; // Interaction to Next Paint (ms)
  cls: number | null; // Cumulative Layout Shift (unitless)
}

export interface WebVitalDetail {
  name: WebVitalMetric;
  value: number | null;
  rating: Rating;
  unit: string;
}

// ------------------------------------------
// PSI Category Scores
// ------------------------------------------

export interface CategoryScores {
  performance: number;
  accessibility: number;
  "best-practices": number;
  seo: number;
}

// ------------------------------------------
// Audit
// ------------------------------------------

export interface AuditDetailHeading {
  key: string;
  label: string;
  valueType?: string; // "bytes" | "ms" | "url" | "text" | "numeric" | ...
}

export interface AuditDetailItem {
  [key: string]: string | number | null | undefined;
}

export interface AuditDetails {
  type: string; // "table" | "opportunity" | ...
  headings: AuditDetailHeading[];
  items: AuditDetailItem[];
  overallSavingsMs?: number;
  overallSavingsBytes?: number;
}

export interface Audit {
  id: string;
  title: string;
  description: string;
  score: number | null;
  displayValue?: string;
  category: Category;
  impact: "high" | "medium" | "low";
  details?: AuditDetails;
}

// ------------------------------------------
// Analysis Result (from PSI API)
// ------------------------------------------

export interface AnalysisResult {
  url: string;
  strategy: Strategy;
  fetchedAt: string; // ISO 8601
  scores: CategoryScores;
  webVitals: WebVitals;
  audits: Audit[];
  screenshot?: string; // base64 data URI
}

// ------------------------------------------
// CrUX Result (from CrUX API)
// ------------------------------------------

export interface CruxMetricValue {
  p75: number;
  rating: Rating;
}

export interface CruxResult {
  url: string;
  lcp?: CruxMetricValue;
  inp?: CruxMetricValue;
  cls?: CruxMetricValue;
  hasData: boolean;
}

// ------------------------------------------
// API Request / Response
// ------------------------------------------

export interface AnalyzeRequest {
  url: string;
  strategy: Strategy;
}

export interface AnalyzeResponse {
  result: AnalysisResult;
}

export interface CruxRequest {
  url: string;
}

export interface CruxResponse {
  result: CruxResult;
}

export interface ReportRequest {
  url: string;
  analysisResult: AnalysisResult;
}

export interface ReportData {
  url: string;
  analyzedAt: string;
  scores: CategoryScores;
  webVitals: WebVitals;
  topAudits: Audit[];
}

export interface ReportResponse {
  report: ReportData;
}

export interface ApiError {
  error: string;
  code: string;
}

// ------------------------------------------
// IndexedDB Records (Dexie)
// ------------------------------------------

export interface AnalysisRecord {
  id?: number;
  url: string;
  strategy: Strategy;
  analyzedAt: string; // ISO 8601
  scores: CategoryScores;
  webVitals: WebVitals;
  audits: Audit[];
}

export interface SettingRecord {
  key: string;
  value: string;
}

// ------------------------------------------
// Performance Budget
// ------------------------------------------

export interface PerformanceBudget {
  performance?: number;
  accessibility?: number;
  "best-practices"?: number;
  seo?: number;
}

// ------------------------------------------
// Schedule
// ------------------------------------------

export type ScheduleInterval = "daily" | "weekly" | "monthly";

export interface ScheduleRecord {
  id?: number;
  url: string;
  strategy: Strategy;
  interval: ScheduleInterval;
  enabled: boolean;
  notifyOnComplete: boolean;
  notifyOnBudgetExceed: boolean;
  nextRunAt: string; // ISO 8601
  lastRunAt?: string; // ISO 8601
  createdAt: string; // ISO 8601
}

// ------------------------------------------
// UI State
// ------------------------------------------

export interface PeriodFilter {
  label: string;
  days: number;
}
