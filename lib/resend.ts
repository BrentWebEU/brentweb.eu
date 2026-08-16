import 'server-only';
import { Resend } from 'resend';

/**
 * Requires RESEND_API_KEY and a verified sending domain (SPF/DKIM/DMARC)
 * for brentweb.eu — both manual prerequisites, not something code can set up.
 *
 * Constructed lazily (not at module scope): the Resend constructor throws
 * synchronously when the API key is missing, and this module is reachable
 * from the 'use server' action referenced by every page that renders the
 * contact form — a module-scope throw here would crash those pages outright
 * instead of surfacing as a caught, per-submission "email failed" result.
 */
let client: Resend | null = null;

export function getResendClient(): Resend {
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

export const LEAD_FROM = 'Brentweb Leads <leads@brentweb.eu>';
export const LEAD_TO = 'brent@brentweb.eu';
