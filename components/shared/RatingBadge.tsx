import type { Rating } from "@/types";
import { RATING_COLORS } from "@/lib/constants";

const RATING_LABELS: Record<Rating, string> = {
  good: "Good",
  "needs-improvement": "NI",
  poor: "Poor",
};

interface RatingBadgeProps {
  rating: Rating;
  className?: string;
}

export function RatingBadge({ rating, className = "" }: RatingBadgeProps) {
  const colors = RATING_COLORS[rating];

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${className}`}
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
      }}
    >
      {RATING_LABELS[rating]}
    </span>
  );
}
