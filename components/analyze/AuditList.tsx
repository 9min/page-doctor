"use client";

import { useState } from "react";
import type { Audit, Category } from "@/types";
import { AuditItem } from "./AuditItem";
import { useTranslation } from "@/hooks/useTranslation";
import type { TranslationKey } from "@/lib/i18n";

interface AuditListProps {
  audits: Audit[];
}

type FilterKey = "all" | Category;

const FILTER_OPTIONS: Array<{ key: FilterKey; labelKey: TranslationKey }> = [
  { key: "all", labelKey: "audit.filter.all" },
  { key: "performance", labelKey: "category.performance" },
  { key: "accessibility", labelKey: "category.accessibility" },
  { key: "best-practices", labelKey: "category.best-practices" },
  { key: "seo", labelKey: "category.seo" },
];

export function AuditList({ audits }: AuditListProps) {
  const [filter, setFilter] = useState<FilterKey>("all");
  const { t } = useTranslation();

  const filtered =
    filter === "all"
      ? audits
      : audits.filter((a) => a.category === filter);

  return (
    <div className="glass-card p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">
          {t("audit.title")}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            ({filtered.length})
          </span>
        </h2>
        <div
          className="flex flex-wrap gap-1 rounded-xl bg-secondary p-1"
          role="tablist"
          aria-label={t("audit.filter.ariaLabel")}
        >
          {FILTER_OPTIONS.map((opt) => (
            <button
              type="button"
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              aria-pressed={filter === opt.key}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 motion-reduce:transition-none cursor-pointer ${
                filter === opt.key
                  ? "bg-primary/20 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t(opt.labelKey)}
            </button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          {t("audit.empty")}
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((audit) => (
            <AuditItem key={audit.id} audit={audit} />
          ))}
        </div>
      )}
    </div>
  );
}
