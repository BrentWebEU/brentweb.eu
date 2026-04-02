"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "@/hooks/useTranslations";
const profileImg = "/brent-profile.webp";

const technologies = [
  "React",
  "Angular",
  "Next.js",
  "TypeScript",
  "Docker",
  "Node.js",
  "MySQL",
  "Python",
  ".NET",
  "C#",
  "NestJS",
  "JavaScript",
  "Rust",
  "Actix",
  "Traefik",
  "Linux",
  "NGINX",
  "MongoDB"
];

export const AboutSection = () => {
  const ref = useRef(null);
  const { t } = useTranslations();

  const hour = new Date().getHours();
  const titleKey =
    hour < 12 ? 'about.titleMorning' :
    hour < 18 ? 'about.titleNoon' :
                'about.titleEvening';

  return (
    <section id="about" ref={ref} className="about">
      <div className="about__container">
        <div className="about__content">
          <motion.div
            className="about__image-wrapper"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="about__image-container">
              <div className="about__image-frame">
                <img
                  src={profileImg}
                  alt="Brent Schoenmakers"
                  className="about__image"
                />
              </div>
              <div className="about__years-badge">
                <div className="about__years-value">
                  {new Date().getFullYear() - 2019}+
                </div>
                <p className="about__years-label">{t('about.yearsBuilding')}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="about__text"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div>
              <span className="about__badge">{t('about.badge')}</span>
              <h2 className="about__title">{t(titleKey)}</h2>
              <div className="about__description">
                <p>
                  {t('about.description1')}
                </p>
                <p>
                  {t('about.description2')}
                </p>
                <p>
                  <a href="mailto:brent@brentweb.eu" className="about__link">
                    brent@brentweb.eu
                  </a>
                </p>
              </div>
            </div>

            <div className="about__tech">
              <h3 className="about__tech-title">{t('about.techTitle')}</h3>
              <div className="tech__description">
                <p>
                  {t('about.techDescription')}
                </p>
              </div>
              <div className="about__tech-list">
                {technologies.map((tech) => (
                  <span key={tech} className="about__tech-tag">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="about__cta">
              <a href="#contact" className="about__cta-link">
                {t('about.getInTouch')}
              </a>
            </div>
          </motion.div>
        </div>

        <motion.p
          className="about__annotation"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.7 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {t('about.annotation')}
        </motion.p>
      </div>
    </section>
  );
};
