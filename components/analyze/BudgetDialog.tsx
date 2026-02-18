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
import { CATEGORY_LABELS } from "@/lib/constants";
import type { PerformanceBudget, Category } from "@/types";

interface BudgetDialogProps {
  budget: PerformanceBudget | null;
  onSave: (budget: PerformanceBudget) => void;
  onDelete: () => void;
}

const CATEGORIES: Category[] = [
  "performance",
  "accessibility",
  "best-practices",
  "seo",
];

export function BudgetDialog({ budget, onSave, onDelete }: BudgetDialogProps) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<PerformanceBudget>({});

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

  const handleSave = () => {
    onSave(values);
    setOpen(false);
  };

  const handleDelete = () => {
    onDelete();
    setOpen(false);
  };

  const hasBudget = budget !== null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="성능 버짓 설정"
          className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground cursor-pointer"
        >
          <Target className="h-4 w-4" aria-hidden="true" />
          버짓
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>성능 버짓 설정</DialogTitle>
          <DialogDescription>
            각 카테고리의 목표 점수를 설정하세요. 분석 결과에서 달성 여부를 확인할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {CATEGORIES.map((category) => (
            <div key={category} className="flex items-center gap-4">
              <label
                htmlFor={`budget-${category}`}
                className="w-28 text-sm font-medium text-foreground shrink-0"
              >
                {CATEGORY_LABELS[category]}
              </label>
              <input
                id={`budget-${category}`}
                type="number"
                min={0}
                max={100}
                placeholder="미설정"
                value={values[category] ?? ""}
                onChange={(e) => handleChange(category, e.target.value)}
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
              삭제
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              취소
            </Button>
            <Button type="button" size="sm" onClick={handleSave}>
              저장
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
