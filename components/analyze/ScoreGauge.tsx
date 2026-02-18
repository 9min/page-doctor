"use client";

import { cn, getScoreRating } from "@/lib/utils";
import { RATING_COLORS } from "@/lib/constants";
import { RatingBadge } from "@/components/shared/RatingBadge";
import { BudgetIndicator } from "./BudgetIndicator";

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: number;
  target?: number;
}

export function ScoreGauge({ score, label, size = 120, target }: ScoreGaugeProps) {
  const rating = getScoreRating(score);
  const color = RATING_COLORS[rating].text;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const filterId = `glow-${label.replace(/\s+/g, "-")}`;

  // Target line position on the arc
  const targetOffset = target != null
    ? circumference - (target / 100) * circumference
    : null;

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
          aria-hidden="true"
        >
          <defs>
            <filter id={filterId}>
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={color} floodOpacity="0.4" />
            </filter>
          </defs>
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/20"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            filter={`url(#${filterId})`}
            className="transition-all duration-1000 ease-out"
          />
          {/* Target marker */}
          {targetOffset != null && (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth={strokeWidth + 2}
              strokeLinecap="butt"
              strokeDasharray={`2 ${circumference - 2}`}
              strokeDashoffset={targetOffset}
              className="pointer-events-none"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={cn("text-2xl font-bold")}
            style={{ color }}
            aria-label={`${label} 점수 ${score}점`}
          >
            {score}
          </span>
        </div>
      </div>
      <span className="text-sm font-medium text-muted-foreground">
        {label}
      </span>
      <RatingBadge rating={rating} />
      {target != null && (
        <BudgetIndicator target={target} current={score} />
      )}
    </div>
  );
}
