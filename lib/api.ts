import type {
  AnalyzeRequest,
  AnalyzeResponse,
  CruxRequest,
  CruxResponse,
  ReportRequest,
  ReportResponse,
  ApiError,
} from "@/types";

async function fetchJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const error: ApiError = await res.json();
    throw new Error(error.error || "요청에 실패했습니다.");
  }

  return res.json() as Promise<T>;
}

export async function analyzeUrl(
  request: AnalyzeRequest
): Promise<AnalyzeResponse> {
  return fetchJson<AnalyzeResponse>("/api/analyze", request);
}

export async function fetchCruxData(
  request: CruxRequest
): Promise<CruxResponse> {
  return fetchJson<CruxResponse>("/api/crux", request);
}

export async function generateReport(
  request: ReportRequest
): Promise<ReportResponse> {
  return fetchJson<ReportResponse>("/api/report", request);
}
