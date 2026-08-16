'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button-variants';

/**
 * Explicitly illustrative: fabricated steps, no real backend, no real
 * tokens. This must never become a reason to reintroduce next-auth/
 * jsonwebtoken — both were removed as dead weight elsewhere in this repo.
 */
const STEPS = ['idle', 'credentials', 'verify', 'issueToken', 'authenticated'] as const;
const STEP_DELAY_MS = 800;

export function AuthFlowVisualizer() {
  const { t } = useTranslations();
  const [stepIndex, setStepIndex] = useState(0);
  const [running, setRunning] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const start = () => {
    if (running) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRunning(true);
    setStepIndex(0);

    STEPS.forEach((_, i) => {
      if (i === 0) return;
      timers.current.push(
        setTimeout(() => {
          setStepIndex(i);
          if (i === STEPS.length - 1) setRunning(false);
        }, i * STEP_DELAY_MS)
      );
    });
  };

  const restart = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStepIndex(0);
    setRunning(false);
  };

  return (
    <div className="lab-widget">
      <h3 className="lab-widget__title">{t('lab.authFlow.title')}</h3>
      <p className="lab-widget__description">{t('lab.authFlow.description')}</p>

      <ol className="lab-widget__steps">
        {STEPS.map((step, i) => (
          <li
            key={step}
            className={cn(
              'lab-widget__step',
              i <= stepIndex && 'lab-widget__step--active',
              i === stepIndex && running && 'lab-widget__step--current'
            )}
          >
            {t(`lab.authFlow.steps.${step}`)}
          </li>
        ))}
      </ol>

      <div className="lab-widget__actions">
        <button type="button" className={buttonVariants({ variant: 'outline' })} onClick={restart}>
          {t('lab.authFlow.restart')}
        </button>
        <button type="button" className={buttonVariants()} onClick={start} disabled={running}>
          {t('lab.authFlow.start')}
        </button>
      </div>
    </div>
  );
}
