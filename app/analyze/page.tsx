import { Suspense } from "react";
import { AnalyzeDashboard } from "@/components/analyze/AnalyzeDashboard";

export default function AnalyzePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense>
        <AnalyzeDashboard />
      </Suspense>
    </div>
  );
}
