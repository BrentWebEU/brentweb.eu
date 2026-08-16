import { getMessages, type Locale } from '@/i18n';
import { routes } from '@/lib/routes';
import { Container, Section } from './section';

/**
 * Conversion band. `closing` hands off directly into the contact form below
 * it; `mid` remains available for a peak-intent placement, though the landing
 * page no longer uses it — PricingBands now carries that job, and two CTA
 * bands on one page made the funnel read as nagging.
 */
const HREFS: Record<
  'mid' | 'closing' | 'tech',
  (l: Locale) => { primary: string; secondary: string }
> = {
  mid: (l) => ({ primary: routes.pricing(l), secondary: routes.work(l, 'business') }),
  closing: () => ({ primary: '#contact', secondary: 'mailto:brent@brentweb.eu' }),
  // The engineering path has no estimator to send people to; its conversion
  // is "go read the architecture", so the primary CTA is the case-study index.
  tech: (l) => ({ primary: routes.work(l, 'tech'), secondary: 'mailto:brent@brentweb.eu' }),
};

export function CtaBand({
  locale,
  variant,
}: {
  locale: Locale;
  variant: 'mid' | 'closing' | 'tech';
}) {
  const { cta } = getMessages(locale);
  const copy = cta[variant];

  const { primary: primaryHref, secondary: secondaryHref } = HREFS[variant](locale);

  return (
    <Section>
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <span className="block font-mono text-xs uppercase tracking-[0.18em] text-primary">
            {copy.eyebrow}
          </span>

          <h2 className="mt-5 font-display text-3xl leading-[1.1] font-bold tracking-tight text-foreground md:text-4xl">
            {copy.title}
          </h2>

          <p className="mx-auto mt-5 max-w-[52ch] leading-relaxed text-muted-foreground">
            {copy.body}
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <a
              href={primaryHref}
              className="group inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3.5
                         text-sm font-medium text-primary-foreground no-underline
                         transition-colors duration-300 ease-out hover:bg-primary/90
                         focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
            >
              {copy.primary}
              <span
                aria-hidden
                className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
              >
                &rarr;
              </span>
            </a>

            <a
              href={secondaryHref}
              className="inline-flex items-center rounded-sm border border-border px-6 py-3.5
                         text-sm font-medium text-foreground no-underline
                         transition-colors duration-300 ease-out hover:border-primary/50 hover:bg-primary/[0.03]
                         focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
            >
              {copy.secondary}
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}
