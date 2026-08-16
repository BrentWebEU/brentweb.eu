import { Outfit, Geist, JetBrains_Mono, Caveat } from 'next/font/google';

/**
 * Self-hosted at build time by next/font. This replaces the three
 * render-blocking `@import url('https://fonts.googleapis.com/...')` lines that
 * used to head styles/index.css, along with the <link rel="preconnect"> they
 * required — there is no third-party font origin any more.
 *
 * All four families ship variable fonts, so a single file per family covers the
 * full weight range and no `weight` array is needed.
 *
 * Each `variable` wires the face to a CSS custom property. styles/variables.css
 * consumes those, and styles/index.css maps them onto Tailwind's --font-*
 * namespace in its `@theme inline` block. The classes go on <html> (not <body>)
 * so portalled Radix content mounted on document.body still resolves them.
 */

/** Display face — headings only. Geometric, distinctive, carries the brand. */
export const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

/** Body and UI text. Neutral grotesk; holds up at small sizes where Outfit's
 *  geometric bowls get muddy, and reads corporate rather than startup. */
export const geist = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-geist',
});

/** Labels, eyebrows, metrics, code. */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

/**
 * Engineering path only — the handwritten annotations on /tech. Not preloaded:
 * it appears in four places, none above the fold, so it should not consume a
 * preload slot on the business landing where it is never used at all.
 */
export const caveat = Caveat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-caveat',
  preload: false,
});

/** Convenience: every font variable class, for the <html> element. */
export const fontVariables = [
  outfit.variable,
  geist.variable,
  jetbrainsMono.variable,
  caveat.variable,
].join(' ');
