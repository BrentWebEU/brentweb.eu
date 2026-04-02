'use client';

import { useRef, useState, memo, useCallback } from "react";
import { Briefcase, GraduationCap, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "@/hooks/useTranslations";

type Category = "work" | "education" | "hackathons";

const getCategories = (t: ReturnType<typeof useTranslations>['t']) => {
  return [
    { id: "work" as Category, label: t('experience.work'), icon: Briefcase },
    { id: "education" as Category, label: t('experience.education'), icon: GraduationCap },
    { id: "hackathons" as Category, label: t('experience.hackathons'), icon: Trophy },
  ];
};

const getStats = (t: ReturnType<typeof useTranslations>['t']) => [
  {
    value: `${new Date().getFullYear() - 2019}+`,
    label: t('experience.stats.yearsLearning'),
  },
  {
    value: "2",
    label: t('experience.stats.jobPositions'),
  },
  { 
    value: "3", 
    label: t('experience.stats.hackathons')
  },
  {
    value: "15+",
    label: t('experience.stats.technologies'),
  },
];

export const ExperienceSection = memo(() => {
  const ref = useRef(null);
  const [activeCategory, setActiveCategory] = useState<Category>("work");
  const { t } = useTranslations();
  const categories = getCategories(t);
  const stats = getStats(t);

  const experiences: Record<
    Category,
    Array<{
      year: string;
      title: string;
      company: string;
      description: string;
      tags: string[];
      status?: "current" | "upcoming";
      personalNote?: string;
    }>
  > = {
    work: t('experience.items.work'),
    education: t('experience.items.education'),
    hackathons: t('experience.items.hackathons'),
  };

  const handleCategoryChange = useCallback(
    (cat: Category) => setActiveCategory(cat),
    []
  );

  return (
    <section
      id="experience"
      ref={ref}
      className="experience"
    >
      <div className="experience__container">
        <div className="experience__header">
          <span className="experience__badge">{t('experience.badge')}</span>
          <h2 className="experience__title">
            {t('experience.title')}
          </h2>
        </div>

        <div className="experience__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="experience__stat">
              <p className="experience__stat-value">{stat.value}</p>
              <p className="experience__stat-label">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="experience__tabs">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={cn(
                  "experience__tab",
                  activeCategory === cat.id && "experience__tab--active"
                )}
              >
                <Icon className="experience__tab-icon" />
                <span className="experience__tab-label">{cat.label}</span>
              </button>
            );
          })}
        </div>

        <div className="experience__timeline">
          <div className="experience__timeline-line" />
          <div className="experience__entries">
            {experiences[activeCategory].map((exp, i) => (
              <div key={exp.title + exp.company} className="experience__entry">
                <div className="experience__entry-dot" />

                {exp.status === "current" && (
                  <span className="experience__annotation">{t('experience.stillHere')}</span>
                )}

                <div className="experience__entry-header">
                  <span className="experience__entry-year">
                    [{exp.year}]
                  </span>
                  {exp.status && (
                    <span
                      className={cn(
                        "experience__entry-status",
                        exp.status === "current" 
                          ? "experience__entry-status--current" 
                          : "experience__entry-status--upcoming"
                      )}
                    >
                      {exp.status === "current" ? t('experience.current') : t('experience.upcoming')}
                    </span>
                  )}
                </div>

                <h4 className="experience__entry-title">{exp.title}</h4>
                <p className="experience__entry-company">{exp.company}</p>

                <p className="experience__entry-description">
                  {exp.description}
                </p>

                {exp.personalNote && (
                  <p className="experience__entry-description" style={{ 
                    fontStyle: "italic", 
                    color: "var(--color-muted-foreground)",
                    opacity: 0.8,
                    transform: "translateX(4px)"
                  }}>
                    {exp.personalNote}
                  </p>
                )}

                <div className="experience__entry-tags">
                  {exp.tags.map((tag) => (
                    <span key={tag} className="experience__entry-tag">
                      {tag}
                    </span>
                  ))}
                </div>

                {i < experiences[activeCategory].length - 1 && (
                  <div className="experience__entry-separator" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});
