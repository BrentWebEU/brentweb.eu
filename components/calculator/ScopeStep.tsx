'use client';

import { useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { SCOPE_KEYS, type ScopeKey } from '@/lib/schemas/lead';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function ScopeStep({
  value,
  onChange,
  onNext,
}: {
  value: ScopeKey[];
  onChange: (value: ScopeKey[]) => void;
  onNext: () => void;
}) {
  const { t } = useTranslations();
  const [error, setError] = useState<string | null>(null);

  const toggle = (key: ScopeKey) => {
    onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key]);
    setError(null);
  };

  const handleNext = () => {
    if (value.length === 0) {
      setError(t('calculator.scope.error'));
      return;
    }
    onNext();
  };

  return (
    <div className="estimator__step">
      <h2 className="estimator__step-title">{t('calculator.scope.title')}</h2>
      <p className="estimator__step-description">{t('calculator.scope.description')}</p>

      <div className="estimator__options">
        {SCOPE_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            className={cn('estimator__option', value.includes(key) && 'estimator__option--selected')}
            onClick={() => toggle(key)}
            aria-pressed={value.includes(key)}
          >
            <span className="estimator__option-label">{t(`calculator.scope.options.${key}.label`)}</span>
            <span className="estimator__option-description">{t(`calculator.scope.options.${key}.description`)}</span>
          </button>
        ))}
      </div>

      {error && <p className="form__error">{error}</p>}

      <div className="estimator__actions">
        <Button type="button" onClick={handleNext}>
          {t('calculator.next')}
        </Button>
      </div>
    </div>
  );
}
