import { getMessages, type Locale } from "@/i18n";
import { routes } from "@/lib/routes";
import { Container } from "@/components/marketing/section";

/**
 * Engineering hero. Replaces the shared HeroSection on this path.
 *
 * The business hero leads with a client screenshot because a buyer needs to
 * see a finished thing. An engineer does not — they want to know the stack and
 * what is being worked on. So the right-hand column is a spec sheet rather
 * than a device mockup: mono key/value rows, the same information a README
 * header would carry.
 *
 * Like the business hero this is a server component with no framer-motion.
 * The old shared hero drove a scroll-linked parallax that made first paint
 * depend on client JS.
 */
export function TechHero({ locale }: { locale: Locale }) {
  const { hero } = getMessages(locale);
  const copy = hero.tech;
  const limitedAvailability = true; // TODO: wire up to a real availability check
  const notAvailable = false; // TODO: wire up to a real availability check

  const spec = [
    { label: copy.spec.stackLabel, value: copy.spec.stackValue },
    { label: copy.spec.focusLabel, value: copy.spec.focusValue },
    { label: copy.spec.locationLabel, value: hero.location },
  ];

  return (
    <section
      id="hero"
      className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28"
    >
      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <span className="block font-mono text-xs uppercase tracking-[0.18em] text-primary">
              {copy.badge}
            </span>

            <h1
              className="mt-6 font-display text-[2.5rem] leading-[1.02] font-bold tracking-tight
                         text-foreground sm:text-5xl lg:text-[3.5rem]"
            >
              {copy.title}
            </h1>

            <p className="mt-6 max-w-[48ch] text-lg leading-relaxed text-muted-foreground">
              {copy.tagline}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={routes.work(locale, "tech")}
                className="group inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3.5
                           text-sm font-medium text-primary-foreground no-underline
                           transition-colors duration-300 ease-out hover:bg-primary/90
                           focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              >
                {copy.viewProjects}
                <span
                  aria-hidden
                  className="transition-transform duration-300 ease-out group-hover:translate-x-0.5"
                >
                  &rarr;
                </span>
              </a>

              <a
                href="#contact"
                className="inline-flex items-center rounded-sm border border-border px-6 py-3.5
                           text-sm font-medium text-foreground no-underline
                           transition-colors duration-300 ease-out hover:border-primary/50 hover:bg-primary/[0.03]
                           focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              >
                {copy.getInTouch}
              </a>
            </div>
          </div>

          {/* Spec sheet. Mono throughout, hairline-separated, no card chrome —
              it should read like terminal output, not a marketing panel. */}
          <div className="lg:col-span-5">
            <dl className="border-t border-border font-mono text-sm">
              {spec.map((row) => (
                <div
                  key={row.label}
                  className="grid grid-cols-[7rem_1fr] gap-4 border-b border-border py-4"
                >
                  <dt className="text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
                    {row.label}
                  </dt>
                  <dd className="leading-relaxed text-foreground">
                    {row.value}
                  </dd>
                </div>
              ))}

              <div className="grid grid-cols-[7rem_1fr] gap-4 border-b border-border py-4">
                <dt className="text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {copy.spec.statusLabel}
                </dt>
                <dd className="inline-flex items-center gap-2 text-foreground">
                  {/* Breathing indicator. animate-pulse is transform/opacity
                      only and the global reduced-motion guard freezes it. */}
                  {limitedAvailability ? (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-warning opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-warning" />
                    </span>
                  ) : notAvailable ? (
                    <span aria-hidden className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                    </span>
                  ) : (
                    <span aria-hidden className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                    </span>
                  )}

                  {copy.spec.statusValueLimited}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </Container>
    </section>
  );
}
