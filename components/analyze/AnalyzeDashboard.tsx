"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Activity, Globe, Monitor, Smartphone, Link, BarChart3, Eye, FileText } from "lucide-react";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useHistory } from "@/hooks/useHistory";
import { useBudget } from "@/hooks/useBudget";
import { useTranslation } from "@/hooks/useTranslation";
import { fetchCruxData } from "@/lib/api";
import { ScoreOverview } from "./ScoreOverview";
import { CoreWebVitals } from "./CoreWebVitals";
import { AuditList } from "./AuditList";
import { PdfReportButton } from "./PdfReportButton";
import { ShareButton } from "./ShareButton";
import { BudgetDialog } from "./BudgetDialog";
import { ScheduleDialog } from "./ScheduleDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getScoreRating } from "@/lib/utils";
import { RATING_COLORS } from "@/lib/constants";
import type { CruxResult, Strategy } from "@/types";

export function AnalyzeDashboard() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const rawStrategy = searchParams.get("strategy");
  const strategy: Strategy =
    rawStrategy === "mobile" || rawStrategy === "desktop"
      ? rawStrategy
      : "mobile";

  const { t, locale } = useTranslation();
  const { result, isLoading, error, analyze } = useAnalysis();
  const { saveResult } = useHistory();
  const { budget, saveBudget, deleteBudget } = useBudget(result?.url ?? null);
  const savedRef = useRef(false);
  const [cruxResult, setCruxResult] = useState<CruxResult | null>(null);
  const cruxFetchedUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (url) {
      savedRef.current = false;
      cruxFetchedUrlRef.current = null;
      analyze(url, strategy);
    }
  }, [url, strategy, analyze]);

  useEffect(() => {
    if (result && !savedRef.current) {
      savedRef.current = true;
      saveResult(result);
    }
  }, [result, saveResult]);

  useEffect(() => {
    if (result && cruxFetchedUrlRef.current !== result.url) {
      const targetUrl = result.url;
      cruxFetchedUrlRef.current = targetUrl;
      fetchCruxData({ url: targetUrl })
        .then((res) => {
          if (cruxFetchedUrlRef.current === targetUrl) {
            setCruxResult(res.result);
          }
        })
        .catch(() => {
          if (cruxFetchedUrlRef.current === targetUrl) {
            setCruxResult(null);
          }
          cruxFetchedUrlRef.current = null;
        });
    }
  }, [result]);

  const safeCruxResult =
    cruxResult && result && cruxResult.url === result.url ? cruxResult : null;
  const isCruxLoading =
    result !== null && safeCruxResult === null;

  if (!url) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="glass-card p-8 text-center">
          <Globe className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-muted-foreground">
            {t("analyze.noUrl")}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSkeleton url={url} strategy={strategy} />;
  }

  if (error) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="glass-card glow-danger mx-auto max-w-lg p-8 text-center">
          <p className="text-lg font-semibold text-danger">{t("analyze.failed")}</p>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  if (!result) return null;

  const perfRating = getScoreRating(result.scores.performance);
  const perfColor = RATING_COLORS[perfRating].text;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl font-bold">{t("analyze.title")}</h1>
          <div className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1">
            {strategy === "mobile" ? (
              <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
            ) : (
              <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground">
              {result.url}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShareButton />
          <ScheduleDialog url={result.url} strategy={strategy} />
          <BudgetDialog
            budget={budget}
            onSave={saveBudget}
            onDelete={deleteBudget}
          />
          <PdfReportButton result={result} />
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid gap-5 lg:grid-cols-3 stagger-fade">
        {/* Score Overview - spans full width */}
        <div className="lg:col-span-3">
          <ScoreOverview scores={result.scores} budget={budget} />
        </div>

        {/* Core Web Vitals - spans 2 cols */}
        <div className="lg:col-span-2">
          <CoreWebVitals webVitals={result.webVitals} cruxResult={safeCruxResult} isCruxLoading={isCruxLoading} />
        </div>

        {/* Summary card - 1 col */}
        <div className="glass-card flex flex-col items-center justify-center p-6 text-center">
          <p
            className="text-5xl font-bold"
            style={{ color: perfColor }}
          >
            {result.scores.performance}
          </p>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            {t("analyze.perfScore")}
          </p>
          <div className="mt-4 h-px w-12 bg-border/50" />
          <p className="mt-3 text-xs text-muted-foreground">
            {new Date(result.fetchedAt).toLocaleString(locale === "ko" ? "ko-KR" : "en-US")}
          </p>
        </div>

        {/* Audit List - full width */}
        <div className="lg:col-span-3">
          <AuditList audits={result.audits} />
        </div>
      </div>
    </div>
  );
}

