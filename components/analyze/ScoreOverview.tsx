"use client";

import type { CategoryScores } from "@/types";
import { CATEGORY_LABELS } from "@/lib/constants";
import { ScoreGauge } from "./ScoreGauge";

interface ScoreOverviewProps {
  scores: CategoryScores;
}

const CATEGORY_ORDER: Array<keyof CategoryScores> = [
  "performance",
  "accessibility",
  "best-practices",
  "seo",
];

export function ScoreOverview({ scores }: ScoreOverviewProps) {
  return (
    <div className="glass-card p-6">
      <h2 className="mb-6 text-lg font-semibold">카테고리 점수</h2>
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {CATEGORY_ORDER.map((key) => (
          <ScoreGauge
            key={key}
            score={scores[key]}
            label={CATEGORY_LABELS[key]}
          />
        ))}
      </div>
    </div>
  );
}
