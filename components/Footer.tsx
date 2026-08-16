'use client';

import { memo, useCallback } from "react";
import { useSectionViewed } from "@/hooks/useSectionViewed";
import {
  ArrowUp,
  Github as GithubIcon,
  Linkedin as LinkedinIcon,
  Mail,
  Instagram as InstagramIcon,
} from "lucide-react";
import type { Locale } from "@/i18n";
import type { Audience } from "@/lib/audience";
import { routes } from "@/lib/routes";
import { useTranslations } from "@/hooks/useTranslations";
import { CONSENT_EVENT } from "@/hooks/useConsent";
import { SECTIONS, ANCHORS } from "./Navigation";
import { Logo } from "./Logo";

const socialLinks = [
  { icon: GithubIcon, href: "https://github.com/BrentWebEU", label: "GitHub" },
  {
    icon: LinkedinIcon,
    href: "https://www.linkedin.com/in/brent-schoenmakers-3793a8262/",
    label: "LinkedIn",
  },
  {
    icon: InstagramIcon,
    href: "https://www.instagram.com/brentweb.eu/",
    label: "Instagram",
  },
  { icon: Mail, href: "mailto:brent@brentweb.eu", label: "Email" },
];

export const Footer = memo(({ locale, audience }: { locale: Locale; audience: Audience }) => {
  const { t } = useTranslations();
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { getViewedCount, getTotalCount } = useSectionViewed();
  const nodesCount = getViewedCount();
  const totalNodes = getTotalCount();
  const nodesProgress = (nodesCount / totalNodes) * 100;

  // Anchors come from the same source as the nav, keyed by section id rather
  // than by the translated label — deriving `#${label.toLowerCase()}` produced
  // dead links on the Dutch site (#overmij) and linked business visitors to
  // #experience, which only the engineering path renders.
  const navLinks = SECTIONS[audience].map((key) => ({
    key,
    label: t(`nav.${key}`),
    href: ANCHORS[key] ?? '#',
  }));

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          <Logo className="footer__logo text-foreground" />
        </div>

        {audience === 'tech' && (
          <div className="footer__nodes">
            <div className="footer__nodes-label">{t('footer.nodesDiscovered')}</div>
            <div className="footer__nodes-count">
              {nodesCount}/{totalNodes}
            </div>
            <div className="footer__nodes-progress">
              <div
                className="footer__nodes-progress-bar"
                style={{ width: `${nodesProgress}%` }}
              />
            </div>
            <p className="footer__annotation">{t('footer.annotation')}</p>
          </div>
        )}

        <div className="footer__socials">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="footer__social-link"
            >
              <social.icon className="footer__social-icon" />
            </a>
          ))}
        </div>

        <div className="footer__bottom">
          <p className="footer__copyright">
            {t('footer.copyright', { year: new Date().getFullYear().toString() })}
          </p>

          <div className="footer__links">
            {navLinks.map((link) => (
              <a key={link.key} href={link.href} className="footer__link">
                {link.label}
              </a>
            ))}
            <a href={routes.privacy(locale)} className="footer__link">
              {t('footer.privacy')}
            </a>
            <button
              className="footer__link footer__link--button"
              onClick={() => window.dispatchEvent(new CustomEvent(CONSENT_EVENT))}
            >
              {t('footer.cookieSettings')}
            </button>
          </div>

          <button
            onClick={scrollToTop}
            className="footer__back-to-top"
            aria-label={t('footer.backToTop')}
          >
            <ArrowUp className="footer__back-to-top-icon" />
          </button>
        </div>

        <p className="footer__status">
          {t('footer.lastUpdated', {
            // Stamped by next.config.js at build time rather than typed by
            // hand, so it cannot drift out of date on its own.
            date: new Date(process.env.NEXT_PUBLIC_BUILD_DATE ?? Date.now()).toLocaleDateString(
              locale,
              { year: 'numeric', month: 'long', day: 'numeric' },
            ),
          })}
        </p>
      </div>
    </footer>
  );
});
