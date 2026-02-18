"use client";

import type { Audit } from "@/types";
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

export function AuditItem({ audit }: AuditItemProps) {
  const { t } = useTranslation();

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border border-border border-l-[3px] p-3.5 transition-colors duration-200 hover:bg-secondary ${IMPACT_BAR[audit.impact]}`}
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
    </div>
  );
}
