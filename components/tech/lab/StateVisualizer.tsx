'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from '@/hooks/useTranslations';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button-variants';

type RequestState = 'idle' | 'validating' | 'processing' | 'success' | 'failed';

const STATES: RequestState[] = ['idle', 'validating', 'processing', 'success', 'failed'];

export function StateVisualizer() {
  const { t } = useTranslations();
  const [state, setState] = useState<RequestState>('idle');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = (shouldFail: boolean) => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setState('validating');
    timers.current.push(setTimeout(() => setState('processing'), 600));
    timers.current.push(setTimeout(() => setState(shouldFail ? 'failed' : 'success'), 1400));
  };

  return (
    <div className="lab-widget">
      <h3 className="lab-widget__title">{t('lab.stateMachine.title')}</h3>
      <p className="lab-widget__description">{t('lab.stateMachine.description')}</p>

      <div className="lab-widget__states">
        {STATES.map((s) => (
          <span
            key={s}
            className={cn(
              'lab-widget__state',
              state === s && 'lab-widget__state--current',
              state === s && s === 'failed' && 'lab-widget__state--error',
              state === s && s === 'success' && 'lab-widget__state--success'
            )}
          >
            {t(`lab.stateMachine.states.${s}`)}
          </span>
        ))}
      </div>

      <div className="lab-widget__actions">
        <button type="button" className={buttonVariants({ variant: 'outline' })} onClick={() => run(true)}>
          {t('lab.stateMachine.triggerFailure')}
        </button>
        <button type="button" className={buttonVariants()} onClick={() => run(false)}>
          {t('lab.stateMachine.trigger')}
        </button>
      </div>
    </div>
  );
}
