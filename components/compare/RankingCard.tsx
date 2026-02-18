"use client";

import { Trophy } from "lucide-react";
import type { CompareItem } from "@/hooks/useCompare";
import { getScoreRating } from "@/lib/utils";
import { RatingBadge } from "@/components/shared/RatingBadge";

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

export function RankingCard({ items }: RankingCardProps) {
  const successItems = items
    .filter((item) => item.result !== null)
    .sort(
      (a, b) => b.result!.scores.performance - a.result!.scores.performance
    );

  if (successItems.length === 0) return null;

  const medalColors = [
    "text-yellow-400",
    "text-gray-400",
    "text-amber-600",
  ];

  return (
    <div className="glass-card p-6">
      <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
        <Trophy className="h-5 w-5 text-yellow-400" />
        종합 순위
      </h2>
      <div className="space-y-3">
        {successItems.map((item, i) => {
          const score = item.result!.scores.performance;
          return (
            <div
              key={item.url}
              className="flex items-center gap-3 rounded-lg bg-muted/30 px-4 py-3 transition-colors"
            >
              <span
                className={`text-2xl font-bold ${medalColors[i] ?? "text-muted-foreground"}`}
              >
                {i + 1}
              </span>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium" title={item.url}>
                  {shortenUrl(item.url)}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {item.url}
                </p>
              </div>
              <div className="flex items-center gap-2">
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
