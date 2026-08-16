import { getMessages, type Locale } from '@/i18n';
import { Container, Section, Eyebrow, SectionTitle, Lede } from './section';

const ITEM_KEYS = ['1', '2', '3', '4', '5'] as const;

/**
 * Objection handling. Ownership, breakage, price and response time are the
 * four things that stop a small business from replying, and none of them were
 * answered anywhere on the site before.
 *
 * Built on native <details>/<summary> rather than @radix-ui/react-accordion:
 * the disclosure pattern, keyboard handling and screen-reader semantics are
 * free, it works with JavaScript disabled, and it keeps this a server
 * component that ships no JS at all.
 *
 * Also emits FAQPage structured data — these answers are exactly what Google
 * surfaces for "do I own the code" style queries.
 */
export function FaqSection({ locale }: { locale: Locale }) {
  const { faq } = getMessages(locale);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: ITEM_KEYS.map((key) => ({
      '@type': 'Question',
      name: faq.items[key].q,
      acceptedAnswer: { '@type': 'Answer', text: faq.items[key].a },
    })),
  };

  return (
    <Section id="faq">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <header className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Eyebrow>{faq.badge}</Eyebrow>
              <SectionTitle className="mt-5">{faq.title}</SectionTitle>
              <Lede className="mt-5">{faq.subtitle}</Lede>
            </div>
          </header>

          <div className="lg:col-span-7 lg:col-start-6">
            {ITEM_KEYS.map((key) => {
              const item = faq.items[key];

              return (
                <details
                  key={key}
                  name="faq"
                  className="group border-t border-border first:border-t-0"
                >
                  <summary
                    className="flex cursor-pointer list-none items-start justify-between gap-6 py-6
                               font-display text-lg font-medium tracking-tight text-foreground
                               transition-colors duration-200 ease-out marker:hidden
                               hover:text-primary focus-visible:outline-2 focus-visible:outline-primary
                               focus-visible:outline-offset-2 md:text-xl
                               [&::-webkit-details-marker]:hidden"
                  >
                    {item.q}
                    {/* Rotating plus → minus. transform only, so it stays on
                        the compositor. */}
                    <span
                      aria-hidden
                      className="relative mt-2 h-3 w-3 shrink-0 text-primary"
                    >
                      <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-current" />
                      <span
                        className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 rotate-90 bg-current
                                   transition-transform duration-300 ease-out group-open:rotate-0"
                      />
                    </span>
                  </summary>

                  <p className="max-w-[62ch] pb-7 leading-relaxed text-muted-foreground">
                    {item.a}
                  </p>
                </details>
              );
            })}
          </div>
        </div>
      </Container>
    </Section>
  );
}
