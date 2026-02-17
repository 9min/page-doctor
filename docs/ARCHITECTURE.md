# PageDoctor - 아키텍처 문서

## 1. 시스템 아키텍처 개요

PageDoctor는 **Next.js 15 (App Router)** 기반의 웹 애플리케이션으로, Vercel에 배포되며 Google의 PageSpeed Insights API와 CrUX API를 활용하여 웹 성능을 측정합니다.

```
┌───────────────────────────────────────────────────────┐
│                   Vercel Edge Network                  │
│                                                       │
│  ┌─────────────────────┐  ┌────────────────────────┐  │
│  │   Frontend (SSR/CSR) │  │  API Routes (Serverless)│  │
│  │                     │  │                        │  │
│  │  Next.js 15         │  │  /api/analyze          │  │
│  │  React 19           │  │  /api/crux             │  │
│  │  Tailwind CSS v4    │  │  /api/report           │  │
│  │  shadcn/ui          │  │                        │  │
│  │  Recharts           │  │  API Key 보호           │  │
│  │  Dexie.js           │  │  응답 가공/캐싱          │  │
│  └──────────┬──────────┘  └────────┬───────────────┘  │
│             │                      │                   │
└─────────────┼──────────────────────┼───────────────────┘
              │                      │
              │ IndexedDB            │ HTTPS
              ▼                      ▼
   ┌──────────────────┐   ┌──────────────────────────┐
   │  브라우저 로컬 저장  │   │  Google APIs             │
   │  (Dexie.js)       │   │  ├ PageSpeed Insights v5  │
   │  - 분석 히스토리    │   │  └ Chrome UX Report      │
   │  - 사용자 설정      │   │                          │
   └──────────────────┘   └──────────────────────────┘
```

### 핵심 아키텍처 결정

**왜 PageSpeed Insights API인가?**

| 항목 | Lighthouse Node API | PageSpeed Insights API v5 |
|------|-------------------|--------------------------|
| 실행 환경 | Chrome 바이너리 필요 | Google 서버에서 실행 |
| Vercel 서버리스 | **실행 불가** (Chrome 설치 불가) | **가능** (HTTP 요청만) |
| 결과 품질 | Lighthouse 직접 실행 | 내부적으로 Lighthouse 실행 (동일 결과) |
| 비용 | 자체 서버 리소스 사용 | 무료 (일 25,000건) |
| 필드 데이터 | 없음 | CrUX 데이터 포함 |

## 2. App Router 라우트 구조

```
app/
├── layout.tsx              ← 루트 레이아웃 (Header, Footer, ThemeProvider)
├── page.tsx                ← / (홈: Hero + URL 입력 + 최근 분석)
├── analyze/
│   └── page.tsx            ← /analyze?url=... (분석 결과 대시보드)
├── history/
│   └── page.tsx            ← /history (성능 히스토리 차트)
├── compare/
│   └── page.tsx            ← /compare (경쟁사 비교 분석)
├── api/
│   ├── analyze/
│   │   └── route.ts        ← POST /api/analyze (PSI API 프록시)
│   ├── crux/
│   │   └── route.ts        ← POST /api/crux (CrUX API 프록시)
│   └── report/
│       └── route.ts        ← POST /api/report (리포트 데이터 가공)
├── globals.css             ← 글로벌 스타일 + 테마 + 애니메이션
└── not-found.tsx           ← 404 페이지
```

### 라우트별 렌더링 전략

| 라우트 | 렌더링 | 이유 |
|--------|--------|------|
| `/` | SSR (Server Component) | SEO 최적화, 정적 콘텐츠 중심 |
| `/analyze` | CSR (Client Component) | URL 파라미터 기반 동적 분석, IndexedDB 접근 |
| `/history` | CSR (Client Component) | IndexedDB 데이터 조회, 차트 렌더링 |
| `/compare` | CSR (Client Component) | 다중 URL 동시 분석, 동적 상호작용 |

## 3. 프론트엔드 아키텍처

### 3.1 컴포넌트 트리

