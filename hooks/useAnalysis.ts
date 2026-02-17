"use client";

import { useState, useCallback } from "react";
import type { AnalysisResult, Strategy } from "@/types";
import { analyzeUrl } from "@/lib/api";

interface UseAnalysisReturn {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  analyze: (url: string, strategy: Strategy) => Promise<AnalysisResult | null>;
  reset: () => void;
}

export function useAnalysis(): UseAnalysisReturn {
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(
    async (url: string, strategy: Strategy): Promise<AnalysisResult | null> => {
      setIsLoading(true);
      setError(null);
      setResult(null);

      try {
        const response = await analyzeUrl({ url, strategy });
        setResult(response.result);
        return response.result;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "분석 중 오류가 발생했습니다.";
        setError(message);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setResult(null);
    setIsLoading(false);
    setError(null);
  }, []);

  return { result, isLoading, error, analyze, reset };
}
