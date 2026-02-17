import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { AnalyzeDashboard } from "@/components/analyze/AnalyzeDashboard";

function AnalyzePageFallback() {
  return (
    <div className="flex items-center gap-3 py-8">
      <Loader2 className="h-5 w-5 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">로딩 중...</p>
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
