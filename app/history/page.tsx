"use client";

import { useState, useEffect, useCallback } from "react";
import { Download } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import { UrlSelector } from "@/components/history/UrlSelector";
import { PeriodFilter } from "@/components/history/PeriodFilter";
import { ScoreTrendChart } from "@/components/history/ScoreTrendChart";
import { WebVitalsTrendChart } from "@/components/history/WebVitalsTrendChart";
import { HistoryTable } from "@/components/history/HistoryTable";
import { Skeleton } from "@/components/ui/skeleton";
import type { AnalysisRecord } from "@/types";

export default function HistoryPage() {
  const { uniqueUrls, isLoading, getByUrl, deleteRecord, refresh } =
    useHistory();
  const [selectedUrl, setSelectedUrl] = useState("");
  const [selectedDays, setSelectedDays] = useState(30);
  const [filteredRecords, setFilteredRecords] = useState<AnalysisRecord[]>([]);

  // URL 선택 시 첫 번째 URL로 초기화
  useEffect(() => {
    if (uniqueUrls.length > 0 && !selectedUrl) {
      setSelectedUrl(uniqueUrls[0]);
    }
  }, [uniqueUrls, selectedUrl]);

  // 선택된 URL + 기간에 따라 데이터 필터링
  const loadFilteredRecords = useCallback(async () => {
    if (!selectedUrl) {
      setFilteredRecords([]);
      return;
    }
    const records = await getByUrl(selectedUrl, selectedDays);
    setFilteredRecords(records);
  }, [selectedUrl, selectedDays, getByUrl]);

  useEffect(() => {
    loadFilteredRecords();
  }, [loadFilteredRecords]);

  const handleDelete = async (id: number) => {
    await deleteRecord(id);
    await loadFilteredRecords();
  };

  const handleExportJson = () => {
    if (filteredRecords.length === 0) return;
    const json = JSON.stringify(filteredRecords, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `page-doctor-history-${selectedUrl.replace(/[^a-zA-Z0-9]/g, "_")}.json`;
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
            selectedUrl={selectedUrl}
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
