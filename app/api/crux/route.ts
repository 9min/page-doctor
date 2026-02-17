import { NextRequest, NextResponse } from "next/server";

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

    // TODO: Google Chrome UX Report API 호출 구현
    return NextResponse.json(
      { error: "아직 구현되지 않았습니다.", code: "NOT_IMPLEMENTED" },
      { status: 501 }
    );
  } catch {
    return NextResponse.json(
      { error: "잘못된 요청입니다.", code: "BAD_REQUEST" },
      { status: 400 }
    );
  }
}
