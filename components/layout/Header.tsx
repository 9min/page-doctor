"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { LocaleSwitcher } from "@/components/shared/LocaleSwitcher";
import { useTranslation } from "@/hooks/useTranslation";
import { cn } from "@/lib/utils";
import type { TranslationKey } from "@/lib/i18n";

const NAV_ITEMS: Array<{ href: string; labelKey: TranslationKey }> = [
  { href: "/", labelKey: "nav.home" },
  { href: "/analyze", labelKey: "nav.analyze" },
  { href: "/history", labelKey: "nav.history" },
  { href: "/compare", labelKey: "nav.compare" },
];

export function Header() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="mx-auto max-w-7xl px-4 pt-3">
        <div className="glass-card flex h-14 items-center justify-between rounded-2xl px-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-bold tracking-tight cursor-pointer"
          >
            <Activity
              className="h-5 w-5 text-[#3B82F6]"
              aria-hidden="true"
            />
            <span className="text-gradient">PageDoctor</span>
          </Link>

          <nav
            className="flex items-center gap-1"
            aria-label={t("nav.ariaLabel")}
          >
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-xl px-3.5 py-1.5 text-sm font-medium transition-all duration-200 cursor-pointer",
                    isActive
                      ? "bg-[#3B82F6]/10 text-[#3B82F6]"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
            <div className="ml-2 flex items-center gap-1.5 border-l border-border pl-2">
              <LocaleSwitcher />
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
