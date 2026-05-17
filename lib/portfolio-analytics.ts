import { Pool } from "pg";

declare global {
  var __portfolioAnalyticsPool: Pool | undefined;
  var __portfolioAnalyticsInitPromise: Promise<void> | undefined;
}

function getPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!global.__portfolioAnalyticsPool) {
    global.__portfolioAnalyticsPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
    });
  }

  return global.__portfolioAnalyticsPool;
}

export async function ensurePortfolioAnalyticsSchema() {
  if (!global.__portfolioAnalyticsInitPromise) {
    global.__portfolioAnalyticsInitPromise = (async () => {
      const pool = getPool();

      await pool.query(`
        CREATE TABLE IF NOT EXISTS analytics_events (
          id           SERIAL PRIMARY KEY,
          event        VARCHAR(100) NOT NULL,
          page         VARCHAR(500),
          referrer     VARCHAR(500),
          screen_width SMALLINT,
          user_agent   VARCHAR(512),
          ip           VARCHAR(45),
          created_at   TIMESTAMPTZ DEFAULT NOW()
        )
      `);

      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at
          ON analytics_events (created_at DESC)
      `);

      await pool.query(`
        CREATE INDEX IF NOT EXISTS idx_analytics_events_page_created_at
          ON analytics_events (page, created_at DESC)
      `);
    })();
  }

  await global.__portfolioAnalyticsInitPromise;
}

export async function insertPortfolioAnalyticsEvent(input: {
  event?: unknown;
  page?: unknown;
  referrer?: unknown;
  screen_width?: unknown;
  userAgent?: string | null;
  ip?: string | null;
}) {
  const pool = getPool();
  await ensurePortfolioAnalyticsSchema();

  const safeEvent =
    typeof input.event === "string" ? input.event.slice(0, 100) : "pageview";
  const safePage =
    typeof input.page === "string" ? input.page.slice(0, 500) : null;
  const safeReferrer =
    typeof input.referrer === "string" ? input.referrer.slice(0, 500) : null;
  const safeWidth =
    typeof input.screen_width === "number" && Number.isFinite(input.screen_width)
      ? Math.trunc(input.screen_width)
      : null;
  const safeUserAgent =
    typeof input.userAgent === "string" ? input.userAgent.slice(0, 512) : null;
  const safeIp = typeof input.ip === "string" ? input.ip.slice(0, 45) : null;

  await pool.query(
    `INSERT INTO analytics_events (event, page, referrer, screen_width, user_agent, ip)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [safeEvent, safePage, safeReferrer, safeWidth, safeUserAgent, safeIp],
  );
}
