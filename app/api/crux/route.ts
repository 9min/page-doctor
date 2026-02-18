import { NextRequest, NextResponse } from "next/server";
import type { CruxResult, Rating } from "@/types";

const CRUX_API_URL =
  "https://chromeuxreport.googleapis.com/v1/records:queryRecord";

function getRating(
  p75: number,
  goodThreshold: number,
  poorThreshold: number
): Rating {
  if (p75 <= goodThreshold) return "good";
  if (p75 <= poorThreshold) return "needs-improvement";
  return "poor";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "URL이 필요합니다.", code: "MISSING_URL" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_CRUX_API_KEY;
    if (!apiKey) {
      // 키 없으면 데이터 없음으로 응답 (CrUX API는 키 필수)
      return NextResponse.json({
        result: { url, hasData: false } satisfies CruxResult,
      });
    }

    // CrUX API 호출 - origin 단위로 조회
    let origin: string;
    try {
      const parsed = new URL(url);
      origin = parsed.origin;
    } catch {
      return NextResponse.json(
        { error: "올바른 URL 형식이 아닙니다.", code: "INVALID_URL" },
        { status: 400 }
      );
    }

    const cruxResponse = await fetch(`${CRUX_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        origin,
        formFactor: "PHONE",
        metrics: [
          "largest_contentful_paint",
          "interaction_to_next_paint",
          "cumulative_layout_shift",
        ],
      }),
    });

    // CrUX 데이터가 없는 경우 (트래픽이 적은 URL)
    if (cruxResponse.status === 404) {
      const result: CruxResult = {
        url,
        hasData: false,
      };
      return NextResponse.json({ result });
    }

    if (!cruxResponse.ok) {
      const errorData = await cruxResponse.json().catch(() => ({}));
      console.error("CrUX API error:", errorData);
      return NextResponse.json(
        {
          error: "CrUX API 호출에 실패했습니다.",
          code: "CRUX_API_ERROR",
        },
        { status: 502 }
      );
    }

    const cruxData = await cruxResponse.json();
    const metrics = cruxData.record?.metrics;

    const result: CruxResult = {
      url,
      hasData: true,
    };

    if (metrics?.largest_contentful_paint) {
      const p75 = metrics.largest_contentful_paint.percentiles.p75;
      result.lcp = {
        p75,
        rating: getRating(p75, 2500, 4000),
      };
    }

    if (metrics?.interaction_to_next_paint) {
      const p75 = metrics.interaction_to_next_paint.percentiles.p75;
      result.inp = {
        p75,
        rating: getRating(p75, 200, 500),
      };
    }

    if (metrics?.cumulative_layout_shift) {
      const p75 = metrics.cumulative_layout_shift.percentiles.p75;
      result.cls = {
        p75,
        rating: getRating(p75, 0.1, 0.25),
      };
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("CrUX API route error:", error);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다.", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
