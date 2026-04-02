'use client';

import { motion } from "framer-motion";
import { useTranslations } from "@/hooks/useTranslations";

export const HeroSection = () => {
  const { t } = useTranslations();

  return (
    <section id="hero" className="hero">
      <div className="hero__container">
        <div className="hero__content">
          <span className="hero__badge">{t('hero.badge')}</span>
          <h1 className="hero__title">{t('hero.title')}</h1>
          <p className="hero__tagline">
            {t('hero.tagline')}
          </p>
          <div className="hero__actions" style={{ position: "relative" }}>
            <a href="#contact" className="hero__btn hero__btn--primary">
              {t('hero.getInTouch')}
            </a>
            <a href="#projects" className="hero__btn hero__btn--secondary">
              {t('hero.viewProjects')}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
