'use client';

import { useRef, useState, memo, useEffect, useTransition } from "react";
import {
  Send,
  Mail,
  MapPin,
  Linkedin as LinkedinIcon,
  Github as GithubIcon,
  Instagram as InstagramIcon,
} from "lucide-react";
import { toast } from "sonner";
import { useTheme } from "next-themes";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { useTranslations, useLocale } from "@/hooks/useTranslations";
import { sendEvent } from '@/lib/analytics';
import { routes } from '@/lib/routes';
import type { Audience } from '@/lib/audience';
import {
  contactLeadFormSchema,
  BUDGET_KEYS,
  TIMELINE_KEYS,
  type ContactLead,
} from '@/lib/schemas/lead';
import { submitLead } from '@/app/actions/submit-lead';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const googleMapsApiKey =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY &&
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !== "your_google_maps_api_key_here" &&
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.trim() !== ""
    ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    : null;

const socialLinks = [
  { icon: GithubIcon, label: "GitHub", href: "https://github.com/BrentWebBE" },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/brent-schoenmakers-3793a8262/",
  },
  {
    icon: InstagramIcon,
    label: "Instagram",
    href: "https://www.instagram.com/brentweb.be/",
  },
];

const MapComponent = memo(() => {
  const { theme } = useTheme();
  const [mapError, setMapError] = useState(false);
  const center = { lat: 51.3112589, lng: 3.1323429 }; // Blankenberge - Geel, Belgium

  const getColorScheme = () => {
    if (theme === "light") return "LIGHT";
    return "DARK";
  };
  const colorScheme = getColorScheme();

  const hasValidApiKey = Boolean(googleMapsApiKey && googleMapsApiKey.length > 10);

  const useFallback = mapError || !hasValidApiKey;

  useEffect(() => {
    if (useFallback || !hasValidApiKey) return;

    const handleError = (event: ErrorEvent) => {
      if (event.message?.includes("Google Maps") || event.message?.includes("maps.googleapis.com")) {
        console.error("Google Maps API error:", event.message);
        setMapError(true);
      }
    };

    globalThis.addEventListener("error", handleError);
    return () => globalThis.removeEventListener("error", handleError);
  }, [hasValidApiKey, useFallback]);

  return (
    <div className="contact__map-container">
      <div style={{ width: "100%", height: "100%" }}>
        {useFallback ? (
          <div className="contact__map-fallback">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=4.9%2C51.1%2C5.1%2C51.2&layer=mapnik&marker=51.1657,4.9902"
              className="contact__map-fallback-iframe"
              title="Map of Blankenberge - Geel, Belgium"
              loading="lazy"
            />
            <div className="contact__map-fallback-note">
              {mapError ? (
                "Google Maps error - Using OpenStreetMap"
              ) : (
                "Using OpenStreetMap (Google Maps API key not configured)"
              )}
            </div>
          </div>
        ) : (
          <APIProvider apiKey={googleMapsApiKey!}>
            <Map
              defaultCenter={center}
              defaultZoom={13}
              disableDoubleClickZoom={false}
              disableDefaultUI={false}
              zoomControl={true}
              mapTypeControl={false}
              streetViewControl={false}
              fullscreenControl={true}
              colorScheme={colorScheme}
              gestureHandling="greedy"
              style={{ width: "100%", height: "100%" }}
            >
              <Marker
                position={center}
                title="Brent Schoenmakers - Blankenberge - Geel, Belgium"
              />
            </Map>
          </APIProvider>
        )}
      </div>
    </div>
  );
});

