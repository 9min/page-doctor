import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ReportData, Rating, WebVitalMetric } from "@/types";
import { getMetricRating, formatMetricValue } from "@/lib/utils";

const COLORS = {
  primary: "#3B82F6",
  good: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  bg: "#FFFFFF",
  card: "#F8FAFC",
  text: "#0F172A",
  textSecondary: "#64748B",
  border: "#E2E8F0",
};

function getScoreColor(score: number): string {
  if (score >= 90) return COLORS.good;
  if (score >= 50) return COLORS.warning;
  return COLORS.danger;
}

function getRatingColor(rating: Rating): string {
  if (rating === "good") return COLORS.good;
  if (rating === "needs-improvement") return COLORS.warning;
  return COLORS.danger;
}

function getRatingLabel(rating: Rating): string {
  if (rating === "good") return "Good";
  if (rating === "needs-improvement") return "Needs Improvement";
  return "Poor";
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: COLORS.bg,
    color: COLORS.text,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  brandName: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: COLORS.primary,
  },
  brandSub: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerDate: {
    fontSize: 9,
    color: COLORS.textSecondary,
  },
  headerUrl: {
    fontSize: 9,
    color: COLORS.text,
    marginTop: 2,
    maxWidth: 250,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: COLORS.text,
    marginBottom: 12,
    marginTop: 20,
  },
  scoreRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scoreValue: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
  },
  scoreLabel: {
    fontSize: 9,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  vitalsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 8,
  },
  vitalCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  vitalName: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: COLORS.text,
  },
  vitalDesc: {
    fontSize: 8,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  vitalValue: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    marginTop: 6,
  },
  vitalRating: {
    fontSize: 8,
    marginTop: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  auditTable: {
    marginTop: 4,
  },
  auditHeader: {
    flexDirection: "row",
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  auditRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  auditIndex: {
    width: 24,
    fontSize: 9,
    color: COLORS.textSecondary,
  },
  auditTitle: {
    flex: 1,
    fontSize: 9,
    color: COLORS.text,
  },
  auditImpact: {
    width: 60,
    fontSize: 8,
    textAlign: "center",
    paddingVertical: 1,
    borderRadius: 4,
  },
  auditCategory: {
    width: 65,
    fontSize: 8,
    color: COLORS.textSecondary,
    textAlign: "right",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerText: {
    fontSize: 8,
    color: COLORS.textSecondary,
  },
});

const CATEGORY_LABELS: Record<string, string> = {
  performance: "Performance",
  accessibility: "Accessibility",
  "best-practices": "Best Practices",
  seo: "SEO",
};

const IMPACT_COLORS: Record<string, { bg: string; text: string }> = {
  high: { bg: "#FEE2E2", text: COLORS.danger },
  medium: { bg: "#FEF3C7", text: "#D97706" },
  low: { bg: "#E0F2FE", text: "#0284C7" },
};

const VITAL_LABELS: Record<WebVitalMetric, { name: string; desc: string }> = {
  LCP: { name: "LCP", desc: "Largest Contentful Paint" },
  INP: { name: "INP", desc: "Interaction to Next Paint" },
  CLS: { name: "CLS", desc: "Cumulative Layout Shift" },
};

interface PdfReportDocumentProps {
  report: ReportData;
}

export function PdfReportDocument({ report }: PdfReportDocumentProps) {
  const d = new Date(report.analyzedAt);
  const date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

  const vitals: { key: WebVitalMetric; value: number | null }[] = [
    { key: "LCP", value: report.webVitals.lcp },
    { key: "INP", value: report.webVitals.inp },
    { key: "CLS", value: report.webVitals.cls },
  ];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandName}>PageDoctor</Text>
            <Text style={styles.brandSub}>Web Performance Report</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.headerDate}>{date}</Text>
            <Text style={styles.headerUrl}>{report.url}</Text>
          </View>
        </View>

        {/* Score Summary */}
        <Text style={styles.sectionTitle}>Score Summary</Text>
        <View style={styles.scoreRow}>
          {(
            Object.entries(report.scores) as [string, number][]
          ).map(([key, value]) => (
            <View key={key} style={styles.scoreCard}>
              <Text
                style={[styles.scoreValue, { color: getScoreColor(value) }]}
              >
                {value}
              </Text>
              <Text style={styles.scoreLabel}>
                {CATEGORY_LABELS[key] ?? key}
              </Text>
            </View>
          ))}
        </View>

        {/* Core Web Vitals */}
        <Text style={styles.sectionTitle}>Core Web Vitals</Text>
        <View style={styles.vitalsRow}>
          {vitals.map(({ key, value }) => {
            const rating =
              value !== null ? getMetricRating(key, value) : null;
            const color = rating ? getRatingColor(rating) : COLORS.textSecondary;
            return (
              <View key={key} style={styles.vitalCard}>
                <Text style={styles.vitalName}>{VITAL_LABELS[key].name}</Text>
                <Text style={styles.vitalDesc}>{VITAL_LABELS[key].desc}</Text>
                <Text style={[styles.vitalValue, { color }]}>
                  {formatMetricValue(key, value)}
                </Text>
                {value !== null && rating !== null && (
                  <Text
                    style={[
                      styles.vitalRating,
                      { backgroundColor: `${color}20`, color },
                    ]}
                  >
                    {getRatingLabel(rating)}
                  </Text>
                )}
              </View>
            );
          })}
        </View>

        {/* Top Audits */}
        <Text style={styles.sectionTitle}>
          Top Improvement Suggestions ({report.topAudits.length})
        </Text>
        <View style={styles.auditTable}>
          <View style={styles.auditHeader}>
            <Text style={[styles.auditIndex, { fontFamily: "Helvetica-Bold", fontSize: 8 }]}>
              #
            </Text>
            <Text style={[styles.auditTitle, { fontFamily: "Helvetica-Bold", fontSize: 8 }]}>
              Audit
            </Text>
            <Text
              style={[
                styles.auditImpact,
                { fontFamily: "Helvetica-Bold", fontSize: 8 },
              ]}
            >
              Impact
            </Text>
            <Text
              style={[
                styles.auditCategory,
                { fontFamily: "Helvetica-Bold", fontSize: 8 },
              ]}
            >
              Category
            </Text>
          </View>
          {report.topAudits.map((audit, i) => {
            const impactStyle = IMPACT_COLORS[audit.impact] ?? IMPACT_COLORS.low;
            return (
              <View
                key={audit.id}
                style={[
                  styles.auditRow,
                  i % 2 === 1
                    ? { backgroundColor: COLORS.card }
                    : {},
                ]}
              >
                <Text style={styles.auditIndex}>{i + 1}</Text>
                <Text style={styles.auditTitle}>{audit.title}</Text>
                <Text
                  style={[
                    styles.auditImpact,
                    {
                      backgroundColor: impactStyle.bg,
                      color: impactStyle.text,
                    },
                  ]}
                >
                  {audit.impact.toUpperCase()}
                </Text>
                <Text style={styles.auditCategory}>
                  {CATEGORY_LABELS[audit.category] ?? audit.category}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>
            Generated by PageDoctor
          </Text>
          <Text style={styles.footerText}>{report.url}</Text>
        </View>
      </Page>
    </Document>
  );
}
