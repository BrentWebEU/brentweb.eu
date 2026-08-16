'use client';

import { useEffect } from 'react';
import { useLocaleContext } from '@/components/LocaleProvider';
import { buttonVariants } from '@/components/ui/button-variants';

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { messages } = useLocaleContext();

  useEffect(() => {
    // Next redacts server error messages in production; the digest is what
    // correlates a client-side report back to the server log.
    console.error('Route segment error', error.digest ?? error.message);
  }, [error]);

  return (
    <main id="main" className="py-20 mx-auto w-full max-w-7xl px-6 route-error">
      <h1>{messages.errors.title}</h1>
      <p>{messages.errors.description}</p>
      <button type="button" className={buttonVariants()} onClick={reset}>
        {messages.errors.retry}
      </button>
    </main>
  );
}
