"use client";

import type { WebVitals } from "@/types";
import { MetricCard } from "./MetricCard";

interface CoreWebVitalsProps {
  webVitals: WebVitals;
}

export function CoreWebVitals({ webVitals }: CoreWebVitalsProps) {
  return (
    <div className="glass-card p-6">
      <h2 className="mb-4 text-lg font-semibold">Core Web Vitals</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <MetricCard metric="LCP" value={webVitals.lcp} />
        <MetricCard metric="INP" value={webVitals.inp} />
        <MetricCard metric="CLS" value={webVitals.cls} />
      </div>
    </div>
  );
}
