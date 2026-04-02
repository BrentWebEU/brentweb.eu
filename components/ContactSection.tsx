'use client';

import { useRef, useState, memo, useEffect } from "react";
import {
  Send,
  Mail,
  MapPin,
  Linkedin as LinkedinIcon,
  Github as GithubIcon,
  Instagram as InstagramIcon,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/hooks/useTranslations";

const socialLinks = [
  { icon: GithubIcon, label: "GitHub", href: "https://github.com/BrentWebEU" },
  {
    icon: LinkedinIcon,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/brent-schoenmakers-3793a8262/",
  },
  {
    icon: InstagramIcon,
    label: "Instagram",
    href: "https://www.instagram.com/brentweb.eu/",
  },
];

const MapComponent = memo(() => {
  const { theme } = useTheme();
  const [mapError, setMapError] = useState(false);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [apiKeyLoaded, setApiKeyLoaded] = useState(false);
  const center = { lat: 51.1610826, lng: 4.9903187 }; // Geel, Belgium

  useEffect(() => {
    fetch("/api/maps-config")
      .then((res) => res.json())
      .then((data) => {
        setApiKey(data.apiKey ?? null);
        setApiKeyLoaded(true);
      })
      .catch(() => setApiKeyLoaded(true));
  }, []);

  const getColorScheme = () => {
    if (theme === "light") return "LIGHT";
    return "DARK";
  };
  const colorScheme = getColorScheme();

  const hasValidApiKey = Boolean(apiKey && apiKey.length > 10);

  const useFallback = mapError || (apiKeyLoaded && !hasValidApiKey);

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

  if (!apiKeyLoaded) {
    return <div className="contact__map-container" />;
  }

  return (
    <div className="contact__map-container">
      <div style={{ width: "100%", height: "100%" }}>
        {useFallback ? (
          <div className="contact__map-fallback">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=4.9%2C51.1%2C5.1%2C51.2&layer=mapnik&marker=51.1657,4.9902"
              className="contact__map-fallback-iframe"
              title="Map of Geel, Belgium"
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
          <APIProvider apiKey={apiKey!}>
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
                title="Brent Schoenmakers - Geel, Belgium"
              />
            </Map>
          </APIProvider>
        )}
      </div>
    </div>
  );
});

export const ContactSection = memo(() => {
  const ref = useRef(null);
  const { t } = useTranslations();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    gdprConsent: false,
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!formData.gdprConsent) {
      setError(t('contact.form.gdprRequired'));
      setIsSubmitting(false);
      return;
    }

    const { name, email, message } = formData;

    try {
      const response = await fetch("https://formcarry.com/s/kV0I8IGIy1L", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, message }),
      });

      const data = await response.json();

      if (data.code === 200) {
        toast({
          title: t('contact.form.success'),
          description: t('contact.form.success'),
        });
        setFormData({ name: "", email: "", message: "", gdprConsent: false });
      } else if (data.code === 422) {
        setError(data.message || t('contact.form.error'));
      } else {
        setError(data.message || t('contact.form.error'));
      }
    } catch (err) {
      setError(t('contact.form.error'));
      console.error("Form submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={ref} className="contact">
      <div className="contact__container">
        <div className="contact__header" style={{ position: "relative" }}>
          <span className="contact__badge">{t('contact.badge')}</span>
          <h2 className="contact__title">
            {t('contact.title')}
          </h2>
          <span className="contact__annotation">{t('contact.annotation')}</span>
          <p className="contact__subtitle">
            {t('contact.subtitle')}
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
              <p className="contact__socials-label">Connect with me</p>
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
                Usually reply within 24 hours.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className={cn("contact__form-wrapper", "form")}
          >
            <p className="contact__form-note">
              Drop me a line below.
            </p>
            
            <div className="form__row">
              <div className="form__field">
                <label htmlFor="name" className="form__label">{t('contact.form.name')}</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="form__input"
                  placeholder={t('contact.form.name')}
                />
              </div>
              <div className="form__field">
                <label htmlFor="email" className="form__label">{t('contact.form.email')}</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="form__input"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div className="form__field">
              <label htmlFor="message" className="form__label">{t('contact.form.message')}</label>
              <textarea
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="form__textarea"
                placeholder="Tell me about your project, ask a question, or just say hi..."
              />
            </div>

            {error && (
              <div className="form__error">{error}</div>
            )}

            {/* GDPR consent */}
            <div className="form__gdpr">
              <label className="form__gdpr-label">
                <input
                  type="checkbox"
                  required
                  checked={formData.gdprConsent}
                  onChange={(e) =>
                    setFormData({ ...formData, gdprConsent: e.target.checked })
                  }
                  className="form__gdpr-checkbox"
                />
                <span>
                  {t('contact.form.gdprConsent')}{' '}
                  <a href="/privacy" className="form__gdpr-link">
                    {t('contact.form.gdprConsentLink')}
                  </a>
                  {'. '}
                  {t('contact.form.gdprConsentSuffix')}
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="form__button"
            >
              {isSubmitting ? (
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