export const ContactSection = memo(({ audience }: { audience: Audience }) => {
  const ref = useRef(null);
  const { t } = useTranslations();
  const { locale } = useLocale();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactLead>({
    resolver: zodResolver(contactLeadFormSchema),
    defaultValues: {
      source: 'contact',
      audience,
      locale,
      name: '',
      email: '',
      message: '',
      gdprConsent: false,
      honeypot: '',
      budget: undefined,
      timeline: undefined,
    },
  });

  const onSubmit = (values: ContactLead) => {
    try { sendEvent('contact_form_submit_attempt'); } catch { /* analytics must never break the UI */ }

    startTransition(async () => {
      const result = await submitLead(values);

      if (result.ok) {
        toast.success(t('contact.form.success'));
        reset();
        return;
      }

      if (result.error === 'rate_limited') {
        toast.error(t('contact.form.rateLimited'));
        return;
      }

      toast.error(t('contact.form.error'));
    });
  };

  return (
    <section id="contact" ref={ref} className="contact">
      <div className="contact__container">
        <div className="contact__header" style={{ position: "relative" }}>
          <span className="contact__badge">{t(`contact.${audience}.badge`)}</span>
          <h2 className="contact__title">
            {t(`contact.${audience}.title`)}
          </h2>
          {audience === 'tech' && (
            <span className="contact__annotation">{t(`contact.${audience}.annotation`)}</span>
          )}
          <p className="contact__subtitle">
            {t(`contact.${audience}.subtitle`)}
          </p>
        </div>

        <div className="contact__content">
          <div className="contact__info">
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
              <a
                href="mailto:brent@brentweb.eu"
                className="contact__info-item"
              >
                <div className="contact__info-icon-wrapper">
                  <Mail className="contact__info-icon" />
                </div>
                <div className="contact__info-text">
                  <p className="contact__info-label">Email</p>
                  <p className="contact__info-value">brent@brentweb.eu</p>
                </div>
              </a>

              <div className="contact__info-item">
                <div className="contact__info-icon-wrapper">
                  <MapPin className="contact__info-icon" />
                </div>
                <div>
                  <p className="contact__info-label">{t('contact.location')}</p>
                  <p className="contact__info-value">{t('contact.locationValue')}</p>
                </div>
              </div>
            </div>

            <div className="contact__socials">
              <p className="contact__socials-label">{t('contact.socialsLabel')}</p>
              <div className="contact__socials-list">
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact__social-link"
                  >
                    <social.icon className="contact__social-icon" />
                  </a>
                ))}
              </div>
            </div>

            <div className="contact__availability">
              <div className="contact__availability-status">
                <span className="contact__availability-dot" />
                <span className="contact__availability-label">{t('contact.availability')}</span>
              </div>
              <p className="contact__availability-note">
                {t('contact.availabilityNote')}
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className={cn("contact__form-wrapper", "form")}
          >
            <p className="contact__form-note">
              {t(`contact.${audience}.formNote`)}
            </p>

            {/* Honeypot: real visitors never see this field. */}
            <div className="form__honeypot" aria-hidden="true">
              <label htmlFor="company_website">Company website</label>
              <input
                id="company_website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                {...register('honeypot')}
              />
            </div>

            <div className="form__row">
              <div className="form__field">
                <label htmlFor="name" className="form__label">{t('contact.form.name')}</label>
                <Input
                  id="name"
                  type="text"
                  placeholder={t('contact.form.name')}
                  {...register('name')}
                />
                {errors.name && <span className="form__error">{errors.name.message}</span>}
              </div>
              <div className="form__field">
                <label htmlFor="email" className="form__label">{t('contact.form.email')}</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  {...register('email')}
                />
                {errors.email && <span className="form__error">{errors.email.message}</span>}
              </div>
            </div>

            {/* Qualification fields: business path only. The engineering path
                keeps a plain message box — architecture conversations don't
                start with a budget bracket. */}
            {audience === 'business' && (
              <div className="form__row">
                <div className="form__field">
                  <label htmlFor="budget" className="form__label">{t('contact.form.budget')}</label>
                  <select id="budget" className="form__select" defaultValue="" {...register('budget')}>
                    <option value="" disabled>
                      {t('contact.form.selectPlaceholder')}
                    </option>
                    {BUDGET_KEYS.map((key) => (
                      <option key={key} value={key}>
                        {t(`contact.form.budgetOptions.${key}`)}
                      </option>
                    ))}
                  </select>
                  {errors.budget && <span className="form__error">{errors.budget.message}</span>}
                </div>
                <div className="form__field">
                  <label htmlFor="timeline" className="form__label">{t('contact.form.timeline')}</label>
                  {/* Labels reuse the calculator's timeline copy — already
                      translated in both locales for the same key set. */}
                  <select id="timeline" className="form__select" defaultValue="" {...register('timeline')}>
                    <option value="" disabled>
                      {t('contact.form.selectPlaceholder')}
                    </option>
                    {TIMELINE_KEYS.map((key) => (
                      <option key={key} value={key}>
                        {t(`calculator.timeline.options.${key}`)}
                      </option>
                    ))}
                  </select>
                  {errors.timeline && <span className="form__error">{errors.timeline.message}</span>}
                </div>
              </div>
            )}

            <div className="form__field">
              <label htmlFor="message" className="form__label">{t('contact.form.message')}</label>
              <Textarea
                id="message"
                rows={4}
                placeholder={t(`contact.${audience}.messagePlaceholder`)}
                {...register('message')}
              />
              {errors.message && <span className="form__error">{errors.message.message}</span>}
            </div>

            {/* GDPR consent */}
            <div className="form__gdpr">
              <label className="form__gdpr-label">
                <input
                  type="checkbox"
                  className="form__gdpr-checkbox"
                  {...register('gdprConsent')}
                />
                <span>
                  {t('contact.form.gdprConsent')}{' '}
                  <a href={routes.privacy(locale)} className="form__gdpr-link">
                    {t('contact.form.gdprConsentLink')}
                  </a>
                  {'. '}
                  {t('contact.form.gdprConsentSuffix')}
                </span>
              </label>
              {errors.gdprConsent && (
                <span className="form__error">{t('contact.form.gdprRequired')}</span>
              )}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="form__button"
            >
              {isPending ? (
                <>
                  <div className="form__button-spinner" />
                  {t('contact.form.sending')}
                </>
              ) : (
                <>
                  <Send className="form__button-icon" />
                  {t('contact.form.send')}
                </>
              )}
            </button>
          </form>
        </div>

        <div className="contact__map">
          <MapComponent />
        </div>
      </div>
    </section>
  );
});
