import { getMessages, type Locale } from '@/i18n';
import { Container, Section, Eyebrow, SectionTitle, Lede } from './section';

/**
 * Fixed cardinality, addressed by numbered keys rather than a JSON array —
 * scripts/check-messages.mjs skips array contents, so an item added to one
 * locale only would ship a shorter section to the other without failing the
 * build. Same reasoning as ProcessSection.
 */
const ITEM_KEYS = ['1', '2', '3'] as const;

/**
 * The page's first real selling section, and the one aimed squarely at a
 * visitor with no technical vocabulary.
 *
 * Everything below this point describes what I build. A buyer who does not
 * know what "an integration" is cannot recognise themselves in that. They can
 * recognise "the same order gets typed in twice" — so the page leads with the
 * symptom and only then names the fix.
 */
export function PainPoints({ locale }: { locale: Locale }) {
  const { pain } = getMessages(locale);

  return (
    <Section id="pain">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Sticky header column — the list scrolls past a fixed premise. */}
          <header className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              <Eyebrow>{pain.badge}</Eyebrow>
              <SectionTitle className="mt-5">{pain.title}</SectionTitle>
              <Lede className="mt-5">{pain.subtitle}</Lede>
            </div>
          </header>

          <ul className="lg:col-span-7 lg:col-start-6">
            {ITEM_KEYS.map((key, i) => {
              const item = pain.items[key];

              return (
                <li
                  key={key}
                  className="border-t border-border py-8 first:border-t-0 first:pt-0 md:py-10 md:first:pt-0"
                >
                  <div className="flex gap-5 md:gap-7">
                    <span
                      aria-hidden
                      className="shrink-0 pt-1 font-mono text-sm tabular-nums text-muted-foreground/60"
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>

                    <div className="min-w-0">
                      <h3 className="font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                        {item.problem}
                      </h3>
                      <p className="mt-3 max-w-[56ch] leading-relaxed text-muted-foreground">
                        {item.body}
                      </p>

                      {/* The turn: symptom → what replaces it. Accent rule
                          carries the eye without needing a card. */}
                      <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1 border-l-2 border-primary pl-4">
                        <span className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                          {pain.fixLabel}
                        </span>
                        <span className="font-medium text-foreground">{item.fix}</span>
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Container>
    </Section>
  );
}
