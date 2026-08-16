'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { cn } from '@/lib/utils';
import { createBucket, tryConsume, refill, msUntilNextToken, type Bucket } from '@/lib/rate-limit-core';
import { buttonVariants } from '@/components/ui/button-variants';

/**
 * Mirrors lib/rate-limit.ts's RATE_LIMITS.contact config — this animates the
 * exact same token-bucket algorithm that throttles the real contact form,
 * not a simplified stand-in.
 */
const CONFIG = { capacity: 5, refillPerMs: 1 / (2 * 60 * 1000) };
const REFILL_SECONDS = Math.round(1 / CONFIG.refillPerMs / 1000);

export function RateLimitSimulator() {
  const { t } = useTranslations();
  const [bucket, setBucket] = useState<Bucket>(() => createBucket(CONFIG, Date.now()));
  const [displayTokens, setDisplayTokens] = useState(CONFIG.capacity);
  const [blockedMs, setBlockedMs] = useState<number | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const refilled = refill(bucket, now, CONFIG);
      setDisplayTokens(refilled.tokens);
      setBlockedMs((current) => {
        if (current === null) return null;
        const remaining = msUntilNextToken(refilled, CONFIG);
        return remaining > 0 ? remaining : null;
      });
    }, 200);
    return () => clearInterval(interval);
  }, [bucket]);

  const handleSend = () => {
    const now = Date.now();
    const result = tryConsume(bucket, now, CONFIG);
    setBucket(result.bucket);
    setDisplayTokens(result.bucket.tokens);
    setBlockedMs(result.allowed ? null : msUntilNextToken(result.bucket, CONFIG));
  };

  const filledBars = Math.round(displayTokens);

  return (
    <div className="lab-widget">
      <h3 className="lab-widget__title">{t('lab.rateLimit.title')}</h3>
      <p className="lab-widget__description">
        {t('lab.rateLimit.description', { capacity: CONFIG.capacity, refillSeconds: REFILL_SECONDS })}
      </p>

      <div className="lab-widget__gauge" role="img" aria-label={`${displayTokens.toFixed(1)} / ${CONFIG.capacity}`}>
        {Array.from({ length: CONFIG.capacity }).map((_, i) => (
          <span
            key={i}
            className={cn('lab-widget__token', i < filledBars && 'lab-widget__token--filled')}
          />
        ))}
      </div>
      <p className="lab-widget__tokens-label">
        {t('lab.rateLimit.tokensLabel')}: {displayTokens.toFixed(1)}
      </p>

      <div className="lab-widget__actions">
        <button type="button" className={buttonVariants({ variant: 'outline' })} onClick={handleSend}>
          {t('lab.rateLimit.sendRequest')}
        </button>
      </div>

      {blockedMs !== null && (
        <p className="lab-widget__status lab-widget__status--blocked">
          {t('lab.rateLimit.blocked', { seconds: Math.ceil(blockedMs / 1000) })}
        </p>
      )}
    </div>
  );
}
