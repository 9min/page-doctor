"use client";

import { useState, useCallback } from "react";
import type { AnalysisResult, Strategy } from "@/types";
import { analyzeUrl } from "@/lib/api";

export interface CompareItem {
  url: string;
  result: AnalysisResult | null;
  error: string | null;
  isLoading: boolean;
}

interface UseCompareReturn {
  items: CompareItem[];
  isComparing: boolean;
  compare: (urls: string[], strategy: Strategy) => Promise<void>;
  reset: () => void;
}

export function useCompare(): UseCompareReturn {
  const [items, setItems] = useState<CompareItem[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const compare = useCallback(
    async (urls: string[], strategy: Strategy) => {
      setIsComparing(true);

      // 초기 상태 설정
      const initial: CompareItem[] = urls.map((url) => ({
        url,
        result: null,
        error: null,
        isLoading: true,
      }));
      setItems(initial);

      // Promise.allSettled로 병렬 분석
      const results = await Promise.allSettled(
        urls.map((url) => analyzeUrl({ url, strategy }))
      );

      const updated: CompareItem[] = urls.map((url, i) => {
        const settled = results[i];
        if (settled.status === "fulfilled") {
          return {
            url,
            result: settled.value.result,
            error: null,
            isLoading: false,
          };
        }
        return {
          url,
          result: null,
          error:
            settled.reason instanceof Error
              ? settled.reason.message
              : "분석 실패",
          isLoading: false,
        };
      });

      setItems(updated);
      setIsComparing(false);
    },
    []
  );

  const reset = useCallback(() => {
    setItems([]);
    setIsComparing(false);
  }, []);

  return { items, isComparing, compare, reset };
}
