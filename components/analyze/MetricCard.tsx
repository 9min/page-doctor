"use client";

import type { WebVitalMetric } from "@/types";
import { formatMetricValue, getMetricRating } from "@/lib/utils";
import { WEB_VITAL_LABELS } from "@/lib/constants";
import { RatingBadge } from "@/components/shared/RatingBadge";

interface MetricCardProps {
  metric: WebVitalMetric;
  value: number | null;
  source?: "lab" | "field";
}

const COLOR_BAR_CLASSES = {
  good: "color-bar-good",
  "needs-improvement": "color-bar-warning",
  poor: "color-bar-danger",
} as const;

export function MetricCard({ metric, value, source = "lab" }: MetricCardProps) {
  const rating = value !== null ? getMetricRating(metric, value) : "poor";
  const displayValue = formatMetricValue(metric, value);

  return (
    <div
      className={`flex flex-col gap-2 rounded-xl bg-secondary p-4 transition-colors duration-200 hover:bg-accent ${COLOR_BAR_CLASSES[rating]}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-muted-foreground">
          {metric}
        </span>
        {value !== null && <RatingBadge rating={rating} />}
      </div>
      <p className="text-3xl font-bold tracking-tight">{displayValue}</p>
      <p className="text-xs text-muted-foreground">
        {WEB_VITAL_LABELS[metric]}
        {source === "field" && value !== null && (
          <span className="ml-1 opacity-70">(p75)</span>
        )}
      </p>
    </div>
  );
}
