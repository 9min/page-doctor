"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { AnalysisRecord } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

interface ScoreTrendChartProps {
  records: AnalysisRecord[];
}

export function ScoreTrendChart({ records }: ScoreTrendChartProps) {
  const { t, locale } = useTranslation();

  if (records.length === 0) {
    return (
      <div className="glass-card flex h-64 items-center justify-center text-muted-foreground">
        {t("history.noRecords")}
      </div>
    );
  }

  const categoryLabels = {
    performance: t("category.performance"),
    accessibility: t("category.accessibility"),
    bestPractices: t("category.best-practices"),
    seo: t("category.seo"),
  };

  const data = records.map((r) => ({
    date: new Date(r.analyzedAt).toLocaleDateString(locale === "ko" ? "ko-KR" : "en-US", {
      month: "short",
      day: "numeric",
    }),
    [categoryLabels.performance]: r.scores.performance,
    [categoryLabels.accessibility]: r.scores.accessibility,
    [categoryLabels.bestPractices]: r.scores["best-practices"],
    [categoryLabels.seo]: r.scores.seo,
  }));

  const lineColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
  ];

  const categoryKeys = Object.values(categoryLabels);

  return (
    <div className="glass-card p-6">
      <h2 className="mb-4 text-lg font-semibold">{t("history.scoreTrend")}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="var(--muted-foreground)"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 12 }}
            stroke="var(--muted-foreground)"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--popover-foreground)",
            }}
          />
          <Legend />
          {categoryKeys.map((key, i) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={lineColors[i]}
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
