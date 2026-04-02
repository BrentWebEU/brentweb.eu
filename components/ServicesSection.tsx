'use client';

import { useRef, memo } from "react";
import { motion, useInView } from "framer-motion";
import { Code, Globe, Cloudy, Database, Grid2x2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/hooks/useTranslations";

const getServices = (t: ReturnType<typeof useTranslations>['t']) => {
  return [
  {
    icon: Globe,
    title: t('services.items.webDevelopment.title'),
    description: t('services.items.webDevelopment.description'),
    color: "#ec4899",
  },
  {
    icon: Code,
    title: t('services.items.fullStackApps.title'),
    description: t('services.items.fullStackApps.description'),
    color: "#8b5cf6",
  },
  {
    icon: Cloudy,
    title: t('services.items.deployment.title'),
    description: t('services.items.deployment.description'),
    color: "#3b82f6",
  },
  {
    icon: Database,
    title: t('services.items.database.title'),
    description: t('services.items.database.description'),
    color: "#10b981",
  },
  {
    icon: Grid2x2,
    title: t('services.items.architecture.title'),
    description: t('services.items.architecture.description'),
    color: "#facc15",
  },
];
};

const getStats = (t: ReturnType<typeof useTranslations>['t']) => {
  const projectItems = t('projects.items') as any[];
  return [
  {
    value: projectItems.length + "+",
    label: t('services.stats.projectsDelivered'),
  },
  {
    value: new Date().getFullYear() - 2019 + "+",
    label: t('services.stats.yearsLearning'),
  },
  {
    value: "15+",
    label: t('services.stats.technologiesUsed'),
  },
];
};

const ServiceCard = memo(
  ({
    service,
    index,
  }: {
    service: ReturnType<typeof getServices>[0];
    index: number;
  }) => {
    const Icon = service.icon;

    return (
      <div className={cn("card", "card--service")}>
        <div className="card__icon-wrapper">
          <Icon className="card__icon" />
        </div>

        <div>
          <h3 className="card__title">{service.title}</h3>
          <p className="card__description">
            {service.description}
          </p>
        </div>
      </div>
    );
  }
);

export const ServicesSection = memo(() => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useTranslations();
  const services = getServices(t);
  const stats = getStats(t);

  return (
    <section id="services" ref={ref} className="section section--loose">
      <div className="container">
        <div style={{ maxWidth: "64rem", marginInline: "auto" }}>
          <div className="card card--stats">
            {stats.map((stat) => (
              <div key={stat.label} className="card__stat">
                <p className="card__stat-value">{stat.value}</p>
                <p className="card__stat-label">{stat.label}</p>
              </div>
            ))}
          </div>

          <div style={{ marginBottom: "var(--space-12)", marginTop: "var(--space-12)", position: "relative" }}>
            <span className="what-i-do__label" style={{ marginBottom: "var(--space-4)" }}>
              {t('services.badge')}
            </span>
            <h2 style={{ 
              fontSize: "clamp(1.875rem, 4vw, 3rem)", 
              fontWeight: "var(--font-weight-bold)", 
              marginBottom: "var(--space-4)" 
            }}>
              {t('services.title')}
            </h2>
            <span className="services__annotation">{t('services.annotation')}</span>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
              gap: "var(--space-6)" 
            }}
          >
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ 
                  duration: 0.5, 
                  delay: 0.5 + (index * 0.1),
                  ease: [0.25, 0.1, 0.25, 1]
                }}
              >
                <ServiceCard
                  service={service}
                  index={index}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
});
