"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAnalysis } from "@/hooks/useAnalysis";
import { useHistory } from "@/hooks/useHistory";
import { ScoreOverview } from "./ScoreOverview";
import { CoreWebVitals } from "./CoreWebVitals";
import { AuditList } from "./AuditList";
import { Skeleton } from "@/components/ui/skeleton";
import type { Strategy } from "@/types";

export function AnalyzeDashboard() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const strategy = (searchParams.get("strategy") as Strategy) || "mobile";

  const { result, isLoading, error, analyze } = useAnalysis();
  const { saveResult } = useHistory();
  const savedRef = useRef(false);

  useEffect(() => {
    if (url) {
      savedRef.current = false;
      analyze(url, strategy);
    }
  }, [url, strategy, analyze]);

  useEffect(() => {
    if (result && !savedRef.current) {
      savedRef.current = true;
      saveResult(result);
    }
  }, [result, saveResult]);

  if (!url) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        분석할 URL을 입력해주세요.
      </div>
    );
  }

  if (isLoading) {
    return <LoadingSkeleton url={url} />;
  }

  if (error) {
    return (
      <div className="glass-card mx-auto max-w-lg p-8 text-center">
        <p className="text-lg font-medium text-danger">분석 실패</p>
        <p className="mt-2 text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        <h1 className="text-xl font-bold">분석 결과</h1>
        <span className="text-sm text-muted-foreground">
          {result.url} · {strategy === "mobile" ? "모바일" : "데스크톱"}
        </span>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Score Overview - spans full width */}
        <div className="lg:col-span-3">
          <ScoreOverview scores={result.scores} />
        </div>

        {/* Core Web Vitals - spans 2 cols */}
        <div className="lg:col-span-2">
          <CoreWebVitals webVitals={result.webVitals} />
        </div>

        {/* Summary card - 1 col */}
        <div className="glass-card flex flex-col items-center justify-center p-6 text-center">
          <p className="text-4xl font-bold">{result.scores.performance}</p>
          <p className="mt-1 text-sm text-muted-foreground">성능 점수</p>
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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <div>
          <p className="text-sm font-medium">분석 중...</p>
          <p className="text-xs text-muted-foreground">{url}</p>
        </div>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-3">
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="lg:col-span-3">
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
