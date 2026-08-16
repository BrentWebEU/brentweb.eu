import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import { fontVariables } from '@/app/fonts';
import { locales, getMessages, type Locale } from '@/i18n';
import { isLocale } from '@/lib/locale';
import { SITE_URL } from '@/lib/site';
import { buildPersonSchema } from '@/lib/schema/person';
import { LocaleProvider } from '@/components/LocaleProvider';
import { QueryClientProvider } from '@/providers/QueryProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { CookieConsent } from '@/components/CookieConsent';
import { PortfolioAnalytics } from '@/components/PortfolioAnalytics';
import { Preloader } from '@/components/Preloader';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

/** hreflang map, including the x-default crawlers expect. */
function languageAlternates(path = '') {
  return {
    ...Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])),
    'x-default': `${SITE_URL}/en${path}`,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const messages = getMessages(locale);

  return {
    title: {
      default: messages.hero.title,
      template: '%s | Brent Schoenmakers',
    },
    description: messages.hero.tagline,
    authors: [{ name: 'Brent Schoenmakers' }],
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${SITE_URL}/${locale}`,
      languages: languageAlternates(),
    },
    openGraph: {
      type: 'website',
      locale: locale === 'nl-BE' ? 'nl_BE' : 'en_US',
      url: `${SITE_URL}/${locale}`,
      title: messages.hero.title,
      description: messages.hero.tagline,
      siteName: 'brentweb',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const messages = getMessages(locale as Locale);

  return (
    <html lang={locale} className={fontVariables} suppressHydrationWarning>
      <body>
        {/* First in the body so its no-flash script runs before anything else
            paints, and so the overlay is on screen from the first frame. */}
        <Preloader />
        {/* The Person node other schemas reference by @id. Emitted here rather
            than per-page so `#person` resolves everywhere — it previously
            lived only on the gateway, which no longer exists. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildPersonSchema(locale as Locale)) }}
        />
        <a
          href="#main"
          className="absolute left-0 -top-10 z-100 bg-primary text-primary-foreground px-4 py-2 no-underline focus:top-0"
        >
          {messages.common.skipToContent}
        </a>
        <LocaleProvider locale={locale as Locale} messages={messages}>
          <QueryClientProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
              <TooltipProvider>
                <PortfolioAnalytics />
                <CookieConsent />
                {children}
                <Sonner />
              </TooltipProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
