brentweb.be uses self-hosted analytics instead of a public dashboard or third-party tracking.

- Website events are written by `app/api/track/route.ts` into the `portfolio_analytics` PostgreSQL database.
- Metabase reads the reporting views from `portfolio_reporting` via the existing `postgres` data source.
- The starter Metabase dashboard is named `Portfolio Analytics Template` and was placed in the archived `Examples` collection so it can be selected with **Choose a template**.


Analytics & SEO setup

Environment variables

- NEXT_PUBLIC_GA_ID (optional): GA4 measurement id (G-XXXX) for client-side gtag. Only used when users opt-in to analytics via the cookie banner.
- GA_MEASUREMENT_ID (optional): GA4 measurement id (G-XXXX) for server-side Measurement Protocol forwarding.
- GA_API_SECRET (optional): GA4 Measurement Protocol secret (keep private).
- DATABASE_URL: Postgres connection for self-hosted analytics events.

Notes

- Analytics are consent-gated. Client-side gtag is loaded only after the user grants analytics consent.
- Server-side forwarding to GA4 is optional and only enabled when GA_MEASUREMENT_ID and GA_API_SECRET are set.
- Do NOT commit GA_API_SECRET to source control. Use environment management or secrets storage in deployment.
