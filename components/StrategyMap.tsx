'use client';

/**
 * Projects section — clean card grid with a dual-audience detail dialog:
 * business impact on the left, engineering architecture on the right.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { motion, useInView } from 'framer-motion';
import { ArrowUpRight, Github, X } from 'lucide-react';
import { useLocale } from '@/hooks/useTranslations';
import { getMessages } from '@/i18n';
import { sendEvent } from '@/lib/analytics';

const IMAGE_MAP: Record<string, string> = {
  carrosserieKris: '/images/ckris-small.png',
  provilion: '/provilion.png',
  hetsmaakpand: '/hetsmaakpand.png',
  idps: '/images/idps.png',
};

type DeploymentStatus = 'active' | 'maintained' | 'decommissioned';

type ProjectsMessages = ReturnType<typeof getMessages>['projects'];
type ProjectItem = ProjectsMessages['items'][number];
type MapUi = ProjectsMessages['map'];

const STATUSES: readonly DeploymentStatus[] = [
  'active',
  'maintained',
  'decommissioned',
];

function toStatus(value: string): DeploymentStatus {
  return (STATUSES as readonly string[]).includes(value)
    ? (value as DeploymentStatus)
    : 'active';
}

function StatusBadge({
  status,
  label,
}: {
  status: DeploymentStatus;
  label: string;
}) {
  return (
    <span className={`sm-status sm-status--${status}`}>
      <span aria-hidden className="sm-status__dot" />
      {label}
    </span>
  );
}

function ProjectCard({
  item,
  ui,
  ctaLabel,
  onOpen,
}: {
  item: ProjectItem;
  ui: MapUi;
  ctaLabel: string;
  onOpen: (item: ProjectItem) => void;
}) {
  const status = toStatus(item.status);
  const imageSrc = IMAGE_MAP[item.image];
  return (
    <button
      type="button"
      className="sm-card"
      onClick={() => onOpen(item)}
      aria-haspopup="dialog"
    >
      {imageSrc && (
        <div aria-hidden className="sm-card__bg">
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      )}
      <div className="sm-card__top">
        <h3 className="sm-card__title">{item.title}</h3>
        <StatusBadge status={status} label={ui.status[status]} />
      </div>
      <p className="sm-card__meta">
        {item.sector} · {item.period}
      </p>
      <p className="sm-card__description">{item.abstract}</p>
      <div className="sm-card__tags">
        {item.tags.map((tech) => (
          <span key={tech} className="sm-tag">
            {tech}
          </span>
        ))}
      </div>
      <span className="sm-card__cta">
        {ctaLabel}
        <ArrowUpRight size={14} strokeWidth={1.75} />
      </span>
    </button>
  );
}

function ProjectSpecDialog({
  item,
  ui,
  onClose,
}: {
  item: ProjectItem;
  ui: MapUi;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const status = toStatus(item.status);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const dialog = (
    <div
      className="sm-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sm-dialog-title"
        tabIndex={-1}
        className="sm-dialog"
      >
        <header className="sm-dialog__header">
          <div>
            <h2 id="sm-dialog-title" className="sm-dialog__title">
              {item.title}
            </h2>
            <div className="sm-dialog__meta">
              <StatusBadge status={status} label={ui.status[status]} />
              <span className="sm-dialog__sector">
                {item.sector} · {item.period}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="sm-dialog__close"
            onClick={onClose}
            aria-label={ui.close}
          >
            <X size={16} strokeWidth={1.75} />
          </button>
        </header>

        <div className="sm-dialog__columns">
          <section className="sm-panel">
            <h3 className="sm-panel__title">{ui.businessTitle}</h3>
            <p className="sm-panel__audience">{ui.businessAudience}</p>
            <p className="sm-panel__summary">{item.business.summary}</p>

            <dl className="sm-metrics">
              {item.business.metrics.map((metric) => (
                <div key={metric.label} className="sm-metric">
                  <dd className="sm-metric__value">{metric.value}</dd>
                  <dt className="sm-metric__label">{metric.label}</dt>
                </div>
              ))}
            </dl>

            <ul className="sm-points">
              {item.business.outcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
          </section>

          <section className="sm-panel sm-panel--alt">
            <h3 className="sm-panel__title">{ui.engineeringTitle}</h3>
            <p className="sm-panel__audience">{ui.engineeringAudience}</p>
            <p className="sm-panel__summary">{item.engineering.summary}</p>

            <div className="sm-panel__tags">
              {item.tags.map((tech) => (
                <span key={tech} className="sm-tag">
                  {tech}
                </span>
              ))}
            </div>

            <ul className="sm-points">
              {item.engineering.decisions.map((decision) => (
                <li key={decision}>{decision}</li>
              ))}
            </ul>
          </section>
        </div>

        {(item.liveUrl || item.githubUrl) && (
          <footer className="sm-dialog__footer">
            {item.liveUrl && (
              <a
                href={item.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sm-dialog__link sm-dialog__link--primary"
              >
                {ui.liveLink}
                <ArrowUpRight size={14} strokeWidth={1.75} />
              </a>
            )}
            {item.githubUrl && (
              <a
                href={item.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="sm-dialog__link"
              >
                <Github size={14} strokeWidth={1.75} />
                {ui.sourceLink}
              </a>
            )}
          </footer>
        )}
      </div>
    </div>
  );

  return createPortal(dialog, document.body);
}

export function StrategyMap() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const { locale } = useLocale();

  const projects = useMemo(() => getMessages(locale).projects, [locale]);
  const { items, map: ui } = projects;

  const [selected, setSelected] = useState<ProjectItem | null>(null);

  const openProject = useCallback((item: ProjectItem) => {
    try {
      sendEvent('project_open', { project: item.title });
    } catch {
      /* analytics must never break the UI */
    }
    setSelected(item);
  }, []);

  const closeProject = useCallback(() => setSelected(null), []);

  return (
    <section id="projects" ref={ref} className="section section--tight">
      <div className="container">
        <motion.div
          className="sm-header"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <span className="sm-header__badge">{projects.badge}</span>
          <h2 className="sm-header__title">{projects.title}</h2>
          <p className="sm-header__subtitle">{projects.subtitle}</p>
          <span className="projects__annotation">{projects.annotation}</span>
        </motion.div>

        <div className="sm-grid">
          {items.map((item, index) => (
            <motion.div
              key={item.code}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: 0.1 + index * 0.08,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            >
              <ProjectCard
                item={item}
                ui={ui}
                ctaLabel={projects.viewProject}
                onOpen={openProject}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {selected && (
        <ProjectSpecDialog item={selected} ui={ui} onClose={closeProject} />
      )}
    </section>
  );
}
