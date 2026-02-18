"use client";

import { CheckCircle2, AlertTriangle } from "lucide-react";

interface BudgetIndicatorProps {
  target: number;
  current: number;
}

export function BudgetIndicator({ target, current }: BudgetIndicatorProps) {
  const met = current >= target;

  return (
    <div className="flex items-center gap-1.5 mt-1">
      {met ? (
        <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" aria-hidden="true" />
      ) : (
        <AlertTriangle className="h-3.5 w-3.5 text-danger shrink-0" aria-hidden="true" />
      )}
      <span
        className={`text-xs ${met ? "text-success" : "text-danger"}`}
        aria-label={`목표: ${target}점, 현재: ${current}점`}
      >
        목표 {target} / 현재 {current}
      </span>
    </div>
  );
}
