import type { Dictionary } from "./ko";

const en: Dictionary = {
  // Navigation
  "nav.home": "Home",
  "nav.analyze": "Analyze",
  "nav.history": "History",
  "nav.compare": "Compare",
  "nav.ariaLabel": "Main navigation",

  // Theme
  "theme.toggle": "Toggle theme",
  "locale.switch": "Switch language",

  // Home - Hero
  "home.badge": "Web Performance Inspector & Monitoring Dashboard",
  "home.title.prefix": "Diagnose web",
  "home.title.suffix": "performance with",
  "home.description": "Measure Core Web Vitals, get improvement suggestions, and track history — all from a single URL.",

  // Home - Features
  "home.feature.measure.title": "Performance Audit",
  "home.feature.measure.desc": "Check Core Web Vitals and Lighthouse scores at a glance.",
  "home.feature.history.title": "History Tracking",
  "home.feature.history.desc": "Track performance over time and analyze trends.",
  "home.feature.compare.title": "Competitor Comparison",
  "home.feature.compare.desc": "Compare up to 5 sites side by side to find your edge.",

  // Home - Recent
  "home.recent": "Recent Analyses",
  "home.recent.mobile": "Mobile",
  "home.recent.desktop": "Desktop",
  "home.recent.perf": "Perf",
  "home.recent.deleteAll": "Delete all",

  // URL Input
  "input.placeholder": "Enter a URL (e.g. example.com)",
  "input.ariaLabel": "URL to analyze",
  "input.submit": "Analyze",
  "input.strategy": "Analysis strategy",
  "input.desktop": "Desktop",
  "input.mobile": "Mobile",
  "input.error.empty": "Please enter a URL.",
  "input.error.invalid": "Please enter a valid URL.",

  // Analyze Dashboard
  "analyze.title": "Analysis Results",
  "analyze.noUrl": "Please enter a URL to analyze.",
  "analyze.loading": "Analyzing...",
  "analyze.failed": "Analysis Failed",
  "analyze.perfScore": "Performance Score",
  "analyze.loading.page": "Loading...",

  // Score Overview
  "score.title": "Category Scores",

  // Category Labels
  "category.performance": "Performance",
  "category.accessibility": "Accessibility",
  "category.best-practices": "Best Practices",
  "category.seo": "SEO",

  // Core Web Vitals
  "cwv.title": "Core Web Vitals",
  "cwv.source": "Select data source",
  "cwv.lab": "Lab Data",
  "cwv.field": "Field Data",
  "cwv.field.noData": "No field data available",
  "cwv.field.noDataDesc": "CrUX data is not available for URLs with insufficient traffic.",
  "cwv.field.note": "* Field data represents real Chrome user measurements (p75).",
  "cwv.lcp": "Largest Contentful Paint",
  "cwv.inp": "Interaction to Next Paint",
  "cwv.cls": "Cumulative Layout Shift",

  // Audit
  "audit.title": "Improvement Suggestions",
  "audit.empty": "No improvement suggestions.",
  "audit.filter.all": "All",
  "audit.filter.ariaLabel": "Category filter",
  "audit.impact.high": "High",
  "audit.impact.medium": "Medium",
  "audit.impact.low": "Low",

  // PDF Report
  "pdf.download": "PDF Report",
  "pdf.generating": "Generating...",
  "pdf.ariaGenerating": "Generating PDF report",
  "pdf.ariaDownload": "Download PDF report",
  "pdf.error": "PDF generation failed. Please try again.",

  // Share
  "share.button": "Share",
  "share.copied": "Copied",
  "share.ariaCopied": "Link copied to clipboard",
  "share.ariaLabel": "Copy analysis result link",

  // Budget
  "budget.button": "Budget",
  "budget.ariaLabel": "Set performance budget",
  "budget.title": "Performance Budget",
  "budget.description": "Set target scores for each category. You can check whether targets are met in the analysis results.",
  "budget.placeholder": "Not set",
  "budget.delete": "Delete",
  "budget.cancel": "Cancel",
  "budget.save": "Save",
  "budget.target": "Target",
  "budget.current": "Current",

  // History
  "history.title": "Performance History",
  "history.subtitle": "Track performance changes over time",
  "history.empty": "No analysis records",
  "history.emptyDesc": "Analyze a URL from the home page to start saving history.",
  "history.noRecords": "No analysis records.",
  "history.export": "Export JSON",
  "history.urlSelect": "Select URL",
  "history.scoreTrend": "Score Trend",
  "history.cwvTrend": "Core Web Vitals Trend",
  "history.records": "Analysis Records",
  "history.table.date": "Date",
  "history.table.strategy": "Strategy",
  "history.table.performance": "Perf",
  "history.table.rating": "Rating",
  "history.table.delete": "Delete",
  "history.deleteAria": "Delete record",

  // Period Filter
  "period.7": "Last 7 days",
  "period.30": "Last 30 days",
  "period.90": "Last 90 days",
  "period.365": "All",

  // Compare
  "compare.title": "Competitor Comparison",
  "compare.subtitle": "Compare up to 5 sites at a glance",
  "compare.inputTitle": "Enter URLs to compare",
  "compare.addUrl": "Add URL",
  "compare.removeUrl": "Remove URL",
  "compare.urlAria": "URL to compare",
  "compare.strategy": "Strategy:",
  "compare.submit": "Start Comparison",
  "compare.loading": "Comparing...",
  "compare.radar": "Category Score Comparison",
  "compare.ranking": "Overall Ranking",
  "compare.detail": "Detailed Comparison",
  "compare.metric": "Metric",
  "compare.perfScore": "Perf Score",
  "compare.error.empty": "Please enter a URL.",
  "compare.error.invalid": "Please enter a valid URL.",
  "compare.error.failed": "Analysis failed",

  // 404
  "notFound.title": "Page Not Found",
  "notFound.description": "The page you requested does not exist or may have been moved.",
  "notFound.home": "Back to Home",

  // Footer
  "footer.powered": "Powered by Google PageSpeed Insights API.",
  "footer.copyright": "\u00A9 {year} PageDoctor. All rights reserved.",

  // Budget Indicator
  "budgetIndicator.aria": "Target: {target}, Current: {current}",
  "budgetIndicator.label": "Target {target} / Current {current}",

  // ScoreGauge
  "scoreGauge.aria": "{label} score: {score}",

  // Schedule
  "schedule.button": "Schedule",
  "schedule.title": "Scheduled Analysis",
  "schedule.interval": "Analysis Interval",
  "schedule.daily": "Daily",
  "schedule.weekly": "Weekly",
  "schedule.monthly": "Monthly",
  "schedule.notifyComplete": "Notify on analysis complete",
  "schedule.notifyBudget": "Notify on budget exceeded",
  "schedule.delete": "Delete",
  "schedule.cancel": "Cancel",
  "schedule.save": "Save",
  "schedule.ariaLabel": "Set scheduled analysis",
  "schedule.nextRun": "Next analysis",
  "schedule.section.title": "Scheduled Analyses",
  "schedule.section.empty": "No scheduled analyses.",
  "schedule.notification.title": "PageDoctor Analysis Complete",
  "schedule.notification.body": "Analysis for {url} complete. Performance score: {score}",
  "schedule.notification.budgetTitle": "PageDoctor Budget Exceeded",
  "schedule.notification.budgetBody": "Performance budget exceeded for {url}.",

  // Offline
  "offline.title": "You are offline",
  "offline.description": "Please check your internet connection and try again.",
  "offline.retry": "Try again",

  // Analyze Steps
  "analyze.step.connect": "Connecting to website",
  "analyze.step.performance": "Measuring performance",
  "analyze.step.accessibility": "Checking accessibility",
  "analyze.step.report": "Generating report",

  // Error
  "error.request": "Request failed.",
  "error.analyze": "An error occurred during analysis.",
};

export default en;
