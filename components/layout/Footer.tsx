"use client";

import { Activity } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/hooks/useTranslation";

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="mt-auto py-8">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-separator mb-8" />
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <Activity
              className="h-4 w-4 text-[#3B82F6]"
              aria-hidden="true"
            />
            <span className="text-sm font-semibold text-gradient">
              PageDoctor
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("footer.powered")}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link
              href="/"
              className="transition-colors hover:text-foreground cursor-pointer"
            >
              {t("nav.home")}
            </Link>
            <Link
              href="/analyze"
              className="transition-colors hover:text-foreground cursor-pointer"
            >
              {t("nav.analyze")}
            </Link>
            <Link
              href="/history"
              className="transition-colors hover:text-foreground cursor-pointer"
            >
              {t("nav.history")}
            </Link>
            <Link
              href="/compare"
              className="transition-colors hover:text-foreground cursor-pointer"
            >
              {t("nav.compare")}
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
