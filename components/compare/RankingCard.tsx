"use client";

import { Trophy } from "lucide-react";
import type { CompareItem } from "@/hooks/useCompare";
import { getScoreRating } from "@/lib/utils";
import { RatingBadge } from "@/components/shared/RatingBadge";
import { useTranslation } from "@/hooks/useTranslation";

interface RankingCardProps {
  items: CompareItem[];
}

function shortenUrl(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

const MEDAL_STYLES = [
  {
    text: "text-yellow-400",
    bg: "bg-gradient-to-r from-yellow-500/10 to-amber-500/5 border border-yellow-500/20",
  },
  {
    text: "text-gray-400",
    bg: "bg-secondary",
  },
  {
    text: "text-amber-600",
    bg: "bg-secondary",
  },
];

export function RankingCard({ items }: RankingCardProps) {
  const { t } = useTranslation();
  const successItems = items
    .filter((item) => item.result !== null)
    .sort(
      (a, b) => b.result!.scores.performance - a.result!.scores.performance
    );

  if (successItems.length === 0) return null;

  return (
    <div className="glass-card p-6">
      <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-400" />
        {t("compare.ranking")}
      </h2>
      <div className="space-y-2.5">
        {successItems.map((item, i) => {
          const score = item.result!.scores.performance;
          const style = MEDAL_STYLES[i] ?? { text: "text-muted-foreground", bg: "bg-secondary" };

          return (
            <div
              key={item.url}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors duration-200 ${style.bg}`}
            >
              <span
                className={`text-2xl font-bold ${style.text}`}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold" title={item.url}>
                  {shortenUrl(item.url)}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.url}
                </p>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-xl font-bold">{score}</span>
                <RatingBadge rating={getScoreRating(score)} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
