"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import type { AnalysisRecord } from "@/types";
import { formatDate, getScoreRating } from "@/lib/utils";
import { RatingBadge } from "@/components/shared/RatingBadge";

export function RecentAnalyses() {
  const [records, setRecords] = useState<AnalysisRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const recent = await db.analyses
          .orderBy("analyzedAt")
          .reverse()
          .limit(5)
          .toArray();
        setRecords(recent);
      } catch {
        // IndexedDB may not be available (SSR or private browsing)
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  if (isLoading) return null;
  if (records.length === 0) return null;

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-4 flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-sm font-medium text-muted-foreground">
          최근 분석
        </h2>
      </div>
      <div className="space-y-2 stagger-fade">
        {records.map((record) => (
          <Link
            key={record.id ?? `${record.url}-${record.analyzedAt}`}
            href={`/analyze?url=${encodeURIComponent(record.url)}&strategy=${record.strategy}`}
            className="glass-card flex items-center justify-between p-3.5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="flex items-center gap-3 min-w-0">
              <RatingBadge
                rating={getScoreRating(record.scores.performance)}
              />
              <div className="min-w-0">
                <span className="block truncate text-sm font-medium">
                  {record.url}
                </span>
                <span className="text-xs text-muted-foreground">
                  {record.strategy === "mobile" ? "모바일" : "데스크톱"} ·
                  성능{" "}
                  <span className="font-semibold text-foreground">
                    {record.scores.performance}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-3">
              <span className="text-xs text-muted-foreground">
                {formatDate(record.analyzedAt)}
              </span>
              <ExternalLink
                className="h-3.5 w-3.5 text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
