/**
 * Hex mirrors of styles/variables.css's HSL tokens. Both @react-pdf/renderer
 * and next/og's ImageResponse (Satori) render outside a CSS engine and cannot
 * read CSS custom properties, so this duplication is unavoidable — kept in one
 * place rather than re-derived per consumer.
 *
 * Nothing validates these against variables.css, so they must be updated by
 * hand whenever a ramp moves. Each value is the exact hex of the matching
 * `--token` in that file.
 */

/** Light ramp — used by the estimate PDF, which is printed on white paper. */
export const BRAND_COLORS = {
  primary: '#e02c1f', // --primary          4 76% 50%
  foreground: '#23232a', // --foreground       240 9% 15%
  mutedForeground: '#666670', // --muted-foreground 240 5% 42%
  border: '#dddde4', // --border           240 12% 88%
  muted: '#f3f3f6', // --muted            240 16% 96%
  background: '#fcfcfd', // --background       240 20% 99%
} as const;

/**
 * Dark ramp — used by the OG image, which is deliberately dark.
 *
 * This exists because app/og/route.tsx previously hardcoded `#0a0a0b` and
 * `#ffffff` inline, so the social preview kept the old near-black palette
 * after the theme was softened, and paired it with the *light* brand red on a
 * dark ground. Link previews are the site's most-shared surface; they should
 * not be the one place still running the old colours.
 */
export const BRAND_COLORS_DARK = {
  primary: '#e86359', // --primary          4 76% 63%
  foreground: '#ebebeb', // --foreground       0 0% 92%
  mutedForeground: '#9f9fa8', // --muted-foreground 240 5% 64%
  border: '#35353b', // --border           240 6% 22%
  muted: '#303036', // --muted            240 6% 20%
  background: '#1a1a1e', // --background       240 7% 11%
} as const;
