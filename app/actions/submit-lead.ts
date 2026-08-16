'use server';

import { headers } from 'next/headers';
import { leadSubmissionSchema } from '@/lib/schemas/lead';
import { consume, RATE_LIMITS } from '@/lib/rate-limit';
import { getResendClient, LEAD_FROM, LEAD_TO } from '@/lib/resend';
import { renderLeadNotificationEmail, renderLeadConfirmationEmail } from '@/lib/email-templates';
import { estimate } from '@/lib/calculator/pricing';
import { renderEstimatePdf } from '@/lib/pdf/estimate';

export type SubmitLeadResult =
  | { ok: true }
  | { ok: false; error: 'validation'; fieldErrors: Record<string, string[]> }
  | { ok: false; error: 'rate_limited'; retryAfterSeconds: number }
  | { ok: false; error: 'email_failed' };

export async function submitLead(input: unknown): Promise<SubmitLeadResult> {
  const parsed = leadSubmissionSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: 'validation',
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }
  const lead = parsed.data;

  // contactLeadSchema keeps budget/timeline optional so it stays a bare
  // ZodObject for the discriminated union. The business path requires them,
  // so enforce that here rather than trusting the client-side resolver.
  if (lead.source === 'contact' && lead.audience === 'business') {
    const fieldErrors: Record<string, string[]> = {};
    if (!lead.budget) fieldErrors.budget = ['Select a budget range'];
    if (!lead.timeline) fieldErrors.timeline = ['Select a timeline'];
    if (Object.keys(fieldErrors).length > 0) {
      return { ok: false, error: 'validation', fieldErrors };
    }
  }

  // Honeypot: real visitors never see or fill this field. Any value here
  // means a bot filled every field it could find. Pretend success and send
  // nothing — an explicit rejection would teach scrapers to detect the trap.
  if (lead.honeypot) {
    console.warn(`[submit-lead] honeypot triggered on a "${lead.source}" submission (${lead.email})`);
    return { ok: true };
  }

  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const { allowed, retryAfterMs } = consume(`${ip}:${lead.source}`, RATE_LIMITS[lead.source]);
  if (!allowed) {
    return { ok: false, error: 'rate_limited', retryAfterSeconds: Math.ceil(retryAfterMs / 1000) };
  }

  const estimateResult =
    lead.source === 'calculator' ? estimate({ scope: lead.scope, timeline: lead.timeline }) : undefined;

  const notification = renderLeadNotificationEmail(lead, estimateResult);
  const confirmation = renderLeadConfirmationEmail(lead, lead.locale);

  const confirmationAttachments =
    lead.source === 'calculator'
      ? [
          {
            filename: 'project-estimate.pdf',
            content: await renderEstimatePdf({
              name: lead.name,
              scope: lead.scope,
              timeline: lead.timeline,
              // The confirmation email is already rendered in the lead's
              // locale; the attached PDF has to match it.
              locale: lead.locale,
            }),
          },
        ]
      : undefined;

  try {
    const resend = getResendClient();
    const [notificationResult, confirmationResult] = await Promise.all([
      resend.emails.send({
        from: LEAD_FROM,
        to: LEAD_TO,
        subject: notification.subject,
        html: notification.html,
        replyTo: lead.email,
      }),
      resend.emails.send({
        from: LEAD_FROM,
        to: lead.email,
        subject: confirmation.subject,
        html: confirmation.html,
        attachments: confirmationAttachments,
      }),
    ]);

    if (notificationResult.error || confirmationResult.error) {
      console.error('[submit-lead] Resend returned an error', notificationResult.error, confirmationResult.error);
      return { ok: false, error: 'email_failed' };
    }
  } catch (error) {
    console.error('[submit-lead] Resend send failed', error);
    return { ok: false, error: 'email_failed' };
  }

  return { ok: true };
}
