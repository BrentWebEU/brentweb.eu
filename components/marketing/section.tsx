import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Shared primitives for the commercial landing page.
 *
 * These exist so the section rhythm is declared once instead of being retyped
 * as a utility string in nine files — the same job styles/layout.css used to
 * do for `.container` / `.section` before Tailwind replaced it.
 *
 * Everything here is a server component: the landing sections are static, so
 * they should ship no JavaScript at all.
 */

/** Page gutter. Narrower than the old 1280px `.container` — long measures read
 *  poorly, and the editorial layout wants the margin. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn('mx-auto w-full max-w-6xl px-6 lg:px-8', className)}>{children}</div>;
}

export function Section({
  id,
  className,
  bordered = true,
  children,
}: {
  id?: string;
  className?: string;
  bordered?: boolean;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        'py-24 md:py-32',
        // A hairline instead of alternating background blocks: the page reads
        // as one continuous document rather than a stack of cards.
        bordered && 'border-t border-border',
        className,
      )}
    >
      {children}
    </section>
  );
}

/** Small mono label above a heading. */
export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'block font-mono text-xs uppercase tracking-[0.18em] text-primary',
        className,
      )}
    >
      {children}
    </span>
  );
}

export function SectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        'font-display text-3xl leading-[1.08] font-bold tracking-tight text-foreground md:text-4xl lg:text-[2.75rem]',
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function Lede({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('max-w-[58ch] text-base leading-relaxed text-muted-foreground md:text-lg', className)}>
      {children}
    </p>
  );
}
