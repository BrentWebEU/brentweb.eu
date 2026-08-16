import Link from 'next/link';

/**
 * Root-level 404, reached only for paths outside any [locale] segment — the
 * proxy redirects almost everything into one. It renders its own <html>/<body>
 * because the root layout deliberately does not (see app/layout.tsx).
 */
export default function NotFound() {
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
        <p style={{ fontSize: '3.5rem', margin: 0, opacity: 0.4 }}>404</p>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>
          That page does not exist.
        </h1>
        <p style={{ marginBottom: '2rem', maxWidth: '38ch', lineHeight: 1.6 }}>
          The link may be out of date, or the address may have a typo.
        </p>
        <Link
          href="/en"
          style={{
            padding: '0.75rem 1.5rem',
            border: '1px solid #fafafa',
            borderRadius: '0.5rem',
            color: '#fafafa',
            textDecoration: 'none',
          }}
        >
          Back to start
        </Link>
      </body>
    </html>
  );
}
