'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { ArrowUpRight, Github, X } from 'lucide-react';
import { useLocale } from '@/hooks/useTranslations';
import { getMessages, type Locale } from '@/i18n';
import { sendEvent } from '@/lib/analytics';
import { routes } from '@/lib/routes';

/**
 * Successor to StrategyMap, which the business landing no longer uses.
 *
 * That component rendered a two-column dialog — "Business impact" for managers
 * and recruiters on the left, "Engineering" for tech leads on the right — so a
 * single component could serve both paths. With the paths split, half of it was
 * addressing an audience that is no longer here. This is engineering-first: the
 * architecture summary and decisions lead, impact metrics support them.
 *
 * The dialog behaviour is deliberately preserved and one gap is closed: the
 * original restored focus on close but never trapped Tab, so keyboard users
 * could tab out of an open modal into the page behind it.
 */

const IMAGE_MAP: Record<string, string> = {
  carrosserieKris: '/images/ckris-small.png',
  provilion: '/provilion.png',
  hetsmaakpand: '/hetsmaakpand.png',
  idps: '/images/idps.png',
};

type DeploymentStatus = 'active' | 'maintained' | 'decommissioned' | 'finished';
type ProjectsMessages = ReturnType<typeof getMessages>['projects'];
type ProjectItem = ProjectsMessages['items'][number];
type MapUi = ProjectsMessages['map'];

const STATUSES: readonly DeploymentStatus[] = ['active', 'maintained', 'decommissioned', 'finished'];
const toStatus = (v: string): DeploymentStatus =>
  (STATUSES as readonly string[]).includes(v) ? (v as DeploymentStatus) : 'active';

const STATUS_DOT: Record<DeploymentStatus, string> = {
  active: 'bg-success',
  maintained: 'bg-warning',
  decommissioned: 'bg-muted-foreground',
  finished: 'bg-primary',
};

function StatusBadge({ status, label }: { status: DeploymentStatus; label: string }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status]}`} />
      {label}
    </span>
  );
}

function SystemCard({
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
      onClick={() => onOpen(item)}
      aria-haspopup="dialog"
      className="group relative flex h-full w-full flex-col overflow-hidden bg-background p-6 text-left
                 transition-colors duration-300 ease-out hover:bg-muted/40
                 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary md:p-8"
    >
      {imageSrc && (
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] transition-opacity duration-500 ease-out group-hover:opacity-[0.11]">
          <Image src={imageSrc} alt="" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
        </div>
      )}

      <div className="relative flex items-start justify-between gap-4">
        <h3 className="font-display text-lg font-semibold tracking-tight text-foreground md:text-xl">
          {item.title}
        </h3>
        <StatusBadge status={status} label={ui.status[status]} />
      </div>

      <p className="relative mt-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
        {item.sector}, {item.period}
      </p>

      <p className="relative mt-5 grow leading-relaxed text-muted-foreground">{item.abstract}</p>

      <ul className="relative mt-6 flex flex-wrap gap-2">
        {item.tags.map((tech) => (
          <li
            key={tech}
            className="border border-border px-2 py-1 font-mono text-[0.7rem] text-muted-foreground"
          >
            {tech}
          </li>
        ))}
      </ul>

      <span className="relative mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors duration-300 ease-out group-hover:text-primary">
        {ctaLabel}
        <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden />
      </span>
    </button>
  );
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function SystemDialog({
  item,
  ui,
  locale,
  onClose,
}: {
  item: ProjectItem;
  ui: MapUi;
  locale: Locale;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const status = toStatus(item.status);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const node = dialogRef.current;
    node?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }
      // Real focus trap. The previous implementation only restored focus on
      // close, which let Tab walk out of the modal into the inert page.
      if (event.key !== 'Tab' || !node) return;
      const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
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

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 p-4 backdrop-blur-sm md:p-8"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="system-dialog-title"
        tabIndex={-1}
        className="my-auto w-full max-w-3xl border border-border bg-card shadow-dialog outline-none"
      >
        <header className="flex items-start justify-between gap-6 border-b border-border p-6 md:p-8">
          <div>
            <h2
              id="system-dialog-title"
              className="font-display text-2xl font-bold tracking-tight text-foreground"
            >
              {item.title}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <StatusBadge status={status} label={ui.status[status]} />
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
                {item.sector}, {item.period}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={ui.close}
            className="shrink-0 border border-border p-2 text-muted-foreground transition-colors duration-200 ease-out
                       hover:border-primary/50 hover:text-foreground
                       focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          >
            <X size={16} strokeWidth={1.75} aria-hidden />
          </button>
        </header>

        <div className="space-y-8 p-6 md:p-8">
          <p className="leading-relaxed text-foreground">{item.engineering.summary}</p>

          <section>
            <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
              {ui.stackTitle}
            </h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {item.tags.map((tech) => (
                <li
                  key={tech}
                  className="border border-border px-2 py-1 font-mono text-[0.7rem] text-muted-foreground"
                >
                  {tech}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
              {ui.decisionsTitle}
            </h3>
            <ul className="mt-3 space-y-2.5">
              {item.engineering.decisions.map((decision) => (
                <li
                  key={decision}
                  className="border-l-2 border-primary pl-4 leading-relaxed text-muted-foreground"
                >
                  {decision}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
              {ui.impactTitle}
            </h3>
            <dl className="mt-3 grid grid-cols-3 gap-4 border-y border-border py-4">
              {item.business.metrics.map((metric) => (
                <div key={metric.label}>
                  <dd className="font-display text-lg font-semibold tabular-nums text-primary">
                    {metric.value}
                  </dd>
                  <dt className="mt-1 text-xs leading-snug text-muted-foreground">{metric.label}</dt>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <footer className="flex flex-wrap gap-x-6 gap-y-3 border-t border-border p-6 md:p-8">
          <a
            href={routes.caseStudy(locale, 'tech', item.slug)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-primary no-underline hover:underline"
          >
            {ui.readCaseStudy}
            <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden />
          </a>
          {item.liveUrl && (
            <a
              href={item.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline hover:text-foreground"
            >
              {ui.liveLink}
              <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden />
            </a>
          )}
          {item.githubUrl && (
            <a
              href={item.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline hover:text-foreground"
            >
              <Github size={14} strokeWidth={1.75} aria-hidden />
              {ui.sourceLink}
            </a>
          )}
        </footer>
      </div>
    </div>,
    document.body,
  );
}

export function SystemsGrid() {
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
    <section id="projects" className="border-t border-border py-24 md:py-32">
      <div className="mx-auto w-full max-w-6xl px-6 lg:px-8">
        <header className="max-w-3xl">
          <span className="block font-mono text-xs uppercase tracking-[0.18em] text-primary">
            {projects.badge}
          </span>
          <h2 className="mt-5 font-display text-3xl leading-[1.08] font-bold tracking-tight text-foreground md:text-4xl lg:text-[2.75rem]">
            {projects.title}
          </h2>
          <p className="mt-5 max-w-[58ch] text-base leading-relaxed text-muted-foreground md:text-lg">
            {projects.subtitle}
          </p>
        </header>

        <div className="mt-14 grid gap-px overflow-hidden rounded-lg bg-border md:mt-16 md:grid-cols-2">
          {items.map((item) => (
            <SystemCard
              key={item.slug}
              item={item}
              ui={ui}
              ctaLabel={projects.viewProject}
              onOpen={openProject}
            />
          ))}
        </div>
      </div>

      {selected && (
        <SystemDialog item={selected} ui={ui} locale={locale} onClose={closeProject} />
      )}
    </section>
  );
}
