"use client";

import type { CategoryScores, PerformanceBudget } from "@/types";
import { ScoreGauge } from "./ScoreGauge";
import { useTranslation } from "@/hooks/useTranslation";
import type { TranslationKey } from "@/lib/i18n";

interface ScoreOverviewProps {
  scores: CategoryScores;
  budget?: PerformanceBudget | null;
}

const CATEGORY_ORDER: Array<{ key: keyof CategoryScores; labelKey: TranslationKey }> = [
  { key: "performance", labelKey: "category.performance" },
  { key: "accessibility", labelKey: "category.accessibility" },
  { key: "best-practices", labelKey: "category.best-practices" },
  { key: "seo", labelKey: "category.seo" },
];

export function ScoreOverview({ scores, budget }: ScoreOverviewProps) {
  const { t } = useTranslation();

  return (
    <div className="glass-card p-6">
      <h2 className="mb-6 text-lg font-semibold">{t("score.title")}</h2>
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
        {CATEGORY_ORDER.map(({ key, labelKey }) => (
          <ScoreGauge
            key={key}
            score={scores[key]}
            label={t(labelKey)}
            target={budget?.[key]}
          />
        ))}
      </div>
    </div>
  );
}
