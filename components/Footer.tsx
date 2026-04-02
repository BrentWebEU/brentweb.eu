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
import { useTranslations } from "@/hooks/useTranslations";
import { CONSENT_EVENT } from "@/hooks/useConsent";
const logo = "/logo.svg";

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

export const Footer = memo(() => {
  const { t } = useTranslations();
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { getViewedCount, getTotalCount } = useSectionViewed();
  const nodesCount = getViewedCount();
  const totalNodes = getTotalCount();
  const nodesProgress = (nodesCount / totalNodes) * 100;

  const navLinks = [
    t('nav.about'),
    t('nav.experience'),
    t('nav.services'),
    t('nav.projects'),
    t('nav.contact')
  ];

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__top">
          <img
            src={logo}
            alt="Brent Schoenmakers"
            className="footer__logo"
          />
        </div>

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
              <a
                key={link}
                href={`#${link.toLowerCase().replace(/\s+/g, '')}`}
                className="footer__link"
              >
                {link}
              </a>
            ))}
            <a href="/privacy" className="footer__link">
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
            date: '16 March 2026',
          })}
        </p>
      </div>
    </footer>
  );
});
