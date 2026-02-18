"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { CATEGORY_LABELS, CHART_COLORS } from "@/lib/constants";
import type { CompareItem } from "@/hooks/useCompare";

interface CompareRadarChartProps {
  items: CompareItem[];
}

export function CompareRadarChart({ items }: CompareRadarChartProps) {
  const successItems = items.filter((item) => item.result !== null);

  if (successItems.length === 0) return null;

  const data = (
    Object.keys(CATEGORY_LABELS) as Array<keyof typeof CATEGORY_LABELS>
  ).map((key) => {
    const entry: Record<string, string | number> = {
      category: CATEGORY_LABELS[key],
    };
    successItems.forEach((item) => {
      if (item.result) {
        entry[item.url] = item.result.scores[key];
      }
    });
    return entry;
  });

  // URL을 짧게 표시
  const shortenUrl = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="glass-card p-6">
      <h2 className="mb-4 text-lg font-semibold">카테고리 점수 비교</h2>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.15)" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fontSize: 12, fill: "var(--muted-foreground)" }}
          />
          <PolarRadiusAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--popover-foreground)",
            }}
          />
          <Legend
            formatter={(value: string) => shortenUrl(value)}
          />
          {successItems.map((item, i) => (
            <Radar
              key={item.url}
              name={item.url}
              dataKey={item.url}
              stroke={CHART_COLORS[i % CHART_COLORS.length]}
              fill={CHART_COLORS[i % CHART_COLORS.length]}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          ))}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
