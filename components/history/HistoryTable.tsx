"use client";

import { Trash2 } from "lucide-react";
import type { AnalysisRecord } from "@/types";
import { formatDate, getScoreRating, formatMetricValue } from "@/lib/utils";
import { RatingBadge } from "@/components/shared/RatingBadge";

interface HistoryTableProps {
  records: AnalysisRecord[];
  onDelete: (id: number) => void;
}

export function HistoryTable({ records, onDelete }: HistoryTableProps) {
  if (records.length === 0) {
    return (
      <div className="glass-card flex h-32 items-center justify-center text-muted-foreground">
        분석 기록이 없습니다.
      </div>
    );
  }

  return (
    <div className="glass-card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">날짜</th>
              <th className="px-4 py-3 font-medium">전략</th>
              <th className="px-4 py-3 font-medium text-center">성능</th>
              <th className="px-4 py-3 font-medium text-center">LCP</th>
              <th className="px-4 py-3 font-medium text-center">INP</th>
              <th className="px-4 py-3 font-medium text-center">CLS</th>
              <th className="px-4 py-3 font-medium text-center">등급</th>
              <th className="px-4 py-3 font-medium text-center">삭제</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record, index) => (
              <tr
                key={record.id ?? index}
                className="border-b border-border/50 transition-colors hover:bg-muted/30"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  {formatDate(record.analyzedAt)}
                </td>
                <td className="px-4 py-3">
                  {record.strategy === "mobile" ? "모바일" : "데스크톱"}
                </td>
                <td className="px-4 py-3 text-center font-semibold">
                  {record.scores.performance}
                </td>
                <td className="px-4 py-3 text-center">
                  {formatMetricValue("LCP", record.webVitals.lcp)}
                </td>
                <td className="px-4 py-3 text-center">
                  {formatMetricValue("INP", record.webVitals.inp)}
                </td>
                <td className="px-4 py-3 text-center">
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
                    className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label="기록 삭제"
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
