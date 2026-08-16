/**
 * Stamped at build time so the footer's "last updated" reflects reality.
 * It was previously the literal string '16 March 2026', which was wrong the
 * day after it was written and could only ever get more wrong.
 */
const BUILD_DATE = new Date().toISOString().slice(0, 10);

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BUILD_DATE: BUILD_DATE,
  },
  reactStrictMode: true,
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    unoptimized: false,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  async redirects() {
    return [
      // Common short form of the Dutch locale.
      { source: '/nl', destination: '/nl-BE', permanent: true },
      { source: '/nl/:path*', destination: '/nl-BE/:path*', permanent: true },

      // The business path was promoted to the site root, so /business no
      // longer exists as a segment. These keep every previously-indexed URL
      // alive. Order matters: the more specific patterns must precede the
      // bare /business rule.
      {
        source: '/:locale(en|nl-BE)/business/calculator',
        destination: '/:locale/pricing',
        permanent: true,
      },
      {
        source: '/:locale(en|nl-BE)/business/work/:path*',
        destination: '/:locale/work/:path*',
        permanent: true,
      },
      {
        source: '/:locale(en|nl-BE)/business',
        destination: '/:locale',
        permanent: true,
      },
    ];
  },
  // Applied globally, including the /api routes the proxy matcher excludes.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
