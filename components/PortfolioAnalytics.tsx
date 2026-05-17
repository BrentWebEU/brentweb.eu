'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useConsent } from '@/hooks/useConsent';

export function PortfolioAnalytics() {
  const pathname = usePathname();
  const { analyticsConsent, isLoaded } = useConsent();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !analyticsConsent || !pathname) {
      return;
    }

    const query = window.location.search;
    const page = query ? `${pathname}${query}` : pathname;

    if (lastTracked.current === page) {
      return;
    }

    lastTracked.current = page;

    const payload = JSON.stringify({
      event: 'pageview',
      page,
      referrer: document.referrer || null,
      screen_width: window.screen.width,
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'application/json' });
      navigator.sendBeacon('/api/track', blob);
      return;
    }

    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }, [analyticsConsent, isLoaded, pathname]);

  return null;
}
