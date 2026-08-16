import { cva } from 'class-variance-authority';

/**
 * Split out of button.tsx, which carries 'use client'.
 *
 * Server components (the 404 page, and anything rendering a link that should
 * look like a button) need these classes too, and a value exported from a
 * client module cannot be called on the server — Next fails the prerender with
 * "Attempted to call buttonVariants() from the server". The variants
 * themselves have no client-only concerns, so they live here and button.tsx
 * re-exports them for existing call sites.
 */
/**
 * Migrated from styles/components/button.css, which has been deleted.
 *
 * Every value below is a 1:1 translation of that file — 2.5rem→h-10,
 * 2.25rem→h-9, 2.75rem→h-11, `0.5rem 2rem`→px-8 py-2, --radius-sm→rounded-sm,
 * --duration-normal→duration-300, --ease-out→ease-out (the project curve,
 * remapped in styles/index.css).
 *
 * Two things this fixes rather than preserves:
 *   · `secondary` and `destructive` referenced --color-secondary,
 *     --color-secondary-foreground and --color-destructive-foreground, none of
 *     which were declared. Both variants rendered unstyled. The aliases are now
 *     backfilled in variables.css and these utilities resolve properly.
 *   · The old component built class names by string interpolation
 *     (`btn-${variant}`), which is invisible to both Tailwind's scanner and
 *     TypeScript. cva gives real types and real scanning.
 */
export const buttonVariants = cva(
  // No `border-none` / `outline-none` here, deliberately. Preflight already
  // sets `border: 0 solid`, and both utilities set the *style* sub-property,
  // which twMerge treats as a different group from the *width* set by
  // `border` / `outline-2`. Including them leaves style:none winning, so the
  // outline variant's border and every focus ring render invisible.
  'inline-flex items-center justify-center gap-2 font-sans text-sm font-medium ' +
    'no-underline rounded-sm ' +
    'transition-all duration-300 ease-out ' +
    'focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ' +
    'disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        cta: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'bg-transparent text-foreground border border-border ' +
          'hover:border-primary/50 hover:bg-primary/[0.03] hover:[&_span]:text-primary',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'bg-transparent text-foreground hover:bg-accent/50',
        link: 'bg-transparent text-primary underline hover:no-underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3 py-2',
        lg: 'h-11 px-8 py-2',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);
