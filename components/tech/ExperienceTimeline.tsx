'use client';

import { useState } from 'react';
import { Briefcase, GraduationCap, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTranslations } from '@/hooks/useTranslations';

type Category = 'work' | 'education' | 'hackathons';

interface Entry {
  year: string;
  title: string;
  company: string;
  description: string;
  tags: string[];
  status?: 'current' | 'upcoming';
  personalNote?: string;
}

const CATEGORIES = [
  { id: 'work' as const, icon: Briefcase },
  { id: 'education' as const, icon: GraduationCap },
  { id: 'hackathons' as const, icon: Trophy },
];

/**
 * Rewritten from ExperienceSection. Client-side only because the category
 * tabs hold state; everything else on this page is a server component.
 *
 * The old version led with a four-tile stat strip that included "15+
 * Technologies" — the same vanity metric removed from the business services
 * section. The three that remain are countable facts.
 */
export function ExperienceTimeline() {
  const { t } = useTranslations();
  const [active, setActive] = useState<Category>('work');

  const stats = [
    { value: `${new Date().getFullYear() - 2019}+`, label: t('experience.stats.yearsLearning') },
    { value: '2', label: t('experience.stats.jobPositions') },
    { value: '3', label: t('experience.stats.hackathons') },
  ];

  const entries = t(`experience.items.${active}`) as Entry[];

  return (
    <section id="experience" className="border-t border-border py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <header className="max-w-3xl">
          <span className="block font-mono text-xs uppercase tracking-[0.18em] text-primary">
            {t('experience.badge')}
          </span>
          <h2 className="mt-5 font-display text-3xl leading-[1.08] font-bold tracking-tight text-foreground md:text-4xl lg:text-[2.75rem]">
            {t('experience.title')}
          </h2>
        </header>

        <dl className="mt-12 grid grid-cols-3 gap-px overflow-hidden rounded-lg bg-border">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-background p-5 md:p-6">
              <dd className="font-display text-2xl font-bold tabular-nums text-foreground md:text-3xl">
                {stat.value}
              </dd>
              <dt className="mt-1 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
                {stat.label}
              </dt>
            </div>
          ))}
        </dl>

        <div role="tablist" aria-label={t('experience.title')} className="mt-14 flex flex-wrap gap-2">
          {CATEGORIES.map(({ id, icon: Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`experience-panel-${id}`}
                id={`experience-tab-${id}`}
                onClick={() => setActive(id)}
                className={cn(
                  'inline-flex items-center gap-2 border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.14em]',
                  'transition-colors duration-200 ease-out',
                  'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2',
                  isActive
                    ? 'border-primary bg-primary/[0.06] text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                )}
              >
                <Icon size={14} strokeWidth={1.75} aria-hidden />
                {t(`experience.${id}`)}
              </button>
            );
          })}
        </div>

        <ol
          role="tabpanel"
          id={`experience-panel-${active}`}
          aria-labelledby={`experience-tab-${active}`}
          className="mt-10 border-l border-border"
        >
          {entries.map((entry) => (
            <li key={`${entry.title}-${entry.company}`} className="relative py-7 pl-8 md:pl-10">
              {/* Timeline node, centred on the rail. */}
              <span
                aria-hidden
                className={cn(
                  'absolute top-9 -left-[4.5px] h-2 w-2 rounded-full',
                  entry.status === 'current' ? 'bg-primary' : 'bg-border',
                )}
              />

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="font-mono text-xs tabular-nums text-muted-foreground">
                  [{entry.year}]
                </span>
                {entry.status && (
                  <span
                    className={cn(
                      'font-mono text-[0.7rem] uppercase tracking-[0.14em]',
                      entry.status === 'current' ? 'text-success' : 'text-warning',
                    )}
                  >
                    {t(`experience.${entry.status}`)}
                  </span>
                )}
              </div>

              <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-foreground">
                {entry.title}
              </h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{entry.company}</p>
              <p className="mt-3 max-w-[62ch] leading-relaxed text-muted-foreground">
                {entry.description}
              </p>

              {entry.personalNote && (
                <p className="mt-3 max-w-[56ch] font-handwritten text-lg text-primary">
                  {entry.personalNote}
                </p>
              )}

              {entry.tags?.length > 0 && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <li
                      key={tag}
                      className="border border-border px-2 py-1 font-mono text-[0.7rem] text-muted-foreground"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
