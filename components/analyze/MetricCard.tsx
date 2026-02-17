"use client";

import type { WebVitalMetric } from "@/types";
import { formatMetricValue, getMetricRating } from "@/lib/utils";
import { WEB_VITAL_LABELS } from "@/lib/constants";
import { RatingBadge } from "@/components/shared/RatingBadge";

interface MetricCardProps {
  metric: WebVitalMetric;
  value: number | null;
}

export function MetricCard({ metric, value }: MetricCardProps) {
  const rating = value !== null ? getMetricRating(metric, value) : "poor";
  const displayValue = formatMetricValue(metric, value);

  return (
    <div className="glass-card flex flex-col gap-2 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {metric}
        </span>
        {value !== null && <RatingBadge rating={rating} />}
      </div>
      <p className="text-2xl font-bold">{displayValue}</p>
      <p className="text-xs text-muted-foreground">
        {WEB_VITAL_LABELS[metric]}
      </p>
    </div>
  );
}