```
app/layout.tsx (Server Component)
├── ThemeProvider (Client)
├── Header (Client) ─── Navigation + ThemeToggle
├── {children} ─── 페이지별 콘텐츠
└── Footer (Server)

app/page.tsx (홈)
├── Hero (Server)
├── UrlInput (Client) ─── URL 입력 + 전략 선택 + 분석 버튼
└── RecentAnalyses (Client) ─── IndexedDB 최근 분석 목록

app/analyze/page.tsx (분석 결과)
├── AnalyzeDashboard (Client)
│   ├── ScoreOverview ─── 4개 카테고리 게이지 차트
│   ├── CoreWebVitals ─── LCP / INP / CLS 카드
│   │   ├── MetricCard ─── 개별 지표 + 등급 배지
│   │   └── LabFieldToggle ─── Lab / Field 데이터 전환
│   ├── AuditList ─── 개선 제안 목록
│   │   └── AuditItem ─── 개별 제안 (우선순위 + 상세)
│   ├── ScoreSummaryCard ─── 종합 점수 요약
│   └── ActionBar ─── [PDF 다운로드] [히스토리 저장]

app/history/page.tsx (히스토리)
├── UrlSelector ─── URL 선택 드롭다운
├── PeriodFilter ─── 기간 필터 (7일/30일/90일/전체)
├── ScoreTrendChart ─── 시계열 라인 차트 (Recharts)
├── WebVitalsTrendChart ─── CWV 트렌드 차트
└── HistoryTable ─── 분석 기록 테이블

app/compare/page.tsx (비교)
├── CompareUrlInputs ─── URL 1-5 입력 필드
├── CompareRadarChart ─── 레이더 차트 (Recharts)
├── CompareTable ─── CWV 비교 테이블
└── RankingCard ─── 종합 순위
```

### 3.2 스타일링 아키텍처

**shadcn/ui + Tailwind CSS v4 + 글래스모피즘**

```
globals.css
├── @import tailwindcss          ← Tailwind v4 기본
├── @theme                       ← CSS 변수 (색상, 라운딩, 간격)
├── @layer base                  ← 다크모드 기본 + 글래스모피즘 유틸
├── @layer components            ← 커스텀 컴포넌트 스타일
├── @keyframes                   ← 애니메이션 (fade-in, slide-up, pulse-glow)
└── @media (prefers-reduced-motion) ← 접근성

shadcn/ui 컴포넌트
├── Card, Button, Input          ← 기본 UI
├── Dialog, Sheet                ← 오버레이
├── Tabs, Badge                  ← 네비게이션/상태
├── Skeleton                     ← 로딩 상태
└── Tooltip                      ← 정보 표시
```

**스타일 적용 우선순위:**
1. shadcn/ui 컴포넌트 기본 스타일 → 커스터마이징은 className으로
2. Tailwind CSS 유틸리티 → 레이아웃, 간격, 색상
3. CSS 변수 → 테마 색상, 다크/라이트 모드
4. 글로벌 CSS → 글래스모피즘, 커스텀 애니메이션

### 3.3 상태 관리 패턴

별도의 상태 관리 라이브러리 없이 **React 19 기본 기능 + 커스텀 훅** 패턴으로 관리합니다.

```
페이지별 상태 관리:

/analyze (AnalyzeDashboard)
  ├── useAnalysis()     → { result, isLoading, error, analyze }
  ├── useHistory()      → { saveResult, getHistory }
  └── URL searchParams  → url, strategy

/history
  ├── useHistory()      → { histories, getByUrl, deleteHistory }
  └── useState()        → selectedUrl, period

/compare
  ├── useCompare()      → { results, isLoading, compareUrls }
  └── useState()        → urls[]

글로벌 상태:
  └── ThemeProvider     → { theme, toggleTheme } (Context API)
```

## 4. 백엔드 아키텍처 (API Routes)

### 4.1 API 라우트 구조

```
app/api/
├── analyze/route.ts     ← PSI API 프록시 + 응답 정규화
├── crux/route.ts        ← CrUX API 프록시 + 응답 정규화
└── report/route.ts      ← 리포트 데이터 가공
```

### 4.2 API Routes 상세

#### POST /api/analyze

