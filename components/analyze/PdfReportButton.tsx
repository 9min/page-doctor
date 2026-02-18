"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import type { AnalysisResult } from "@/types";
import { useTranslation } from "@/hooks/useTranslation";

interface PdfReportButtonProps {
  result: AnalysisResult;
}

export function PdfReportButton({ result }: PdfReportButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { t } = useTranslation();

  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const [{ pdf }, { PdfReportDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/lib/pdf-template"),
      ]);

      const topAudits = [...result.audits]
        .sort((a, b) => {
          const order = { high: 0, medium: 1, low: 2 };
          return order[a.impact] - order[b.impact];
        })
        .slice(0, 10);

      const report = {
        url: result.url,
        analyzedAt: result.fetchedAt,
        scores: result.scores,
        webVitals: result.webVitals,
        topAudits,
      };

      const blob = await pdf(<PdfReportDocument report={report} />).toBlob();
      const blobUrl = URL.createObjectURL(blob);

      let hostname: string;
      try {
        hostname = new URL(result.url).hostname;
      } catch {
        hostname = "unknown";
      }
      const date = new Date(result.fetchedAt).toISOString().slice(0, 10);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `PageDoctor_${hostname}_${date}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert(t("pdf.error"));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isGenerating}
      aria-label={isGenerating ? t("pdf.ariaGenerating") : t("pdf.ariaDownload")}
      aria-busy={isGenerating}
      className="flex items-center gap-2 rounded-xl border border-border bg-secondary px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-200 hover:bg-accent hover:text-foreground disabled:opacity-50 cursor-pointer"
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          {t("pdf.generating")}
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" aria-hidden="true" />
          {t("pdf.download")}
        </>
      )}
    </button>
  );
}
