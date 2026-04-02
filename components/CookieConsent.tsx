'use client';

import { useState, useEffect, useCallback } from 'react';
import { Cookie, ChevronDown, ChevronUp } from 'lucide-react';
import { useConsent, CONSENT_EVENT } from '@/hooks/useConsent';
import { useTranslations } from '@/hooks/useTranslations';

export function CookieConsent() {
  const { setConsent, hasConsented, consent, isLoaded } = useConsent();
  const { t } = useTranslations();
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    if (!isLoaded) return;
    if (!hasConsented) {
      const timer = setTimeout(() => setIsVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, hasConsented]);

  useEffect(() => {
    const handler = () => {
      setAnalyticsEnabled(consent?.analytics ?? true);
      setIsExpanded(true);
      setIsVisible(true);
    };
    window.addEventListener(CONSENT_EVENT, handler);
    return () => window.removeEventListener(CONSENT_EVENT, handler);
  }, [consent]);

  const handleAcceptAll = useCallback(() => {
    setConsent({ analytics: true });
    setIsVisible(false);
    setIsExpanded(false);
  }, [setConsent]);

  const handleRejectAll = useCallback(() => {
    setConsent({ analytics: false });
    setIsVisible(false);
    setIsExpanded(false);
  }, [setConsent]);

  const handleSavePreferences = useCallback(() => {
    setConsent({ analytics: analyticsEnabled });
    setIsVisible(false);
    setIsExpanded(false);
  }, [setConsent, analyticsEnabled]);

  if (!isLoaded || !isVisible) return null;

  return (
    <div
      className="cookie-consent"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="cookie-consent__panel">
        <div className="cookie-consent__header">
          <Cookie className="cookie-consent__icon" aria-hidden="true" />
          <h3 id="cookie-consent-title" className="cookie-consent__title">
            {t('cookie.banner.title')}
          </h3>
        </div>

        <p id="cookie-consent-desc" className="cookie-consent__description">
          {t('cookie.banner.description')}{' '}
          <a href="/privacy" className="cookie-consent__privacy-link">
            {t('cookie.banner.privacyLink')}
          </a>
          .
        </p>

        {isExpanded && (
          <div className="cookie-consent__categories" role="group" aria-label={t('cookie.banner.manage')}>
            <div className="cookie-consent__category">
              <div className="cookie-consent__category-header">
                <div className="cookie-consent__category-info">
                  <p className="cookie-consent__category-title">
                    {t('cookie.categories.essential.title')}
                  </p>
                  <p className="cookie-consent__category-desc">
                    {t('cookie.categories.essential.description')}
                  </p>
                </div>
                <span className="cookie-consent__always-active">
                  {t('cookie.categories.essential.alwaysActive')}
                </span>
              </div>
            </div>

            <div className="cookie-consent__category">
              <div className="cookie-consent__category-header">
                <div className="cookie-consent__category-info">
                  <p className="cookie-consent__category-title">
                    {t('cookie.categories.analytics.title')}
                  </p>
                  <p className="cookie-consent__category-desc">
                    {t('cookie.categories.analytics.description')}
                  </p>
                </div>
                <label
                  className="cookie-consent__toggle"
                  aria-label={t('cookie.categories.analytics.title')}
                >
                  <input
                    type="checkbox"
                    checked={analyticsEnabled}
                    onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    className="cookie-consent__toggle-input"
                  />
                  <span className="cookie-consent__toggle-track" aria-hidden="true" />
                </label>
              </div>
            </div>
          </div>
        )}

        <div className="cookie-consent__actions">
          <button
            className="cookie-consent__btn cookie-consent__btn--ghost"
            onClick={() => setIsExpanded((v) => !v)}
            aria-expanded={isExpanded}
          >
            {isExpanded ? (
              <><ChevronUp className="cookie-consent__btn-icon" aria-hidden="true" />{t('cookie.banner.hidePreferences')}</>
            ) : (
              <><ChevronDown className="cookie-consent__btn-icon" aria-hidden="true" />{t('cookie.banner.manage')}</>
            )}
          </button>

          <div className="cookie-consent__btn-group">
            <button
              className="cookie-consent__btn cookie-consent__btn--outline"
              onClick={isExpanded ? handleSavePreferences : handleRejectAll}
            >
              {isExpanded ? t('cookie.banner.save') : t('cookie.banner.rejectAll')}
            </button>
            <button
              className="cookie-consent__btn cookie-consent__btn--primary"
              onClick={handleAcceptAll}
            >
              {t('cookie.banner.acceptAll')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
