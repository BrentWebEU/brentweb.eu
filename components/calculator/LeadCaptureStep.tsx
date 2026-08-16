'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useTranslations } from '@/hooks/useTranslations';
import { routes } from '@/lib/routes';
import { calculatorLeadSchema, type CalculatorLead, type ScopeKey, type TimelineKey } from '@/lib/schemas/lead';
import { submitLead } from '@/app/actions/submit-lead';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import type { Locale } from '@/i18n';

export function LeadCaptureStep({
  locale,
  scope,
  timeline,
}: {
  locale: Locale;
  scope: ScopeKey[];
  timeline: TimelineKey;
}) {
  const { t } = useTranslations();
  const [isPending, startTransition] = useTransition();
  const [isDownloading, setIsDownloading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<CalculatorLead>({
    resolver: zodResolver(calculatorLeadSchema),
    defaultValues: {
      source: 'calculator',
      locale,
      name: '',
      email: '',
      company: '',
      notes: '',
      scope,
      timeline,
      gdprConsent: false,
      honeypot: '',
    },
  });

  const name = watch('name');

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch('/api/estimate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name || 'You', scope, timeline, locale }),
      });
      if (!response.ok) throw new Error(`PDF request failed with status ${response.status}`);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'project-estimate.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('[calculator] PDF download failed', error);
      toast.error(t('calculator.lead.error'));
    } finally {
      setIsDownloading(false);
    }
  };

  const onSubmit = (values: CalculatorLead) => {
    startTransition(async () => {
      const result = await submitLead(values);

      if (result.ok) {
        toast.success(t('calculator.lead.success'));
        reset();
        return;
      }

      if (result.error === 'rate_limited') {
        toast.error(t('calculator.lead.rateLimited'));
        return;
      }

      toast.error(t('calculator.lead.error'));
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="form estimator__lead-form">
      <h3 className="estimator__step-title">{t('calculator.lead.title')}</h3>
      <p className="estimator__step-description">{t('calculator.lead.subtitle')}</p>

      {/* Honeypot: real visitors never see this field. */}
      <div className="form__honeypot" aria-hidden="true">
        <label htmlFor="calc_company_website">Company website</label>
        <input
          id="calc_company_website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register('honeypot')}
        />
      </div>

      <div className="form__row">
        <div className="form__field">
          <label htmlFor="calc_name" className="form__label">{t('calculator.lead.name')}</label>
          <Input id="calc_name" type="text" {...register('name')} />
          {errors.name && <span className="form__error">{errors.name.message}</span>}
        </div>
        <div className="form__field">
          <label htmlFor="calc_email" className="form__label">{t('calculator.lead.email')}</label>
          <Input id="calc_email" type="email" {...register('email')} />
          {errors.email && <span className="form__error">{errors.email.message}</span>}
        </div>
      </div>

      <div className="form__field">
        <label htmlFor="calc_company" className="form__label">{t('calculator.lead.company')}</label>
        <Input id="calc_company" type="text" {...register('company')} />
      </div>

      <div className="form__field">
        <label htmlFor="calc_notes" className="form__label">{t('calculator.lead.notes')}</label>
        <Textarea id="calc_notes" rows={3} {...register('notes')} />
      </div>

      <div className="form__gdpr">
        <label className="form__gdpr-label">
          <input type="checkbox" className="form__gdpr-checkbox" {...register('gdprConsent')} />
          <span>
            {t('contact.form.gdprConsent')}{' '}
            <a href={routes.privacy(locale)} className="form__gdpr-link">
              {t('contact.form.gdprConsentLink')}
            </a>
            {'. '}
            {t('contact.form.gdprConsentSuffix')}
          </span>
        </label>
        {errors.gdprConsent && <span className="form__error">{t('contact.form.gdprRequired')}</span>}
      </div>

      <div className="estimator__actions">
        <Button type="button" variant="outline" onClick={handleDownload} disabled={isDownloading}>
          {isDownloading ? t('calculator.result.downloadingPdf') : t('calculator.result.downloadPdf')}
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? t('calculator.lead.sending') : t('calculator.lead.submit')}
        </Button>
      </div>
    </form>
  );
}
