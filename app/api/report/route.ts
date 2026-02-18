import { NextRequest, NextResponse } from "next/server";
import type { AnalysisResult, ReportData } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, analysisResult } = body as {
      url: string;
      analysisResult: AnalysisResult;
    };

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL이 필요합니다.", code: "MISSING_URL" },
        { status: 400 }
      );
    }

    if (!analysisResult || typeof analysisResult !== "object") {
      return NextResponse.json(
        { error: "분석 결과가 필요합니다.", code: "MISSING_ANALYSIS" },
        { status: 400 }
      );
    }

    const topAudits = [...analysisResult.audits]
      .sort((a, b) => {
        const impactOrder = { high: 0, medium: 1, low: 2 };
        return impactOrder[a.impact] - impactOrder[b.impact];
      })
      .slice(0, 10);

    const report: ReportData = {
      url,
      analyzedAt: analysisResult.fetchedAt,
      scores: analysisResult.scores,
      webVitals: analysisResult.webVitals,
      topAudits,
    };

    return NextResponse.json({ report });
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청입니다.", code: "BAD_REQUEST" },
      { status: 400 }
    );
  }
}
