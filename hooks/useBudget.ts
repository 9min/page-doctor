"use client";

import { useCallback, useEffect, useState } from "react";
import { db } from "@/lib/db";
import type { PerformanceBudget } from "@/types";

function budgetKey(url: string): string {
  return `budget:${url}`;
}

export function useBudget(url: string | null) {
  const [budget, setBudget] = useState<PerformanceBudget | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!url) {
      setBudget(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const record = await db.settings.get(budgetKey(url));
      if (record) {
        setBudget(JSON.parse(record.value) as PerformanceBudget);
      } else {
        setBudget(null);
      }
    } catch {
      setBudget(null);
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveBudget = useCallback(
    async (newBudget: PerformanceBudget) => {
      if (!url) return;
      const key = budgetKey(url);
      await db.settings.put({ key, value: JSON.stringify(newBudget) });
      setBudget(newBudget);
    },
    [url],
  );

  const deleteBudget = useCallback(async () => {
    if (!url) return;
    await db.settings.delete(budgetKey(url));
    setBudget(null);
  }, [url]);

  return { budget, isLoading, saveBudget, deleteBudget };
}
