# PageDoctor

웹 페이지 성능 검사 & 모니터링 대시보드. URL 하나로 Core Web Vitals 측정, 히스토리 추적, 경쟁사 비교, 개선 제안, PDF 리포트까지.

## 주요 기능

- **성능 분석** - Lighthouse 4대 카테고리 점수 + Core Web Vitals (LCP, INP, CLS)
- **Lab / Field 데이터** - PSI 실험실 데이터와 CrUX 실사용자 필드 데이터 탭 전환
- **히스토리 추적** - IndexedDB 기반 로컬 저장, 시계열 트렌드 차트
- **경쟁사 비교** - 최대 5개 URL 동시 비교, 레이더 차트 + 순위
- **개선 제안** - 우선순위별 Lighthouse Audit 목록
- **PDF 리포트** - 분석 결과를 PDF로 다운로드
- **성능 버짓** - 카테고리별 목표 점수 설정, 달성 여부 표시
- **정기 분석** - 스케줄 예약 (매일/매주/매월) + 브라우저 알림
- **공유** - 분석 결과 URL 클립보드 복사
- **다국어** - 한국어 / English
- **다크모드** - 기본 다크 + 라이트 전환
- **PWA** - 오프라인 폴백 지원

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 16 (App Router), React 19, TypeScript 5 |
| 스타일링 | Tailwind CSS v4, shadcn/ui |
| 차트 | Recharts |
| 데이터 저장 | Dexie.js (IndexedDB) |
| PDF | @react-pdf/renderer |
| API | Google PageSpeed Insights API v5, Chrome UX Report API |
| 배포 | Vercel |
| CI/CD | GitHub Actions (Lint + Type Check + Build) |
| 코드 리뷰 | CodeRabbit AI |

## 시작하기

### 사전 요구사항

- Node.js 22+
- npm 10+
- Google PageSpeed Insights API 키 ([발급](https://developers.google.com/speed/docs/insights/v5/get-started))

### 설치

```bash
git clone https://github.com/9min/page-doctor.git
cd page-doctor
npm ci
```

### 환경 변수

`.env.local` 파일을 프로젝트 루트에 생성:

```env
GOOGLE_PSI_API_KEY=your_psi_api_key_here
GOOGLE_CRUX_API_KEY=your_crux_api_key_here
```

### 개발 서버

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

### 기타 명령어

```bash
npm run build      # 프로덕션 빌드
npm run start      # 프로덕션 서버
npm run lint       # ESLint
npx tsc --noEmit   # TypeScript 타입 체크
```

## 프로젝트 구조

```text
app/                  # Next.js App Router (페이지 + API Routes)
components/           # UI 컴포넌트 (ui, layout, home, analyze, history, compare, shared)
hooks/                # 커스텀 훅 (useAnalysis, useHistory, useCompare, useBudget, useSchedule 등)
lib/                  # 유틸리티 (db, api, utils, constants, i18n, pdf-template 등)
types/                # TypeScript 중앙 타입 정의
docs/                 # 프로젝트 문서 (PRD, ARCHITECTURE, 워크플로우 가이드)
public/               # 정적 파일 (PWA manifest, 서비스 워커, 아이콘)
```

자세한 아키텍처는 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)를 참고하세요.

## 문서

| 문서 | 설명 |
|------|------|
| [CLAUDE.md](CLAUDE.md) | 프로젝트 가이드 (구조, 컨벤션, 디자인 시스템) |
| [docs/PRD.md](docs/PRD.md) | 제품 요구사항 문서 |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | 아키텍처 설계 문서 |
| [docs/development-workflow-guide.md](docs/development-workflow-guide.md) | Git 정책, CI/CD, 배포 가이드 |

## Git 워크플로우

- `main` 직접 푸시 금지 - 모든 변경은 feature/fix 브랜치 → PR → 리뷰 → 머지
- PR 시 CodeRabbit AI 자동 코드 리뷰 + CI (Lint, Type Check, Build) 통과 필수
- 커밋 메시지: [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, `docs:` 등)

## 라이선스

MIT
