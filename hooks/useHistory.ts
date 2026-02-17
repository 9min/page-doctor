"use client";

import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/db";
import type { AnalysisRecord, AnalysisResult } from "@/types";

interface UseHistoryReturn {
  histories: AnalysisRecord[];
  uniqueUrls: string[];
  isLoading: boolean;
  saveResult: (result: AnalysisResult) => Promise<void>;
  getByUrl: (url: string, days?: number) => Promise<AnalysisRecord[]>;
  getRecent: (limit?: number) => Promise<AnalysisRecord[]>;
  deleteRecord: (id: number) => Promise<void>;
  refresh: () => Promise<void>;
}

export function useHistory(): UseHistoryReturn {
  const [histories, setHistories] = useState<AnalysisRecord[]>([]);
  const [uniqueUrls, setUniqueUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const all = await db.analyses.orderBy("analyzedAt").reverse().toArray();
      setHistories(all);

      const urls = [...new Set(all.map((r) => r.url))];
      setUniqueUrls(urls);
    } catch (error) {
      console.error("Failed to load history:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveResult = useCallback(
    async (result: AnalysisResult) => {
      try {
        const record: AnalysisRecord = {
          url: result.url,
          strategy: result.strategy,
          analyzedAt: result.fetchedAt,
          scores: result.scores,
          webVitals: result.webVitals,
          audits: result.audits,
        };
        await db.analyses.add(record);
        await refresh();
      } catch (error) {
        console.error("Failed to save result:", error);
      }
    },
    [refresh]
  );

  const getByUrl = useCallback(
    async (url: string, days?: number): Promise<AnalysisRecord[]> => {
      if (days) {
        const since = new Date();
        since.setDate(since.getDate() - days);
        return db.analyses
          .where("[url+analyzedAt]")
          .between([url, since.toISOString()], [url, "\uffff"], true, true)
          .sortBy("analyzedAt");
      }

      return db.analyses
        .where("url")
        .equals(url)
        .sortBy("analyzedAt");
    },
    []
  );

  const getRecent = useCallback(
    async (limit = 5): Promise<AnalysisRecord[]> => {
      return db.analyses.orderBy("analyzedAt").reverse().limit(limit).toArray();
    },
    []
  );

  const deleteRecord = useCallback(
    async (id: number) => {
      try {
        await db.analyses.delete(id);
        await refresh();
      } catch (error) {
        console.error("Failed to delete record:", error);
      }
    },
    [refresh]
  );

  return {
    histories,
    uniqueUrls,
    isLoading,
    saveResult,
    getByUrl,
    getRecent,
    deleteRecord,
    refresh,
  };
}
