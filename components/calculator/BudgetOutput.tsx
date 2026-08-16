'use client';

import { useTranslations, useLocale } from '@/hooks/useTranslations';
import { formatBracket, type EstimatorResult } from '@/lib/calculator/pricing';
import { Button } from '@/components/ui/button';

export function BudgetOutput({ result, onBack }: { result: EstimatorResult; onBack: () => void }) {
  const { t } = useTranslations();
  const { locale } = useLocale();

  // estimate() returns the selected scope keys rather than pre-rendered
  // bullets, so the copy resolves in the visitor's own language. These used to
  // be English literals baked into lib/calculator/pricing.ts.
  const includedItems = result.scope.flatMap(
    (key) => t(`calculator.scope.options.${key}.includes`) as unknown as string[],
  );

  return (
    <div className="estimator__result">
      <h2 className="estimator__step-title">{t('calculator.result.title')}</h2>

      <div className="estimator__result-grid">
        <div className="estimator__result-card">
          <span className="estimator__result-label">{t('calculator.result.budgetLabel')}</span>
          <span className="estimator__result-value">{formatBracket(result.bracket, locale)}</span>
        </div>
        <div className="estimator__result-card">
          <span className="estimator__result-label">{t('calculator.result.timelineLabel')}</span>
          <span className="estimator__result-value">
            {t('calculator.result.weeksLabel', {
              min: result.estimatedWeeks[0],
              max: result.estimatedWeeks[1],
            })}
          </span>
        </div>
      </div>

      {result.isRush && (
        <p className="estimator__rush-note">{t('calculator.result.rushNote')}</p>
      )}

      <div className="estimator__included">
        <h3 className="estimator__included-title">{t('calculator.result.includedTitle')}</h3>
        <ul className="estimator__included-list">
          {includedItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <p className="estimator__disclaimer">{t('calculator.result.disclaimer')}</p>

      <div className="estimator__actions">
        <Button type="button" variant="outline" onClick={onBack}>
          {t('calculator.back')}
        </Button>
      </div>
    </div>
  );
}
