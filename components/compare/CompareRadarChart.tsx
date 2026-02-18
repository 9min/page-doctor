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
import { CHART_COLORS } from "@/lib/constants";
import { useTranslation } from "@/hooks/useTranslation";
import type { CompareItem } from "@/hooks/useCompare";
import type { TranslationKey } from "@/lib/i18n";

interface CompareRadarChartProps {
  items: CompareItem[];
}

const CATEGORY_KEYS: Array<{ key: string; labelKey: TranslationKey }> = [
  { key: "performance", labelKey: "category.performance" },
  { key: "accessibility", labelKey: "category.accessibility" },
  { key: "best-practices", labelKey: "category.best-practices" },
  { key: "seo", labelKey: "category.seo" },
];

export function CompareRadarChart({ items }: CompareRadarChartProps) {
  const { t } = useTranslation();
  const successItems = items.filter((item) => item.result !== null);

  if (successItems.length === 0) return null;

  const data = CATEGORY_KEYS.map(({ key, labelKey }) => {
    const entry: Record<string, string | number> = {
      category: t(labelKey),
    };
    successItems.forEach((item) => {
      if (item.result) {
        entry[item.url] = item.result.scores[key as keyof typeof item.result.scores];
      }
    });
    return entry;
  });

  const shortenUrl = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="glass-card p-6">
      <h2 className="mb-4 text-lg font-semibold">{t("compare.radar")}</h2>
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
