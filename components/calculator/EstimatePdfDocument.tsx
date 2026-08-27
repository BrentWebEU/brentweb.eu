import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { BRAND_COLORS } from '@/lib/brand-tokens';
import type { Messages, Locale } from '@/i18n';
import { formatBracket, type EstimatorResult } from '@/lib/calculator/pricing';
import type { ScopeKey, TimelineKey } from '@/lib/schemas/lead';

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 11,
    color: BRAND_COLORS.foreground,
    fontFamily: 'Helvetica',
  },
  brand: {
    fontSize: 12,
    color: BRAND_COLORS.primary,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  meta: {
    fontSize: 10,
    color: BRAND_COLORS.mutedForeground,
    marginBottom: 28,
  },
  section: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottom: `1px solid ${BRAND_COLORS.border}`,
  },
  sectionLabel: {
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: BRAND_COLORS.mutedForeground,
    marginBottom: 6,
  },
  bigValue: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: BRAND_COLORS.primary,
  },
  value: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
  },
  listItem: {
    fontSize: 11,
    marginBottom: 3,
    lineHeight: 1.4,
  },
  noteBox: {
    backgroundColor: BRAND_COLORS.muted,
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
  noteText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: BRAND_COLORS.foreground,
  },
  footer: {
    fontSize: 9,
    color: BRAND_COLORS.mutedForeground,
    marginTop: 12,
  },
});

export interface EstimatePdfProps {
  name: string;
  scope: ScopeKey[];
  timeline: TimelineKey;
  result: EstimatorResult;
  generatedAt: string;
  /**
   * The visitor's message bundle. Satori and @react-pdf render outside React
   * context, so translations have to be passed in explicitly — this document
   * previously hardcoded every string in English and shipped that to Dutch
   * leads as an email attachment.
   */
  messages: Messages;
  locale: Locale;
}

export function EstimatePdfDocument({
  name,
  scope,
  timeline,
  result,
  generatedAt,
  messages,
  locale,
}: EstimatePdfProps) {
  const { calculator } = messages;
  const pdf = calculator.pdf;
  const fill = (template: string, values: Record<string, string | number>) =>
    Object.entries(values).reduce(
      (acc, [key, value]) => acc.replace(`{${key}}`, String(value)),
      template,
    );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.brand}>brentweb.be</Text>
        <Text style={styles.title}>{pdf.title}</Text>
        <Text style={styles.meta}>{fill(pdf.preparedFor, { name, date: generatedAt })}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{pdf.budgetLabel}</Text>
          <Text style={styles.bigValue}>{formatBracket(result.bracket, locale)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{pdf.timelineLabel}</Text>
          <Text style={styles.value}>
            {fill(pdf.weeks, { min: result.estimatedWeeks[0], max: result.estimatedWeeks[1] })}
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{pdf.scopeLabel}</Text>
          {scope.map((key) => (
            <Text key={key} style={styles.listItem}>• {calculator.scope.options[key].label}</Text>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{pdf.timelinePreferenceLabel}</Text>
          <Text style={styles.value}>{calculator.timeline.options[timeline]}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{pdf.includedLabel}</Text>
          {result.scope
            .flatMap((key) => calculator.scope.options[key].includes)
            .map((item) => (
              <Text key={item} style={styles.listItem}>• {item}</Text>
            ))}
        </View>

        {result.isRush && (
          <View style={styles.noteBox}>
            <Text style={styles.noteText}>{calculator.result.rushNote}</Text>
          </View>
        )}

        <Text style={styles.footer}>{pdf.footer}</Text>
      </Page>
    </Document>
  );
}
