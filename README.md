brentweb.eu uses self-hosted analytics instead of a public dashboard or third-party tracking.

- Website events are written by `app/api/track/route.ts` into the `portfolio_analytics` PostgreSQL database.
- Metabase reads the reporting views from `portfolio_reporting` via the existing `postgres` data source.
- The starter Metabase dashboard is named `Portfolio Analytics Template` and was placed in the archived `Examples` collection so it can be selected with **Choose a template**.
