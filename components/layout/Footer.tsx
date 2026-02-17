import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6">
      <div className="container mx-auto flex flex-col items-center gap-2 px-4 text-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4" aria-hidden="true" />
          <span className="font-medium">PageDoctor</span>
        </div>
        <p>Google PageSpeed Insights API로 구동됩니다.</p>
      </div>
    </footer>
  );
}
