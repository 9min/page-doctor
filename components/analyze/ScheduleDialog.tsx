"use client";

import { useState } from "react";
import { Clock, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import { useSchedule } from "@/hooks/useSchedule";
import { requestNotificationPermission } from "@/lib/notifications";
import type { ScheduleInterval, Strategy } from "@/types";
import type { TranslationKey } from "@/lib/i18n";

interface ScheduleDialogProps {
  url: string;
  strategy: Strategy;
}

const INTERVAL_OPTIONS: Array<{ value: ScheduleInterval; labelKey: TranslationKey }> = [
  { value: "daily", labelKey: "schedule.daily" },
  { value: "weekly", labelKey: "schedule.weekly" },
  { value: "monthly", labelKey: "schedule.monthly" },
];

export function ScheduleDialog({ url, strategy }: ScheduleDialogProps) {
  const { t } = useTranslation();
  const { schedule, saveSchedule, deleteSchedule } = useSchedule(url, strategy);
  const [open, setOpen] = useState(false);
  const [interval, setInterval] = useState<ScheduleInterval>("weekly");
  const [notifyComplete, setNotifyComplete] = useState(true);
  const [notifyBudget, setNotifyBudget] = useState(true);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen && schedule) {
      setInterval(schedule.interval);
      setNotifyComplete(schedule.notifyOnComplete);
      setNotifyBudget(schedule.notifyOnBudgetExceed);
    }
    setOpen(nextOpen);
  };

  const handleSave = async () => {
    // Request notification permission if any notification option is enabled
    if (notifyComplete || notifyBudget) {
      await requestNotificationPermission();
    }

    await saveSchedule({
      interval,
      notifyOnComplete: notifyComplete,
      notifyOnBudgetExceed: notifyBudget,
    });
    setOpen(false);
  };

  const handleDelete = async () => {
    await deleteSchedule();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label={t("schedule.ariaLabel")}
          className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground cursor-pointer"
        >
          <Clock className="h-4 w-4" aria-hidden="true" />
          {t("schedule.button")}
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("schedule.title")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Interval */}
          <div className="space-y-2">
            <p className="text-sm font-medium">{t("schedule.interval")}</p>
            <div
              className="flex gap-1 rounded-xl bg-secondary p-1"
              role="radiogroup"
              aria-label={t("schedule.interval")}
            >
              {INTERVAL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="radio"
                  aria-checked={interval === opt.value}
                  onClick={() => setInterval(opt.value)}
                  className={`flex-1 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer ${
                    interval === opt.value
                      ? "bg-primary/20 text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t(opt.labelKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Notification options */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyComplete}
                onChange={(e) => setNotifyComplete(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-[#3B82F6]"
              />
              <span className="text-sm">{t("schedule.notifyComplete")}</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={notifyBudget}
                onChange={(e) => setNotifyBudget(e.target.checked)}
                className="h-4 w-4 rounded border-border accent-[#3B82F6]"
              />
              <span className="text-sm">{t("schedule.notifyBudget")}</span>
            </label>
          </div>
        </div>

        <DialogFooter className="flex-row gap-2 sm:justify-between">
          {schedule && (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="mr-1.5 h-3.5 w-3.5" />
              {t("schedule.delete")}
            </Button>
          )}
          <div className="flex gap-2 ml-auto">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              {t("schedule.cancel")}
            </Button>
            <Button type="button" size="sm" onClick={handleSave}>
              {t("schedule.save")}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
