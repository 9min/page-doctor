"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { db } from "@/lib/db";
import { calculateNextRunAt } from "@/lib/schedule";
import type { ScheduleInterval, ScheduleRecord, Strategy } from "@/types";

interface UseScheduleReturn {
  schedule: ScheduleRecord | null;
  isLoading: boolean;
  saveSchedule: (data: {
    interval: ScheduleInterval;
    notifyOnComplete: boolean;
    notifyOnBudgetExceed: boolean;
  }) => Promise<void>;
  deleteSchedule: () => Promise<void>;
}

export function useSchedule(url: string | null, strategy: Strategy): UseScheduleReturn {
  const [schedule, setSchedule] = useState<ScheduleRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const requestIdRef = useRef(0);

  const refresh = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    if (!url) {
      setSchedule(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const records = await db.schedules
        .where("[url+strategy]")
        .equals([url, strategy])
        .toArray();

      if (requestId !== requestIdRef.current) return;
      setSchedule(records[0] ?? null);
    } catch {
      if (requestId !== requestIdRef.current) return;
      setSchedule(null);
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, [url, strategy]);

  useEffect(() => {
    refresh();
    return () => {
      requestIdRef.current += 1;
    };
  }, [refresh]);

  const saveSchedule = useCallback(
    async (data: {
      interval: ScheduleInterval;
      notifyOnComplete: boolean;
      notifyOnBudgetExceed: boolean;
    }) => {
      if (!url) return;

      const now = new Date().toISOString();
      const nextRunAt = calculateNextRunAt(data.interval);

      if (schedule?.id) {
        await db.schedules.update(schedule.id, {
          interval: data.interval,
          notifyOnComplete: data.notifyOnComplete,
          notifyOnBudgetExceed: data.notifyOnBudgetExceed,
          nextRunAt,
          enabled: true,
        });
      } else {
        await db.schedules.add({
          url,
          strategy,
          interval: data.interval,
          enabled: true,
          notifyOnComplete: data.notifyOnComplete,
          notifyOnBudgetExceed: data.notifyOnBudgetExceed,
          nextRunAt,
          createdAt: now,
        });
      }

      await refresh();
    },
    [url, strategy, schedule, refresh],
  );

  const deleteSchedule = useCallback(async () => {
    if (!schedule?.id) return;
    await db.schedules.delete(schedule.id);
    setSchedule(null);
  }, [schedule]);

  return { schedule, isLoading, saveSchedule, deleteSchedule };
}

export interface ScheduleListItem {
  schedule: ScheduleRecord;
}

export function useScheduleList() {
  const [schedules, setSchedules] = useState<ScheduleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const all = await db.schedules
        .where("enabled")
        .equals(1)
        .toArray();
      setSchedules(all);
    } catch {
      setSchedules([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { schedules, isLoading, refresh };
}
