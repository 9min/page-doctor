"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, Globe, Monitor, Smartphone } from "lucide-react";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useHistory } from "@/hooks/useHistory";
import { fetchCruxData } from "@/lib/api";
import { ScoreOverview } from "./ScoreOverview";
import { CoreWebVitals } from "./CoreWebVitals";
import { AuditList } from "./AuditList";
import { PdfReportButton } from "./PdfReportButton";
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

  const { result, isLoading, error, analyze } = useAnalysis();
  const { saveResult } = useHistory();
  const savedRef = useRef(false);
  const [cruxResult, setCruxResult] = useState<CruxResult | null>(null);

  useEffect(() => {
    if (url) {
      savedRef.current = false;
      setCruxResult(null);
      analyze(url, strategy);
    }
  }, [url, strategy, analyze]);

  useEffect(() => {
    if (result && !savedRef.current) {
      savedRef.current = true;
      saveResult(result);
      fetchCruxData({ url: result.url })
        .then((res) => setCruxResult(res.result))
        .catch(() => setCruxResult(null));
    }
  }, [result, saveResult]);

  if (!url) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="glass-card p-8 text-center">
          <Globe className="mx-auto h-10 w-10 text-muted-foreground/50" />
          <p className="mt-3 text-muted-foreground">
            분석할 URL을 입력해주세요.
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
          <p className="text-lg font-semibold text-danger">분석 실패</p>
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
          <h1 className="text-xl font-bold">분석 결과</h1>
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
        <PdfReportButton result={result} />
      </div>

      {/* Bento Grid Layout */}
      <div className="grid gap-5 lg:grid-cols-3 stagger-fade">
        {/* Score Overview - spans full width */}
        <div className="lg:col-span-3">
          <ScoreOverview scores={result.scores} />
        </div>

        {/* Core Web Vitals - spans 2 cols */}
        <div className="lg:col-span-2">
          <CoreWebVitals webVitals={result.webVitals} cruxResult={cruxResult} />
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
            성능 점수
          </p>
          <div className="mt-4 h-px w-12 bg-border/50" />
          <p className="mt-3 text-xs text-muted-foreground">
            {new Date(result.fetchedAt).toLocaleString("ko-KR")}
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
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-[#3B82F6]" />
        <div>
          <p className="text-sm font-medium">분석 중...</p>
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
