"use client";

import { useCompare } from "@/hooks/useCompare";
import { CompareUrlInputs } from "@/components/compare/CompareUrlInputs";
import { CompareRadarChart } from "@/components/compare/CompareRadarChart";
import { CompareTable } from "@/components/compare/CompareTable";
import { RankingCard } from "@/components/compare/RankingCard";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle } from "lucide-react";

export default function ComparePage() {
  const { items, isComparing, compare } = useCompare();

  const hasResults = items.some((item) => item.result !== null);
  const failedItems = items.filter(
    (item) => !item.isLoading && item.error !== null
  );

  return (
    <div className="container mx-auto space-y-6 px-4 py-8 animate-fade-in">
      <h1 className="text-2xl font-bold">경쟁사 비교</h1>

      <CompareUrlInputs isComparing={isComparing} onCompare={compare} />

      {/* Loading state */}
      {isComparing && (
        <div className="space-y-6">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      )}

      {/* Error messages for failed URLs */}
      {failedItems.length > 0 && (
        <div className="glass-card space-y-2 p-4">
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
        <div className="space-y-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <CompareRadarChart items={items} />
            <RankingCard items={items} />
          </div>
          <CompareTable items={items} />
        </div>
      )}
    </div>
  );
}
