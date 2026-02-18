"use client";

import { WifiOff, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

export default function OfflinePage() {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative">
        <WifiOff className="mx-auto h-16 w-16 text-muted-foreground/50" />
        <p className="mt-6 text-xl font-semibold">
          {t("offline.title")}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("offline.description")}
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="btn-gradient mt-8 rounded-xl cursor-pointer"
        >
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden="true" />
          {t("offline.retry")}
        </Button>
      </div>
    </div>
  );
}
