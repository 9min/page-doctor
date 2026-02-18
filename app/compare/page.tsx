"use client";

import { useCompare } from "@/hooks/useCompare";
import { useTranslation } from "@/hooks/useTranslation";
import { CompareUrlInputs } from "@/components/compare/CompareUrlInputs";
import { CompareRadarChart } from "@/components/compare/CompareRadarChart";
import { CompareTable } from "@/components/compare/CompareTable";
import { RankingCard } from "@/components/compare/RankingCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, GitCompareArrows } from "lucide-react";

export default function ComparePage() {
  const { items, isComparing, compare } = useCompare();
  const { t } = useTranslation();

  const hasResults = items.some((item) => item.result !== null);
  const failedItems = items.filter(
    (item) => !item.isLoading && item.error !== null
  );

  return (
    <div className="container mx-auto space-y-6 px-4 py-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6]/10">
          <GitCompareArrows className="h-5 w-5 text-[#3B82F6]" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{t("compare.title")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("compare.subtitle")}
          </p>
        </div>
      </div>

      <CompareUrlInputs isComparing={isComparing} onCompare={compare} />

      {/* Loading state */}
      {isComparing && (
        <div className="space-y-5">
          <Skeleton className="shimmer h-96 w-full rounded-2xl" />
          <Skeleton className="shimmer h-64 w-full rounded-2xl" />
        </div>
      )}

      {/* Error messages for failed URLs */}
      {failedItems.length > 0 && (
        <div className="glass-card glow-danger space-y-2 p-4">
          {failedItems.map((item) => (
            <div
              key={item.url}
              className="flex items-center gap-2 text-sm text-danger"
            >
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>
                {item.url}: {item.error}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Results */}
      {hasResults && !isComparing && (
        <div className="space-y-5 stagger-fade">
          <div className="grid gap-5 lg:grid-cols-2">
            <CompareRadarChart items={items} />
            <RankingCard items={items} />
          </div>
          <CompareTable items={items} />
        </div>
      )}
    </div>
  );
}
