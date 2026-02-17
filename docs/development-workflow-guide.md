# 개발 워크플로우 가이드

> PageDoctor 프로젝트에 적용된 Git 정책, 브랜치 전략, CI/CD, 코드 리뷰, 배포 파이프라인을 정리한 문서입니다.
> 이 문서를 기반으로 다른 프로젝트에도 동일한 워크플로우를 세팅할 수 있습니다.

---

## 목차

1. [Git 정책](#1-git-정책)
2. [브랜치 전략](#2-브랜치-전략)
3. [커밋 컨벤션](#3-커밋-컨벤션)
4. [GitHub Branch Protection 설정](#4-github-branch-protection-설정)
5. [코드 리뷰 - CodeRabbit AI](#5-코드-리뷰---coderabbit-ai)
6. [CI 파이프라인](#6-ci-파이프라인)
7. [배포 파이프라인](#7-배포-파이프라인)
8. [로컬 개발 환경 테스트](#8-로컬-개발-환경-테스트)
9. [버전 관리](#9-버전-관리)
10. [새 프로젝트에 적용하기 (체크리스트)](#10-새-프로젝트에-적용하기-체크리스트)

---

## 1. Git 정책

### 핵심 원칙

- **main 브랜치 직접 push 절대 금지** - admin 포함 모든 사용자에게 적용
- 모든 코드 변경은 반드시 **feature/fix 브랜치 → PR → 리뷰 → 머지** 흐름을 따른다
- PR 머지 조건: **CI 통과 + CodeRabbit 리뷰 코멘트 전체 resolve**

### .gitignore 구성

프로젝트 루트 `.gitignore` (Next.js 프로젝트):

```gitignore
# dependencies
node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

# editor
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
```

---

## 2. 브랜치 전략

### 브랜치 종류

| 브랜치 | 용도 | 예시 |
|--------|------|------|
| `main` | 프로덕션 코드. 항상 배포 가능 상태 유지 | - |
| `feat/*` | 새 기능 개발 | `feat/url-analysis` |
| `fix/*` | 버그 수정 | `fix/psi-api-timeout` |
| `docs/*` | 문서 변경 | `docs/readme-update` |
| `chore/*` | 빌드, 설정, 의존성 등 | `chore/update-deps` |
| `ci/*` | CI/CD 워크플로우 변경 | `ci/add-build-step` |
| `design/*` | UI/UX 디자인 변경 | `design/dark-mode-polish` |

### 작업 흐름

```text
1. main에서 새 브랜치 생성
   $ git checkout main
   $ git pull origin main
   $ git checkout -b feat/my-feature

2. 작업 후 커밋
   $ git add <files>
   $ git commit -m "feat: 새 기능 설명"

3. 원격에 push
   $ git push -u origin feat/my-feature

4. GitHub에서 PR 생성 (main ← feat/my-feature)

5. CodeRabbit AI 자동 리뷰 대기

6. 리뷰 코멘트 resolve + CI 통과 확인

7. Squash Merge로 main에 머지

8. 머지 후 로컬 브랜치 정리
   $ git checkout main
   $ git pull origin main
   $ git branch -d feat/my-feature
```

### PR 머지 방식

- **Squash and Merge** 사용 권장
- main의 커밋 히스토리를 깔끔하게 유지
- PR 번호가 커밋 메시지에 자동 포함됨 (예: `feat: 기능 설명 (#5)`)

---

## 3. 커밋 컨벤션

[Conventional Commits](https://www.conventionalcommits.org/) 기반:

```text
<type>: <description>
```

### 타입 목록

| 타입 | 용도 | 예시 |
|------|------|------|
| `feat` | 새 기능 추가 | `feat: URL 분석 대시보드 구현` |
| `fix` | 버그 수정 | `fix: PSI API 타임아웃 에러 처리` |
| `docs` | 문서 변경 | `docs: README에 환경 변수 설정 추가` |
| `chore` | 빌드, 설정, 의존성 | `chore: shadcn/ui Card 컴포넌트 추가` |
| `ci` | CI/CD 워크플로우 | `ci: Vercel 프리뷰 배포 설정` |
| `refactor` | 기능 변경 없는 코드 개선 | `refactor: API 호출 로직 훅으로 분리` |
| `style` | 코드 포맷팅 | `style: 들여쓰기 정리` |
| `test` | 테스트 추가/수정 | `test: useAnalysis 훅 단위 테스트 추가` |
| `design` | UI/UX 디자인 변경 | `design: 벤토 그리드 레이아웃 적용` |

### 규칙

- 한국어 설명 사용
- 첫 글자 소문자 (타입 뒤에 오는 설명 부분)
- 마침표 없이 작성
- 현재형으로 작성 ("추가했다" X → "추가" O)

---

## 4. GitHub Branch Protection 설정

### 설정 위치

GitHub 리포지토리 → Settings → Branches → Branch protection rules → `main`

### 적용 규칙

| 설정 항목 | 값 | 설명 |
|-----------|-----|------|
| Require a pull request before merging | **ON** | PR 없이 직접 push 차단 |
| Require approvals | 프로젝트에 따라 설정 | 1인 개발 시 0, 팀 개발 시 1 이상 |
| Require status checks to pass | **ON** | CI 통과 필수 |
| Required status checks | `Lint & Type Check`, `Build` | CI 잡 이름과 정확히 일치해야 함 |
| Require branches to be up to date | **ON** | 머지 전 최신 main과 동기화 필수 |
| Do not allow bypassing the above settings | **ON** | admin도 직접 push 불가 (`enforce_admins: true`) |
| Restrict who can push to matching branches | **ON** | 직접 push 차단 |

### 새 프로젝트에 설정하는 방법

1. GitHub 리포지토리 → **Settings** → **Branches**
2. **Add branch protection rule** 클릭
3. Branch name pattern: `main`
4. 위 표의 항목들을 체크
5. **Create** 클릭

> GitHub CLI로 설정하는 경우:
> ```bash
> gh api repos/{owner}/{repo}/branches/main/protection \
>   --method PUT \
>   --field enforce_admins=true \
>   --field required_pull_request_reviews='{"required_approving_review_count":0}' \
>   --field required_status_checks='{"strict":true,"contexts":["Lint & Type Check","Build"]}'
> ```

---

## 5. 코드 리뷰 - CodeRabbit AI

### 개요

[CodeRabbit](https://coderabbit.ai)은 PR이 생성되면 자동으로 AI 코드 리뷰를 수행하는 서비스입니다.

### 설치 방법

1. [CodeRabbit GitHub App](https://github.com/apps/coderabbit-ai-reviewer) 설치
2. 리뷰 대상 리포지토리 선택
3. 프로젝트 루트에 `.coderabbit.yaml` 설정 파일 추가

### 설정 파일 (`.coderabbit.yaml`)

```yaml
language: "ko-KR"              # 리뷰 언어 (한국어)

reviews:
  request_changes_workflow: true  # 문제 발견 시 Request Changes 자동 설정
  high_level_summary: true        # PR 요약 자동 생성
  poem: false                     # 시 형식 요약 비활성화
  review_status: true             # 리뷰 진행 상태 표시
  collapse_walkthrough: false     # 파일별 변경 요약 펼쳐서 표시

  # 파일 경로별 리뷰 컨텍스트 지시
  path_instructions:
    - path: "app/**/*.tsx"
      instructions: "Next.js 15 App Router 컴포넌트입니다. Server/Client Component를 구분합니다. 'use client' 지시자가 필요한지 확인합니다."
    - path: "app/api/**/*.ts"
      instructions: "Next.js API Route입니다. Google API 키가 서버사이드에서만 사용되는지 확인합니다. NEXT_PUBLIC_ 접두사로 노출되면 안 됩니다."
    - path: "components/**/*.tsx"
      instructions: "React 함수 컴포넌트입니다. shadcn/ui + Tailwind CSS를 사용합니다. UI 텍스트는 한국어입니다."
    - path: "hooks/**/*.ts"
      instructions: "React 커스텀 훅입니다. 클라이언트 사이드에서만 동작합니다."
    - path: "lib/**/*.ts"
      instructions: "유틸리티 및 설정 파일입니다. Dexie.js는 클라이언트 전용입니다."

  auto_review:
    enabled: true      # PR 생성 시 자동 리뷰
    drafts: false       # Draft PR은 리뷰 건너뜀

chat:
  auto_reply: true      # 리뷰 코멘트에 대한 자동 응답
```

### 리뷰 워크플로우

```text
1. PR 생성
2. CodeRabbit이 자동으로 리뷰 시작 (보통 1-2분)
3. 리뷰 결과:
   - 고수준 PR 요약 코멘트
   - 파일별 인라인 리뷰 코멘트
   - 문제 발견 시 Request Changes 설정
4. 개발자가 리뷰 코멘트에 대응:
   - 코드 수정 후 push → CodeRabbit 재리뷰
   - 코멘트에 답변 → CodeRabbit 자동 응답
5. 모든 코멘트 resolve → Approve
```

---

## 6. CI 파이프라인

### 트리거 조건

- **PR이 main 브랜치를 대상으로 생성/업데이트될 때** 실행
- 같은 브랜치의 이전 실행은 자동 취소 (concurrency 설정)

### 워크플로우 파일 (`.github/workflows/ci.yml`)

```yaml
name: CI

on:
  pull_request:
    branches: [main]

# 같은 브랜치의 이전 CI 실행 자동 취소
concurrency:
  group: ci-${{ github.head_ref }}
  cancel-in-progress: true

jobs:
  # Job 1: 프론트엔드 정적 분석
  check:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: TypeScript type check
        run: npx tsc --noEmit

      - name: Lint
        run: npm run lint

  # Job 2: 빌드 검증 (check 통과 후 실행)
  build:
    name: Build
    needs: check          # check job 통과 필수
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build
        env:
          GOOGLE_PSI_API_KEY: ${{ secrets.GOOGLE_PSI_API_KEY }}
          GOOGLE_CRUX_API_KEY: ${{ secrets.GOOGLE_CRUX_API_KEY }}
```

### CI 구조 설계 원칙

```
check (빠름, ubuntu)  →  build (ubuntu)
   TypeScript 타입 체크       Next.js 프로덕션 빌드
   ESLint 린트                빌드 에러 검출
   ~30초                      ~1-2분
```

- **check → build 순차 실행** (`needs: check`): 타입 에러가 있으면 빌드를 건너뜀
- **모든 job이 ubuntu에서 실행**: 빠르고 저렴함
- **빌드 시 환경 변수**: API 키를 GitHub Secrets에서 주입 (빌드 검증용)
- **concurrency**: 같은 브랜치에서 새 push가 오면 이전 CI 자동 취소 (비용 절약)

### 다른 프로젝트에 적용 시 수정 포인트

| 항목 | PageDoctor 설정 | 변경 예시 |
|------|-----------------|-----------|
| Node.js 버전 | 22 | 프로젝트에 맞게 (18, 20 등) |
| check 내용 | `tsc --noEmit` + `npm run lint` | `npm test` 추가 가능 |
| build 내용 | `npm run build` (Next.js) | 프레임워크에 따라 조정 |
| 환경 변수 | Google API 키 | 프로젝트에 맞게 조정 |

---

## 7. 배포 파이프라인

### Primary: Vercel 자동 배포

Vercel은 GitHub 연동 시 자동으로 배포됩니다. 별도의 GitHub Actions 워크플로우가 필요 없습니다.

```text
main push → Vercel 자동 빌드 + Production 배포
PR 생성   → Vercel Preview 배포 (PR별 고유 URL)
PR 업데이트 → Vercel Preview 자동 재배포
```

### Vercel 설정

| 항목 | 설정 |
|------|------|
| Framework Preset | Next.js |
| Build Command | `next build` |
| Output Directory | `.next` |
| Node.js Version | 22.x |
| Root Directory | `.` |

### 환경 변수 (Vercel Dashboard)

```text
Vercel Dashboard → Settings → Environment Variables

GOOGLE_PSI_API_KEY    = [API 키]    (Production + Preview)
GOOGLE_CRUX_API_KEY   = [API 키]    (Production + Preview)
```

### Secondary: GitHub Release (선택)

태그 기반 릴리스가 필요한 경우 사용합니다.

```yaml
name: Release

on:
  push:
    tags: ["v*"]

jobs:
  release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run build
        env:
          GOOGLE_PSI_API_KEY: ${{ secrets.GOOGLE_PSI_API_KEY }}
          GOOGLE_CRUX_API_KEY: ${{ secrets.GOOGLE_CRUX_API_KEY }}

      - name: Create Release
        uses: softprops/action-gh-release@v2
        with:
          draft: true
          generate_release_notes: true
```

### 릴리스 흐름

```text
1. 모든 작업이 main에 머지된 상태에서 릴리스 준비

2. 버전 업데이트 (PR로 진행)
   - package.json → "version": "0.2.0"

3. 버전 업데이트 PR 머지 후 태그 생성
   $ git checkout main
   $ git pull origin main
   $ git tag v0.2.0
   $ git push origin v0.2.0

4. GitHub Actions 자동 실행
   → 빌드 확인 → GitHub Release (Draft) 생성

5. GitHub Releases 페이지에서 Draft 확인
   → 릴리스 노트 확인/수정
   → Publish release 클릭
```

---

## 8. 로컬 개발 환경 테스트

### 사전 요구사항

| 도구 | 버전 | 용도 |
|------|------|------|
| Node.js | 22+ | 런타임 |
| npm | 10+ | 패키지 관리 |

### 환경 변수 설정

```bash
# .env.local 파일 생성 (프로젝트 루트)
cp .env.example .env.local
# Google API 키 입력
```

### 개발 서버 실행

```bash
# 의존성 설치
npm ci

# 개발 서버 (HMR)
npm run dev
# → http://localhost:3000

# TypeScript 타입 체크 (CI와 동일)
npx tsc --noEmit

# 린트 (CI와 동일)
npm run lint

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

### PR 제출 전 로컬 체크리스트

```text
[ ] npx tsc --noEmit  → 타입 에러 없음
[ ] npm run lint      → 린트 에러 없음
[ ] npm run build     → 빌드 성공
[ ] npm run dev       → 개발 서버 정상 실행
[ ] 변경한 기능 수동 테스트 완료
[ ] 불필요한 console.log 제거
[ ] API 키가 클라이언트에 노출되지 않는지 확인
[ ] 커밋 메시지 컨벤션 준수 (feat: / fix: / docs: 등)
```

---

## 9. 버전 관리

### 버전 체계

[Semantic Versioning](https://semver.org/) 사용:

```text
MAJOR.MINOR.PATCH

예: 0.1.0 → 0.2.0 → 0.2.1 → 1.0.0
```

| 변경 유형 | 버전 업 | 예시 |
|-----------|---------|------|
| 하위 호환 버그 수정 | PATCH | 0.1.0 → 0.1.1 |
| 하위 호환 기능 추가 | MINOR | 0.1.0 → 0.2.0 |
| 호환 깨지는 변경 | MAJOR | 0.2.0 → 1.0.0 |

### 버전이 기록된 파일

| 파일 | 필드 |
|------|------|
| `package.json` | `"version": "0.1.0"` |

> Next.js 웹 프로젝트는 `package.json`만 관리하면 됩니다. (Tauri/Cargo.toml 등 불필요)

---

## 10. 새 프로젝트에 적용하기 (체크리스트)

### Step 1: Git 초기화 및 원격 저장소 생성

```bash
git init
git remote add origin https://github.com/{owner}/{repo}.git
git branch -M main
git push -u origin main
```

### Step 2: .gitignore 설정

프로젝트 루트에 `.gitignore` 생성 (위 1장 참고)

### Step 3: CI 워크플로우 추가

```bash
mkdir -p .github/workflows
```

`.github/workflows/ci.yml` 생성 (위 6장 참고, 프로젝트에 맞게 수정)

### Step 4: CodeRabbit 설정

1. GitHub Marketplace에서 CodeRabbit 앱 설치
2. 프로젝트 루트에 `.coderabbit.yaml` 생성 (위 5장 참고)
3. `path_instructions`를 프로젝트 기술 스택에 맞게 수정

### Step 5: Vercel 배포 설정

1. [Vercel](https://vercel.com)에서 GitHub 리포지토리 연결
2. Framework Preset: Next.js 선택
3. Environment Variables에 API 키 등록
4. 자동 배포 확인

### Step 6: Branch Protection 설정

GitHub Settings → Branches에서 `main` 보호 규칙 추가 (위 4장 참고)

> 주의: Branch Protection은 CI 워크플로우가 최소 1번 실행된 후에 설정해야 합니다.
> GitHub가 CI job 이름을 인식하려면 해당 워크플로우가 실행된 이력이 필요합니다.

### Step 7: 첫 번째 PR 테스트

```bash
git checkout -b chore/initial-setup
# 설정 파일들 커밋
git add .github/ .coderabbit.yaml .gitignore
git commit -m "chore: CI/CD 및 코드 리뷰 초기 설정"
git push -u origin chore/initial-setup
# GitHub에서 PR 생성 → CI 실행 + CodeRabbit 리뷰 확인
```

### 전체 파일 구조 요약

```text
project-root/
├── .github/
│   └── workflows/
│       └── ci.yml              # PR 시 자동 검증
├── .coderabbit.yaml            # AI 코드 리뷰 설정
├── .gitignore                  # Git 추적 제외 파일
├── .env.local                  # 환경 변수 (Git 미추적)
└── ... (프로젝트 소스 코드)
```

---

## 부록: 사용 중인 GitHub Actions 목록

| Action | 용도 | 문서 |
|--------|------|------|
| `actions/checkout@v4` | 리포지토리 체크아웃 | [actions/checkout 문서](https://github.com/actions/checkout) |
| `actions/setup-node@v4` | Node.js 설치 + npm 캐시 | [actions/setup-node 문서](https://github.com/actions/setup-node) |
| `softprops/action-gh-release@v2` | GitHub Release 생성 | [softprops/action-gh-release 문서](https://github.com/softprops/action-gh-release) |

## 부록: Vercel 배포 vs GitHub Actions 배포

| 항목 | Vercel 자동 배포 (Primary) | GitHub Actions + Release (Secondary) |
|------|--------------------------|--------------------------------------|
| 트리거 | main push / PR 생성 | `v*` 태그 push |
| 배포 대상 | Vercel Edge Network | GitHub Release (빌드 아카이브) |
| Preview 배포 | PR별 자동 생성 | 없음 |
| 환경 변수 | Vercel Dashboard | GitHub Secrets |
| 설정 난이도 | 낮음 (GUI) | 중간 (YAML 작성) |
| 권장 사용 | **일상 배포** | 릴리스 이력 관리 (선택) |
