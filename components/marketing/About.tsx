import Image from 'next/image';
import { getMessages, type Locale } from '@/i18n';
import { Container, Section, Eyebrow, SectionTitle } from './section';

/**
 * Shortened from the shared AboutSection, which stays on the engineering path.
 *
 * Three things were cut rather than restyled:
 *  · the time-of-day greeting ("Good afternoon, I'm Brent") — a portfolio
 *    flourish that undercuts the page it now sits on;
 *  · the 18 hardcoded technology tags — a buyer cannot evaluate "NestJS", and
 *    the engineering path already lists them for the audience that can;
 *  · the "student-zelfstandige" opening. That framing survives where it earns
 *    its place — explaining the honest 1–2 day reply time in ProcessSection —
 *    rather than leading the pitch with an apology.
 */
export function About({ locale }: { locale: Locale }) {
  const { about, hero } = getMessages(locale);
  const yearsBuilding = new Date().getFullYear() - 2019;

  return (
    <Section id="about">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <figure className="lg:col-span-5">
            <div className="relative overflow-hidden rounded-lg border border-border bg-muted">
              <Image
                src="/brent-profile.webp"
                alt="Brent Schoenmakers"
                width={720}
                height={900}
                sizes="(min-width: 1024px) 24rem, 100vw"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>

            <figcaption
              className="mt-4 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground"
            >
              {yearsBuilding}+ {about.yearsBuilding}, {hero.location}
            </figcaption>
          </figure>

          <div className="lg:col-span-6 lg:col-start-7 lg:pt-4">
            <Eyebrow>{about.badge}</Eyebrow>
            <SectionTitle className="mt-5">{about.business.title}</SectionTitle>

            <div className="mt-7 space-y-5">
              <p className="max-w-[56ch] text-lg leading-relaxed text-muted-foreground">
                {about.business.description1}
              </p>
              <p className="max-w-[56ch] leading-relaxed text-muted-foreground">
                {about.business.description2}
              </p>
            </div>

            <a
              href="mailto:brent@brentweb.eu"
              className="group mt-9 inline-flex items-center gap-2 border-b border-primary/40 pb-1
                         text-sm font-medium text-foreground no-underline
                         transition-colors duration-300 ease-out hover:border-primary hover:text-primary
                         focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
            >
              brent@brentweb.eu
              <span
                aria-hidden
                className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
              >
                &rarr;
              </span>
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}
