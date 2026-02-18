import { Activity, BarChart3, History, GitCompareArrows } from "lucide-react";
import { UrlInput } from "@/components/home/UrlInput";
import { RecentAnalyses } from "@/components/home/RecentAnalyses";

const FEATURES = [
  {
    icon: Activity,
    title: "성능 측정",
    description: "Core Web Vitals와 Lighthouse 점수를 한눈에 확인하세요.",
  },
  {
    icon: History,
    title: "히스토리 추적",
    description: "성능 변화를 시간 흐름에 따라 추적하고 트렌드를 분석하세요.",
  },
  {
    icon: GitCompareArrows,
    title: "경쟁사 비교",
    description: "최대 5개 사이트를 동시에 비교하여 경쟁 우위를 파악하세요.",
  },
];

export default function Home() {
  return (
    <div className="relative flex flex-col items-center px-4 py-16 sm:py-24">
      {/* Hero */}
      <div className="animate-fade-in relative text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
          <BarChart3
            className="h-3.5 w-3.5 text-[#3B82F6]"
            aria-hidden="true"
          />
          <span className="text-xs font-medium text-muted-foreground">
            웹 성능 검사 & 모니터링 대시보드
          </span>
        </div>

        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight">
          <span className="text-gradient">PageDoctor</span>로
          <br />
          웹 성능을 진단하세요
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          URL 하나로 Core Web Vitals 측정, 성능 개선 제안,
          <br className="hidden sm:block" />
          히스토리 추적까지 한 번에.
        </p>
      </div>

      {/* URL Input */}
      <div className="relative mt-10 w-full max-w-xl animate-slide-up glow-blue rounded-2xl">
        <UrlInput />
      </div>

      {/* Feature Cards */}
      <div className="relative mt-20 grid w-full max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3 stagger-fade">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="glass-card group flex flex-col items-center gap-3 p-6 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B82F6]/10 transition-colors group-hover:bg-[#3B82F6]/20">
              <feature.icon
                className="h-6 w-6 text-[#3B82F6]"
                aria-hidden="true"
              />
            </div>
            <h3 className="text-base font-bold text-foreground">{feature.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Analyses */}
      <div className="relative mt-16">
        <RecentAnalyses />
      </div>
    </div>
  );
}
