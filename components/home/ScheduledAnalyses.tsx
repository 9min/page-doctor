"use client";

import { Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { useScheduleList } from "@/hooks/useSchedule";
import { useTranslation } from "@/hooks/useTranslation";
import { formatDate } from "@/lib/utils";
import type { TranslationKey } from "@/lib/i18n";

const INTERVAL_LABELS: Record<string, TranslationKey> = {
  daily: "schedule.daily",
  weekly: "schedule.weekly",
  monthly: "schedule.monthly",
};

export function ScheduledAnalyses() {
  const { schedules, isLoading } = useScheduleList();
  const { t, locale } = useTranslation();

  if (isLoading) return null;
  if (schedules.length === 0) return null;

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-4 flex items-center gap-2">
        <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
        <h2 className="text-sm font-medium text-muted-foreground">
          {t("schedule.section.title")}
        </h2>
      </div>
      <div className="space-y-2 stagger-fade">
        {schedules.map((schedule) => (
          <Link
            key={schedule.id}
            href={`/analyze?url=${encodeURIComponent(schedule.url)}&strategy=${schedule.strategy}`}
            className="glass-card flex items-center justify-between p-3.5 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
          >
            <div className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">
                {schedule.url}
              </span>
              <span className="text-xs text-muted-foreground">
                {t(INTERVAL_LABELS[schedule.interval])} · {schedule.strategy === "mobile" ? t("input.mobile") : t("input.desktop")}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-3">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden="true" />
              <span className="text-xs text-muted-foreground">
                {t("schedule.nextRun")}: {formatDate(schedule.nextRunAt, locale)}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
