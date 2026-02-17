"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "홈" },
  { href: "/analyze", label: "분석" },
  { href: "/history", label: "히스토리" },
  { href: "/compare", label: "비교" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="glass-card sticky top-0 z-50 border-b border-border/40">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Activity className="h-5 w-5 text-primary" aria-hidden="true" />
          <span>PageDoctor</span>
        </Link>

        <nav className="flex items-center gap-1" aria-label="메인 네비게이션">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-md px-3 py-2 text-sm transition-colors hover:text-foreground",
                pathname === item.href
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
