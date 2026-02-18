# CLAUDE.md - PageDoctor 프로젝트 가이드

## 프로젝트 개요

PageDoctor는 웹 페이지 성능 검사/모니터링 대시보드 웹 애플리케이션입니다. URL 입력 → Core Web Vitals 측정 + 히스토리 추적 + 경쟁사 비교 + 개선 제안 + PDF 리포트를 제공합니다.

## 기술 스택

- **프레임워크**: Next.js 15 (App Router), React 19, TypeScript 5
- **스타일링**: Tailwind CSS v4, shadcn/ui
- **차트**: Recharts
- **데이터 저장**: Dexie.js (IndexedDB)
- **PDF 생성**: @react-pdf/renderer
- **성능 측정 API**: Google PageSpeed Insights API v5, Chrome UX Report API
- **배포**: Vercel
- **코드 리뷰**: CodeRabbit AI (`.coderabbit.yaml`)
- **패키지 매니저**: npm

## 프로젝트 구조

```
page-doctor/
├── app/                            # Next.js App Router
│   ├── layout.tsx                  # 루트 레이아웃 (Header, Footer, ThemeProvider, LocaleProvider)
│   ├── page.tsx                    # / (홈: Hero + URL 입력 + 최근 분석)
│   ├── globals.css                 # 글로벌 스타일 + 테마 + 애니메이션
│   ├── not-found.tsx               # 404 페이지
│   ├── analyze/
│   │   └── page.tsx                # /analyze?url=...&strategy=... (분석 결과)
│   ├── history/
│   │   └── page.tsx                # /history (성능 히스토리 차트)
│   ├── compare/
│   │   └── page.tsx                # /compare (경쟁사 비교 분석)
│   ├── offline/
│   │   └── page.tsx                # /offline (PWA 오프라인 폴백)
│   └── api/
│       ├── analyze/
│       │   └── route.ts            # POST /api/analyze (PSI API 프록시)
│       ├── crux/
│       │   └── route.ts            # POST /api/crux (CrUX API 프록시)
│       └── report/
│           └── route.ts            # POST /api/report (리포트 데이터 가공)
├── components/                     # UI 컴포넌트
│   ├── ui/                         # shadcn/ui 기본 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── skeleton.tsx
│   │   ├── tabs.tsx
│   │   ├── dialog.tsx
│   │   ├── sheet.tsx
│   │   └── tooltip.tsx
│   ├── layout/                     # 레이아웃 컴포넌트
│   │   ├── Header.tsx              # 네비게이션 + 다크모드 토글 + 언어 전환
│   │   └── Footer.tsx              # 브랜딩 + 링크
│   ├── home/                       # 홈 페이지 컴포넌트
│   │   ├── Hero.tsx                # 히어로 섹션
│   │   ├── UrlInput.tsx            # URL 입력 + 전략 선택 + 분석 버튼
│   │   ├── RecentAnalyses.tsx      # 최근 분석 URL 목록
│   │   └── ScheduledAnalyses.tsx   # 예약된 정기 분석 목록
│   ├── analyze/                    # 분석 결과 컴포넌트
│   │   ├── AnalyzeDashboard.tsx    # 분석 대시보드 메인
│   │   ├── ScoreOverview.tsx       # 4개 카테고리 게이지 차트
│   │   ├── ScoreGauge.tsx          # 개별 원형 게이지
│   │   ├── CoreWebVitals.tsx       # CWV 카드 그룹
│   │   ├── MetricCard.tsx          # 개별 지표 카드 + 등급 배지
│   │   ├── AuditList.tsx           # 개선 제안 목록
│   │   ├── AuditItem.tsx           # 개별 제안 항목
│   │   ├── PdfReportButton.tsx     # PDF 다운로드 버튼
│   │   └── ScheduleDialog.tsx     # 정기 분석 스케줄 설정 Dialog
│   ├── history/                    # 히스토리 컴포넌트
│   │   ├── UrlSelector.tsx         # URL 선택 드롭다운
│   │   ├── PeriodFilter.tsx        # 기간 필터
│   │   ├── ScoreTrendChart.tsx     # 점수 트렌드 라인 차트
│   │   ├── WebVitalsTrendChart.tsx # CWV 트렌드 차트
│   │   └── HistoryTable.tsx        # 분석 기록 테이블
│   ├── compare/                    # 비교 컴포넌트
│   │   ├── CompareUrlInputs.tsx    # URL 1-5 입력 필드
│   │   ├── CompareRadarChart.tsx   # 레이더 차트
│   │   ├── CompareTable.tsx        # CWV 비교 테이블
│   │   └── RankingCard.tsx         # 종합 순위
│   └── shared/                     # 공용 컴포넌트
│       ├── ThemeProvider.tsx        # 다크/라이트 모드 Provider
│       ├── ThemeToggle.tsx          # 테마 전환 토글
│       ├── RatingBadge.tsx          # Good/NI/Poor 등급 배지
│       ├── LocaleProvider.tsx       # i18n 다국어 Context Provider
│       ├── LocaleSwitcher.tsx       # KO/EN 언어 전환 토글
│       ├── ScheduleRunner.tsx       # 앱 마운트 시 오버듀 스케줄 자동 실행
│       └── ServiceWorkerRegistrar.tsx # PWA 서비스 워커 등록 (production)
├── hooks/                          # 커스텀 훅
│   ├── useAnalysis.ts              # PSI 분석 요청 + 상태 관리
│   ├── useHistory.ts               # IndexedDB 히스토리 CRUD
│   ├── useCompare.ts               # 다중 URL 비교 분석
│   ├── useTheme.ts                 # 다크/라이트 모드 관리
│   ├── useTranslation.ts           # i18n 번역 훅 (locale, setLocale, t)
│   └── useSchedule.ts              # 스케줄 CRUD + 목록 조회
├── lib/                            # 유틸리티
│   ├── db.ts                       # Dexie.js 데이터베이스 정의 (v3: analyses, settings, schedules)
│   ├── api.ts                      # API 호출 래퍼 함수
│   ├── utils.ts                    # 공통 유틸 (cn, 포맷터 등)
│   ├── constants.ts                # 상수 (등급 임계값, 색상 등)
│   ├── pdf-template.tsx            # PDF 리포트 템플릿 (@react-pdf/renderer)
│   ├── schedule.ts                 # 스케줄 유틸 (calculateNextRunAt, isOverdue)
│   ├── notifications.ts            # 브라우저 알림 유틸
│   └── i18n/                       # 다국어 번역 시스템
│       ├── ko.ts                   # 한국어 딕셔너리 (기본 언어, TranslationKey 타입 정의)
│       ├── en.ts                   # 영어 딕셔너리
│       └── index.ts                # barrel export + LOCALE_LABELS, DEFAULT_LOCALE
├── types/                          # TypeScript 타입 정의
│   └── index.ts                    # 중앙 타입 정의
├── docs/                           # 프로젝트 문서
│   ├── PRD.md                      # 제품 요구사항 문서
│   ├── ARCHITECTURE.md             # 아키텍처 설계 문서
│   └── development-workflow-guide.md  # 개발 워크플로우 가이드
├── public/
│   ├── manifest.json               # PWA 웹 앱 매니페스트
│   ├── sw.js                       # 서비스 워커 (캐시 전략)
│   ├── apple-touch-icon.png        # iOS 앱 아이콘
│   └── icons/                      # PWA 아이콘 (72~512px)
├── scripts/
│   └── generate-icons.mjs          # PWA 아이콘 생성 스크립트 (sharp)
├── .github/workflows/
│   └── ci.yml                      # PR 시 Lint + Type Check + Build
├── .coderabbit.yaml                # CodeRabbit AI 코드 리뷰 설정
├── .env.local                      # 환경 변수 (Git 미추적)
├── package.json                    # Node 의존성
├── tsconfig.json                   # TypeScript 설정
├── next.config.ts                  # Next.js 설정
├── tailwind.config.ts              # Tailwind CSS 설정 (필요 시)
├── postcss.config.mjs              # PostCSS 설정
└── components.json                 # shadcn/ui 설정
```

