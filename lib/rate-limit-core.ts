/**
 * Pure token-bucket math — no Node APIs, no module-level state. Isomorphic
 * so the tech/lab rate-limit simulator can animate the exact same algorithm
 * lib/rate-limit.ts uses to actually throttle requests.
 */

export interface Bucket {
  tokens: number;
  lastRefillMs: number;
}

export interface BucketConfig {
  /** Maximum tokens the bucket can hold. */
  capacity: number;
  /** Tokens regained per millisecond. */
  refillPerMs: number;
}

export function createBucket(cfg: BucketConfig, now: number): Bucket {
  return { tokens: cfg.capacity, lastRefillMs: now };
}

export function refill(bucket: Bucket, now: number, cfg: BucketConfig): Bucket {
  const elapsed = Math.max(0, now - bucket.lastRefillMs);
  const tokens = Math.min(cfg.capacity, bucket.tokens + elapsed * cfg.refillPerMs);
  return { tokens, lastRefillMs: now };
}

export function tryConsume(
  bucket: Bucket,
  now: number,
  cfg: BucketConfig
): { bucket: Bucket; allowed: boolean } {
  const refilled = refill(bucket, now, cfg);
  if (refilled.tokens < 1) {
    return { bucket: refilled, allowed: false };
  }
  return { bucket: { ...refilled, tokens: refilled.tokens - 1 }, allowed: true };
}

/** How long until this bucket has at least one token again, in ms. */
export function msUntilNextToken(bucket: Bucket, cfg: BucketConfig): number {
  if (bucket.tokens >= 1) return 0;
  return Math.ceil((1 - bucket.tokens) / cfg.refillPerMs);
}
