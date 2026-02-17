import { Activity } from "lucide-react";

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

      {/* TODO: UrlInput 컴포넌트 */}
      <div className="mt-12 w-full max-w-xl">
        <div className="glass-card flex h-14 items-center justify-center text-muted-foreground">
          URL 입력 컴포넌트 (구현 예정)
        </div>
      </div>

      {/* TODO: RecentAnalyses 컴포넌트 */}
      <div className="mt-16 w-full max-w-4xl">
        <div className="glass-card flex h-32 items-center justify-center text-muted-foreground">
          최근 분석 목록 (구현 예정)
        </div>
      </div>
    </div>
  );
}