PSI API를 호출하고 응답을 프론트엔드에 최적화된 형태로 가공합니다.

```
요청:
{
  "url": "https://example.com",
  "strategy": "mobile" | "desktop"
}

처리 흐름:
  1. URL 유효성 검사
  2. PSI API v5 호출 (API 키 서버사이드 보호)
     GET https://www.googleapis.com/pagespeedonline/v5/runPagespeed
       ?url={url}&strategy={strategy}&key={API_KEY}
       &category=PERFORMANCE&category=ACCESSIBILITY
       &category=BEST_PRACTICES&category=SEO
  3. 응답 정규화 (필요한 데이터만 추출)
  4. 가공된 결과 반환

응답:
{
  "url": "https://example.com",
  "fetchedAt": "2025-01-01T00:00:00Z",
  "strategy": "mobile",
  "scores": {
    "performance": 85,
    "accessibility": 92,
    "bestPractices": 88,
    "seo": 95
  },
  "webVitals": {
    "lcp": { "value": 2.4, "unit": "s", "rating": "needs-improvement" },
    "inp": { "value": 180, "unit": "ms", "rating": "good" },
    "cls": { "value": 0.05, "unit": "", "rating": "good" }
  },
  "audits": [
    {
      "id": "render-blocking-resources",
      "title": "렌더 차단 리소스 제거",
      "score": 0.4,
      "priority": "high",
      "savings": { "ms": 1200 },
      "description": "..."
    }
  ]
}
```

#### POST /api/crux

Chrome UX Report API를 호출하여 실제 사용자 필드 데이터를 조회합니다.

```
요청:
{
  "url": "https://example.com"
}

처리 흐름:
  1. CrUX API 호출 (API 키 서버사이드 보호)
     POST https://chromeuxreport.googleapis.com/v1/records:queryRecord
  2. 필드 데이터 정규화
  3. 데이터 없으면 { available: false } 반환

응답:
{
  "available": true,
  "webVitals": {
    "lcp": { "p75": 2.1, "rating": "needs-improvement", "distributions": {...} },
    "inp": { "p75": 150, "rating": "good", "distributions": {...} },
    "cls": { "p75": 0.08, "rating": "good", "distributions": {...} }
  }
}
```

#### POST /api/report

PDF 리포트 생성을 위한 데이터를 가공합니다.

```
요청:
{
  "url": "https://example.com",
  "analysisResult": { ... },
  "includeAudits": true
}

응답:
{
  "reportData": {
    "title": "PageDoctor 성능 리포트",
    "generatedAt": "2025-01-01T00:00:00Z",
    "url": "https://example.com",
    "summary": { ... },
    "topAudits": [ ... ]  // 상위 10개 개선 제안
  }
}
```

## 5. 데이터 흐름

### 5.1 분석 플로우

```
사용자 액션: URL 입력 + [분석] 클릭
    │
    ▼
UrlInput → router.push("/analyze?url=...&strategy=mobile")
    │
    ▼
AnalyzeDashboard (useAnalysis hook)
    │ POST /api/analyze { url, strategy }
    ▼
[API Route] /api/analyze
    │ GET googleapis.com/pagespeedonline/v5/runPagespeed
    ▼
Google PSI API → Lighthouse 실행 (10-20초)
    │
    ▼
응답 정규화 → 프론트엔드 반환
    │
    ▼
AnalyzeDashboard
    ├── ScoreOverview: 카테고리 점수 게이지 차트 렌더링
    ├── CoreWebVitals: LCP/INP/CLS 카드 렌더링
    ├── AuditList: 개선 제안 목록 렌더링
    └── useHistory().saveResult(): IndexedDB에 자동 저장
```

### 5.2 히스토리 플로우

```
/history 페이지 마운트
    │
    ▼
useHistory hook
    │ Dexie.js → IndexedDB 쿼리
    ▼
고유 URL 목록 추출 → UrlSelector 렌더링
    │
    ▼
사용자 URL 선택 + 기간 필터
    │
    ▼
Dexie.js → 필터링된 결과 조회
    │
    ▼
Recharts
    ├── ScoreTrendChart: 라인 차트 (날짜 vs 점수)
    ├── WebVitalsTrendChart: LCP/INP/CLS 트렌드
    └── HistoryTable: 기록 테이블 렌더링
```

