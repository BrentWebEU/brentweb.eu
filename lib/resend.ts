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
  if (!client) {
    /* The SDK's own message for a missing key ("Missing API key. Pass it to
     * the constructor") reads like a coding mistake, which sent this exact
     * outage looking in the wrong place: nothing had been passed because
     * nothing was configured. Name the variable and the file to fix. */
    if (!process.env.RESEND_API_KEY) {
      throw new Error(
        'RESEND_API_KEY is not set — no lead email can be sent. Add it to .env for local dev, ' +
          'and to secrets/resend_api_key (mapped in docker-compose.yml) for production.',
      );
    }
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

export const LEAD_FROM = 'Brentweb Leads <leads@brentweb.eu>';
export const LEAD_TO = 'brent@brentweb.eu';
