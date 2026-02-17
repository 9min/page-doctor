"use client";

import { useState } from "react";
import type { Audit, Category } from "@/types";
import { CATEGORY_LABELS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { AuditItem } from "./AuditItem";

interface AuditListProps {
  audits: Audit[];
}

type FilterKey = "all" | Category;

const FILTER_OPTIONS: Array<{ key: FilterKey; label: string }> = [
  { key: "all", label: "전체" },
  { key: "performance", label: CATEGORY_LABELS.performance },
  { key: "accessibility", label: CATEGORY_LABELS.accessibility },
  { key: "best-practices", label: CATEGORY_LABELS["best-practices"] },
  { key: "seo", label: CATEGORY_LABELS.seo },
];

export function AuditList({ audits }: AuditListProps) {
  const [filter, setFilter] = useState<FilterKey>("all");

  const filtered =
    filter === "all"
      ? audits
      : audits.filter((a) => a.category === filter);

  return (
    <div className="glass-card p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">
          개선 제안 ({filtered.length})
        </h2>
        <div className="flex flex-wrap gap-1">
          {FILTER_OPTIONS.map((opt) => (
            <Button
              key={opt.key}
              variant={filter === opt.key ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(opt.key)}
              className="text-xs"
            >
              {opt.label}
            </Button>
          ))}
        </div>
      </div>
      {filtered.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          개선 제안이 없습니다.
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
