"use client";

import { Trash2 } from "lucide-react";
import type { AnalysisRecord } from "@/types";
import { formatDate, getScoreRating, formatMetricValue } from "@/lib/utils";
import { RatingBadge } from "@/components/shared/RatingBadge";
import { useTranslation } from "@/hooks/useTranslation";

interface HistoryTableProps {
  records: AnalysisRecord[];
  onDelete: (id: number) => void;
}

export function HistoryTable({ records, onDelete }: HistoryTableProps) {
  const { t, locale } = useTranslation();

  if (records.length === 0) {
    return (
      <div className="glass-card flex h-32 items-center justify-center text-muted-foreground">
        {t("history.noRecords")}
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 text-left text-muted-foreground">
              <th className="px-4 py-3.5 font-medium">{t("history.table.date")}</th>
              <th className="px-4 py-3.5 font-medium">{t("history.table.strategy")}</th>
              <th className="px-4 py-3.5 font-medium text-center">{t("history.table.performance")}</th>
              <th className="px-4 py-3.5 font-medium text-center">LCP</th>
              <th className="px-4 py-3.5 font-medium text-center">INP</th>
              <th className="px-4 py-3.5 font-medium text-center">CLS</th>
              <th className="px-4 py-3.5 font-medium text-center">{t("history.table.rating")}</th>
              <th className="px-4 py-3.5 font-medium text-center">{t("history.table.delete")}</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr
                key={record.id ?? index}
                className={`border-b border-border/30 transition-colors duration-150 hover:bg-[#3B82F6]/5 ${
                  index % 2 === 1 ? "bg-secondary" : ""
                }`}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDate(record.analyzedAt, locale)}
                </td>
                <td className="px-4 py-3">
                  {record.strategy === "mobile" ? t("input.mobile") : t("input.desktop")}
                </td>
                <td className="px-4 py-3 text-center font-bold">
                  {record.scores.performance}
                </td>
                <td className="px-4 py-3 text-center font-mono text-xs">
                  {formatMetricValue("LCP", record.webVitals.lcp)}
                </td>
                <td className="px-4 py-3 text-center font-mono text-xs">
                  {formatMetricValue("INP", record.webVitals.inp)}
                </td>
                <td className="px-4 py-3 text-center font-mono text-xs">
                  {formatMetricValue("CLS", record.webVitals.cls)}
                </td>
                <td className="px-4 py-3 text-center">
                  <RatingBadge
                    rating={getScoreRating(record.scores.performance)}
                  />
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => record.id && onDelete(record.id)}
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors duration-150 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                    aria-label={t("history.deleteAria")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