## 개발 명령어

```bash
# 개발 서버 (HMR)
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# TypeScript 타입 체크
npx tsc --noEmit

# 린트
npm run lint
```

## 환경 변수

`.env.local` (Git 미추적):

```env
GOOGLE_PSI_API_KEY=your_psi_api_key_here
GOOGLE_CRUX_API_KEY=your_crux_api_key_here
```

- API 키는 **반드시 서버사이드(API Routes)에서만** 사용
- 클라이언트에 절대 노출하지 않음 (`NEXT_PUBLIC_` 접두사 사용 금지)
- Vercel Dashboard → Settings → Environment Variables에 등록

## 코딩 컨벤션

### 프론트엔드 (TypeScript/React)

- 컴포넌트: 함수 컴포넌트 + named export (Next.js 페이지는 default export)
- 상태 관리: 커스텀 훅 패턴 (`useXxx`)
- 스타일: **Tailwind CSS 유틸리티 + shadcn/ui 컴포넌트**
  - shadcn/ui 컴포넌트를 기본으로 사용하고 className으로 커스터마이징
  - 레이아웃, 간격, 색상은 Tailwind CSS 유틸리티 클래스
  - 글래스모피즘, 커스텀 애니메이션은 `globals.css`
- 타입: `types/index.ts`에 중앙 정의
- API 통신: `lib/api.ts`에 fetch 래퍼 함수로 추상화
- 다국어(i18n): 모든 사용자 대면 텍스트는 `t("key")` 번역 함수 사용 (하드코딩 금지)
  - 지원 언어: 한국어(ko, 기본), 영어(en)
  - 번역 딕셔너리: `lib/i18n/ko.ts`, `lib/i18n/en.ts`
  - 새 UI 텍스트 추가 시 반드시 양쪽 딕셔너리에 키 추가
  - 서버 메타데이터(title, description)는 한국어 고정 (SSR이므로 t() 사용 불가)
