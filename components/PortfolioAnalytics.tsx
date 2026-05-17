'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useConsent } from '@/hooks/useConsent';

export function PortfolioAnalytics() {
  const pathname = usePathname();
  const { analyticsConsent, isLoaded } = useConsent();
  const lastTracked = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded || !pathname) {
      return;
    }

    // Dynamically load gtag when analytics consent is given and NEXT_PUBLIC_GA_ID is present
    const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

    if (analyticsConsent && GA_ID && typeof window !== 'undefined' && !(window as any).gtagLoaded) {
      try {
        const script = document.createElement('script');
        script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
        script.async = true;
        document.head.appendChild(script);

        (window as any).dataLayer = (window as any).dataLayer || [];
        function gtag(){ (window as any).dataLayer.push(arguments); }
        (window as any).gtag = gtag;
        (window as any).gtag('js', new Date());
        (window as any).gtag('config', GA_ID, { send_page_view: false });
        (window as any).gtagLoaded = true;
      } catch (e) {
        // fail silently
      }
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

    if (analyticsConsent) {
      // send server-side event (beacon preferred)
      if (navigator.sendBeacon) {
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon('/api/track', blob);
      } else {
        fetch('/api/track', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        }).catch(() => {});
      }

      // also send to gtag if loaded (client-side)
      try {
        const GA_ID_LOCAL = process.env.NEXT_PUBLIC_GA_ID;
        if (GA_ID_LOCAL && (window as any).gtag) {
          (window as any).gtag('event', 'page_view', {
            page_location: window.location.href,
            page_path: page,
          });
        }
      } catch (e) {
        // ignore gtag errors
      }
    }
  }, [analyticsConsent, isLoaded, pathname]);

  return null;
}
