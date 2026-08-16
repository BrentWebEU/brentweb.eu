import { getMessages, type Locale } from '@/i18n';
import { Container, Section, Eyebrow, SectionTitle, Lede } from '@/components/marketing/section';

/**
 * Fixed cardinality, addressed by numbered keys rather than a JSON array:
 * scripts/check-messages.mjs skips array contents, so a step added to one
 * locale only would ship a shorter diagram to the other without failing
 * the build.
 */
const STEP_KEYS = ['1', '2', '3', '4', '5'] as const;
const GUARANTEE_KEYS = ['1', '2', '3', '4'] as const;

/**
 * De-risking block: how an engagement runs, and what is committed to.
 *
 * The five steps sit in five columns because they are a sequence, not a
 * feature row — the reading order left-to-right is the point, and the rule
 * above each one behaves like a progress track. The four guarantees below
 * use an accent border instead, so the two halves of the section do not read
 * as the same component twice.
 */
export function ProcessSection({ locale }: { locale: Locale }) {
  const { process } = getMessages(locale);

  return (
    <Section id="process">
      <Container>
        <header className="max-w-3xl">
          <Eyebrow>{process.badge}</Eyebrow>
          <SectionTitle className="mt-5">{process.title}</SectionTitle>
          <Lede className="mt-5">{process.subtitle}</Lede>
        </header>

        <ol className="mt-14 grid gap-10 sm:grid-cols-2 md:mt-16 lg:grid-cols-5 lg:gap-6">
          {STEP_KEYS.map((key) => (
            <li key={key} className="border-t-2 border-border pt-5">
              <span
                aria-hidden
                className="font-mono text-sm tabular-nums text-primary"
              >
                {key.padStart(2, '0')}
              </span>
              <h3 className="mt-3 font-display text-lg font-semibold tracking-tight text-foreground">
                {process.steps[key].title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {process.steps[key].body}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-20">
          <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
            {process.guaranteesTitle}
          </h3>

          <div className="mt-8 grid gap-x-12 gap-y-10 md:grid-cols-2">
            {GUARANTEE_KEYS.map((key) => (
              <div key={key} className="border-l-2 border-primary pl-6">
                <h4 className="font-display text-lg font-semibold tracking-tight text-foreground">
                  {process.guarantees[key].title}
                </h4>
                <p className="mt-2 max-w-[52ch] leading-relaxed text-muted-foreground">
                  {process.guarantees[key].body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </Section>
  );
}
