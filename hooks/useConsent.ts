'use client';

import { useState, useEffect, useCallback } from 'react';

const CONSENT_KEY = 'cookie-consent';
export const CONSENT_EVENT = 'cookie-consent:open';

export type ConsentState = {
  analytics: boolean;
  timestamp: number;
};

export function useConsent() {
  const [consent, setConsentState] = useState<ConsentState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(CONSENT_KEY);
      if (stored) {
        setConsentState(JSON.parse(stored));
      }
    } catch {
    }
    setIsLoaded(true);
  }, []);

  const setConsent = useCallback((prefs: Omit<ConsentState, 'timestamp'>) => {
    const full: ConsentState = { ...prefs, timestamp: Date.now() };
    setConsentState(full);
    localStorage.setItem(CONSENT_KEY, JSON.stringify(full));
    if (!prefs.analytics && typeof window !== 'undefined') {
      (window as any)['ga-disable-G-NTBEEGE8WJ'] = true;
    }
  }, []);

  return {
    consent,
    setConsent,
    hasConsented: consent !== null,
    analyticsConsent: consent?.analytics ?? false,
    isLoaded,
  };
}
