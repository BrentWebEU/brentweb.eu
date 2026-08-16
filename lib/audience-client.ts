'use client';

import { PREFERENCE_MAX_AGE } from '@/lib/audience';

/**
 * Writes a preference cookie from the browser. Mirrors PREFERENCE_COOKIE_OPTIONS
 * in lib/audience.ts — keep the two in sync.
 */
export function writePreferenceCookie(name: string, value: string): void {
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${name}=${value}; Path=/; Max-Age=${PREFERENCE_MAX_AGE}; SameSite=Lax${secure}`;
}
