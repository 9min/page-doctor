"use client";

import { PERIOD_FILTERS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PeriodFilterProps {
  selectedDays: number;
  onSelect: (days: number) => void;
}

export function PeriodFilter({ selectedDays, onSelect }: PeriodFilterProps) {
  return (
    <div className="flex gap-2">
      {PERIOD_FILTERS.map((filter) => (
        <button
          key={filter.days}
          onClick={() => onSelect(filter.days)}
          className={cn(
            "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
            selectedDays === filter.days
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}
