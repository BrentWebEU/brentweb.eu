import 'server-only';
import { getTranslations, type Locale } from '@/i18n';
import type { LeadSubmission } from '@/lib/schemas/lead';
import type { EstimatorResult } from '@/lib/calculator/pricing';
import { formatBracket } from '@/lib/calculator/pricing';

/**
 * Plain HTML string templates rather than @react-email/components — that
 * package (and @react-email/tailwind) were pulled from npm ("no longer
 * supported") the day this was built, so this avoids depending on a
 * flagged package for a one-way transactional email.
 */

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function wrapper(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:32px 16px;background:#0a0a0b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#e5e5e5;">
    <table role="presentation" width="100%" style="max-width:560px;margin:0 auto;background:#141416;border-radius:12px;padding:32px;">
      <tr><td>
        <h1 style="font-size:18px;margin:0 0 16px;color:#ffffff;">${escapeHtml(title)}</h1>
        ${bodyHtml}
      </td></tr>
    </table>
  </body>
</html>`;
}

function fieldRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 0;color:#9a9a9a;font-size:13px;vertical-align:top;width:120px;">${escapeHtml(label)}</td>
    <td style="padding:6px 0;color:#e5e5e5;font-size:13px;">${escapeHtml(value)}</td>
  </tr>`;
}

export function renderLeadNotificationEmail(
  input: LeadSubmission,
  estimate?: EstimatorResult
): { subject: string; html: string } {
  const rows: string[] = [
    fieldRow('Source', input.source),
    fieldRow('Name', input.name),
    fieldRow('Email', input.email),
    fieldRow('Locale', input.locale),
  ];

  if (input.source === 'contact') {
    rows.push(fieldRow('Audience', input.audience));
    // Qualification first: these are what decide whether the lead is worth a
    // call, and they need to survive an email client's preview truncation.
    if (input.budget) rows.push(fieldRow('Budget', input.budget));
    if (input.timeline) rows.push(fieldRow('Timeline', input.timeline));
    rows.push(fieldRow('Message', input.message));
  } else {
    if (input.company) rows.push(fieldRow('Company', input.company));
    rows.push(fieldRow('Scope', input.scope.join(', ')));
    rows.push(fieldRow('Timeline', input.timeline));
    if (input.notes) rows.push(fieldRow('Notes', input.notes));
    if (estimate) {
      rows.push(fieldRow('Estimate', `${formatBracket(estimate.bracket, 'en')} · ${estimate.estimatedWeeks[0]}-${estimate.estimatedWeeks[1]} weeks`));
    }
  }

  const subject =
    input.source === 'contact'
      ? `New contact form lead: ${input.name}${input.budget ? ` · ${input.budget}` : ''}`
      : `New calculator lead: ${input.name}`;

  const html = wrapper(
    subject,
    `<table role="presentation" width="100%">${rows.join('')}</table>`
  );

  return { subject, html };
}

export function renderLeadConfirmationEmail(
  input: LeadSubmission,
  locale: Locale
): { subject: string; html: string } {
  const { t } = getTranslations(locale);

  const subject = t('email.confirmationSubject', { name: input.name });
  const body =
    input.source === 'contact'
      ? t('email.confirmationBodyContact')
      : t('email.confirmationBodyCalculator');
  const signature = t('email.confirmationSignature');

  const html = wrapper(
    subject,
    `<p style="font-size:14px;line-height:1.6;color:#e5e5e5;">${escapeHtml(body)}</p>
     <p style="font-size:14px;color:#9a9a9a;margin-top:24px;">${escapeHtml(signature)}</p>`
  );

  return { subject, html };
}
