'use client';

import { useEffect } from 'react';
import { BRAND_COLORS } from '@/lib/brand-tokens';

/**
 * Console greeting for the engineering path. Mounted from the tech layout
 * only — the business path and gateway ship a clean console.
 */
export default function DevToolsEasterEgg() {
  useEffect(() => {
    const ascii = `
  ██████╗ ██████╗ ███████╗███╗   ██╗████████╗
  ██╔══██╗██╔══██╗██╔════╝████╗  ██║╚══██╔══╝
  ██████╔╝██████╔╝█████╗  ██╔██╗ ██║   ██║
  ██╔══██╗██╔══██╗██╔══╝  ██║╚██╗██║   ██║
  ██████╔╝██║  ██║███████╗██║ ╚████║   ██║
  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝  `;

    const mono = "font-family: 'JetBrains Mono', monospace;";

    console.log(
      `%c${ascii}`,
      `color: ${BRAND_COLORS.primary}; ${mono} font-size: 10px; line-height: 1.4; font-weight: bold;`
    );

    console.log(
      '%c  Reading the source? The interactive demos at /tech/lab are the same\n  code, unminified: rate limiting, auth flows and state machines.',
      `color: ${BRAND_COLORS.mutedForeground}; ${mono} font-size: 12px; line-height: 1.6;`
    );

    console.log(
      '%c  Brent Schoenmakers  |  brentweb.be',
      `color: ${BRAND_COLORS.mutedForeground}; ${mono} font-size: 11px; font-style: italic;`
    );
  }, []);

  return null;
}
