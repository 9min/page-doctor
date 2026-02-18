"use client";

import { useMemo, useState } from "react";
import { Download, History } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";
import { useTranslation } from "@/hooks/useTranslation";
import { UrlSelector } from "@/components/history/UrlSelector";
import { PeriodFilter } from "@/components/history/PeriodFilter";
import { ScoreTrendChart } from "@/components/history/ScoreTrendChart";
import { WebVitalsTrendChart } from "@/components/history/WebVitalsTrendChart";
import { HistoryTable } from "@/components/history/HistoryTable";
import { Skeleton } from "@/components/ui/skeleton";

export default function HistoryPage() {
  const { histories, uniqueUrls, isLoading, deleteRecord } = useHistory();
  const { t } = useTranslation();
  const [selectedUrl, setSelectedUrl] = useState("");
  const [selectedDays, setSelectedDays] = useState(30);

  const effectiveUrl = selectedUrl || (uniqueUrls.length > 0 ? uniqueUrls[0] : "");

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
        <Skeleton className="shimmer h-8 w-48 rounded-lg" />
        <Skeleton className="shimmer h-10 w-full rounded-lg" />
        <Skeleton className="shimmer h-80 w-full rounded-2xl" />
        <Skeleton className="shimmer h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (uniqueUrls.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6]/10">
            <History className="h-5 w-5 text-[#3B82F6]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("history.title")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("history.subtitle")}
            </p>
          </div>
        </div>
        <div className="glass-card flex h-64 flex-col items-center justify-center gap-3 text-muted-foreground">
          <p className="text-lg font-medium">{t("history.empty")}</p>
          <p className="text-sm">
            {t("history.emptyDesc")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6 px-4 py-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3B82F6]/10">
            <History className="h-5 w-5 text-[#3B82F6]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{t("history.title")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("history.subtitle")}
            </p>
          </div>
        </div>
        <button
          onClick={handleExportJson}
          disabled={filteredRecords.length === 0}
          className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-4 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-accent-foreground disabled:opacity-50 cursor-pointer"
        >
          <Download className="h-4 w-4" />
          {t("history.export")}
        </button>
      </div>

      {/* Filters - wrapped in glass card */}
      <div className="glass-card flex flex-wrap items-end gap-4 p-4">
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
        <h2 className="mb-3 text-lg font-semibold">{t("history.records")}</h2>
        <HistoryTable records={filteredRecords} onDelete={handleDelete} />
      </div>
    </div>
  );
}
