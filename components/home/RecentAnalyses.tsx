"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, ExternalLink, Trash2 } from "lucide-react";
import { db } from "@/lib/db";
import type { AnalysisRecord } from "@/types";
import { formatDate, getScoreRating } from "@/lib/utils";
import { RatingBadge } from "@/components/shared/RatingBadge";
import { useTranslation } from "@/hooks/useTranslation";

export function RecentAnalyses() {
  const { t, locale } = useTranslation();
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

  async function handleDelete(e: React.MouseEvent, id: number) {
    e.preventDefault();
    e.stopPropagation();
    await db.analyses.delete(id);
    setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  async function handleDeleteAll() {
    await db.analyses.clear();
    setRecords([]);
  }

  if (isLoading) return null;
  if (records.length === 0) return null;

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <h2 className="text-sm font-medium text-muted-foreground">
            {t("home.recent")}
          </h2>
        </div>
        <button
          onClick={handleDeleteAll}
          className="text-xs text-muted-foreground transition-colors hover:text-destructive cursor-pointer"
        >
          {t("home.recent.deleteAll")}
        </button>
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
                  {record.strategy === "mobile" ? t("home.recent.mobile") : t("home.recent.desktop")} ·
                  {t("home.recent.perf")}{" "}
                  <span className="font-semibold text-foreground">
                    {record.scores.performance}
                  </span>
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <span className="text-xs text-muted-foreground">
                {formatDate(record.analyzedAt, locale)}
              </span>
              {record.id != null && (
                <button
                  onClick={(e) => handleDelete(e, record.id!)}
                  className="rounded-lg p-1.5 text-muted-foreground transition-colors duration-150 hover:bg-destructive/10 hover:text-destructive cursor-pointer"
                  aria-label={t("history.deleteAria")}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
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
