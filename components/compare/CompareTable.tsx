"use client";

import type { CompareItem } from "@/hooks/useCompare";
import { formatMetricValue, getMetricRating, getScoreRating } from "@/lib/utils";
import { RatingBadge } from "@/components/shared/RatingBadge";
import { useTranslation } from "@/hooks/useTranslation";
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
  const { t } = useTranslation();
  const successItems = items.filter((item) => item.result !== null);

  if (successItems.length === 0) return null;

  const rows = [
    { key: "performance", label: t("compare.perfScore") },
    ...METRICS.map(({ key, label }) => ({ key, label })),
    { key: "accessibility" as const, label: t("category.accessibility") },
    { key: "best-practices" as const, label: t("category.best-practices") },
    { key: "seo" as const, label: t("category.seo") },
  ];

  return (
    <div className="glass-card overflow-hidden">
      <div className="p-6 pb-0">
        <h2 className="text-lg font-semibold">{t("compare.detail")}</h2>
      </div>
      <div className="overflow-x-auto p-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50 text-left text-muted-foreground">
              <th className="px-4 py-3.5 font-medium">{t("compare.metric")}</th>
              {successItems.map((item) => (
                <th
                  key={item.url}
                  className="px-4 py-3.5 font-medium text-center"
                  title={item.url}
                >
                  {shortenUrl(item.url)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={row.key} className={`border-b border-border/30 transition-colors duration-150 hover:bg-[#3B82F6]/5 ${idx % 2 === 1 ? "bg-secondary" : ""}`}>
                <td className="px-4 py-3 font-medium">{row.label}</td>
                {successItems.map((item) => {
                  const isMetric = ["LCP", "INP", "CLS"].includes(row.key);
                  const isPerformance = row.key === "performance";

                  if (isPerformance) {
                    return (
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
                    );
                  }

                  if (isMetric) {
                    const metricKey = row.key as WebVitalMetric;
                    const value = item.result!.webVitals[METRIC_TO_VITALS_KEY[metricKey]];
                    return (
                      <td key={item.url} className="px-4 py-3 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <span className="font-mono text-xs">
                            {formatMetricValue(metricKey, value)}
                          </span>
                          {value !== null && (
                            <RatingBadge rating={getMetricRating(metricKey, value)} />
                          )}
                        </div>
                      </td>
                    );
                  }

                  const scores = item.result!.scores;
                  const scoreKey = row.key as keyof typeof scores;
                  return (
                    <td key={item.url} className="px-4 py-3 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <span className="font-semibold">{scores[scoreKey]}</span>
                        <RatingBadge
                          rating={getScoreRating(item.result!.scores[scoreKey])}
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
