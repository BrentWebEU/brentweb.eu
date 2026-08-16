export const AUDIENCES = ['business', 'tech'] as const;
export type Audience = (typeof AUDIENCES)[number];

export const AUDIENCE_COOKIE = 'bw-path';
export const LOCALE_COOKIE = 'bw-locale';

/** One year. Both preference cookies share this lifetime. */
export const PREFERENCE_MAX_AGE = 60 * 60 * 24 * 365;

export const PREFERENCE_COOKIE_OPTIONS = {
  path: '/',
  maxAge: PREFERENCE_MAX_AGE,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  // Deliberately not httpOnly: the client AudienceSwitch writes these
  // optimistically so the preference survives even if the user never
  // completes the navigation.
  httpOnly: false,
} as const;

export function isAudience(value: unknown): value is Audience {
  return typeof value === 'string' && (AUDIENCES as readonly string[]).includes(value);
}
