'use client';

import { useTranslations } from '@/hooks/useTranslations';
import { TIMELINE_KEYS, type TimelineKey } from '@/lib/schemas/lead';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function TimelineStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: TimelineKey | null;
  onChange: (value: TimelineKey) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const { t } = useTranslations();

  return (
    <div className="estimator__step">
      <h2 className="estimator__step-title">{t('calculator.timeline.title')}</h2>

      <div className="estimator__options estimator__options--list">
        {TIMELINE_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className={cn('estimator__option', value === key && 'estimator__option--selected')}
            onClick={() => onChange(key)}
            aria-pressed={value === key}
          >
            <span className="estimator__option-label">{t(`calculator.timeline.options.${key}`)}</span>
          </button>
        ))}
      </div>

      <div className="estimator__actions">
        <Button type="button" variant="outline" onClick={onBack}>
          {t('calculator.back')}
        </Button>
        <Button type="button" disabled={!value} onClick={onNext}>
          {t('calculator.next')}
        </Button>
      </div>
    </div>
  );
}
