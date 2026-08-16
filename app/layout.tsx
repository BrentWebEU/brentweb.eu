import type { Metadata, Viewport } from 'next';
import { SITE_URL } from '@/lib/site';
import '@/styles/index.css';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export const viewport: Viewport = {
  // Must track the --background token in styles/variables.css, or the mobile
  // browser chrome paints a different colour than the page behind it.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fcfcfd' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1e' },
  ],
  width: 'device-width',
  initialScale: 1,
};

/**
 * Deliberately renders `children` bare. `app/[locale]/layout.tsx` emits the
 * <html> and <body> tags, because only it knows the `lang` attribute.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
