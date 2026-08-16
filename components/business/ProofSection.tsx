import Image from 'next/image';
import { getMessages, type Locale } from '@/i18n';
import { routes } from '@/lib/routes';
import { Container, Section, Eyebrow, SectionTitle, Lede } from '@/components/marketing/section';

/**
 * `client` and `logo` are optional on project items and so cannot be inferred
 * from the bundle. `client` is set only on real, named client engagements —
 * the IDPS security project has no client and is deliberately absent from the
 * strip. `logo` lets a real logo file be added as `"logo": "/logos/acme.svg"`
 * with no component change; items without one keep the typographic wordmark.
 */
type ProjectItem = ReturnType<typeof getMessages>['projects']['items'][number] & {
  client?: string;
  logo?: string;
};

/**
 * Shape for `proof.testimonials` in messages/*.json. The array ships empty in
 * both locales — the block below renders nothing until real, attributable
 * quotes are added. Never populate this with invented copy: a fabricated
 * testimonial is a lie about a named client.
 */
interface Testimonial {
  quote: string;
  name: string;
  role: string;
  company: string;
}

/**
 * Evidence block, and the landing page's `#projects` anchor now that
 * StrategyMap has moved to the engineering path.
 *
 * Numbers come from `projects.items[].business.metrics` — the same source the
 * case-study pages render — so a figure can never say one thing here and
 * another there.
 *
 * The grid is a hairline lattice (`gap-px` over a border-coloured backdrop)
 * rather than a row of cards: it groups the four systems without drawing four
 * boxes, and it reads differently from the ruled lists above and below it.
 */
export function ProofSection({ locale }: { locale: Locale }) {
  const messages = getMessages(locale);
  const { proof } = messages;

  const projects = messages.projects.items as ProjectItem[];
  const testimonials = ((proof as { testimonials?: Testimonial[] }).testimonials ?? []) as Testimonial[];
  // Project titles are not client names — one project is internal security
  // work and another carries a "(Closed)" suffix. Only items with an explicit
  // client belong in a "selected clients" strip.
  const clients = projects.filter((project) => Boolean(project.client));

  return (
    <Section id="projects">
      <Container>
        <header className="max-w-3xl">
          <Eyebrow>{proof.badge}</Eyebrow>
          <SectionTitle className="mt-5">{proof.title}</SectionTitle>
          <Lede className="mt-5">{proof.subtitle}</Lede>
        </header>

        <div className="mt-14 grid gap-px overflow-hidden rounded-lg bg-border md:mt-16 md:grid-cols-2">
          {projects.map((project) => (
            <article
              key={project.slug}
              className="group flex flex-col bg-background p-6 md:p-10"
            >
              <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
                {project.sector}
              </p>

              <h3 className="mt-3 font-display text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                {project.title}
              </h3>

              <dl className="mt-7 grid grid-cols-3 gap-3 border-y border-border py-5 md:gap-4">
                {project.business.metrics.map((metric) => (
                  <div key={metric.label}>
                    <dd className="font-display text-lg font-semibold tabular-nums text-primary">
                      {metric.value}
                    </dd>
                    <dt className="mt-1 text-xs leading-snug text-muted-foreground">
                      {metric.label}
                    </dt>
                  </div>
                ))}
              </dl>

              {project.business.outcomes[0] && (
                <p className="mt-6 grow leading-relaxed text-muted-foreground">
                  {project.business.outcomes[0]}
                </p>
              )}

              <a
                className="mt-7 inline-flex items-center gap-2 self-start text-sm font-medium
                           text-foreground no-underline transition-colors duration-300 ease-out
                           group-hover:text-primary focus-visible:outline-2
                           focus-visible:outline-primary focus-visible:outline-offset-2"
                href={routes.caseStudy(locale, 'business', project.slug)}
              >
                {proof.readCaseStudy}
                <span
                  aria-hidden
                  className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                >
                  &rarr;
                </span>
              </a>
            </article>
          ))}
        </div>

        {testimonials.length > 0 && (
          <div className="mt-16">
            <h3 className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
              {proof.testimonialsTitle}
            </h3>
            <div className="mt-8 grid gap-10 md:grid-cols-2">
              {testimonials.map((testimonial) => (
                <figure key={testimonial.name} className="border-l-2 border-primary pl-6">
                  <blockquote className="text-lg leading-relaxed text-foreground">
                    {testimonial.quote}
                  </blockquote>
                  <figcaption className="mt-4 text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">{testimonial.name}</span>
                    {', '}
                    {testimonial.role}, {testimonial.company}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}

        {clients.length > 0 && (
          <div className="mt-16 border-t border-border pt-10">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
              {proof.clientsLabel}
            </p>
            <ul className="mt-6 flex flex-wrap items-center gap-x-12 gap-y-6">
              {clients.map((project) => (
                <li key={project.slug}>
                  {/* Falls back to a typographic wordmark until a real logo
                      file is added as `logo` in messages/*.json. */}
                  {project.logo ? (
                    <Image
                      src={project.logo}
                      alt={project.client!}
                      width={120}
                      height={32}
                      className="h-8 w-auto opacity-70"
                    />
                  ) : (
                    <span className="font-display text-lg font-medium tracking-tight text-muted-foreground">
                      {project.client}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Container>
    </Section>
  );
}
