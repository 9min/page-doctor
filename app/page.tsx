"use client";

import dynamic from "next/dynamic";
import { Activity, BarChart3, History, GitCompareArrows } from "lucide-react";
import { UrlInput } from "@/components/home/UrlInput";
import { useTranslation } from "@/hooks/useTranslation";
import type { TranslationKey } from "@/lib/i18n";
import type { LucideIcon } from "lucide-react";

const RecentAnalyses = dynamic(
  () => import("@/components/home/RecentAnalyses").then((m) => ({ default: m.RecentAnalyses })),
  { ssr: false }
);
const ScheduledAnalyses = dynamic(
  () => import("@/components/home/ScheduledAnalyses").then((m) => ({ default: m.ScheduledAnalyses })),
  { ssr: false }
);

const FEATURES: Array<{
  icon: LucideIcon;
  titleKey: TranslationKey;
  descKey: TranslationKey;
}> = [
  {
    icon: Activity,
    titleKey: "home.feature.measure.title",
    descKey: "home.feature.measure.desc",
  },
  {
    icon: History,
    titleKey: "home.feature.history.title",
    descKey: "home.feature.history.desc",
  },
  {
    icon: GitCompareArrows,
    titleKey: "home.feature.compare.title",
    descKey: "home.feature.compare.desc",
  },
];

export default function Home() {
  const { t, locale } = useTranslation();

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
            {t("home.badge")}
          </span>
        </div>

        <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight">
          {locale === "ko" ? (
            <>
              <span className="text-gradient">PageDoctor</span>{t("home.title.prefix")}
              <br />
              {t("home.title.suffix")}
            </>
          ) : (
            <>
              {t("home.title.prefix")}
              <br />
              {t("home.title.suffix")} <span className="text-gradient">PageDoctor</span>
            </>
          )}
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          {t("home.description")}
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
            key={feature.titleKey}
            className="glass-card group flex flex-col items-center gap-3 p-6 text-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#3B82F6]/10 transition-colors group-hover:bg-[#3B82F6]/20">
              <feature.icon
                className="h-6 w-6 text-[#3B82F6]"
                aria-hidden="true"
              />
            </div>
            <h2 className="text-base font-bold text-foreground">{t(feature.titleKey)}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {t(feature.descKey)}
            </p>
          </div>
        ))}
      </div>

      {/* Scheduled Analyses */}
      <div className="relative mt-16">
        <ScheduledAnalyses />
      </div>

      {/* Recent Analyses */}
      <div className="relative mt-8">
        <RecentAnalyses />
      </div>
    </div>
  );
}
