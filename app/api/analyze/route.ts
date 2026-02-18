import { NextRequest, NextResponse } from "next/server";
import type { AnalysisResult, Audit, AuditDetails, CategoryScores, Strategy, WebVitals } from "@/types";

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

    const params = new URLSearchParams({
      url,
      strategy,
      category: "PERFORMANCE",
    });
    if (apiKey) {
      params.set("key", apiKey);
    }
    // URLSearchParams only keeps the last value for duplicate keys, so append extra categories
    params.append("category", "ACCESSIBILITY");
    params.append("category", "BEST_PRACTICES");
    params.append("category", "SEO");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    let psiResponse: Response;
    try {
      psiResponse = await fetch(`${PSI_API_URL}?${params.toString()}`, {
        signal: controller.signal,
      });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return NextResponse.json(
          { error: "분석 요청 시간이 초과되었습니다.", code: "TIMEOUT" },
          { status: 504 }
        );
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }

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

  const loadingMetrics = data.loadingExperience?.metrics;

  const webVitals: WebVitals = {
    lcp: lighthouseAudits["largest-contentful-paint"]?.numericValue ?? null,
    inp: lighthouseAudits["interaction-to-next-paint"]?.numericValue ??
      lighthouseAudits["experimental-interaction-to-next-paint"]?.numericValue ??
      loadingMetrics?.INTERACTION_TO_NEXT_PAINT?.percentile ??
      null,
    cls: lighthouseAudits["cumulative-layout-shift"]?.numericValue ?? null,
  };

  const audits = extractAudits(data);

  return {
    url,
    strategy,
    fetchedAt: data.lighthouseResult?.fetchTime ?? new Date().toISOString(),
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
        details: extractAuditDetails(audit.details),
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function flattenValue(val: any): string | number | null {
  if (val == null) return null;
  if (typeof val === "string" || typeof val === "number") return val;
  if (typeof val === "object") {
    // Handle common PSI value types: {type: "url", value: "..."}, {type: "code", value: "..."}, {type: "node", snippet: "..."}
    if (val.value != null) return String(val.value);
    if (val.snippet != null) return String(val.snippet);
    if (val.url != null) return String(val.url);
    return JSON.stringify(val);
  }
  return String(val);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractAuditDetails(details: any): AuditDetails | undefined {
  if (!details) return undefined;
  const type = details.type;
  if (type !== "table" && type !== "opportunity") return undefined;
  if (!Array.isArray(details.headings) || !Array.isArray(details.items)) return undefined;
  if (details.items.length === 0) return undefined;

  const headings = details.headings
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((h: any) => h && h.key)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((h: any) => ({
      key: String(h.key),
      label: String(h.label ?? h.key),
      valueType: h.valueType ? String(h.valueType) : undefined,
    }));

  if (headings.length === 0) return undefined;

  const items = details.items.slice(0, 10).map(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (item: any) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const flat: Record<string, any> = {};
      for (const h of headings) {
        flat[h.key] = flattenValue(item[h.key]);
      }
      return flat;
    }
  );

  return {
    type,
    headings,
    items,
    overallSavingsMs: typeof details.overallSavingsMs === "number" ? details.overallSavingsMs : undefined,
    overallSavingsBytes: typeof details.overallSavingsBytes === "number" ? details.overallSavingsBytes : undefined,
  };
}
