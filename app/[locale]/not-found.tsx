import Link from 'next/link';
import { getMessages, defaultLocale } from '@/i18n';
import { routes } from '@/lib/routes';
import { buttonVariants } from '@/components/ui/button-variants';

/**
 * Scoped 404. Next.js does not pass route params to not-found.tsx, so this
 * renders in the default locale — the localized copy lives one level up in
 * the layout, which still wraps this page with the correct <html lang>.
 */
export default function LocaleNotFound() {
  const messages = getMessages(defaultLocale);

  return (
    <main id="main" className="py-20 mx-auto w-full max-w-7xl px-6 route-error">
      <p className="route-error__code">404</p>
      <h1>{messages.errors.notFoundTitle}</h1>
      <p>{messages.errors.notFoundDescription}</p>
      <Link className={buttonVariants()} href={routes.home(defaultLocale)}>
        {messages.errors.backHome}
      </Link>
    </main>
  );
}
