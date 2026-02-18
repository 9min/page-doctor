"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Globe, Monitor, Smartphone } from "lucide-react";
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
          <Globe className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <p className="mt-3 text-muted-foreground">
            {t("analyze.noUrl")}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSkeleton url={url} />;
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

function LoadingSkeleton({ url }: { url: string }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-[#3B82F6]" />
        <div>
          <p className="text-sm font-medium">{t("analyze.loading")}</p>
          <p className="text-xs text-muted-foreground">{url}</p>
        </div>
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <Skeleton className="shimmer h-48 w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="shimmer h-40 w-full rounded-2xl" />
        </div>
        <Skeleton className="shimmer h-40 w-full rounded-2xl" />
        <div className="lg:col-span-3">
          <Skeleton className="shimmer h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
