'use client';

import { useEffect } from 'react';

/**
 * Replaces the entire document when the root layout itself throws, so it must
 * render its own <html>/<body>. Styles are inline because the stylesheet
 * import lives in the layout that just failed.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root layout error', error.digest ?? error.message);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          margin: 0,
          padding: '2rem',
          textAlign: 'center',
          background: '#0a0a0b',
          color: '#fafafa',
        }}
      >
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
          Something broke.
        </h1>
        <p style={{ marginBottom: '2rem', maxWidth: '38ch', lineHeight: 1.6 }}>
          That one's on me, not you. The error has been logged. Try again, or head
          back to the start.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            padding: '0.75rem 1.5rem',
            border: '1px solid #fafafa',
            borderRadius: '0.5rem',
            background: 'transparent',
            color: '#fafafa',
            font: 'inherit',
            cursor: 'pointer',
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
