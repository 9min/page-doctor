"use client";

import { CheckCircle2, AlertTriangle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

interface BudgetIndicatorProps {
  target: number;
  current: number;
}

export function BudgetIndicator({ target, current }: BudgetIndicatorProps) {
  const { t } = useTranslation();
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
        aria-label={t("budgetIndicator.aria", { target: String(target), current: String(current) })}
      >
        {t("budgetIndicator.label", { target: String(target), current: String(current) })}
      </span>
    </div>
  );
}
