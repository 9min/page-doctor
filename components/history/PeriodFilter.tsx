"use client";

import { cn } from "@/lib/utils";
import { useTranslation } from "@/hooks/useTranslation";
import type { TranslationKey } from "@/lib/i18n";

interface PeriodFilterProps {
  selectedDays: number;
  onSelect: (days: number) => void;
}

const PERIOD_OPTIONS: Array<{ days: number; labelKey: TranslationKey }> = [
  { days: 7, labelKey: "period.7" },
  { days: 30, labelKey: "period.30" },
  { days: 90, labelKey: "period.90" },
  { days: 365, labelKey: "period.365" },
];

export function PeriodFilter({ selectedDays, onSelect }: PeriodFilterProps) {
  const { t } = useTranslation();

  return (
    <div className="flex gap-2">
      {PERIOD_OPTIONS.map((filter) => (
        <button
          key={filter.days}
          type="button"
          onClick={() => onSelect(filter.days)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            selectedDays === filter.days
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {t(filter.labelKey)}
        </button>
      ))}
    </div>
  );
}
