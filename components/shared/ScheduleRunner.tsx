"use client";

import { useEffect, useRef } from "react";
import { db } from "@/lib/db";
import { isOverdue, calculateNextRunAt } from "@/lib/schedule";
import { sendNotification } from "@/lib/notifications";
import { analyzeUrl } from "@/lib/api";
import type { PerformanceBudget } from "@/types";

export function ScheduleRunner() {
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    runOverdueSchedules();
  }, []);

  return null;
}

async function runOverdueSchedules() {
  try {
    const allSchedules = await db.schedules
      .where("enabled")
      .equals(1)
      .toArray();

    const overdue = allSchedules.filter(
      (s) => isOverdue(s.nextRunAt),
    );

    for (const schedule of overdue) {
      // Conditionally update nextRunAt to prevent multi-tab duplicate execution
      const newNextRunAt = calculateNextRunAt(schedule.interval);
      const updated = await db.schedules
        .where("id")
        .equals(schedule.id!)
        .and((s) => s.nextRunAt === schedule.nextRunAt)
        .modify({ nextRunAt: newNextRunAt });
      if (updated === 0) continue;

      try {
        const response = await analyzeUrl({
          url: schedule.url,
          strategy: schedule.strategy,
        });

        const result = response.result;

        // Save analysis result
        await db.analyses.add({
          url: result.url,
          strategy: result.strategy,
          analyzedAt: result.fetchedAt,
          scores: result.scores,
          webVitals: result.webVitals,
          audits: result.audits,
        });

        // Update lastRunAt
        await db.schedules.update(schedule.id!, {
          lastRunAt: new Date().toISOString(),
        });

        // Send completion notification
        if (schedule.notifyOnComplete) {
          sendNotification(
            "PageDoctor",
            `${schedule.url} - 성능 점수: ${result.scores.performance}`,
          );
        }

        // Check budget and send notification if exceeded
        if (schedule.notifyOnBudgetExceed) {
          await checkBudgetExceed(schedule.url, result.scores.performance);
        }
      } catch (err) {
        console.error(`Scheduled analysis failed for ${schedule.url}:`, err);
      }
    }
  } catch (err) {
    console.error("ScheduleRunner error:", err);
  }
}

async function checkBudgetExceed(url: string, performanceScore: number) {
  try {
    const budgetRecord = await db.settings.get(`budget:${url}`);
    if (!budgetRecord) return;

    const budget: PerformanceBudget = JSON.parse(budgetRecord.value);
    if (budget.performance && performanceScore < budget.performance) {
      sendNotification(
        "PageDoctor",
        `${url} - 성능 ${performanceScore} < 목표 ${budget.performance}`,
      );
    }
  } catch {
    // Budget check is non-critical
  }
}
