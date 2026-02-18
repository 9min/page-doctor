"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="relative flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="relative">
        <p className="text-8xl font-bold text-gradient sm:text-9xl">404</p>
        <p className="mt-4 text-xl font-semibold">
          {t("notFound.title")}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("notFound.description")}
        </p>
        <Button asChild className="btn-gradient mt-8 rounded-xl cursor-pointer">
          <Link href="/" className="flex items-center gap-2">
            <Home className="h-4 w-4" aria-hidden="true" />
            {t("notFound.home")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
