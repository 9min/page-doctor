import type { ScheduleInterval } from "@/types";

export function calculateNextRunAt(interval: ScheduleInterval, from?: Date): string {
  const base = from ?? new Date();
  const next = new Date(base);

  switch (interval) {
    case "daily":
      next.setDate(next.getDate() + 1);
      break;
    case "weekly":
      next.setDate(next.getDate() + 7);
      break;
    case "monthly": {
      const day = next.getDate();
      next.setDate(1);
      next.setMonth(next.getMonth() + 1);
      const lastDay = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
      next.setDate(Math.min(day, lastDay));
      break;
    }
  }

  return next.toISOString();
}

export function isOverdue(nextRunAt: string): boolean {
  return new Date(nextRunAt) <= new Date();
}
