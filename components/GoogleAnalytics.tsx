'use client';

import { useEffect } from 'react';
import Script from 'next/script';
import { useConsent } from '@/hooks/useConsent';

const GA_ID = 'G-NTBEEGE8WJ';

export function GoogleAnalytics() {
  const { analyticsConsent, isLoaded } = useConsent();

  useEffect(() => {
    if (!isLoaded) return;
    if (!analyticsConsent && typeof window !== 'undefined') {
      (window as any)[`ga-disable-${GA_ID}`] = true;
    }
  }, [analyticsConsent, isLoaded]);

  if (!isLoaded || !analyticsConsent) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
