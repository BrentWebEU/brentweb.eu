import 'server-only';
import { createBucket, tryConsume, msUntilNextToken, type Bucket, type BucketConfig } from '@/lib/rate-limit-core';

/**
 * In-memory limiter, viable because this app runs as a single long-lived
 * Docker container (node server.js, one replica) — not serverless. State
 * persists for the container's uptime. If this is ever scaled to multiple
 * replicas behind Traefik, this stops being a shared limit (each replica
 * gets its own bucket); Upstash Redis is the documented upgrade path then.
 */

export const RATE_LIMITS = {
  contact: { capacity: 5, refillPerMs: 1 / (2 * 60 * 1000) }, // ~5 per 10 min
  calculator: { capacity: 3, refillPerMs: 1 / (3.33 * 60 * 1000) }, // ~3 per 10 min
} as const satisfies Record<string, BucketConfig>;

const buckets = new Map<string, Bucket>();

const ONE_HOUR_MS = 60 * 60 * 1000;

declare global {
  var __rateLimitSweepRegistered: boolean | undefined;
}

// Evict buckets untouched for an hour so this Map doesn't grow unbounded
// over the container's lifetime. Guarded against double-registration
// under dev-mode HMR, which would otherwise stack multiple intervals.
if (!globalThis.__rateLimitSweepRegistered) {
  globalThis.__rateLimitSweepRegistered = true;
  setInterval(() => {
    const now = Date.now();
    for (const [key, bucket] of buckets) {
      if (now - bucket.lastRefillMs > ONE_HOUR_MS) buckets.delete(key);
    }
  }, ONE_HOUR_MS).unref?.();
}

export function consume(
  key: string,
  cfg: BucketConfig
): { allowed: boolean; retryAfterMs: number } {
  const now = Date.now();
  const existing = buckets.get(key) ?? createBucket(cfg, now);
  const { bucket, allowed } = tryConsume(existing, now, cfg);
  buckets.set(key, bucket);
  return { allowed, retryAfterMs: allowed ? 0 : msUntilNextToken(bucket, cfg) };
}
