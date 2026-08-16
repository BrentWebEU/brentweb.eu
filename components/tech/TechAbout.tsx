import Image from 'next/image';
import { getMessages, type Locale } from '@/i18n';
import { Container, Section, Eyebrow, SectionTitle } from '@/components/marketing/section';

/**
 * Engineering-path About. Split from the shared AboutSection so the two paths
 * can diverge where it matters.
 *
 * This one keeps what the business version dropped: the time-of-day greeting
 * (a small piece of personality that suits this audience and undercuts the
 * commercial page), the handwritten annotation, and the explicit technology
 * list — a buyer cannot evaluate "NestJS", an engineer can.
 */
function greetingKey(): 'titleMorning' | 'titleNoon' | 'titleEvening' {
  const hour = new Date().getHours();
  if (hour < 12) return 'titleMorning';
  if (hour < 18) return 'titleNoon';
  return 'titleEvening';
}

export function TechAbout({ locale }: { locale: Locale }) {
  const { about } = getMessages(locale);

  return (
    <Section id="about">
      <Container>
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <figure className="relative lg:col-span-5">
            <div className="overflow-hidden rounded-lg border border-border bg-muted">
              <Image
                src="/brent-profile.webp"
                alt="Brent Schoenmakers"
                width={720}
                height={900}
                sizes="(min-width: 1024px) 24rem, 100vw"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>
            <figcaption className="mt-4 font-handwritten text-xl text-primary">
              {about.annotation}
            </figcaption>
          </figure>

          <div className="lg:col-span-6 lg:col-start-7 lg:pt-4">
            <Eyebrow>{about.badge}</Eyebrow>
            <SectionTitle className="mt-5">{about.tech[greetingKey()]}</SectionTitle>

            <div className="mt-7 space-y-5">
              <p className="max-w-[56ch] text-lg leading-relaxed text-muted-foreground">
                {about.tech.description1}
              </p>
              <p className="max-w-[56ch] leading-relaxed text-muted-foreground">
                {about.tech.description2}
              </p>
            </div>

            <div className="mt-9 border-t border-border pt-7">
              <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                {about.techTitle}
              </h3>
              <p className="mt-3 max-w-[58ch] font-mono text-sm leading-relaxed text-muted-foreground">
                {about.techDescription}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
