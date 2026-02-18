"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { AnalysisRecord } from "@/types";
import { CWV_THRESHOLDS } from "@/lib/constants";
import { useTranslation } from "@/hooks/useTranslation";

interface WebVitalsTrendChartProps {
  records: AnalysisRecord[];
}

export function WebVitalsTrendChart({ records }: WebVitalsTrendChartProps) {
  const { t, locale } = useTranslation();
  const bcp47 = locale === "ko" ? "ko-KR" : "en-US";

  if (records.length === 0) {
    return (
      <div className="glass-card flex h-64 items-center justify-center text-muted-foreground">
        {t("history.noRecords")}
      </div>
    );
  }

  const lcpData = records.map((r) => ({
    date: new Date(r.analyzedAt).toLocaleDateString(bcp47, {
      month: "short",
      day: "numeric",
    }),
    LCP: r.webVitals.lcp ? Math.round(r.webVitals.lcp) : null,
  }));

  const inpData = records.map((r) => ({
    date: new Date(r.analyzedAt).toLocaleDateString(bcp47, {
      month: "short",
      day: "numeric",
    }),
    INP: r.webVitals.inp ? Math.round(r.webVitals.inp) : null,
  }));

  const clsData = records.map((r) => ({
    date: new Date(r.analyzedAt).toLocaleDateString(bcp47, {
      month: "short",
      day: "numeric",
    }),
    CLS: r.webVitals.cls,
  }));

  const tooltipStyle = {
    backgroundColor: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--popover-foreground)",
  };

  return (
    <div className="glass-card p-6">
      <h2 className="mb-4 text-lg font-semibold">{t("history.cwvTrend")}</h2>
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LCP Chart */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">
            LCP (ms)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={lcpData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={tooltipStyle} />
              <ReferenceLine
                y={CWV_THRESHOLDS.LCP.good}
                stroke="#22C55E"
                strokeDasharray="3 3"
                label={{ value: "Good", fontSize: 10, fill: "#22C55E" }}
              />
              <ReferenceLine
                y={CWV_THRESHOLDS.LCP.poor}
                stroke="#EF4444"
                strokeDasharray="3 3"
                label={{ value: "Poor", fontSize: 10, fill: "#EF4444" }}
              />
              <Line
                type="monotone"
                dataKey="LCP"
                stroke="var(--chart-1)"
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* INP Chart */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">
            INP (ms)
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={inpData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={tooltipStyle} />
              <ReferenceLine
                y={CWV_THRESHOLDS.INP.good}
                stroke="#22C55E"
                strokeDasharray="3 3"
                label={{ value: "Good", fontSize: 10, fill: "#22C55E" }}
              />
              <ReferenceLine
                y={CWV_THRESHOLDS.INP.poor}
                stroke="#EF4444"
                strokeDasharray="3 3"
                label={{ value: "Poor", fontSize: 10, fill: "#EF4444" }}
              />
              <Line
                type="monotone"
                dataKey="INP"
                stroke="var(--chart-2)"
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* CLS Chart */}
        <div>
          <h3 className="mb-2 text-sm font-medium text-muted-foreground">
            CLS
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={clsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
              <YAxis tick={{ fontSize: 10 }} stroke="var(--muted-foreground)" />
              <Tooltip contentStyle={tooltipStyle} />
              <ReferenceLine
                y={CWV_THRESHOLDS.CLS.good}
                stroke="#22C55E"
                strokeDasharray="3 3"
                label={{ value: "Good", fontSize: 10, fill: "#22C55E" }}
              />
              <ReferenceLine
                y={CWV_THRESHOLDS.CLS.poor}
                stroke="#EF4444"
                strokeDasharray="3 3"
                label={{ value: "Poor", fontSize: 10, fill: "#EF4444" }}
              />
              <Line
                type="monotone"
                dataKey="CLS"
                stroke="var(--chart-3)"
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
