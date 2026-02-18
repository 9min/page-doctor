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
import { CATEGORY_LABELS } from "@/lib/constants";

interface ScoreTrendChartProps {
  records: AnalysisRecord[];
}

export function ScoreTrendChart({ records }: ScoreTrendChartProps) {
  if (records.length === 0) {
    return (
      <div className="glass-card flex h-64 items-center justify-center text-muted-foreground">
        분석 기록이 없습니다.
      </div>
    );
  }

  const data = records.map((r) => ({
    date: new Date(r.analyzedAt).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    }),
    성능: r.scores.performance,
    접근성: r.scores.accessibility,
    권장사항: r.scores["best-practices"],
    SEO: r.scores.seo,
  }));

  const lineColors = [
    "var(--chart-1)",
    "var(--chart-2)",
    "var(--chart-3)",
    "var(--chart-4)",
  ];

  const categoryKeys = Object.values(CATEGORY_LABELS);

  return (
    <div className="glass-card p-6">
      <h2 className="mb-4 text-lg font-semibold">점수 트렌드</h2>
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