- 접근성: `aria-label`, `aria-hidden`, `role`, `prefers-reduced-motion` 지원
- Server/Client Component 구분: 파일 최상단 `'use client'` 명시 (필요한 경우만)

### API Routes

- 모든 API Route는 `app/api/` 아래 배치
- 요청/응답 타입은 `types/index.ts`에 정의
- 에러 응답: `{ error: string, code: string }` 형태로 통일
- Google API 키는 `process.env.GOOGLE_PSI_API_KEY`로 서버사이드 접근
- API Route 내에서 `console.error`로 에러 로깅 (Vercel Logs에서 확인)

### Git 워크플로우

- **main 직접 푸시 절대 금지** - 어떤 경우에도 main에 직접 commit/push하지 않는다
- 모든 변경은 반드시 feature/fix 브랜치 생성 → PR 생성 → 리뷰 통과 후 머지
- PR 생성 시: CodeRabbit AI 자동 코드 리뷰 (한국어)
- 머지 조건: CodeRabbit 리뷰 코멘트 전체 resolve + CI 통과
- Branch Protection: `enforce_admins: true` (admin도 직접 푸시 불가)

## API Routes 인터페이스

| API Route | 메서드 | 설명 | 요청 Body | 응답 |
|-----------|--------|------|----------|------|
| `/api/analyze` | POST | PSI 분석 실행 | `{ url, strategy }` | `AnalysisResult` |
| `/api/crux` | POST | CrUX 필드 데이터 조회 | `{ url }` | `CruxResult` |
| `/api/report` | POST | PDF 리포트 데이터 가공 | `{ url, analysisResult }` | `ReportData` |

