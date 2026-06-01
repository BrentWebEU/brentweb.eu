'use client';

import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from "@/hooks/useTranslations";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  const { t } = useTranslations();
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const handleShowroomClick = () => {
    const target = document.getElementById("projects");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleShowroomClick();
    }
  };

  return (
    <section id="hero" className="hero" ref={containerRef}>
      <motion.div className="hero__content" style={{ y, opacity }}>
        <div className="hero__text">
          <motion.span
            className="hero__badge"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {t('hero.badge')}
          </motion.span>

          <motion.h1
            className="hero__title"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {t('hero.title')}
          </motion.h1>

          <motion.p
            className="hero__tagline"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {t('hero.tagline')}
          </motion.p>

          <motion.div
            className="hero__location"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="hero__location-icon"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>{t('hero.location')}</span>
          </motion.div>

          <motion.div
            className="hero__actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button href="#contact" variant="cta">
              {t('hero.getInTouch')}
            </Button>
            <Button href="#projects" variant="outline" className="hero__btn-outline">
              <div className="hero__project-thumb">
                <img
                  src="/images/ckris-small.png"
                  alt="Carrosserie Kris"
                />
              </div>
              <span>{t('hero.viewProjects')}</span>
            </Button>
          </motion.div>
        </div>

        <motion.div
          className="hero__visual"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div
            className="hero__device-frame"
            onClick={handleShowroomClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label="View featured project"
          >
            <div className="hero__device-screen">
              <img
                src="/images/ckris-small.png"
                alt="Featured project - Carrosserie Kris website"
                className="hero__device-img"
              />
            </div>
            <div className="hero__device-notch"></div>
          </div>
          <div className="hero__project-info">
            <span className="hero__project-badge">{t('hero.featured')}</span>
            <span className="hero__project-name">{t("hero.featuredProject")}</span>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
