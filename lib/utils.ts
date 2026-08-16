import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * twMerge is not optional now that components emit Tailwind utilities.
 *
 * Under plain clsx, `cn('px-4', 'px-8')` keeps both classes and the winner is
 * decided by stylesheet order rather than argument order — which silently
 * breaks `className` props as an override mechanism. twMerge resolves the
 * conflict by last-wins, which is what every call site already assumes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