## 디자인 시스템

### 테마 색상 (`globals.css @theme`)

| 변수 | 용도 |
|------|------|
| `--color-primary` | 주요 액션, 버튼, 링크 (브랜드 블루) |
| `--color-success` (#22C55E) | Good 등급, 90+ 점수 |
| `--color-warning` (#F59E0B) | Needs Improvement 등급, 50-89 점수 |
| `--color-danger` (#EF4444) | Poor 등급, 0-49 점수 |
| `--color-bg-primary` | 메인 배경 (다크: #0A0A0F) |
| `--color-bg-card` | 카드 배경 (다크: #1A1A2E, 글래스모피즘 적용) |
| `--color-text-primary` | 본문 텍스트 |
| `--color-text-secondary` | 보조 텍스트 |
| `--color-border` | 구분선 |

### 성능 등급 배지

| 등급 | 점수 범위 | 배경 | 텍스트 | 테두리 |
|------|----------|------|--------|--------|
| Good | 90-100 | #052E16 | #22C55E | #166534 |
| Needs Improvement | 50-89 | #451A03 | #F59E0B | #92400E |
| Poor | 0-49 | #450A0A | #EF4444 | #991B1B |

### Core Web Vitals 등급

| 지표 | Good | Needs Improvement | Poor |
|------|------|-------------------|------|
| LCP | ≤ 2.5s | ≤ 4.0s | > 4.0s |
| INP | ≤ 200ms | ≤ 500ms | > 500ms |
| CLS | ≤ 0.1 | ≤ 0.25 | > 0.25 |

### 벤토 그리드

```
분석 대시보드 (/analyze) 벤토 레이아웃:

┌──────────┬──────────┬──────────┐
│ Performance│ A11y     │ Best     │  ← 점수 게이지 (1:1:1)
│   85       │  92      │ Practices│
│            │          │   88     │
├──────────┴──────────┼──────────┤
│ Core Web Vitals      │ SEO      │  ← CWV 넓게 + SEO 좁게 (2:1)
│ LCP | INP | CLS      │  95      │
├──────────────────────┴──────────┤
│ 개선 제안 목록 (전체 너비)          │  ← 풀 와이드
│ High: 렌더 차단 리소스 제거         │
│ Med: 이미지 최적화                  │
└─────────────────────────────────┘
```

### 글래스모피즘

```css
/* 카드 컴포넌트에 적용 */
.glass-card {
  background: rgba(26, 26, 46, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}
```

### 다크모드

- **기본 모드: 다크** (사용자 토글로 라이트 전환 가능)
- `class` 전략 사용 (Tailwind `darkMode: 'class'`)
- `ThemeProvider`에서 `localStorage` 기반 테마 영속화
- `prefers-color-scheme` 미디어 쿼리로 시스템 설정 감지 (초기값)

## 주의사항

- **PSI API 키 노출 금지**: 반드시 API Route(서버사이드)에서만 사용. `NEXT_PUBLIC_` 접두사 절대 사용 금지
- **PSI API 일일 한도**: 25,000건/일. 동일 URL 중복 요청 방지 로직 필요
- **Vercel 서버리스 타임아웃**: Hobby 10초 제한. PSI API 호출은 Google 서버에서 실행되므로 API Route 자체는 빠르게 반환됨
- **@react-pdf/renderer SSR 불가**: 반드시 `dynamic(() => import(...), { ssr: false })` 사용
- **Dexie.js는 클라이언트 전용**: Server Component에서 import 불가. `'use client'` 필수
- **CrUX 데이터 미제공**: 트래픽이 적은 URL은 필드 데이터가 없음. "데이터 없음" 안내 UI 필요
- **Recharts SSR 호환성**: `ResponsiveContainer`는 클라이언트 전용. `'use client'` 필수
- 기본 다크모드이므로 라이트모드 대비 색상도 반드시 정의할 것