### 5.3 비교 플로우

```
사용자: URL 1-5 입력 + [비교 분석] 클릭
    │
    ▼
useCompare hook
    │ Promise.allSettled([
    │   POST /api/analyze { url: url1 },
    │   POST /api/analyze { url: url2 },
    │   ...
    │ ])
    ▼
개별 진행 상태 표시 (각 URL별 로딩/완료/에러)
    │
    ▼
전체 완료 시
    ├── CompareRadarChart: 레이더 차트 (4개 카테고리 × N개 URL)
    ├── CompareTable: CWV 나란히 비교
    └── RankingCard: 종합 순위 표시
```

### 5.4 PDF 생성 플로우

```
사용자: [PDF 다운로드] 클릭
    │
    ▼
PdfReportButton (Client Component)
    │ dynamic(() => import("@react-pdf/renderer"), { ssr: false })
    ▼
@react-pdf/renderer
    │ 분석 결과 데이터 → PDF Document 컴포넌트
    │ ├── 헤더 (PageDoctor 로고 + 날짜)
    │ ├── 점수 요약 (4개 카테고리)
    │ ├── Core Web Vitals (LCP / INP / CLS)
    │ ├── 개선 제안 Top 10
    │ └── 푸터 (PageDoctor 브랜딩)
    ▼
blob:// URL 생성 → 브라우저 다운로드
```

## 6. IndexedDB 스키마 (Dexie.js)

### 데이터베이스 정의

```typescript
// db.ts
import Dexie, { type Table } from 'dexie';

interface AnalysisRecord {
  id?: number;              // 자동 증가 PK
  url: string;              // 분석 대상 URL
  strategy: 'mobile' | 'desktop';
  fetchedAt: string;        // ISO 8601 타임스탬프
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  webVitals: {
    lcp: { value: number; unit: string; rating: string };
    inp: { value: number; unit: string; rating: string };
    cls: { value: number; unit: string; rating: string };
  };
  audits: Audit[];          // 개선 제안 목록
}

interface UserSettings {
  id: string;               // 'default'
  theme: 'dark' | 'light';
  defaultStrategy: 'mobile' | 'desktop';
}

class PageDoctorDB extends Dexie {
  analyses!: Table<AnalysisRecord>;
  settings!: Table<UserSettings>;

  constructor() {
    super('PageDoctorDB');
    this.version(1).stores({
      analyses: '++id, url, strategy, fetchedAt, [url+strategy]',
      settings: 'id'
    });
  }
}

export const db = new PageDoctorDB();
```

### 인덱스 설계

| 테이블 | 인덱스 | 용도 |
|--------|--------|------|
| analyses | `++id` | 자동 증가 PK |
| analyses | `url` | URL별 히스토리 조회 |
| analyses | `strategy` | 전략별 필터링 |
| analyses | `fetchedAt` | 기간별 필터링 (정렬) |
| analyses | `[url+strategy]` | 복합 인덱스: URL+전략 조합 조회 |
| settings | `id` | 설정 단일 레코드 ('default') |

### 데이터 크기 추정

```
단일 AnalysisRecord ≈ 3-5 KB
  - scores: ~100B
  - webVitals: ~200B
  - audits (20개 평균): ~3KB
  - 메타데이터: ~200B

1,000건 저장 시 ≈ 3-5 MB (IndexedDB 한도 대비 매우 적음)
```

## 7. 성능 측정 방법론

### PageSpeed Insights API v5

**Lab Data** (시뮬레이션 환경):
- Google 서버에서 Lighthouse 실행
- 일관된 네트워크/디바이스 조건 (Moto G Power, 느린 4G)
- 모든 URL에 대해 즉시 측정 가능

```
GET https://www.googleapis.com/pagespeedonline/v5/runPagespeed
  ?url=https://example.com
  &strategy=mobile
  &category=PERFORMANCE
  &category=ACCESSIBILITY
  &category=BEST_PRACTICES
  &category=SEO
  &key=API_KEY
```