const ANALYSIS_STEPS = [
  { key: "analyze.step.connect" as const, icon: Link },
  { key: "analyze.step.performance" as const, icon: BarChart3 },
  { key: "analyze.step.accessibility" as const, icon: Eye },
  { key: "analyze.step.report" as const, icon: FileText },
] as const;

function LoadingSkeleton({ url, strategy }: { url: string; strategy: Strategy }) {
  const { t } = useTranslation();
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 3000),
      setTimeout(() => setStep(2), 7000),
      setTimeout(() => setStep(3), 11000),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
      {/* Central pulse ring + icon */}
      <div className="relative flex items-center justify-center">
        {/* Outer pulse ring */}
        <div
          className="absolute h-36 w-36 rounded-full border-2 border-primary/30 animate-analyze-pulse"
        />
        {/* Middle pulse ring (delayed) */}
        <div
          className="absolute h-28 w-28 rounded-full border border-primary/20 animate-analyze-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        {/* Spinning gradient ring */}
        <div className="absolute h-32 w-32 rounded-full animate-analyze-spin">
          <div
            className="h-full w-full rounded-full"
            style={{
              background: "conic-gradient(from 0deg, transparent 0%, #3B82F6 30%, #818CF8 50%, #A855F7 70%, transparent 100%)",
              mask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
              WebkitMask: "radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 2px))",
            }}
          />
        </div>
        {/* Center icon */}
        <div className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full bg-card border border-border/50">
          <Activity className="h-9 w-9 text-primary animate-pulse-glow" />
        </div>
      </div>

      {/* Analyzing text */}
      <p className="mt-8 text-xl font-semibold">{t("analyze.loading")}</p>

      {/* URL + strategy */}
      <div className="mt-3 flex items-center gap-2 rounded-full bg-secondary/60 px-4 py-1.5">
        {strategy === "mobile" ? (
          <Smartphone className="h-3.5 w-3.5 text-muted-foreground" />
        ) : (
          <Monitor className="h-3.5 w-3.5 text-muted-foreground" />
        )}
        <span className="max-w-xs truncate text-sm text-muted-foreground">{url}</span>
      </div>

      {/* Step indicators */}
      <div className="mt-8 space-y-3">
        {ANALYSIS_STEPS.map((s, i) => {
          const StepIcon = s.icon;
          const isActive = i === step;
          const isDone = i < step;
          return (
            <div
              key={s.key}
              className={`flex items-center gap-3 transition-all duration-500 ${
                isActive ? "text-foreground" : isDone ? "text-primary" : "text-muted-foreground/70"
              }`}
            >
              {/* Step dot / check */}
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-500 ${
                  isActive
                    ? "border-primary bg-primary/10 scale-110"
                    : isDone
                    ? "border-primary/50 bg-primary/5"
                    : "border-border/50 bg-transparent"
                }`}
              >
                {isDone ? (
                  <svg className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <StepIcon className={`h-3.5 w-3.5 ${isActive ? "text-primary" : ""}`} />
                )}
              </div>
              <span className={`text-sm font-medium ${isActive ? "text-foreground" : ""}`}>
                {t(s.key)}
              </span>
              {isActive && (
                <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Compact skeleton preview */}
      <div className="mt-10 w-full max-w-2xl opacity-30">
        <div className="grid gap-3 grid-cols-3">
          <Skeleton className="shimmer h-10 rounded-xl" />
          <Skeleton className="shimmer h-10 rounded-xl" />
          <Skeleton className="shimmer h-10 rounded-xl" />
          <Skeleton className="shimmer col-span-2 h-8 rounded-xl" />
          <Skeleton className="shimmer h-8 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
