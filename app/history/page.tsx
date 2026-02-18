"use client";

import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import { UrlSelector } from "@/components/history/UrlSelector";
import { PeriodFilter } from "@/components/history/PeriodFilter";
import { ScoreTrendChart } from "@/components/history/ScoreTrendChart";
import { WebVitalsTrendChart } from "@/components/history/WebVitalsTrendChart";
import { HistoryTable } from "@/components/history/HistoryTable";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryPage() {
  const { histories, uniqueUrls, isLoading, deleteRecord } = useHistory();
  const [selectedUrl, setSelectedUrl] = useState("");
  const [selectedDays, setSelectedDays] = useState(30);

  // 선택된 URL (미선택 시 첫 번째 URL 사용)
  const effectiveUrl = selectedUrl || (uniqueUrls.length > 0 ? uniqueUrls[0] : "");

  // histories 배열에서 동기적으로 필터링 (useEffect 불필요)
  const filteredRecords = useMemo(() => {
    if (!effectiveUrl) return [];

    let filtered = histories.filter((r) => r.url === effectiveUrl);

    if (selectedDays < 365) {
      const since = new Date();
      since.setDate(since.getDate() - selectedDays);
      filtered = filtered.filter((r) => new Date(r.analyzedAt) >= since);
    }

    return filtered.sort((a, b) => a.analyzedAt.localeCompare(b.analyzedAt));
  }, [histories, effectiveUrl, selectedDays]);

  const handleDelete = async (id: number) => {
    await deleteRecord(id);
  };

  const handleExportJson = () => {
    if (filteredRecords.length === 0) return;
    const json = JSON.stringify(filteredRecords, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `page-doctor-history-${effectiveUrl.replace(/[^a-zA-Z0-9]/g, "_")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto space-y-6 px-4 py-8">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-80 w-full rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (uniqueUrls.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold">성능 히스토리</h1>
        <div className="mt-8 glass-card flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
          <p className="text-lg font-medium">분석 기록이 없습니다</p>
          <p className="text-sm">
            홈에서 URL을 분석하면 히스토리가 자동으로 저장됩니다.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-4 py-8 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">성능 히스토리</h1>
        <button
          onClick={handleExportJson}
          disabled={filteredRecords.length === 0}
          className="flex items-center gap-2 rounded-lg bg-muted px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          JSON 내보내기
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex-1 min-w-[250px]">
          <UrlSelector
            urls={uniqueUrls}
            selectedUrl={effectiveUrl}
            onSelect={setSelectedUrl}
          />
        </div>
        <PeriodFilter selectedDays={selectedDays} onSelect={setSelectedDays} />
      </div>

      {/* Charts */}
      <ScoreTrendChart records={filteredRecords} />
      <WebVitalsTrendChart records={filteredRecords} />

      {/* Table */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">분석 기록</h2>
        <HistoryTable records={filteredRecords} onDelete={handleDelete} />
      </div>
    </div>
  );
}
