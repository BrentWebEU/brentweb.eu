'use client';

import { useMemo, useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import type { Locale } from '@/i18n';
import type { ScopeKey, TimelineKey } from '@/lib/schemas/lead';
import { estimate } from '@/lib/calculator/pricing';
import { ScopeStep } from '@/components/calculator/ScopeStep';
import { TimelineStep } from '@/components/calculator/TimelineStep';
import { BudgetOutput } from '@/components/calculator/BudgetOutput';
import { LeadCaptureStep } from '@/components/calculator/LeadCaptureStep';

type Step = 0 | 1 | 2;

export function CostEstimator({ locale }: { locale: Locale }) {
  const { t } = useTranslations();
  const [step, setStep] = useState<Step>(0);
  const [scope, setScope] = useState<ScopeKey[]>([]);
  const [timeline, setTimeline] = useState<TimelineKey | null>(null);

  const result = useMemo(() => (timeline ? estimate({ scope, timeline }) : null), [scope, timeline]);

  return (
    <div className="estimator">
      <p className="estimator__step-of">{t('calculator.stepOf', { current: step + 1, total: 3 })}</p>

      {step === 0 && <ScopeStep value={scope} onChange={setScope} onNext={() => setStep(1)} />}

      {step === 1 && (
        <TimelineStep
          value={timeline}
          onChange={setTimeline}
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
        />
      )}

      {step === 2 && result && timeline && (
        <>
          <BudgetOutput result={result} onBack={() => setStep(1)} />
          <LeadCaptureStep locale={locale} scope={scope} timeline={timeline} />
        </>
      )}
    </div>
  );
}
