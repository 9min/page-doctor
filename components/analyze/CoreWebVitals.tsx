"use client";

import { useState } from "react";
import { FlaskConical, Globe } from "lucide-react";
import type { CruxResult, WebVitals } from "@/types";
import { MetricCard } from "./MetricCard";

type DataTab = "lab" | "field";

interface CoreWebVitalsProps {
  webVitals: WebVitals;
  cruxResult?: CruxResult | null;
}

export function CoreWebVitals({ webVitals, cruxResult }: CoreWebVitalsProps) {
  const [tab, setTab] = useState<DataTab>("lab");

  const hasFieldData = cruxResult?.hasData === true;

  const fieldVitals: WebVitals = hasFieldData
    ? {
        lcp: cruxResult.lcp?.p75 ?? null,
        inp: cruxResult.inp?.p75 ?? null,
        cls: cruxResult.cls?.p75 ?? null,
      }
    : { lcp: null, inp: null, cls: null };

  const activeVitals = tab === "lab" ? webVitals : fieldVitals;

  return (
    <div className="glass-card p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Core Web Vitals</h2>
        <div
          className="flex gap-1 rounded-xl bg-secondary p-1"
          role="tablist"
          aria-label="데이터 소스 선택"
        >
          <button
            type="button"
            role="tab"
            aria-selected={tab === "lab"}
            onClick={() => setTab("lab")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
              tab === "lab"
                ? "bg-[#3B82F6]/10 text-[#3B82F6] shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
            Lab Data
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "field"}
            onClick={() => setTab("field")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 cursor-pointer ${
              tab === "field"
                ? "bg-[#3B82F6]/10 text-[#3B82F6] shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Globe className="h-3.5 w-3.5" aria-hidden="true" />
            Field Data
          </button>
        </div>
      </div>

      {tab === "field" && !hasFieldData ? (
        <div className="flex flex-col items-center justify-center rounded-xl bg-secondary py-10 text-center">
          <Globe className="h-8 w-8 text-muted-foreground/50" aria-hidden="true" />
          <p className="mt-3 text-sm font-medium text-muted-foreground">
            필드 데이터가 없습니다
          </p>
          <p className="mt-1 text-xs text-muted-foreground/70">
            트래픽이 충분하지 않은 URL은 CrUX 데이터가 제공되지 않습니다.
          </p>
        </div>
      ) : (
        <div role="tabpanel">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <MetricCard
              metric="LCP"
              value={activeVitals.lcp}
              source={tab}
            />
            <MetricCard
              metric="INP"
              value={activeVitals.inp}
              source={tab}
            />
            <MetricCard
              metric="CLS"
              value={activeVitals.cls}
              source={tab}
            />
          </div>
          {tab === "field" && (
            <p className="mt-3 text-xs text-muted-foreground/70">
              * Field Data는 Chrome 사용자의 실제 측정값(p75)입니다.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
