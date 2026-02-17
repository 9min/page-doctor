import { NextRequest, NextResponse } from "next/server";
import type { AnalysisResult, Audit, CategoryScores, Strategy, WebVitals } from "@/types";

const PSI_API_URL =
  "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, strategy = "mobile" } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL이 필요합니다.", code: "MISSING_URL" },
        { status: 400 }
      );
    }

    if (!["mobile", "desktop"].includes(strategy)) {
      return NextResponse.json(
        { error: "전략은 mobile 또는 desktop이어야 합니다.", code: "INVALID_STRATEGY" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_PSI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API 키가 설정되지 않았습니다.", code: "MISSING_API_KEY" },
        { status: 500 }
      );
    }

    const params = new URLSearchParams({
      url,
      strategy,
      key: apiKey,
      category: "PERFORMANCE",
    });
    // URLSearchParams only keeps the last value for duplicate keys, so append extra categories
    params.append("category", "ACCESSIBILITY");
    params.append("category", "BEST_PRACTICES");
    params.append("category", "SEO");

    const psiResponse = await fetch(`${PSI_API_URL}?${params.toString()}`);

    if (!psiResponse.ok) {
      const errorData = await psiResponse.json().catch(() => null);
      const message =
        errorData?.error?.message || "PSI API 호출에 실패했습니다.";
      console.error("PSI API Error:", message);
      return NextResponse.json(
        { error: message, code: "PSI_API_ERROR" },
        { status: 502 }
      );
    }

    const data = await psiResponse.json();
    const result = normalizeResponse(data, url, strategy as Strategy);

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Analyze API Error:", error);
    return NextResponse.json(
      { error: "분석 요청 처리 중 오류가 발생했습니다.", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeResponse(data: any, url: string, strategy: Strategy): AnalysisResult {
  const categories = data.lighthouseResult?.categories ?? {};
  const lighthouseAudits = data.lighthouseResult?.audits ?? {};

  const scores: CategoryScores = {
    performance: Math.round((categories.performance?.score ?? 0) * 100),
    accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
    "best-practices": Math.round(
      (categories["best-practices"]?.score ?? 0) * 100
    ),
    seo: Math.round((categories.seo?.score ?? 0) * 100),
  };

  const webVitals: WebVitals = {
    lcp: lighthouseAudits["largest-contentful-paint"]?.numericValue ?? null,
    inp: lighthouseAudits["interaction-to-next-paint"]?.numericValue ??
      lighthouseAudits["experimental-interaction-to-next-paint"]?.numericValue ??
      null,
    cls: lighthouseAudits["cumulative-layout-shift"]?.numericValue ?? null,
  };

  const audits = extractAudits(data);

  return {
    url,
    strategy,
    fetchedAt: new Date().toISOString(),
    scores,
    webVitals,
    audits,
    screenshot:
      lighthouseAudits["final-screenshot"]?.details?.data ?? undefined,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractAudits(data: any): Audit[] {
  const lighthouseAudits = data.lighthouseResult?.audits ?? {};
  const categories = data.lighthouseResult?.categories ?? {};

  const audits: Audit[] = [];
  const seen = new Set<string>();

  const categoryKeys: Array<{ key: string; category: Audit["category"] }> = [
    { key: "performance", category: "performance" },
    { key: "accessibility", category: "accessibility" },
    { key: "best-practices", category: "best-practices" },
    { key: "seo", category: "seo" },
  ];

  for (const { key, category } of categoryKeys) {
    const refs =
      categories[key]?.auditRefs?.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (ref: any) => ref.weight > 0 || ref.group === "diagnostics"
      ) ?? [];

    for (const ref of refs) {
      const audit = lighthouseAudits[ref.id];
      if (!audit || seen.has(ref.id)) continue;
      if (audit.score === null || audit.score === undefined) continue;
      if (audit.score >= 0.9) continue; // Skip passing audits

      seen.add(ref.id);

      let impact: Audit["impact"] = "low";
      if (ref.weight >= 10 || audit.score <= 0.3) impact = "high";
      else if (ref.weight >= 5 || audit.score <= 0.6) impact = "medium";

      audits.push({
        id: ref.id,
        title: audit.title ?? ref.id,
        description: audit.description ?? "",
        score: audit.score,
        displayValue: audit.displayValue ?? undefined,
        category,
        impact,
      });
    }
  }

  // Sort: high > medium > low, then by score ascending
  const impactOrder = { high: 0, medium: 1, low: 2 };
  audits.sort((a, b) => {
    const impactDiff = impactOrder[a.impact] - impactOrder[b.impact];
    if (impactDiff !== 0) return impactDiff;
    return (a.score ?? 0) - (b.score ?? 0);
  });

  return audits;
}
