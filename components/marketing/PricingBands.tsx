import { getMessages, type Locale } from '@/i18n';
import { routes } from '@/lib/routes';
import { SCOPE_KEYS } from '@/lib/schemas/lead';
import { SCOPE_DEFINITIONS } from '@/lib/calculator/pricing';
import { Container, Section, Eyebrow, SectionTitle, Lede } from './section';

/**
 * Public prices, on the homepage rather than three clicks deep behind a
 * "What it costs" link.
 *
 * The figures are read straight out of SCOPE_DEFINITIONS — the same rule table
 * the estimator and the server-side lead recalculation use — so this section
 * cannot quote a number the calculator would contradict. Copying them into the
 * message bundles would have guaranteed exactly that drift.
 *
 * Labels, descriptions and the per-item "what's included" bullets all come
 * from calculator.scope.options.*, so only the numbers live in code. The
 * bullets are not rendered here on purpose: four rows x three bullets makes
 * the table too heavy to scan, and the estimator shows them anyway.
 */
export function PricingBands({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const { pricing, calculator } = messages;

  const money = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  });

  return (
    <Section id="pricing">
      <Container>
        <header className="max-w-3xl">
          <Eyebrow>{pricing.badge}</Eyebrow>
          <SectionTitle className="mt-5">{pricing.title}</SectionTitle>
          <Lede className="mt-5">{pricing.subtitle}</Lede>
        </header>

        {/* A price list, not a pricing-card row. Rules and alignment do the
            work so nothing looks like a "recommended plan". */}
        <dl className="mt-14 md:mt-16">
          {SCOPE_KEYS.map((key) => {
            const def = SCOPE_DEFINITIONS[key];
            const option = calculator.scope.options[key];

            return (
              <div
                key={key}
                className="grid grid-cols-1 gap-x-8 gap-y-4 border-t border-border py-8
                           md:grid-cols-12 md:items-baseline md:py-9"
              >
                <div className="md:col-span-5">
                  <dt className="font-display text-xl font-semibold tracking-tight text-foreground">
                    {option.label}
                  </dt>
                  <dd className="mt-2 max-w-[42ch] text-sm leading-relaxed text-muted-foreground">
                    {option.description}
                  </dd>
                </div>

                <dd className="md:col-span-4">
                  <span className="block font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                    {pricing.rangeLabel}
                  </span>
                  <span className="mt-1.5 block font-display text-2xl font-semibold tabular-nums tracking-tight text-foreground">
                    {money.format(def.minCost)} - {money.format(def.maxCost)}
                  </span>
                </dd>

                <dd className="md:col-span-3">
                  <span className="block font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                    {pricing.durationLabel}
                  </span>
                  <span className="mt-1.5 block text-lg tabular-nums text-foreground">
                    {pricing.weeks
                      .replace('{min}', String(def.minWeeks))
                      .replace('{max}', String(def.maxWeeks))}
                  </span>
                </dd>
              </div>
            );
          })}
        </dl>

        <p className="mt-8 max-w-[62ch] border-t border-border pt-8 text-sm leading-relaxed text-muted-foreground">
          {pricing.note}
        </p>

        {/* Hand-off into the estimator for anyone who cannot place themselves
            in a single row above. */}
        <div className="mt-12 flex flex-col gap-6 rounded-lg bg-muted/50 p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <h3 className="font-display text-xl font-semibold tracking-tight text-foreground">
              {pricing.ctaTitle}
            </h3>
            <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-muted-foreground">
              {pricing.ctaBody}
            </p>
          </div>

          <a
            href={routes.pricing(locale)}
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-sm bg-primary
                       px-6 py-3 text-sm font-medium text-primary-foreground no-underline
                       transition-colors duration-300 ease-out hover:bg-primary/90
                       focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2
                       md:self-auto"
          >
            {pricing.cta}
            <span
              aria-hidden
              className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
            >
              &rarr;
            </span>
          </a>
        </div>
      </Container>
    </Section>
  );
}
