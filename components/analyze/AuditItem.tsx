"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Audit, AuditDetailItem, AuditDetailHeading } from "@/types";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import type { TranslationKey } from "@/lib/i18n";

interface AuditItemProps {
  audit: Audit;
}

const IMPACT_STYLES = {
  high: "bg-danger/10 text-danger border-danger/20",
  medium: "bg-warning/10 text-warning border-warning/20",
  low: "bg-muted text-muted-foreground border-border",
};

const IMPACT_LABEL_KEYS: Record<string, TranslationKey> = {
  high: "audit.impact.high",
  medium: "audit.impact.medium",
  low: "audit.impact.low",
};

const CATEGORY_LABEL_KEYS: Record<string, TranslationKey> = {
  performance: "category.performance",
  accessibility: "category.accessibility",
  "best-practices": "category.best-practices",
  seo: "category.seo",
};

const IMPACT_BAR = {
  high: "border-l-[#EF4444]",
  medium: "border-l-[#F59E0B]",
  low: "border-l-border",
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(1)} MB`;
}

function formatMs(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)} ms`;
  return `${(ms / 1000).toFixed(1)} s`;
}

function AuditCellValue({
  value,
  valueType,
}: {
  value: string | number | null | undefined;
  valueType?: string;
}) {
  if (value == null || value === "") return <span className="text-muted-foreground">—</span>;

  if (valueType === "bytes" && typeof value === "number") {
    return <span>{formatBytes(value)}</span>;
  }
  if ((valueType === "ms" || valueType === "timespanMs") && typeof value === "number") {
    return <span>{formatMs(value)}</span>;
  }
  if (valueType === "url" && typeof value === "string") {
    const display = value.length > 60 ? value.slice(0, 57) + "…" : value;
    return (
      <span className="break-all text-primary" title={value}>
        {display}
      </span>
    );
  }
  if (valueType === "numeric" && typeof value === "number") {
    return <span>{value.toLocaleString()}</span>;
  }

  return <span className="break-all">{String(value)}</span>;
}

export function AuditItem({ audit }: AuditItemProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const hasDetails = !!(audit.details || audit.description);
  const hasTable = !!(audit.details?.headings?.length && audit.details?.items?.length);

  return (
    <div
      className={`rounded-xl border border-border border-l-[3px] transition-colors duration-200 ${IMPACT_BAR[audit.impact]}`}
    >
      <button
        type="button"
        onClick={() => hasDetails && setExpanded(!expanded)}
        aria-expanded={hasDetails ? expanded : undefined}
        disabled={!hasDetails}
        className={`flex w-full items-start gap-3 p-3.5 text-left transition-colors duration-200 ${
          hasDetails ? "cursor-pointer hover:bg-secondary" : "cursor-default"
        }`}
      >
        <Badge
          variant="outline"
          className={IMPACT_STYLES[audit.impact]}
        >
          {IMPACT_LABEL_KEYS[audit.impact] ? t(IMPACT_LABEL_KEYS[audit.impact]) : audit.impact}
        </Badge>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{audit.title}</p>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {CATEGORY_LABEL_KEYS[audit.category] ? t(CATEGORY_LABEL_KEYS[audit.category]) : audit.category}
            </span>
            {audit.displayValue && (
              <span className="text-xs text-muted-foreground">
                · {audit.displayValue}
              </span>
            )}
          </div>
        </div>
        {hasDetails && (
          <ChevronDown
            className={`mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        )}
      </button>

      {expanded && hasDetails && (
        <div className="border-t border-border px-3.5 pb-3.5 pt-3 space-y-3">
          {/* Description */}
          {audit.description && (
            <p className="text-xs leading-relaxed text-muted-foreground">
              {audit.description}
            </p>
          )}

          {/* Savings badges */}
          {(audit.details?.overallSavingsMs != null || audit.details?.overallSavingsBytes != null) && (
            <div className="flex flex-wrap gap-2">
              {audit.details.overallSavingsMs != null && audit.details.overallSavingsMs > 0 && (
                <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                  {t("audit.details.savingsMs")}: {formatMs(audit.details.overallSavingsMs)}
                </Badge>
              )}
              {audit.details.overallSavingsBytes != null && audit.details.overallSavingsBytes > 0 && (
                <Badge variant="outline" className="bg-success/10 text-success border-success/20 text-xs">
                  {t("audit.details.savingsBytes")}: {formatBytes(audit.details.overallSavingsBytes)}
                </Badge>
              )}
            </div>
          )}

          {/* Detail table */}
          {hasTable && (
            <div>
              <p className="mb-2 text-xs font-medium text-muted-foreground">
                {t("audit.details.items").replace("{count}", String(audit.details!.items.length))}
              </p>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50">
                      {audit.details!.headings.map((h: AuditDetailHeading) => (
                        <th
                          key={h.key}
                          className="px-3 py-2 text-left font-medium text-muted-foreground"
                        >
                          {h.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {audit.details!.items.map((item: AuditDetailItem, i: number) => (
                      <tr
                        key={i}
                        className="border-b border-border last:border-b-0 hover:bg-secondary/30"
                      >
                        {audit.details!.headings.map((h: AuditDetailHeading) => (
                          <td key={h.key} className="px-3 py-2">
                            <AuditCellValue
                              value={item[h.key]}
                              valueType={h.valueType}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
