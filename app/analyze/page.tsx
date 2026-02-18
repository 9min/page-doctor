"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { AnalyzeDashboard } from "@/components/analyze/AnalyzeDashboard";
import { useTranslation } from "@/hooks/useTranslation";

function AnalyzePageFallback() {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-3 py-8">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{t("analyze.loading.page")}</p>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<AnalyzePageFallback />}>
        <AnalyzeDashboard />
      </Suspense>
    </div>
  );
}
