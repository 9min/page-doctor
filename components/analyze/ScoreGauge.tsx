"use client";

import { cn, getScoreRating } from "@/lib/utils";
import { RATING_COLORS } from "@/lib/constants";
import { RatingBadge } from "@/components/shared/RatingBadge";

interface ScoreGaugeProps {
  score: number;
  label: string;
  size?: number;
}

export function ScoreGauge({ score, label, size = 120 }: ScoreGaugeProps) {
  const rating = getScoreRating(score);
  const color = RATING_COLORS[rating].text;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const filterId = `glow-${label.replace(/\s+/g, "-")}`;

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
    </div>
  );
}
