'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { Logo } from './Logo';

/**
 * First-paint overlay that draws the wordmark, then lifts out of the way.
 *
 * Deliberately CSS-only for the motion itself (styles/components/preloader.css)
 * — the animation has to be running before React hydrates, which rules out
 * driving it from framer-motion or from state.
 *
 * React's only jobs here are unmounting the overlay when the exit animation
 * ends, and locking scroll while it covers the page.
 */

/** Once per tab. A preloader on every navigation is an obstacle, not a brand. */
const SESSION_KEY = 'bw:preloaded';

/**
 * Unmount backstop. Nothing should reach it — the exit fires `animationend` —
 * but if animations are suppressed at the OS or browser level in a way that
 * skips the event, this stops the overlay from becoming a permanent white
 * screen over the site.
 */
const MAX_DURATION_MS = 3000;

/** sessionStorage throws outright in some privacy modes; never fatal here. */
function readPlayed() {
  try {
    return sessionStorage.getItem(SESSION_KEY) !== null;
  } catch {
    return false;
  }
}

function markPlayed() {
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* ignore */
  }
}

/**
 * Runs during HTML parsing, before the overlay below is even parsed. Without
 * it, a repeat visit in the same tab would paint the overlay and only drop it
 * once hydration reaches the effect — a visible flash on exactly the visits
 * that are supposed to skip the animation.
 */
const NO_FLASH_SCRIPT = `try{if(sessionStorage.getItem('${SESSION_KEY}'))document.documentElement.dataset.preloaded='1'}catch(e){}`;

/**
 * Read once at module scope — deliberately not inside the effect. Under
 * StrictMode the mount effect runs twice, and the first pass has already
 * written the key, so a read from inside it would report "played" on the
 * second pass and skip the animation in development only.
 */
const ALREADY_PLAYED = typeof window !== 'undefined' && readPlayed();

/* useSyncExternalStore plumbing for a value that never changes after load: it
 * is the one hook that can return a different result on the server (always
 * "not played", so the overlay is in the HTML) and on the client (the real
 * sessionStorage answer) without a hydration mismatch. Reading it into state
 * from an effect would work too, but only by way of a cascading render. */
const NEVER_CHANGES = () => () => {};
const readClient = () => ALREADY_PLAYED;
const readServer = () => false;

export function Preloader() {
  const played = useSyncExternalStore(NEVER_CHANGES, readClient, readServer);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    if (played) return;

    markPlayed();
    document.documentElement.classList.add('preloader-active');
    const timer = window.setTimeout(() => setFinished(true), MAX_DURATION_MS);

    return () => {
      window.clearTimeout(timer);
      document.documentElement.classList.remove('preloader-active');
    };
  }, [played]);

  /* The component renders null rather than unmounting when it finishes, so the
   * effect above never gets to clean up on its own — without this the page
   * would stay scroll-locked for the rest of the visit. */
  useEffect(() => {
    if (finished) document.documentElement.classList.remove('preloader-active');
  }, [finished]);

  /* Only the overlay's own exit animation counts — the glyph and progress
   * animations bubble their events up through the same element. */
  const handleAnimationEnd = useCallback((event: React.AnimationEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) setFinished(true);
  }, []);

  if (played || finished) return null;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
      <div className="preloader" aria-hidden="true" onAnimationEnd={handleAnimationEnd}>
        <div className="preloader__inner">
          <Logo className="preloader__mark" />
          <span className="preloader__bar" />
        </div>
      </div>
    </>
  );
}
