"use client";

import { useState } from "react";
import { Target, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import type { PerformanceBudget, Category } from "@/types";
import type { TranslationKey } from "@/lib/i18n";

interface BudgetDialogProps {
  budget: PerformanceBudget | null;
  onSave: (budget: PerformanceBudget) => void | Promise<void>;
  onDelete: () => void | Promise<void>;
}

const CATEGORIES: Array<{ key: Category; labelKey: TranslationKey }> = [
  { key: "performance", labelKey: "category.performance" },
  { key: "accessibility", labelKey: "category.accessibility" },
  { key: "best-practices", labelKey: "category.best-practices" },
  { key: "seo", labelKey: "category.seo" },
];

export function BudgetDialog({ budget, onSave, onDelete }: BudgetDialogProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<PerformanceBudget>({});
  const { t } = useTranslation();

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      setValues(budget ?? {});
    }
    setOpen(nextOpen);
  };

  const handleChange = (category: Category, value: string) => {
    const num = value === "" ? undefined : Math.min(100, Math.max(0, parseInt(value, 10)));
    setValues((prev) => ({
      ...prev,
      [category]: Number.isNaN(num) ? undefined : num,
    }));
  };

  const handleSave = async () => {
    try {
      await onSave(values);
      setOpen(false);
    } catch {
      console.error("Budget save failed");
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete();
      setOpen(false);
    } catch {
      console.error("Budget delete failed");
    }
  };

  const hasBudget = budget !== null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={t("budget.ariaLabel")}
          className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground cursor-pointer"
        >
          <Target className="h-4 w-4" aria-hidden="true" />
          {t("budget.button")}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("budget.title")}</DialogTitle>
          <DialogDescription>
            {t("budget.description")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {CATEGORIES.map(({ key, labelKey }) => (
            <div key={key} className="flex items-center gap-4">
              <label
                htmlFor={`budget-${key}`}
                className="w-28 text-sm font-medium text-foreground shrink-0"
              >
                {t(labelKey)}
              </label>
              <input
                id={`budget-${key}`}
                type="number"
                min={0}
                max={100}
                placeholder={t("budget.placeholder")}
                value={values[key] ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          ))}
        </div>

        <DialogFooter className="flex-row gap-2 sm:justify-between">
          {hasBudget && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              {t("budget.delete")}
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              {t("budget.cancel")}
            </Button>
            <Button type="button" size="sm" onClick={handleSave}>
              {t("budget.save")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
