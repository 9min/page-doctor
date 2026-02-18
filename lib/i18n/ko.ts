const ko = {
  // Navigation
  "nav.home": "홈",
  "nav.analyze": "분석",
  "nav.history": "히스토리",
  "nav.compare": "비교",
  "nav.ariaLabel": "메인 네비게이션",

  // Theme
  "theme.toggle": "테마 전환",
  "locale.switch": "언어 전환",

  // Home - Hero
  "home.badge": "웹 성능 검사 & 모니터링 대시보드",
  "home.title.prefix": "로",
  "home.title.suffix": "웹 성능을 진단하세요",
  "home.description": "URL 하나로 Core Web Vitals 측정, 성능 개선 제안, 히스토리 추적까지 한 번에.",

  // Home - Features
  "home.feature.measure.title": "성능 측정",
  "home.feature.measure.desc": "Core Web Vitals와 Lighthouse 점수를 한눈에 확인하세요.",
  "home.feature.history.title": "히스토리 추적",
  "home.feature.history.desc": "성능 변화를 시간 흐름에 따라 추적하고 트렌드를 분석하세요.",
  "home.feature.compare.title": "경쟁사 비교",
  "home.feature.compare.desc": "최대 5개 사이트를 동시에 비교하여 경쟁 우위를 파악하세요.",

  // Home - Recent
  "home.recent": "최근 분석",
  "home.recent.mobile": "모바일",
  "home.recent.desktop": "데스크톱",
  "home.recent.perf": "성능",
  "home.recent.deleteAll": "전체 삭제",

  // URL Input
  "input.placeholder": "URL을 입력하세요 (예: example.com)",
  "input.ariaLabel": "분석할 URL",
  "input.submit": "분석",
  "input.strategy": "분석 전략",
  "input.desktop": "데스크톱",
  "input.mobile": "모바일",
  "input.error.empty": "URL을 입력해주세요.",
  "input.error.invalid": "유효한 URL을 입력해주세요.",

  // Analyze Dashboard
  "analyze.title": "분석 결과",
  "analyze.noUrl": "분석할 URL을 입력해주세요.",
  "analyze.loading": "분석 중...",
  "analyze.failed": "분석 실패",
  "analyze.perfScore": "성능 점수",
  "analyze.loading.page": "로딩 중...",

  // Score Overview
  "score.title": "카테고리 점수",

  // Category Labels
  "category.performance": "성능",
  "category.accessibility": "접근성",
  "category.best-practices": "권장사항",
  "category.seo": "SEO",

  // Core Web Vitals
  "cwv.title": "Core Web Vitals",
  "cwv.source": "데이터 소스 선택",
  "cwv.lab": "실험실 데이터",
  "cwv.field": "필드 데이터",
  "cwv.field.noData": "필드 데이터가 없습니다",
  "cwv.field.noDataDesc": "트래픽이 충분하지 않은 URL은 CrUX 데이터가 제공되지 않습니다.",
  "cwv.field.note": "* 필드 데이터는 Chrome 사용자의 실제 측정값(p75)입니다.",
  "cwv.lcp": "최대 콘텐츠 페인트",
  "cwv.inp": "다음 페인트까지 상호작용",
  "cwv.cls": "누적 레이아웃 시프트",

  // Audit
  "audit.title": "개선 제안",
  "audit.empty": "개선 제안이 없습니다.",
  "audit.filter.all": "전체",
  "audit.impact.high": "높음",
  "audit.impact.medium": "보통",
  "audit.impact.low": "낮음",

  // PDF Report
  "pdf.download": "PDF 리포트",
  "pdf.generating": "생성 중...",
  "pdf.ariaGenerating": "PDF 리포트 생성 중",
  "pdf.ariaDownload": "PDF 리포트 다운로드",
  "pdf.error": "PDF 생성에 실패했습니다. 다시 시도해주세요.",

  // Share
  "share.button": "공유",
  "share.copied": "복사됨",
  "share.ariaCopied": "링크가 복사되었습니다",
  "share.ariaLabel": "분석 결과 링크 복사",

  // Budget
  "budget.button": "버짓",
  "budget.ariaLabel": "성능 버짓 설정",
  "budget.title": "성능 버짓 설정",
  "budget.description": "각 카테고리의 목표 점수를 설정하세요. 분석 결과에서 달성 여부를 확인할 수 있습니다.",
  "budget.placeholder": "미설정",
  "budget.delete": "삭제",
  "budget.cancel": "취소",
  "budget.save": "저장",
  "budget.target": "목표",
  "budget.current": "현재",

  // History
  "history.title": "성능 히스토리",
  "history.subtitle": "시간에 따른 성능 변화를 추적하세요",
  "history.empty": "분석 기록이 없습니다",
  "history.emptyDesc": "홈에서 URL을 분석하면 히스토리가 자동으로 저장됩니다.",
  "history.noRecords": "분석 기록이 없습니다.",
  "history.export": "JSON 내보내기",
  "history.urlSelect": "URL 선택",
  "history.scoreTrend": "점수 트렌드",
  "history.cwvTrend": "Core Web Vitals 트렌드",
  "history.records": "분석 기록",
  "history.table.date": "날짜",
  "history.table.strategy": "전략",
  "history.table.performance": "성능",
  "history.table.rating": "등급",
  "history.table.delete": "삭제",
  "history.deleteAria": "기록 삭제",

  // Period Filter
  "period.7": "최근 7일",
  "period.30": "최근 30일",
  "period.90": "최근 90일",
  "period.365": "전체",

  // Compare
  "compare.title": "경쟁사 비교",
  "compare.subtitle": "최대 5개 사이트의 성능을 한눈에 비교하세요",
  "compare.inputTitle": "비교할 URL 입력",
  "compare.addUrl": "URL 추가",
  "compare.removeUrl": "URL 제거",
  "compare.urlAria": "비교할 URL",
  "compare.strategy": "전략:",
  "compare.submit": "비교 분석 시작",
  "compare.loading": "비교 분석 중...",
  "compare.radar": "카테고리 점수 비교",
  "compare.ranking": "종합 순위",
  "compare.detail": "상세 비교",
  "compare.metric": "지표",
  "compare.perfScore": "성능 점수",
  "compare.error.empty": "URL을 입력해주세요.",
  "compare.error.invalid": "올바른 URL을 입력해주세요.",
  "compare.error.failed": "분석 실패",

  // 404
  "notFound.title": "페이지를 찾을 수 없습니다",
  "notFound.description": "요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.",
  "notFound.home": "홈으로 돌아가기",

  // Footer
  "footer.powered": "Google PageSpeed Insights API로 구동됩니다.",

  // Budget Indicator
  "budgetIndicator.aria": "목표: {target}점, 현재: {current}점",
  "budgetIndicator.label": "목표 {target} / 현재 {current}",

  // ScoreGauge
  "scoreGauge.aria": "{label} 점수 {score}점",

  // Schedule
  "schedule.button": "스케줄",
  "schedule.title": "정기 분석 스케줄",
  "schedule.interval": "분석 주기",
  "schedule.daily": "매일",
  "schedule.weekly": "매주",
  "schedule.monthly": "매월",
  "schedule.notifyComplete": "분석 완료 시 알림",
  "schedule.notifyBudget": "버짓 초과 시 알림",
  "schedule.delete": "삭제",
  "schedule.cancel": "취소",
  "schedule.save": "저장",
  "schedule.ariaLabel": "정기 분석 스케줄 설정",
  "schedule.nextRun": "다음 분석",
  "schedule.section.title": "예약된 분석",
  "schedule.section.empty": "예약된 분석이 없습니다.",
  "schedule.notification.title": "PageDoctor 분석 완료",
  "schedule.notification.body": "{url} 분석이 완료되었습니다. 성능 점수: {score}",
  "schedule.notification.budgetTitle": "PageDoctor 버짓 초과",
  "schedule.notification.budgetBody": "{url}의 성능 버짓을 초과했습니다.",

  // Offline
  "offline.title": "오프라인 상태입니다",
  "offline.description": "인터넷 연결을 확인한 후 다시 시도해주세요.",
  "offline.retry": "다시 시도",

  // Analyze Steps
  "analyze.step.connect": "웹사이트 연결 중",
  "analyze.step.performance": "성능 측정 중",
  "analyze.step.accessibility": "접근성 검사 중",
  "analyze.step.report": "리포트 생성 중",

  // Error
  "error.request": "요청에 실패했습니다.",
  "error.analyze": "분석 중 오류가 발생했습니다.",
};

export type TranslationKey = keyof typeof ko;
export type Dictionary = Record<TranslationKey, string>;
export default ko as Dictionary;
