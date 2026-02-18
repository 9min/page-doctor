"use client";

import type { CompareItem } from "@/hooks/useCompare";
import { formatMetricValue, getMetricRating, getScoreRating } from "@/lib/utils";
import { RatingBadge } from "@/components/shared/RatingBadge";
import type { WebVitalMetric } from "@/types";

interface CompareTableProps {
  items: CompareItem[];
}

const METRICS: { key: WebVitalMetric; label: string }[] = [
  { key: "LCP", label: "LCP" },
  { key: "INP", label: "INP" },
  { key: "CLS", label: "CLS" },
];

const METRIC_TO_VITALS_KEY: Record<WebVitalMetric, "lcp" | "inp" | "cls"> = {
  LCP: "lcp",
  INP: "inp",
  CLS: "cls",
};

function shortenUrl(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export function CompareTable({ items }: CompareTableProps) {
  const successItems = items.filter((item) => item.result !== null);

  if (successItems.length === 0) return null;

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 pb-0">
        <h2 className="text-lg font-semibold">상세 비교</h2>
      </div>
      <div className="overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted-foreground">
              <th className="px-4 py-3 font-medium">지표</th>
              {successItems.map((item) => (
                <th
                  key={item.url}
                  className="px-4 py-3 font-medium text-center"
                  title={item.url}
                >
                  {shortenUrl(item.url)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* Performance Score */}
            <tr className="border-b border-border/50">
              <td className="px-4 py-3 font-medium">성능 점수</td>
              {successItems.map((item) => (
                <td key={item.url} className="px-4 py-3 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-lg font-bold">
                      {item.result!.scores.performance}
                    </span>
                    <RatingBadge
                      rating={getScoreRating(item.result!.scores.performance)}
                    />
                  </div>
                </td>
              ))}
            </tr>

            {/* CWV Metrics */}
            {METRICS.map(({ key, label }) => (
              <tr key={key} className="border-b border-border/50">
                <td className="px-4 py-3 font-medium">{label}</td>
                {successItems.map((item) => {
                  const value =
                    item.result!.webVitals[METRIC_TO_VITALS_KEY[key]];
                  return (
                    <td key={item.url} className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span>{formatMetricValue(key, value)}</span>
                        {value !== null && (
                          <RatingBadge rating={getMetricRating(key, value)} />
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Other Scores */}
            {(
              [
                { key: "accessibility", label: "접근성" },
                { key: "best-practices", label: "권장사항" },
                { key: "seo", label: "SEO" },
              ] as const
            ).map(({ key, label }) => (
              <tr key={key} className="border-b border-border/50">
                <td className="px-4 py-3 font-medium">{label}</td>
                {successItems.map((item) => (
                  <td key={item.url} className="px-4 py-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span>{item.result!.scores[key]}</span>
                      <RatingBadge
                        rating={getScoreRating(item.result!.scores[key])}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
