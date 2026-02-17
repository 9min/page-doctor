import { Activity } from "lucide-react";
import { UrlInput } from "@/components/home/UrlInput";
import { RecentAnalyses } from "@/components/home/RecentAnalyses";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-20">
      <div className="animate-fade-in text-center">
        <div className="mb-6 flex items-center justify-center gap-3">
          <Activity className="h-12 w-12 text-primary" aria-hidden="true" />
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            PageDoctor
          </h1>
        </div>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          웹 페이지의 성능을 검사하고, Core Web Vitals를 측정하며,
          <br className="hidden sm:block" />
          맞춤형 개선 제안을 받아보세요.
        </p>
      </div>

      <div className="mt-12 w-full max-w-xl">
        <UrlInput />
      </div>

      <div className="mt-16">
        <RecentAnalyses />
      </div>
    </div>
  );
}
