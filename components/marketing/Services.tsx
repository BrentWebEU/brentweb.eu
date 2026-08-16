import { getMessages, type Locale } from '@/i18n';
import { routes } from '@/lib/routes';
import { Container, Section, Eyebrow, SectionTitle } from './section';

/**
 * The five service keys, ordered. Named explicitly rather than derived from
 * Object.keys so the running order is a decision in code, not an accident of
 * JSON authoring — and so a renamed key fails the build.
 */
const SERVICE_KEYS = [
  'webDevelopment',
  'fullStackApps',
  'deployment',
  'database',
  'architecture',
] as const;

/**
 * Replaces the old icon-card grid.
 *
 * Two things changed. The stats strip ("15+ Technologies Used") moved out
 * entirely — it was a vanity metric competing with ProofSection, which makes
 * the same argument with real client systems. And the three-across card row
 * became a rules-and-alignment list: five items never divide into three
 * columns cleanly, and the cards were adding a border around content that did
 * not need containing.
 */
export function Services({ locale }: { locale: Locale }) {
  const { services, pricing } = getMessages(locale);

  return (
    <Section id="services">
      <Container>
        <header className="max-w-3xl">
          <Eyebrow>{services.badge}</Eyebrow>
          <SectionTitle className="mt-5">{services.title}</SectionTitle>
        </header>

        <ol className="mt-14 md:mt-16">
          {SERVICE_KEYS.map((key, i) => {
            const item = services.items[key];

            return (
              <li
                key={key}
                className="group grid grid-cols-1 gap-x-8 gap-y-3 border-t border-border py-8
                           md:grid-cols-12 md:py-10"
              >
                <span
                  aria-hidden
                  className="font-mono text-sm tabular-nums text-muted-foreground/60 md:col-span-1"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>

                <h3
                  className="font-display text-xl font-semibold tracking-tight text-foreground
                             transition-colors duration-300 ease-out group-hover:text-primary
                             md:col-span-5 md:text-2xl"
                >
                  {item.title}
                </h3>

                <p className="max-w-[52ch] leading-relaxed text-muted-foreground md:col-span-6">
                  {item.description}
                </p>
              </li>
            );
          })}
        </ol>

        <div className="border-t border-border pt-10">
          <a
            href={routes.pricing(locale)}
            className="group inline-flex items-center gap-2 text-sm font-medium text-foreground
                       no-underline transition-colors duration-300 ease-out hover:text-primary
                       focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
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