### Chrome UX Report (CrUX) API

**Field Data** (실제 사용자 데이터):
- 최근 28일간 실제 Chrome 사용자의 성능 데이터
- 트래픽이 충분한 URL만 데이터 제공
- p75 (75번째 백분위수) 기준

```
POST https://chromeuxreport.googleapis.com/v1/records:queryRecord
{
  "url": "https://example.com",
  "metrics": ["largest_contentful_paint", "interaction_to_next_paint", "cumulative_layout_shift"]
}
```

### Lab vs Field 비교

| 항목 | Lab Data (PSI) | Field Data (CrUX) |
|------|---------------|-------------------|
| 데이터 출처 | 시뮬레이션 | 실제 사용자 |
| 갱신 주기 | 실시간 (요청 시) | 28일 롤링 |
| 데이터 가용성 | 모든 URL | 트래픽 충분한 URL만 |
| 네트워크 조건 | 고정 (느린 4G) | 실제 사용자 네트워크 |
| 용도 | 개발 중 디버깅 | 실사용자 경험 파악 |

## 8. 차트 전략 (Recharts)

### 사용 차트 타입

| 차트 | 용도 | 페이지 |
|------|------|--------|
| 원형 게이지 (커스텀) | Lighthouse 카테고리 점수 (0-100) | /analyze |
| 라인 차트 (`LineChart`) | 성능 점수 시계열 트렌드 | /history |
| 레이더 차트 (`RadarChart`) | 경쟁사 카테고리별 비교 | /compare |
| 바 차트 (`BarChart`) | CWV 비교 (나란히) | /compare |

### 차트 커스터마이징

```
Recharts 기본 설정:
├── ResponsiveContainer       ← 반응형 컨테이너
├── 다크모드 대응 색상          ← CSS 변수 참조
├── 커스텀 Tooltip             ← shadcn/ui Card 스타일
├── 애니메이션                  ← isAnimationActive={true}
└── 등급별 색상 매핑            ← good(녹색), needs-improvement(주황), poor(빨강)
```

## 9. 배포 (Vercel)

### Vercel 설정

```
Framework Preset: Next.js
Build Command: next build
Output Directory: .next
Node.js Version: 22.x
```

### 환경 변수 (Vercel Dashboard)

| 변수 | 용도 | 환경 |
|------|------|------|
| `GOOGLE_PSI_API_KEY` | PageSpeed Insights API 키 | Production, Preview |
| `GOOGLE_CRUX_API_KEY` | Chrome UX Report API 키 | Production, Preview |

### 배포 흐름

```
Primary: Vercel 자동 배포
  main push → Vercel 자동 빌드 + 배포 (Production)
  PR 생성   → Vercel Preview 배포 (PR별 고유 URL)

Secondary: GitHub Release (선택)
  v* 태그 push → GitHub Actions → 빌드 확인 + Release Draft
```

### Vercel 서버리스 제약사항 대응

| 제약 | 한도 | 대응 |
|------|------|------|
| 함수 실행 시간 | Hobby 10초 / Pro 60초 | PSI API는 외부 서버 실행이므로 API Route는 빠르게 반환 |
| 함수 메모리 | 1024MB | API Route는 HTTP 프록시만 수행하므로 충분 |
| 번들 크기 | 50MB | @react-pdf/renderer는 클라이언트 전용, 서버 번들에 미포함 |

## 10. 의존성 맵

### 프론트엔드

```
next 15 ─── react 19 ─── react-dom 19
tailwindcss 4 ─── @tailwindcss/postcss 4
shadcn/ui ──── (각 컴포넌트 개별 설치)
           ├── @radix-ui/react-* (접근성 프리미티브)
           ├── class-variance-authority (스타일 변형)
           ├── clsx + tailwind-merge (클래스 조합)
           └── lucide-react (아이콘)
recharts 2 ──── d3-* (차트 연산)
dexie 4 ──────── (IndexedDB 래퍼)
@react-pdf/renderer 4 ── (PDF 생성)
typescript 5
```

### 개발 의존성

```
@types/react, @types/node
eslint ─── eslint-config-next
prettier
```
