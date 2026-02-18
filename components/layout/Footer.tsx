import { Activity } from "lucide-react";
import Link from "next/link";

export function Footer() {
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
            Google PageSpeed Insights API로 구동됩니다.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link
              href="/"
              className="transition-colors hover:text-foreground cursor-pointer"
            >
              홈
            </Link>
            <Link
              href="/analyze"
              className="transition-colors hover:text-foreground cursor-pointer"
            >
              분석
            </Link>
            <Link
              href="/history"
              className="transition-colors hover:text-foreground cursor-pointer"
            >
              히스토리
            </Link>
            <Link
              href="/compare"
              className="transition-colors hover:text-foreground cursor-pointer"
            >
              비교
            </Link>
          </div>
          <p className="text-xs text-muted-foreground/60">
            &copy; {new Date().getFullYear()} PageDoctor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
